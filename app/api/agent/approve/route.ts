import { NextRequest, NextResponse } from "next/server";
import { mockToolsRegistry } from "@/lib/tools/mock-tools";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { toolId = "restart_server", eventId } = body;

    const toolFn = (mockToolsRegistry as any)[toolId] || mockToolsRegistry.restart_server;

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const time = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

        // 1. ACTION STEP
        controller.enqueue(
          encoder.encode(
            JSON.stringify({
              type: "action",
              message: "Restarting server... (Simulated execution)",
              timestamp: time(),
              details: {
                isDemoMode: true,
                logs: [
                  "[demo-sandbox] > stopping stalled PID 4892...",
                  "[demo-sandbox] > executing npm run dev...",
                  "[demo-sandbox] ready - started server on 0.0.0.0:3000",
                ],
              },
            }) + "\n"
          )
        );

        // Execute simulated safe tool
        if (typeof toolFn === "function") {
          await toolFn();
        }

        // 2. VERIFICATION STEP
        await new Promise((r) => setTimeout(r, 1200));
        controller.enqueue(
          encoder.encode(
            JSON.stringify({
              type: "verification",
              message: "Checking whether localhost:3000 is responding...",
              timestamp: time(),
              details: {
                isDemoMode: true,
                metrics: {
                  "HTTP Status": "200 OK",
                  "Response Time": "14ms",
                  "Verification Probe": "PASSED",
                },
              },
            }) + "\n"
          )
        );

        // 3. SUCCESS / RESULT STEP
        await new Promise((r) => setTimeout(r, 1200));
        controller.enqueue(
          encoder.encode(
            JSON.stringify({
              type: "success",
              message: "✓ RESOLVED - The application is responding normally.",
              timestamp: time(),
              details: {
                isDemoMode: true,
              },
            }) + "\n"
          )
        );

        controller.close();
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "application/x-ndjson; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to process tool approval" }, { status: 500 });
  }
}
