import { createLocalAgentServer } from "./server.js";

const PORT = parseInt(process.env.PORT || "3001", 10);
const server = createLocalAgentServer();

server.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`🛡️  RESOLVEAI LOCAL AGENT BRIDGE STARTED`);
  console.log(`==================================================`);
  console.log(`● Agent ID     : resolveai-local-7f32a`);
  console.log(`● Version      : 0.1.0`);
  console.log(`● Listening on : http://localhost:${PORT}`);
  console.log(`● GET /health  : http://localhost:${PORT}/health`);
  console.log(`● POST /tool   : http://localhost:${PORT}/tool`);
  console.log(`==================================================\n`);
});
