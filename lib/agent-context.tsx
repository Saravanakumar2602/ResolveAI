"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  AgentStateType,
  AgentTimelineEvent,
  SituationModelData,
  PerceptionStreamItem,
  DEFAULT_AGENT_EVENTS,
  INITIAL_SITUATION_MODEL,
  INITIAL_PERCEPTION_STREAM,
  MOCK_PRESET_SCENARIOS,
} from "./mock-data";

interface AgentContextType {
  agentState: AgentStateType;
  setAgentState: (state: AgentStateType) => void;
  events: AgentTimelineEvent[];
  situation: SituationModelData;
  perception: PerceptionStreamItem[];
  isMicActive: boolean;
  setIsMicActive: (active: boolean) => void;
  isScreenSharing: boolean;
  setIsScreenSharing: (active: boolean) => void;
  activeNavRail: "resolve" | "sessions" | "memory" | "activity" | "settings";
  setActiveNavRail: (nav: "resolve" | "sessions" | "memory" | "activity" | "settings") => void;
  approveAction: (eventId: string) => void;
  rejectAction: (eventId: string) => void;
  submitUserIntent: (intentText: string) => void;
  loadScenario: (scenarioId: string) => void;
  resetSession: () => void;
  sessionTimer: number; // in seconds
}

const AgentContext = createContext<AgentContextType | undefined>(undefined);

