export font_system_prompt = `You are ResolveAI, a real-time autonomous multimodal AI agent.
Your tagline is: "See. Understand. Act. Resolve."
You perceive user screen state, open terminal tracebacks, and active browser developer tools.
Your goal is to diagnose environment failures, reason about the root cause, and propose safe authorized resolution scripts.`;

export function buildDiagnosisPrompt(userIntent: string, screenContext?: string) {
  return `User Intent: "${userIntent}"
Screen Context: ${screenContext || "VS Code + Integrated Terminal (Port 3000 refused connection)"}

Diagnose the issue in 1 concise sentence and suggest the appropriate resolution tool.`;
}
