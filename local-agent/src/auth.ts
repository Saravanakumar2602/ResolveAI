export function getAgentToken(): string {
  return process.env.RESOLVEAI_AGENT_TOKEN || "change-me-to-a-secure-secret-token";
}

export function validateToken(authHeader?: string): boolean {
  if (!authHeader) return false;

  const expectedToken = getAgentToken();
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0].toLowerCase() !== "bearer") {
    return false;
  }

  const token = parts[1].trim();
  return token === expectedToken;
}
