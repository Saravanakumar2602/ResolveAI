import { ToolPermissionLevel } from "./types.js";

export function checkToolPermission(
  toolName: string,
  permissionLevel: ToolPermissionLevel,
  authorization?: { approved: boolean; approvalId?: string }
): { allowed: boolean; reason?: string } {
  if (permissionLevel === "MUTATING") {
    if (!authorization || !authorization.approved) {
      return {
        allowed: false,
        reason: `Tool '${toolName}' is MUTATING and requires explicit human approval authorization.`,
      };
    }
  }

  return { allowed: true };
}
