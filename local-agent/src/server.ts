import http from "http";
import { validateToken } from "./auth.js";
import { LOCAL_TOOL_REGISTRY, handleToolCallRequest } from "./registry.js";
import { AgentHealthResponse, LocalToolRequest, LocalToolResponse } from "./types.js";

const AGENT_ID = "resolveai-local-7f32a";
const VERSION = "0.1.0";

export function createLocalAgentServer(): http.Server {
  return http.createServer(async (req, res) => {
    // Enable CORS for Next.js app on localhost
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }

    const url = new URL(req.url || "/", `http://${req.headers.host || "localhost:3001"}`);

    // GET /health
    if (req.method === "GET" && url.pathname === "/health") {
      const healthData: AgentHealthResponse = {
        ok: true,
        agentId: AGENT_ID,
        version: VERSION,
        capabilities: Object.keys(LOCAL_TOOL_REGISTRY),
      };

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(healthData));
      return;
    }

    // POST /tool (Tool execution protocol)
    if (req.method === "POST" && url.pathname === "/tool") {
      const authHeader = req.headers.authorization;
      if (!validateToken(authHeader)) {
        res.writeHead(401, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "401 Unauthorized: Invalid or missing RESOLVEAI_AGENT_TOKEN header" }));
        return;
      }

      let bodyStr = "";
      req.on("data", (chunk) => {
        bodyStr += chunk;
      });

      req.on("end", async () => {
        try {
          const payload: LocalToolRequest = JSON.parse(bodyStr || "{}");
          const requestId = payload.requestId || `req-${Date.now()}`;

          const execResult = await handleToolCallRequest(payload);

          const responseData: LocalToolResponse = {
            requestId,
            success: execResult.success,
            tool: payload.tool || "unknown",
            result: execResult.result,
            error: execResult.error,
            supported: execResult.supported,
            timestamp: new Date().toISOString(),
          };

          res.writeHead(execResult.success ? 200 : 400, { "Content-Type": "application/json" });
          res.end(JSON.stringify(responseData));
        } catch (err: any) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              requestId: `req-${Date.now()}`,
              success: false,
              tool: "unknown",
              error: "Invalid JSON request body: " + err.message,
              supported: true,
              timestamp: new Date().toISOString(),
            })
          );
        }
      });
      return;
    }

    // 404 Not Found
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Route not found" }));
  });
}
