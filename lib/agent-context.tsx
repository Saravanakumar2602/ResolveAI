"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  AgentStateType,
  AgentTimelineEvent,
  EventCategory,
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
  approveAction: (eventId: string) => Promise<void>;
  rejectAction: (eventId: string) => void;
  submitUserIntent: (intentText: string) => Promise<void>;
  loadScenario: (scenarioId: string) => void;
  resetSession: () => void;
  sessionTimer: number;
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
  const [sessionTimer, setSessionTimer] = useState<number>(258);

  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTimer((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Submit User Intent -> Stream server reasoning from /api/agent/resolve
  const submitUserIntent = async (intentText: string) => {
    if (!intentText.trim()) return;

    setAgentState("OBSERVING");
    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

    // Add User Intent Event
    const userEvt: AgentTimelineEvent = {
      id: `evt-${Date.now()}`,
      category: "USER_INTENT",
      title: "User Intent Received",
      description: intentText,
      timestamp,
      status: "completed",
    };

    setEvents((prev) => [...prev, userEvt]);
    setSituation((prev) => ({
      ...prev,
      userGoal: intentText,
      agentState: "OBSERVING",
    }));

    try {
      const response = await fetch("/api/agent/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intent: intentText }),
      });

      if (!response.body) return;

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) continue;
          const serverEvent = JSON.parse(line);

          let cat: EventCategory = "REASONING";
          let state: AgentStateType = "THINKING";

          if (serverEvent.type === "perception") {
            cat = "PERCEPTION";
            state = "OBSERVING";
          } else if (serverEvent.type === "observation") {
            cat = "OBSERVATION";
            state = "OBSERVING";
          } else if (serverEvent.type === "reasoning") {
            cat = "REASONING";
            state = "THINKING";
          } else if (serverEvent.type === "action_request") {
            cat = "ACTION_PROPOSED";
            state = "ACTING";
          }

          setAgentState(state);
          setEvents((prev) => [
            ...prev,
            {
              id: `evt-${Date.now()}-${Math.random()}`,
              category: cat,
              title: serverEvent.type.toUpperCase().replace("_", " "),
              description: serverEvent.message,
              timestamp: serverEvent.timestamp || new Date().toLocaleTimeString(),
              status: serverEvent.requiresApproval ? "pending_approval" : "completed",
              requiresApproval: serverEvent.requiresApproval,
              details: serverEvent.details,
            },
          ]);

          setSituation((prev) => ({
            ...prev,
            agentState: state,
            detectedIssue: serverEvent.message,
          }));
        }
      }
    } catch (err) {
      console.error("Failed to connect to ResolveAI agent streaming route:", err);
    }
  };

  // Approve Action -> Stream tool execution and verification from /api/agent/approve
  const approveAction = async (eventId: string) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, status: "completed" as const } : e))
    );

    setAgentState("ACTING");

    try {
      const response = await fetch("/api/agent/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, toolId: "restart_server" }),
      });

      if (!response.body) return;

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) continue;
          const serverEvent = JSON.parse(line);

          let cat: EventCategory = "ACTION";
          let state: AgentStateType = "ACTING";

          if (serverEvent.type === "action") {
            cat = "ACTION";
            state = "ACTING";
          } else if (serverEvent.type === "verification") {
            cat = "VERIFICATION";
            state = "VERIFYING";
          } else if (serverEvent.type === "success") {
            cat = "SUCCESS";
            state = "RESOLVED";
          }

          setAgentState(state);
          setEvents((prev) => [
            ...prev,
            {
              id: `evt-${Date.now()}-${Math.random()}`,
              category: cat,
              title: serverEvent.type.toUpperCase(),
              description: serverEvent.message,
              timestamp: serverEvent.timestamp || new Date().toLocaleTimeString(),
              status: "completed",
              details: serverEvent.details,
            },
          ]);

          setSituation((prev) => ({
            ...prev,
            agentState: state,
            confidenceScore: state === "RESOLVED" ? 100 : prev.confidenceScore,
            detectedIssue: state === "RESOLVED" ? "None - Application verified" : prev.detectedIssue,
          }));
        }
      }
    } catch (err) {
      console.error("Failed to approve tool action via server route:", err);
    }
  };

  const rejectAction = (eventId: string) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, status: "failed" as const } : e))
    );
    setAgentState("THINKING");
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
