import { execSync } from "child_process";
import { ToolExecutionResult } from "../types.js";

interface ProcessInfo {
  name: string;
  pid: number;
  status: string;
}

export async function executeGetProcessStatus(): Promise<ToolExecutionResult> {
  const commonDevNames = ["node", "npm", "pnpm", "yarn", "next", "vite", "python"];
  const foundProcesses: ProcessInfo[] = [];

  try {
    const isWindows = process.platform === "win32";

    if (isWindows) {
      const output = execSync("tasklist /FO CSV /NH", { encoding: "utf-8", timeout: 2000 });
      const lines = output.split("\n");

      for (const line of lines) {
        const parts = line.split('","').map((p) => p.replace(/"/g, "").trim());
        if (parts.length >= 2) {
          const imageName = parts[0].toLowerCase();
          const pid = parseInt(parts[1], 10);

          if (!isNaN(pid) && commonDevNames.some((dev) => imageName.includes(dev))) {
            foundProcesses.push({
              name: parts[0],
              pid,
              status: "running",
            });
          }
        }
      }
    } else {
      const output = execSync("ps -e -o pid,comm", { encoding: "utf-8", timeout: 2000 });
      const lines = output.split("\n");

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        const [pidStr, ...commParts] = trimmed.split(/\s+/);
        const pid = parseInt(pidStr, 10);
        const comm = commParts.join(" ").toLowerCase();

        if (!isNaN(pid) && commonDevNames.some((dev) => comm.includes(dev))) {
          foundProcesses.push({
            name: comm,
            pid,
            status: "running",
          });
        }
      }
    }

    return {
      success: true,
      supported: true,
      result: {
        processes: foundProcesses,
      },
      evidence: foundProcesses.length > 0
        ? `Detected ${foundProcesses.length} running dev processes (${foundProcesses.map(p => `${p.name}:${p.pid}`).join(", ")})`
        : "No active development server processes detected in local process tree",
    };
  } catch (err: any) {
    return {
      success: true,
      supported: true,
      result: {
        processes: [],
      },
      evidence: "Failed to inspect local process list: " + (err.message || "Execution timeout"),
    };
  }
}
