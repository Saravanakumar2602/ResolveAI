import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const LOCAL_AGENT_URL = process.env.LOCAL_AGENT_URL || "http://localhost:3001";

function getAgentAuthHeaders() {
  const token = process.env.RESOLVEAI_AGENT_TOKEN || "change-me-to-a-secure-secret-token";
  return {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

/**
 * GET /api/local-agent
 * Checks Local Agent health and connectivity status safely from Next.js server
 */
export async function GET() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);

    const res = await fetch(`${LOCAL_AGENT_URL}/health`, {
      method: "GET",
      signal: controller.signal,
      headers: getAgentAuthHeaders(),
    }).finally(() => clearTimeout(timeoutId));

    if (!res.ok) {
      return NextResponse.json({
        connected: false,
        reason: `Local agent returned status ${res.status}`,
      });
    }

    const data = await res.json();
    return NextResponse.json({
      connected: true,
      agentId: data.agentId,
      version: data.version,
      capabilities: data.capabilities || [],
    });
  } catch (err: any) {
    return NextResponse.json({
      connected: false,
      reason: "Local computer access requires the ResolveAI Local Agent.",
    });
  }
}

/**
 * POST /api/local-agent
 * Proxies allowlisted tool execution requests to the Local Agent server-side
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tool, parameters = {}, authorization } = body;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const agentRes = await fetch(`${LOCAL_AGENT_URL}/tool`, {
      method: "POST",
      signal: controller.signal,
      headers: getAgentAuthHeaders(),
      body: JSON.stringify({
        requestId: `req-${Date.now()}`,
        tool,
        parameters,
        authorization,
      }),
    }).finally(() => clearTimeout(timeoutId));

    if (!agentRes.ok) {
      const errData = await agentRes.json().catch(() => ({ error: "Tool execution failed" }));
      return NextResponse.json(
        {
          success: false,
          supported: true,
          error: errData.error || `Local agent error status ${agentRes.status}`,
        },
        { status: agentRes.status }
      );
    }

    const data = await agentRes.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      supported: false,
      error: "Local Agent is offline or unreachable. " + (err.message || ""),
    });
  }
}
