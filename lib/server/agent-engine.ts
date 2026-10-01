import { AgentStateType } from "@/lib/mock-data";
import { analyzeUserIntent } from "@/lib/ai/agent";

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
            content: "You are ResolveAI, an autonomous multimodal AI agent. Answer: 1. What is probably happening? 2. What evidence supports this? 3. What should be done next?",
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
    return null;
  }
}

/**
 * Multimodal reasoning engine stream generator with Server Intent Analysis.
 */
export async function* runAgentReasoningPipeline(
  intent: string
): AsyncGenerator<ServerAgentEvent, void, unknown> {
  const time = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  // Step 0: Server-Side Intent Analysis
  const intentAnalysis = await analyzeUserIntent(intent);
  const groqDiagnosis = await callGroqReasoning(intent);

  // Step 1: PERCEPTION
  yield {
    type: "perception",
    message: "Scanning active desktop windows, OCR frame buffer, and terminal process state...",
    timestamp: time(),
    details: {
      isDemoMode: true,
      metrics: {
        "User Goal": intentAnalysis.goal,
        "Requires Action": intentAnalysis.requiresAction ? "Yes" : "No (Informational)",
        "AI Engine": groqDiagnosis ? "Groq Llama 3.3 70B" : "ResolveAI Engine",
      },
    },
  };

  await new Promise((r) => setTimeout(r, 1100));

  // Step 2: OBSERVATION
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

  await new Promise((r) => setTimeout(r, 1200));

  // Step 3: REASONING
  yield {
    type: "reasoning",
    message:
      groqDiagnosis ||
      "The development server appears to be unavailable. The terminal shows a failed process and the browser cannot connect to localhost:3000.",
    timestamp: time(),
    details: {
      isDemoMode: true,
      suggestedFix: intentAnalysis.requiresAction
        ? "Restart the development server in background terminal environment."
        : "Explain visible error log context to user.",
    },
  };

  await new Promise((r) => setTimeout(r, 1300));

  // Step 4: Conditionally emit ACTION_PROPOSED or INFORMATIONAL SUCCESS
  if (intentAnalysis.requiresAction) {
    yield {
      type: "action_request",
      message: "Restart the development server",
      tool: "restart_server",
      requiresApproval: true,
      timestamp: time(),
      details: {
        isDemoMode: true,
        codeSnippet: `npm run dev -- --port 3000`,
        affectedFiles: ["server.js"],
      },
    };
  } else {
    yield {
      type: "success",
      message: "Informational analysis complete: " + (groqDiagnosis || "The server stopped because port 3000 socket was closed."),
      timestamp: time(),
      details: {
        isDemoMode: true,
      },
    };
  }
}
