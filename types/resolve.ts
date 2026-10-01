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

export interface DiagnosticEvidence {
  source: string;
  observation: string;
  severity: "info" | "warning" | "error";
  confidence?: number;
}

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
    isDemoMode?: boolean;
    isLivePerception?: boolean;
    isLiveTool?: boolean;
    evidenceList?: string[];
    toolName?: string;
    toolPermission?: "READ_ONLY" | "MUTATING";
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
  diagnosticEvidence: DiagnosticEvidence[];
  toolsAvailable: {
    name: string;
    type: "Screen" | "Terminal" | "Browser" | "Files";
    status: "Active" | "Authorized" | "Connected" | "Standby";
    icon: string;
  }[];
  detectedElements?: string[];
}

export interface PerceptionStreamItem {
  id: string;
  icon: string;
  label: string;
  value: string;
  status: "normal" | "warning" | "error" | "active";
}

export interface PerceptionAnalysisResult {
  activeApplication: string | null;
  screenState: string;
  visibleError: string | null;
  detectedElements: string[];
  possibleIssue: string | null;
  confidence: number;
  observations: string[];
}
