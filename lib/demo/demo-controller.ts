import {
  AgentStateType,
  AgentTimelineEvent,
  DiagnosticEvidence,
  SituationModelData,
} from "@/types/resolve";

export type DemoStep =
  | "LISTENING"
  | "OBSERVING"
  | "PERCEIVING"
  | "INVESTIGATING"
  | "EVIDENCE"
  | "REASONING"
  | "ACTION_PROPOSED"
  | "WAITING_APPROVAL"
  | "ACTING"
  | "VERIFYING"
  | "RESOLVED"
  | "FAILED";

export interface DemoControllerOptions {
  isLocalAgentConnected?: boolean;
  failOnAction?: boolean;
}

export class DemoController {
  private step: DemoStep = "LISTENING";
  private isRunning: boolean = false;

  public getStep(): DemoStep {
    return this.step;
  }

  public isDemoActive(): boolean {
    return this.isRunning;
  }

  public async runTroubleshootingScenario(
    callbacks: {
      setAgentState: (state: AgentStateType) => void;
      setEvents: React.Dispatch<React.SetStateAction<AgentTimelineEvent[]>>;
      setSituation: React.Dispatch<React.SetStateAction<SituationModelData>>;
    },
    options: DemoControllerOptions = {}
  ) {
    this.isRunning = true;
    const isLocalAgent = options.isLocalAgentConnected ?? false;
    const time = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

    // ---------------------------------------------------------
    // STEP 1: LISTENING & USER INTENT
    // ---------------------------------------------------------
    this.step = "LISTENING";
    callbacks.setAgentState("LISTENING");

    const userIntentEvt: AgentTimelineEvent = {
      id: `demo-evt-${Date.now()}-intent`,
      category: "USER_INTENT",
      title: "User Query Received",
      description: "My application isn't working. Find the problem.",
      timestamp: time(),
      status: "completed",
    };

    callbacks.setEvents([userIntentEvt]);
    callbacks.setSituation((prev) => ({
      ...prev,
      userGoal: "Find why application on localhost:3000 is failing",
      currentApp: "Next.js / Node.js Workspace",
      agentState: "LISTENING",
      detectedIssue: "Investigating connectivity issue...",
      confidenceScore: 40,
      diagnosticEvidence: [],
      recentActions: ["User requested automated problem diagnosis"],
    }));

    await new Promise((r) => setTimeout(r, 600));

    // ---------------------------------------------------------
    // STEP 2: OBSERVING & PERCEIVING
    // ---------------------------------------------------------
    this.step = "OBSERVING";
    callbacks.setAgentState("OBSERVING");

    const obsEvt: AgentTimelineEvent = {
      id: `demo-evt-${Date.now()}-obs`,
      category: "OBSERVATION",
      title: "Screen & Environment Capture",
      description: "Inspecting active desktop windows: VS Code editor, terminal window, and web browser.",
      timestamp: time(),
      status: "completed",
      details: {
        isLivePerception: isLocalAgent,
        isDemoMode: !isLocalAgent,
        metrics: {
          "Active App": "VS Code",
          "Visible Terminal": "Active",
          "Browser Target": "http://localhost:3000",
        },
      },
    };

    callbacks.setEvents((prev) => [...prev, obsEvt]);

    this.step = "PERCEIVING";
    callbacks.setSituation((prev) => ({
      ...prev,
      screenState: "VS Code + Integrated Terminal active on display surface",
      currentApp: "VS Code / Next.js Development Project",
      agentState: "OBSERVING",
      detectedElements: ["Editor Buffer", "Terminal Window", "Local Host Browser"],
    }));

    await new Promise((r) => setTimeout(r, 700));

    // ---------------------------------------------------------
    // STEP 3: INVESTIGATING (DIAGNOSTIC TOOLS)
    // ---------------------------------------------------------
    this.step = "INVESTIGATING";
    callbacks.setAgentState("THINKING");

    // Tool 1: check_endpoint
    const tool1Evt: AgentTimelineEvent = {
      id: `demo-evt-${Date.now()}-tool1`,
      category: "OBSERVATION",
      title: "Endpoint Connectivity Probe",
      description: "Probing HTTP GET on http://localhost:3000... Error: ECONNREFUSED",
      timestamp: time(),
      status: "completed",
      details: {
        toolName: "check_endpoint",
        toolPermission: "READ_ONLY",
        isLocalAgentTool: isLocalAgent,
        isLiveTool: isLocalAgent,
        isDemoMode: !isLocalAgent,
        metrics: {
          Target: "http://localhost:3000",
          Status: "UNREACHABLE",
          Error: "ECONNREFUSED",
        },
        logs: ["GET http://localhost:3000", "connect ECONNREFUSED 127.0.0.1:3000"],
      },
    };

    callbacks.setEvents((prev) => [...prev, tool1Evt]);
    await new Promise((r) => setTimeout(r, 500));

    // Tool 2: inspect_port
    const tool2Evt: AgentTimelineEvent = {
      id: `demo-evt-${Date.now()}-tool2`,
      category: "OBSERVATION",
      title: "Port Inspection",
      description: "Inspecting TCP socket listener on port 3000... Result: No active listener detected.",
      timestamp: time(),
      status: "completed",
      details: {
        toolName: "inspect_port",
        toolPermission: "READ_ONLY",
        isLocalAgentTool: isLocalAgent,
        isLiveTool: isLocalAgent,
        isDemoMode: !isLocalAgent,
        metrics: {
          Port: 3000,
          Protocol: "TCP",
          State: "CLOSED",
        },
        logs: ["inspecting netstat / lsof for port 3000", "0 listening processes found"],
      },
    };

    callbacks.setEvents((prev) => [...prev, tool2Evt]);
    await new Promise((r) => setTimeout(r, 500));

    // Tool 3: get_process_status
    const tool3Evt: AgentTimelineEvent = {
      id: `demo-evt-${Date.now()}-tool3`,
      category: "OBSERVATION",
      title: "Process Table Inspection",
      description: "Searching system process tree for development server ('node', 'next-dev')... Result: 0 running instances found.",
      timestamp: time(),
      status: "completed",
      details: {
        toolName: "get_process_status",
        toolPermission: "READ_ONLY",
        isLocalAgentTool: isLocalAgent,
        isLiveTool: isLocalAgent,
        isDemoMode: !isLocalAgent,
        metrics: {
          Process: "next-dev",
          Active: "FALSE",
          PID: "NONE",
        },
        logs: ["searching ps / tasklist for node/next", "no matching dev server process running"],
      },
    };

    callbacks.setEvents((prev) => [...prev, tool3Evt]);
    await new Promise((r) => setTimeout(r, 600));

    // ---------------------------------------------------------
    // STEP 4: EVIDENCE SYNTHESIS
    // ---------------------------------------------------------
    this.step = "EVIDENCE";

    const synthesizedEvidence: DiagnosticEvidence[] = [
      {
        source: "check_endpoint",
        observation: "localhost:3000 refused the HTTP connection (ECONNREFUSED)",
        severity: "error",
        confidence: 98,
      },
      {
        source: "inspect_port",
        observation: "Port 3000 is closed and not accepting TCP connections",
        severity: "error",
        confidence: 96,
      },
      {
        source: "get_process_status",
        observation: "No active development server process detected in process table",
        severity: "warning",
        confidence: 90,
      },
    ];

    const evidenceEvt: AgentTimelineEvent = {
      id: `demo-evt-${Date.now()}-evidence`,
      category: "DETECTION",
      title: "Independent Diagnostic Evidence Gathered",
      description: "Synthesized 3 independent telemetry signals confirming development server failure.",
      timestamp: time(),
      status: "completed",
      details: {
        evidenceList: [
          "✓ Endpoint http://localhost:3000 is unreachable (ECONNREFUSED)",
          "✓ Port 3000 is closed and not accepting connections",
          "✓ No active node/next development process was detected in process table",
        ],
        metrics: {
          "Signals Gathered": "3 Independent Sources",
          "Diagnosis Confidence": "94%",
        },
      },
    };

    callbacks.setEvents((prev) => [...prev, evidenceEvt]);
    callbacks.setSituation((prev) => ({
      ...prev,
      detectedIssue: "Development server stopped / port 3000 closed",
      confidenceScore: 94,
      diagnosticEvidence: synthesizedEvidence,
      recentActions: [
        "Gathered 3 independent diagnostic signals",
        "Confirmed port 3000 is not listening",
        ...prev.recentActions,
      ],
    }));

    await new Promise((r) => setTimeout(r, 700));

    // ---------------------------------------------------------
    // STEP 5: REASONING (STRUCTURED FORMAT)
    // ---------------------------------------------------------
    this.step = "REASONING";

    const reasoningEvt: AgentTimelineEvent = {
      id: `demo-evt-${Date.now()}-reasoning`,
      category: "REASONING",
      title: "Diagnostic Reasoning Synthesis",
      description: `OBSERVED
• localhost:3000 refused the connection
• Port 3000 is not accepting connections
• No active development server was detected

INFERENCE
The development server appears to have stopped.

RECOMMENDATION
Restart the configured development server.`,
      timestamp: time(),
      status: "completed",
      details: {
        suggestedFix: "Execute configured server start script 'npm run dev -- --port 3000'",
      },
    };

    callbacks.setEvents((prev) => [...prev, reasoningEvt]);
    await new Promise((r) => setTimeout(r, 600));

    // ---------------------------------------------------------
    // STEP 6: ACTION PROPOSED & WAITING FOR APPROVAL
    // ---------------------------------------------------------
    this.step = "ACTION_PROPOSED";
    callbacks.setAgentState("ACTING");

    const proposalEvt: AgentTimelineEvent = {
      id: `demo-evt-${Date.now()}-proposal`,
      category: "ACTION_PROPOSED",
      title: "Restart Development Server",
      description: "The application is not responding on localhost:3000. Restarting the dev server will re-open port 3000 and restore service.",
      timestamp: time(),
      status: "pending_approval",
      requiresApproval: true,
      details: {
        toolName: "restart_server",
        toolPermission: "MUTATING",
        isLocalAgentTool: isLocalAgent,
        isLiveTool: isLocalAgent,
        isDemoMode: !isLocalAgent,
        codeSnippet: `npm run dev -- --port 3000`,
        affectedFiles: ["package.json", "next.config.mjs"],
        evidenceList: [
          "Endpoint http://localhost:3000 unreachable",
          "Port 3000 closed",
          "Development process unavailable",
        ],
      },
    };

    callbacks.setEvents((prev) => [...prev, proposalEvt]);

    this.step = "WAITING_APPROVAL";
  }

