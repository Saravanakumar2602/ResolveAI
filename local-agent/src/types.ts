export type ToolPermissionLevel = "READ_ONLY" | "MUTATING";

export interface ToolDefinition {
  name: string;
  permission: ToolPermissionLevel;
  description: string;
  requiresApproval: boolean;
  execute: (parameters: Record<string, unknown>) => Promise<ToolExecutionResult>;
}

export interface ToolExecutionResult {
  success: boolean;
  supported: boolean;
  result?: unknown;
  error?: string;
  evidence?: string;
}

export interface LocalToolRequest {
  requestId: string;
  tool: string;
  parameters?: Record<string, unknown>;
  authorization?: {
    approved: boolean;
    approvalId?: string;
  };
}

export interface LocalToolResponse {
  requestId: string;
  success: boolean;
  tool: string;
  result?: unknown;
  error?: string;
  supported: boolean;
  timestamp: string;
}

export interface AgentHealthResponse {
  ok: boolean;
  agentId: string;
  version: string;
  capabilities: string[];
}

export interface ServerProfile {
  name: string;
  command: string;
  workingDirectory: string;
}
