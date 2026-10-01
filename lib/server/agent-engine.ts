import { AgentStateType } from "@/lib/mock-data";

export interface ServerAgentEvent {
  type:
    | "user_intent"
    | "perception"
    | "observation"
    | "detection"
    | "reasoning"
    | "action_request"
    | "action"
    | "verification"
    | "success";
  message: string;
  tool?: string;
  requiresApproval?: boolean;
  timestamp?: string;
  details?: {
    codeSnippet?: string;
    metrics?: Record<string, string | number>;
    logs?: string[];
    affectedFiles?: string[];
    suggestedFix?: string;
  };
}

export interface SituationModelServer {
  userGoal: string;
  currentApp: string;
  screenState: string;
  detectedIssue: string;
  agentState: AgentStateType;
  confidenceScore: number;
  recentActions: string[];
  toolsAvailable: {
    name: string;
    type: "Screen" | "Terminal" | "Browser" | "Files";
    status: "Active" | "Authorized" | "Connected" | "Standby";
    icon: string;
  }[];
}

export interface SafeTool {
  id: string;
  name: string;
  description: string;
  requiresApproval: boolean;
  execute: (args: Record<string, any>) => Promise<{ success: boolean; result: string; logs?: string[] }>;
}

export const SAFE_TOOLS_REGISTRY: Record<string, SafeTool> = {
  restart_server: {
    id: "restart_server",
    name: "Restart Development Server",
    description: "Launches background dev server process on port 3000",
    requiresApproval: true,
    execute: async (args) => {
      await new Promise((res) => setTimeout(res, 1200));
      return {
        success: true,
        result: "Development server restarted cleanly on http://localhost:3000",
        logs: [
          "[resolveai-tool] > stopping stalled PID 4892...",
          "[resolveai-tool] > executing npm run dev...",
          "[resolveai-tool] ready - started server on 0.0.0.0:3000",
        ],
      };
    },
  },
  create_config_file: {
    id: "create_config_file",
    name: "Create Local Environment Config",
    description: "Generates .env.local fallback configuration file",
    requiresApproval: true,
    execute: async (args) => {
      await new Promise((res) => setTimeout(res, 800));
      return {
        success: true,
        result: "Created .env.local with DATABASE_URL fallback",
        logs: ["[resolveai-tool] > writing .env.local... DONE"],
      };
    },
  },
  probe_endpoint: {
    id: "probe_endpoint",
    name: "Verify Endpoint Status",
    description: "Issues HTTP HEAD request to target host",
    requiresApproval: false,
    execute: async (args) => {
      await new Promise((res) => setTimeout(res, 600));
      return {
        success: true,
        result: "HTTP 200 OK (14ms latency)",
      };
    },
  },
};

/**
 * Multimodal reasoning engine stream generator.
 * Emits real-time structured events to the client.
 */
export async function* runAgentReasoningPipeline(
  intent: string
): AsyncGenerator<ServerAgentEvent, void, unknown> {
  const time = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  // Step 1: Perception
  yield {
    type: "perception",
    message: "Analyzing screen context, terminal buffer, and desktop windows...",
    timestamp: time(),
    details: {
      metrics: {
        "Vision Resolution": "3840x2160 @ 60FPS",
        "Active Application": "VS Code + Integrated Terminal",
        "OCR Frame Tokens": "1,420 tokens",
      },
    },
  };

  await new Promise((r) => setTimeout(r, 900));

  // Step 2: Observation
  yield {
    type: "observation",
    message: "Terminal process exited with status code 1. Browser shows ERR_CONNECTION_REFUSED on http://localhost:3000.",
    timestamp: time(),
    details: {
      logs: [
        "[10:13:58] > next dev",
        "[10:13:59] Error: Invalid environment variable DATABASE_URL",
        "[10:13:59] Process exited with code 1",
      ],
      affectedFiles: [".env.example", "config.ts"],
    },
  };

  await new Promise((r) => setTimeout(r, 1000));

  // Step 3: Detection & Reasoning
  yield {
    type: "reasoning",
    message: `Synthesizing strategy for: "${intent}". Missing .env.local configuration file detected.`,
    timestamp: time(),
    details: {
      suggestedFix: "Generate .env.local from project template and restart background server worker.",
    },
  };

  await new Promise((r) => setTimeout(r, 1100));

  // Step 4: Action Requested (Requires Human Authorization)
  yield {
    type: "action_request",
    message: "ResolveAI requests permission to create .env.local and launch npm run dev",
    tool: "restart_server",
    requiresApproval: true,
    timestamp: time(),
    details: {
      codeSnippet: `cat << 'EOF' > .env.local
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_API_URL="http://localhost:3000"
EOF

npm run dev`,
      affectedFiles: [".env.local"],
    },
  };
}
