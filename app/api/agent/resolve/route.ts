import { NextRequest, NextResponse } from "next/server";
import { runAgentReasoningPipeline } from "@/lib/server/agent-engine";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const intent = body.intent || "Diagnose digital environment";

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of runAgentReasoningPipeline(intent)) {
            const jsonChunk = JSON.stringify(event) + "\n";
            controller.enqueue(encoder.encode(jsonChunk));
          }
        } catch (err) {
          controller.enqueue(
            encoder.encode(
              JSON.stringify({
                type: "detection",
                message: `Server engine error: ${err instanceof Error ? err.message : "Unknown failure"}`,
              }) + "\n"
            )
          );
        } finally {
          controller.close();
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "application/x-ndjson; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request payload to ResolveAI agent" },
      { status: 400 }
    );
  }
}
