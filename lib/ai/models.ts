export const AI_MODELS = {
  groq: "llama-3.3-70b-versatile",
  gemini: "gemini-1.5-pro",
  openai: "gpt-4o",
} as const;

export function getActiveModel() {
  const provider = process.env.AI_PROVIDER || "groq";
  return AI_MODELS[provider as keyof typeof AI_MODELS] || AI_MODELS.groq;
}
