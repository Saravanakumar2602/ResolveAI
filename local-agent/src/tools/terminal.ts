import fs from "fs";
import { ToolExecutionResult } from "../types.js";

export async function executeGetRecentTerminalOutput(): Promise<ToolExecutionResult> {
  const logFilePath = process.env.RESOLVEAI_LOG_FILE;

  if (!logFilePath || !fs.existsSync(logFilePath)) {
    return {
      success: true,
      supported: false,
      result: {
        lines: [],
      },
      evidence: "No configured diagnostic log source available on host machine",
      error: "No configured diagnostic log source",
    };
  }

  try {
    const fileContent = fs.readFileSync(logFilePath, "utf-8");
    const allLines = fileContent.split("\n");
    const recentLines = allLines.slice(-50); // Maximum 50 lines

    return {
      success: true,
      supported: true,
      result: {
        lines: recentLines,
      },
      evidence: `Extracted ${recentLines.length} lines from diagnostic log file: ${logFilePath}`,
    };
  } catch (err: any) {
    return {
      success: false,
      supported: true,
      error: "Failed to read configured log file: " + err.message,
    };
  }
}
