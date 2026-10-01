export type AgentStateType =
  | "LISTENING"
  | "OBSERVING"
  | "THINKING"
  | "ACTING"
  | "VERIFYING"
  | "RESOLVED";

export type EventCategory =
  | "USER_INTENT"
  | "PERCEPTION"
  | "OBSERVATION"
  | "DETECTION"
  | "REASONING"
  | "ACTION_PROPOSED"
  | "ACTION"
  | "VERIFICATION"
  | "SUCCESS";

export type EventStatus = "completed" | "in_progress" | "pending_approval" | "failed";

export interface AgentTimelineEvent {
  id: string;
  category: EventCategory;
  title: string;
  description: string;
  timestamp: string;
  status: EventStatus;
  details?: {
    codeSnippet?: string;
    metrics?: Record<string, string | number>;
    logs?: string[];
    affectedFiles?: string[];
    suggestedFix?: string;
  };
  requiresApproval?: boolean;
}

export interface SituationModelData {
  userGoal: string;
  currentApp: string;
  screenState: string;
  detectedIssue: string;
  agentState: AgentStateType;
  confidenceScore: number;
  recentActions: string[];
  toolsAvailable: {
    name: string;
    type: "Screen" | "Terminal" | "Browser" | "Files";
    status: "Active" | "Authorized" | "Connected" | "Standby";
    icon: string;
  }[];
}

export interface PerceptionStreamItem {
  id: string;
  icon: string;
  label: string;
  value: string;
  status: "normal" | "warning" | "error" | "active";
}

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
    "Detected port 3000 socket closure",
    "Inspected root directory for .env files",
  ],
  toolsAvailable: [
    { name: "Screen Vision", type: "Screen", status: "Active", icon: "Eye" },
    { name: "Terminal CLI", type: "Terminal", status: "Authorized", icon: "Terminal" },
    { name: "Browser Client", type: "Browser", status: "Connected", icon: "Globe" },
    { name: "Workspace FS", type: "Files", status: "Authorized", icon: "Folder" },
  ],
};

export const DEFAULT_AGENT_EVENTS: AgentTimelineEvent[] = [
  {
    id: "evt-1",
    category: "USER_INTENT",
    title: "User Intent Captured",
    description: "My Next.js application isn't working when I run npm run dev. Find the problem and resolve it.",
    timestamp: "10:14:02 AM",
    status: "completed",
  },
  {
    id: "evt-2",
    category: "PERCEPTION",
    title: "Perception Scan Triggered",
    description: "Capturing current display output, OCR text layer, active process tree, and browser developer tool logs.",
    timestamp: "10:14:04 AM",
    status: "completed",
    details: {
      metrics: {
        "OCR Text Extracted": "1,420 tokens",
        "Active Windows": "VS Code, Chrome, iTerm2",
        "Screen Resolution": "4K Ultra HD",
      },
    },
  },
  {
    id: "evt-3",
    category: "OBSERVATION",
    title: "Environment Observation",
    description: "Terminal process exited with status code 1. Chrome browser displayed ERR_CONNECTION_REFUSED at http://localhost:3000.",
    timestamp: "10:14:06 AM",
    status: "completed",
    details: {
      logs: [
        "[10:13:58] > next dev",
        "[10:13:59] Error: Invalid environment variable DATABASE_URL",
        "[10:13:59] at validateEnv (config.ts:14)",
        "[10:13:59] Process exited with code 1",
      ],
      affectedFiles: ["config.ts", ".env.example"],
    },
  },
  {
    id: "evt-4",
    category: "DETECTION",
    title: "Issue Isolated",
    description: "Root cause confirmed: Missing local configuration file `.env.local` containing required database connection string.",
    timestamp: "10:14:09 AM",
    status: "completed",
    details: {
      suggestedFix: "Copy `.env.example` to `.env.local` and populate local SQLite fallback credentials.",
    },
  },
  {
    id: "evt-5",
    category: "REASONING",
    title: "Autonomous Plan Generated",
    description: "Formulated 2-step resolution plan: Generate .env.local from project template, then launch npm run dev background worker.",
    timestamp: "10:14:11 AM",
    status: "completed",
  },
  {
    id: "evt-6",
    category: "ACTION_PROPOSED",
    title: "Action Authorization Required",
    description: "ResolveAI requests permission to execute terminal commands and create configuration files in workspace.",
    timestamp: "10:14:14 AM",
    status: "pending_approval",
    requiresApproval: true,
    details: {
      codeSnippet: `# Planned Execution Commands:
cat << 'EOF' > .env.local
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_API_URL="http://localhost:3000"
EOF

npm run dev`,
      affectedFiles: [".env.local"],
    },
  },
];

export const MOCK_PRESET_SCENARIOS = [
  {
    id: "scen-1",
    name: "Next.js Port Crash & Fix",
    description: "Diagnose missing environment variable and restart dev server",
    goal: "Fix application server crash",
    issue: "Connection refused on port 3000",
  },
  {
    id: "scen-2",
    name: "Git Merge Conflict Resolution",
    description: "Detect conflicting lines in main.ts, rebase with origin/main, and test",
    goal: "Resolve Git rebase conflicts",
    issue: "Merge conflict markers detected in 3 files",
  },
  {
    id: "scen-3",
    name: "Tailwind PostCSS Pipeline Failure",
    description: "Identify missing peer dependencies in package.json and execute fix",
    goal: "Restore Tailwind CSS build compilation",
    issue: "Module not found: Can't resolve 'autoprefixer'",
  },
];
