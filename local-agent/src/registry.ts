import { ToolDefinition, ToolExecutionResult, LocalToolRequest } from "./types.js";
import { checkToolPermission } from "./permissions.js";
import { executeGetProcessStatus } from "./tools/process.js";
import { executeInspectPort } from "./tools/port.js";
import { executeGetRecentTerminalOutput } from "./tools/terminal.js";
import { executeRestartServer } from "./tools/server.js";

export const LOCAL_TOOL_REGISTRY: Record<string, ToolDefinition> = {
  get_process_status: {
    name: "get_process_status",
    permission: "READ_ONLY",
    description: "Inspect active development server processes",
    requiresApproval: false,
    execute: executeGetProcessStatus,
  },
  inspect_port: {
    name: "inspect_port",
    permission: "READ_ONLY",
    description: "Probe TCP port reachability on local host",
    requiresApproval: false,
    execute: executeInspectPort,
  },
  get_recent_terminal_output: {
    name: "get_recent_terminal_output",
    permission: "READ_ONLY",
    description: "Read configured diagnostic log lines",
    requiresApproval: false,
    execute: executeGetRecentTerminalOutput,
  },
  restart_server: {
    name: "restart_server",
    permission: "MUTATING",
    description: "Restart development server using trusted profile",
    requiresApproval: true,
    execute: executeRestartServer,
  },
};

export async function handleToolCallRequest(request: LocalToolRequest): Promise<ToolExecutionResult> {
  const toolName = request.tool;
  const toolDef = LOCAL_TOOL_REGISTRY[toolName];

  if (!toolDef) {
    return {
      success: false,
      supported: false,
      error: `Tool '${toolName}' not allowed. Arbitrary shell or tool execution is strictly disabled.`,
    };
  }

  // Permission Check
  const permCheck = checkToolPermission(toolDef.name, toolDef.permission, request.authorization);
  if (!permCheck.allowed) {
    return {
      success: false,
      supported: true,
      error: permCheck.reason || "Permission denied",
    };
  }

  return await toolDef.execute(request.parameters || {});
}