  public async executeApprovedAction(
    eventId: string,
    callbacks: {
      setAgentState: (state: AgentStateType) => void;
      setEvents: React.Dispatch<React.SetStateAction<AgentTimelineEvent[]>>;
      setSituation: React.Dispatch<React.SetStateAction<SituationModelData>>;
    },
    options: DemoControllerOptions = {}
  ) {
    const isLocalAgent = options.isLocalAgentConnected ?? false;
    const shouldFail = options.failOnAction ?? false;
    const time = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

    // Mark proposal completed
    callbacks.setEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, status: "completed" as const } : e))
    );

    // ---------------------------------------------------------
    // STEP 7: ACTING
    // ---------------------------------------------------------
    this.step = "ACTING";
    callbacks.setAgentState("ACTING");

    const actionEvt: AgentTimelineEvent = {
      id: `demo-evt-${Date.now()}-action`,
      category: "ACTION",
      title: "Executing Development Server Restart",
      description: isLocalAgent
        ? "Local Agent executing server restart profile 'resolve-ai-app'..."
        : "Executing simulated background tool restart_server...",
      timestamp: time(),
      status: "completed",
      details: {
        toolName: "restart_server",
        toolPermission: "MUTATING",
        isLocalAgentTool: isLocalAgent,
        isLiveTool: isLocalAgent,
        isDemoMode: !isLocalAgent,
        logs: [
          `[${isLocalAgent ? "local-agent" : "simulated-tool"}] > Authorizing token...`,
          `[${isLocalAgent ? "local-agent" : "simulated-tool"}] > Executing: npm run dev -- --port 3000`,
          `[${isLocalAgent ? "local-agent" : "simulated-tool"}] > Dev server spawned on PID 14920`,
        ],
      },
    };

    callbacks.setEvents((prev) => [...prev, actionEvt]);
    await new Promise((r) => setTimeout(r, 800));

    // ---------------------------------------------------------
    // STEP 8: VERIFYING
    // ---------------------------------------------------------
    this.step = "VERIFYING";
    callbacks.setAgentState("VERIFYING");

    if (shouldFail) {
      // FAILURE SCENARIO
      this.step = "FAILED";
      const failVerifEvt: AgentTimelineEvent = {
        id: `demo-evt-${Date.now()}-verif-fail`,
        category: "VERIFICATION",
        title: "VERIFICATION FAILED",
        description: "Probe on http://localhost:3000 failed. Configured development server could not be restarted.",
        timestamp: time(),
        status: "failed",
        details: {
          metrics: {
            "HTTP Status": "CONNECTION REFUSED",
            "Probe Result": "FAILED",
          },
          logs: [
            "Probing http://localhost:3000...",
            "Error: Connection refused (server failed to bind port 3000)",
          ],
        },
      };

      callbacks.setEvents((prev) => [...prev, failVerifEvt]);
      callbacks.setSituation((prev) => ({
        ...prev,
        agentState: "THINKING",
        detectedIssue: "ACTION FAILED — Development server failed to start",
        confidenceScore: 30,
      }));
      return;
    }

    // SUCCESS VERIFICATION
    const verifEvt: AgentTimelineEvent = {
      id: `demo-evt-${Date.now()}-verif`,
      category: "VERIFICATION",
      title: "Closed-Loop Endpoint Verification",
      description: "Probing http://localhost:3000...\nBefore: ✕ unreachable\nAfter: ✓ reachable, ✓ response received, ✓ application recovered",
      timestamp: time(),
      status: "completed",
      details: {
        metrics: {
          "Endpoint": "http://localhost:3000",
          "HTTP Status": "200 OK",
          "Latency": "12ms",
          "Verification": "PASSED",
        },
      },
    };

    callbacks.setEvents((prev) => [...prev, verifEvt]);
    await new Promise((r) => setTimeout(r, 700));

    // ---------------------------------------------------------
    // STEP 9: RESOLVED
    // ---------------------------------------------------------
    this.step = "RESOLVED";
    callbacks.setAgentState("RESOLVED");

    const resolvedEvt: AgentTimelineEvent = {
      id: `demo-evt-${Date.now()}-resolved`,
      category: "SUCCESS",
      title: "Problem Resolved",
      description: "✓ RESOLVED — Application is responding normally on http://localhost:3000",
      timestamp: time(),
      status: "completed",
    };

    callbacks.setEvents((prev) => [...prev, resolvedEvt]);
    callbacks.setSituation((prev) => ({
      ...prev,
      agentState: "RESOLVED",
      detectedIssue: "None — Application verified online",
      confidenceScore: 100,
      recentActions: [
        "Verified http://localhost:3000 returning 200 OK",
        "Restarted dev server process",
        ...prev.recentActions,
      ],
    }));
  }
}

export const demoController = new DemoController();
