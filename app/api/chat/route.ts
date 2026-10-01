import { NextRequest, NextResponse } from "next/server";
import { generateAgentDiagnosis } from "@/lib/ai/agent";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = body.message || body.intent || "";

    const diagnosis = await generateAgentDiagnosis(message);

    return NextResponse.json({
      role: "assistant",
      content: diagnosis,
      timestamp: new Date().toLocaleTimeString(),
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to process chat message" }, { status: 500 });
  }
}
