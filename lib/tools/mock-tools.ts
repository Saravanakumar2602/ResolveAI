export interface ToolExecutionResult {
  success: boolean;
  message: string;
  logs?: string[];
  metrics?: Record<string, string | number>;
}

export const mockToolsRegistry = {
  restart_server: async (): Promise<ToolExecutionResult> => {
    await new Promise((r) => setTimeout(r, 1200));
    return {
      success: true,
      message: "Development server restarted cleanly on http://localhost:3000",
      logs: [
        "[demo-sandbox] > stopping stalled PID 4892...",
        "[demo-sandbox] > executing npm run dev...",
        "[demo-sandbox] ready - started server on 0.0.0.0:3000 (24ms)",
      ],
    };
  },
  create_env_file: async (): Promise<ToolExecutionResult> => {
    await new Promise((r) => setTimeout(r, 800));
    return {
      success: true,
      message: "Created .env.local configuration file with SQLite credentials",
      logs: ["[demo-sandbox] > writing .env.local... DONE"],
    };
  },
};
