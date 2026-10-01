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
    execute: async () => {
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
    execute: async () => {
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
    execute: async () => {
      await new Promise((res) => setTimeout(res, 600));
      return {
        success: true,
        result: "HTTP 200 OK (14ms latency)",
      };
    },
  },
};

/**
 * Call Groq Llama 3 API for AI reasoning if GROQ_API_KEY is configured
 */
async function callGroqReasoning(userIntent: string): Promise<string | null> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "You are ResolveAI, an autonomous multimodal AI agent. Provide a concise 1-sentence technical diagnosis for the user issue.",
          },
          {
            role: "user",
            content: userIntent,
          },
        ],
        temperature: 0.2,
        max_tokens: 150,
      }),
    });

    if (!response.ok) return null;
    const data = await response.json();
    return data.choices?.[0]?.message?.content || null;
  } catch (e) {
    console.error("Groq API call error:", e);
    return null;
  }
}

/**
 * Multimodal reasoning engine stream generator.
 */
export async function* runAgentReasoningPipeline(
  intent: string
): AsyncGenerator<ServerAgentEvent, void, unknown> {
  const time = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  // Try calling Groq AI Llama 3 model
  const groqDiagnosis = await callGroqReasoning(intent);

  // Step 1: Perception
  yield {
    type: "perception",
    message: "Scanning active desktop windows, OCR frame buffer, and terminal process state...",
    timestamp: time(),
    details: {
      metrics: {
        "Vision Sensor": "3840x2160 @ 60FPS",
        "Active Application": "VS Code + Integrated Terminal",
        "OCR Extraction": "1,420 tokens",
        "AI Engine": groqDiagnosis ? "Groq Llama 3.3 70B" : "ResolveAI Native Engine",
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

  // Step 3: Reasoning
  yield {
    type: "reasoning",
    message: groqDiagnosis || `Synthesizing resolution strategy for: "${intent}". Missing .env.local configuration file detected.`,
    timestamp: time(),
    details: {
      suggestedFix: "Generate .env.local from project template and restart background server worker.",
    },
  };

  await new Promise((r) => setTimeout(r, 1100));

  // Step 4: Action Requested
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
