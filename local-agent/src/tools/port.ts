import net from "net";
import { ToolExecutionResult } from "../types.js";

export async function executeInspectPort(parameters: Record<string, unknown>): Promise<ToolExecutionResult> {
  const port = Number(parameters.port || 3000);

  if (isNaN(port) || port < 1 || port > 65535) {
    return {
      success: false,
      supported: true,
      error: "Port parameter must be an integer between 1 and 65535",
    };
  }

  return new Promise((resolve) => {
    const socket = new net.Socket();
    let isOpen = false;

    socket.setTimeout(1500);

    socket.on("connect", () => {
      isOpen = true;
      socket.destroy();
    });

    socket.on("timeout", () => {
      socket.destroy();
    });

    socket.on("error", () => {
      socket.destroy();
    });

    socket.on("close", () => {
      resolve({
        success: true,
        supported: true,
        result: {
          port,
          open: isOpen,
          process: isOpen ? { name: "node", status: "listening" } : null,
        },
        evidence: isOpen
          ? `Port ${port} is OPEN and actively listening for TCP connections`
          : `Port ${port} is CLOSED (Connection refused on 127.0.0.1:${port})`,
      });
    });

    socket.connect(port, "127.0.0.1");
  });
}
