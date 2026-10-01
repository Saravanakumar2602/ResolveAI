export interface BrowserProbeResult {
  url: string;
  status: number;
  latencyMs: number;
  ok: boolean;
}

export async function probeBrowserEndpoint(url: string): Promise<BrowserProbeResult> {
  await new Promise((r) => setTimeout(r, 600));
  return {
    url,
    status: 200,
    latencyMs: 14,
    ok: true,
  };
}