export const AgentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [agentState, setAgentState] = useState<AgentStateType>("THINKING");
  const [events, setEvents] = useState<AgentTimelineEvent[]>(DEFAULT_AGENT_EVENTS);
  const [situation, setSituation] = useState<SituationModelData>(INITIAL_SITUATION_MODEL);
  const [perception, setPerception] = useState<PerceptionStreamItem[]>(INITIAL_PERCEPTION_STREAM);
  const [isMicActive, setIsMicActive] = useState<boolean>(false);
  const [isScreenSharing, setIsScreenSharing] = useState<boolean>(true);
  const [activeNavRail, setActiveNavRail] = useState<"resolve" | "sessions" | "memory" | "activity" | "settings">("resolve");
  const [sessionTimer, setSessionTimer] = useState<number>(258); // 04:18

  // Timer counter
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTimer((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const approveAction = (eventId: string) => {
    // 1. Mark event as completed
    setEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, status: "completed" as const } : e))
    );

    // 2. Transition state to ACTING
    setAgentState("ACTING");
    setSituation((prev) => ({
      ...prev,
      agentState: "ACTING",
      recentActions: ["User authorized action", ...prev.recentActions],
    }));

    // 3. Add ACTION Event after 1s
    setTimeout(() => {
      const actionEvt: AgentTimelineEvent = {
        id: `evt-${Date.now()}-1`,
        category: "ACTION",
        title: "Executing Authorized Fix",
        description: "Created `.env.local` and started background worker `npm run dev`.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        status: "completed",
        details: {
          logs: [
            "[10:14:22] > writing .env.local... DONE",
            "[10:14:23] > starting development server...",
            "[10:14:24] ready - started server on 0.0.0.0:3000, url: http://localhost:3000",
          ],
        },
      };

      setEvents((prev) => [...prev, actionEvt]);
      setAgentState("VERIFYING");
      setSituation((prev) => ({
        ...prev,
        agentState: "VERIFYING",
        detectedIssue: "Executing verification probe...",
        recentActions: ["Created .env.local file", "Launched npm run dev", ...prev.recentActions],
      }));

      // 4. Add VERIFICATION Event after 2.5s
      setTimeout(() => {
        const verifEvt: AgentTimelineEvent = {
          id: `evt-${Date.now()}-2`,
          category: "VERIFICATION",
          title: "Result Verification",
          description: "Issued HTTP HEAD request to http://localhost:3000. Server responded with 200 OK (18ms).",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          status: "completed",
          details: {
            metrics: {
              "Response Code": "200 OK",
              "Latency": "18ms",
              "SSL": "Disabled (localhost)",
            },
          },
        };

        setEvents((prev) => [...prev, verifEvt]);

        // 5. Add SUCCESS Event after 3.8s
        setTimeout(() => {
          const successEvt: AgentTimelineEvent = {
            id: `evt-${Date.now()}-3`,
            category: "SUCCESS",
            title: "Problem Resolved",
            description: "Application environment initialized successfully. Development server is running and accessible.",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            status: "completed",
          };

          setEvents((prev) => [...prev, successEvt]);
          setAgentState("RESOLVED");
          setSituation((prev) => ({
            ...prev,
            agentState: "RESOLVED",
            detectedIssue: "None - System operational",
            confidenceScore: 100,
            screenState: "Active Application (HTTP 200)",
            recentActions: ["Verified HTTP localhost:3000 status 200", ...prev.recentActions],
          }));

          setPerception((prev) =>
            prev.map((p) =>
              p.id === "5" ? { ...p, label: "Status normal", value: "HTTP 200 OK", status: "normal" } : p
            )
          );
        }, 1500);
      }, 1500);
    }, 1000);
  };

  const rejectAction = (eventId: string) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, status: "failed" as const } : e))
    );
    setAgentState("THINKING");
    setSituation((prev) => ({
      ...prev,
      agentState: "THINKING",
      recentActions: ["User rejected action proposal", ...prev.recentActions],
    }));
  };

  const submitUserIntent = (intentText: string) => {
    if (!intentText.trim()) return;

    // Reset timeline with new intent sequence
    setAgentState("OBSERVING");
    
    const userEvt: AgentTimelineEvent = {
      id: `evt-${Date.now()}`,
      category: "USER_INTENT",
      title: "User Intent Received",
      description: intentText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      status: "completed",
    };

    setEvents((prev) => [...prev, userEvt]);

    setSituation((prev) => ({
      ...prev,
      userGoal: intentText,
      agentState: "OBSERVING",
    }));

    // Perception step
    setTimeout(() => {
      setAgentState("OBSERVING");
      const percEvt: AgentTimelineEvent = {
        id: `evt-${Date.now()}-perc`,
        category: "PERCEPTION",
        title: "Multimodal Context Capture",
        description: "Scanning screen frame, open DOM elements, and active window state...",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        status: "completed",
      };
      setEvents((prev) => [...prev, percEvt]);

      // Reasoning step
      setTimeout(() => {
        setAgentState("THINKING");
        const reasonEvt: AgentTimelineEvent = {
          id: `evt-${Date.now()}-reason`,
          category: "REASONING",
          title: "Synthesizing Solution Strategy",
          description: `Analyzing context for query: "${intentText}". Computing optimal resolution trajectory...`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          status: "completed",
        };
        setEvents((prev) => [...prev, reasonEvt]);

        // Action Proposal step
        setTimeout(() => {
          setAgentState("THINKING");
          const propEvt: AgentTimelineEvent = {
            id: `evt-${Date.now()}-prop`,
            category: "ACTION_PROPOSED",
            title: "Action Plan Proposed",
            description: `Execute automated fix script for: ${intentText}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            status: "pending_approval",
            requiresApproval: true,
            details: {
              codeSnippet: `# Automated resolution task\nresolveai exec --target "${intentText}"`,
            },
          };
          setEvents((prev) => [...prev, propEvt]);
          setSituation((prev) => ({
            ...prev,
            agentState: "THINKING",
            detectedIssue: `Awaiting authorization for ${intentText}`,
          }));
        }, 1200);
      }, 1200);
    }, 800);
  };

  const loadScenario = (scenarioId: string) => {
    const scenario = MOCK_PRESET_SCENARIOS.find((s) => s.id === scenarioId);
    if (!scenario) return;

    setAgentState("THINKING");
    setSituation((prev) => ({
      ...prev,
      userGoal: scenario.goal,
      detectedIssue: scenario.issue,
      agentState: "THINKING",
      confidenceScore: 94,
    }));
    setEvents(DEFAULT_AGENT_EVENTS);
  };

  const resetSession = () => {
    setAgentState("THINKING");
    setEvents(DEFAULT_AGENT_EVENTS);
    setSituation(INITIAL_SITUATION_MODEL);
    setPerception(INITIAL_PERCEPTION_STREAM);
  };

  return (
    <AgentContext.Provider
      value={{
        agentState,
        setAgentState,
        events,
        situation,
        perception,
        isMicActive,
        setIsMicActive,
        isScreenSharing,
        setIsScreenSharing,
        activeNavRail,
        setActiveNavRail,
        approveAction,
        rejectAction,
        submitUserIntent,
        loadScenario,
        resetSession,
        sessionTimer,
      }}
    >
      {children}
    </AgentContext.Provider>
  );
};

export const useAgent = () => {
  const context = useContext(AgentContext);
  if (!context) {
    throw new Error("useAgent must be used within an AgentProvider");
  }
  return context;
};
