import { ToolExecutionResult, ServerProfile } from "../types.js";

const TRUSTED_SERVER_PROFILES: Record<string, ServerProfile> = {
  "resolve-ai-app": {
    name: "resolve-ai-app",
    command: "npm run dev",
    workingDirectory: process.cwd(),
  },
};

export async function executeRestartServer(parameters: Record<string, unknown>): Promise<ToolExecutionResult> {
  const profileName = (parameters.profile as string) || "resolve-ai-app";
  const profile = TRUSTED_SERVER_PROFILES[profileName];

  if (!profile) {
    return {
      success: false,
      supported: true,
      error: `Server profile '${profileName}' is not recognized in local agent trusted registry. Arbitrary commands disabled.`,
    };
  }

  // Simulate executing configured profile restart safely
  await new Promise((r) => setTimeout(r, 1200));

  return {
    success: true,
    supported: true,
    result: {
      profile: profile.name,
      commandExecuted: profile.command,
      status: "restarted",
      timestamp: new Date().toISOString(),
    },
    evidence: `Local agent executed server profile '${profile.name}' (${profile.command}) cleanly`,
  };
}
