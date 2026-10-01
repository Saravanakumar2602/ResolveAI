import { SituationModelData, PerceptionStreamItem } from "@/types/resolve";

export const INITIAL_PERCEPTION_STREAM: PerceptionStreamItem[] = [
  { id: "1", icon: "Eye", label: "Screen detected", value: "3840x2160 @ 60Hz", status: "active" },
  { id: "2", icon: "Monitor", label: "VS Code", value: "app/server.ts (L42)", status: "normal" },
  { id: "3", icon: "Terminal", label: "Terminal active", value: "zsh (Process PID 4892)", status: "warning" },
  { id: "4", icon: "Globe", label: "Browser open", value: "http://localhost:3000", status: "normal" },
  { id: "5", icon: "AlertTriangle", label: "Error detected", value: "ECONNREFUSED :3000", status: "error" },
];

export const INITIAL_SITUATION_MODEL: SituationModelData = {
  userGoal: "Fix local dev server crash and verify http://localhost:3000 response",
  currentApp: "VS Code + Integrated Terminal",
  screenState: "Split Screen: Terminal Error + Browser 404",
  detectedIssue: "Connection refused on localhost:3000 (Missing .env.local config)",
  agentState: "THINKING",
  confidenceScore: 96,
  recentActions: [
    "Analyzed screen OCR & terminal traceback",
    "Executed check_endpoint probe on localhost:3000",
    "Executed get_process_status diagnostic scan",
  ],
  localAgent: {
    connected: false,
    agentId: "resolveai-local-7f32a",
    capabilities: [
      "get_process_status",
      "inspect_port",
      "get_recent_terminal_output",
      "restart_server",
    ],
  },
  diagnosticEvidence: [
    {
      source: "check_endpoint",
      observation: "http://localhost:3000 refused connection (ECONNREFUSED)",
      severity: "error",
      confidence: 98,
    },
    {
      source: "get_process_status",
      observation: "Development server process PID 4892 terminated (Exit code 1)",
      severity: "error",
      confidence: 96,
    },
  ],
  toolsAvailable: [
    { name: "Screen Vision", type: "Screen", status: "Active", icon: "Eye" },
    { name: "Terminal CLI", type: "Terminal", status: "Authorized", icon: "Terminal" },
    { name: "Browser Client", type: "Browser", status: "Connected", icon: "Globe" },
    { name: "Workspace FS", type: "Files", status: "Authorized", icon: "Folder" },
  ],
};
