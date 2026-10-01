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
    isDemoMode?: boolean;
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
  isDemoSimulated: boolean;
  execute: (args: Record<string, any>) => Promise<{ success: boolean; result: string; logs?: string[] }>;
}

export const SAFE_TOOLS_REGISTRY: Record<string, SafeTool> = {
  restart_server: {
    id: "restart_server",
    name: "Restart Development Server",
    description: "Launches background dev server process on port 3000",
    requiresApproval: true,
    isDemoSimulated: true,
    execute: async () => {
      await new Promise((res) => setTimeout(res, 1400));
      return {
        success: true,
        result: "[DEMO MODE] Development server restarted cleanly on http://localhost:3000",
        logs: [
          "[demo-sandbox] > stopping stalled PID 4892...",
          "[demo-sandbox] > executing npm run dev...",
          "[demo-sandbox] ready - started server on 0.0.0.0:3000 (24ms)",
        ],
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
            content: "You are ResolveAI, an autonomous multimodal AI agent. Provide a 1-sentence analysis of why the user's local web server stopped.",
          },
          {
            role: "user",
            content: userIntent,
          },
        ],
        temperature: 0.2,
        max_tokens: 120,
      }),
    });

    if (!response.ok) return null;
    const data = await response.json();
    return data.choices?.[0]?.message?.content || null;
  } catch (e) {
    return null;
  }
}

/**
 * Multimodal reasoning engine stream generator for the demonstration scenario.
 */
export async function* runAgentReasoningPipeline(
  intent: string
): AsyncGenerator<ServerAgentEvent, void, unknown> {
  const time = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  const groqDiagnosis = await callGroqReasoning(intent);

  // 1. LISTENING & PERCEPTION
  yield {
    type: "perception",
    message: "Analyzing screen context, active windows, and terminal traceback...",
    timestamp: time(),
    details: {
      isDemoMode: true,
      metrics: {
        "Vision Stream": "3840x2160 @ 60FPS",
        "Active Windows": "VS Code, Chrome Browser, iTerm2",
        "OCR Extraction": "1,420 tokens parsed",
      },
    },
  };

  await new Promise((r) => setTimeout(r, 1200));

  // 2. OBSERVING & UNDERSTANDING
  yield {
    type: "observation",
    message: "VS Code and terminal detected. Connection refused on http://localhost:3000.",
    timestamp: time(),
    details: {
      isDemoMode: true,
      logs: [
        "[10:13:58] > next dev",
        "[10:13:59] Error: Connection refused on localhost:3000",
        "[10:13:59] Process exited with code 1",
      ],
      affectedFiles: ["package.json", "server.js"],
    },
  };

  await new Promise((r) => setTimeout(r, 1400));

  // 3. REASONING
  yield {
    type: "reasoning",
    message: groqDiagnosis || "The application server appears to have stopped unexpected socket binding on port 3000.",
    timestamp: time(),
    details: {
      isDemoMode: true,
      suggestedFix: "Restart the development server in background terminal environment.",
    },
  };

  await new Promise((r) => setTimeout(r, 1500));

  // 4. ACTION PROPOSAL
  yield {
    type: "action_request",
    message: "Restart the development server",
    tool: "restart_server",
    requiresApproval: true,
    timestamp: time(),
    details: {
      isDemoMode: true,
      codeSnippet: `# Planned Action (Demo Simulation Mode):
npm run dev -- --port 3000`,
      affectedFiles: ["server.js"],
    },
  };
}
