import { getActiveModel } from "./models";
import { buildDiagnosisPrompt, font_system_prompt } from "./prompts";

export async function generateAgentDiagnosis(intent: string): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return "The application server appears to have stopped unexpected socket binding on port 3000.";
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: getActiveModel(),
        messages: [
          { role: "system", content: font_system_prompt },
          { role: "user", content: buildDiagnosisPrompt(intent) },
        ],
        temperature: 0.2,
        max_tokens: 120,
      }),
    });

    if (!response.ok) {
      return "The application server appears to have stopped unexpected socket binding on port 3000.";
    }

    const data = await response.json();
    return (
      data.choices?.[0]?.message?.content ||
      "The application server appears to have stopped unexpected socket binding on port 3000."
    );
  } catch (e) {
    return "The application server appears to have stopped unexpected socket binding on port 3000.";
  }
}
