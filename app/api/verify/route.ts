import { NextRequest, NextResponse } from "next/server";
import { probeBrowserEndpoint } from "@/lib/tools/browser";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const targetUrl = body.url || "http://localhost:3000";

    const probeResult = await probeBrowserEndpoint(targetUrl);

    return NextResponse.json({
      verified: probeResult.ok,
      url: probeResult.url,
      statusCode: probeResult.status,
      latencyMs: probeResult.latencyMs,
      message: probeResult.ok
        ? "Application responding normally on http://localhost:3000"
        : "Endpoint verification failed",
    });
  } catch (error) {
    return NextResponse.json({ error: "Verification probe failed" }, { status: 500 });
  }
}
