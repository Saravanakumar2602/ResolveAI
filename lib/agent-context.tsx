"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  AgentStateType,
  AgentTimelineEvent,
  EventCategory,
  SituationModelData,
  PerceptionStreamItem,
  PerceptionAnalysisResult,
} from "@/types/resolve";
import {
  INITIAL_SITUATION_MODEL,
  INITIAL_PERCEPTION_STREAM,
} from "@/lib/situation/model";
import { DEFAULT_AGENT_EVENTS, MOCK_PRESET_SCENARIOS } from "./mock-data";

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
  isLivePerceptionActive: boolean;
  setIsLivePerceptionActive: (active: boolean) => void;
  activeNavRail: "resolve" | "sessions" | "memory" | "activity" | "settings";
  setActiveNavRail: (nav: "resolve" | "sessions" | "memory" | "activity" | "settings") => void;
  approveAction: (eventId: string) => Promise<void>;
  rejectAction: (eventId: string) => void;
  submitUserIntent: (intentText: string) => Promise<void>;
  captureAndAnalyzeScreen: (base64Image: string) => Promise<void>;
  handleScreenCaptureError: (errorMsg: string) => void;
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
  const [isScreenSharing, setIsScreenSharing] = useState<boolean>(false);
  const [isLivePerceptionActive, setIsLivePerceptionActive] = useState<boolean>(false);
  const [activeNavRail, setActiveNavRail] = useState<"resolve" | "sessions" | "memory" | "activity" | "settings">("resolve");
  const [sessionTimer, setSessionTimer] = useState<number>(258);

  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTimer((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const captureAndAnalyzeScreen = async (base64Image: string) => {
    setIsScreenSharing(true);
    setIsLivePerceptionActive(true);
    setAgentState("OBSERVING");

    const time = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

    const obsEvt: AgentTimelineEvent = {
      id: `evt-${Date.now()}-obs`,
      category: "OBSERVATION",
      title: "Environment Scan Triggered",
      description: "Capturing your current digital environment...",
      timestamp: time(),
      status: "completed",
    };
    setEvents((prev) => [...prev, obsEvt]);

    await new Promise((r) => setTimeout(r, 600));
    const percEvt: AgentTimelineEvent = {
      id: `evt-${Date.now()}-perc`,
      category: "PERCEPTION",
      title: "Display Frame Captured",
      description: "Screen captured.",
      timestamp: time(),
      status: "completed",
      details: {
        isLivePerception: true,
      },
    };
    setEvents((prev) => [...prev, percEvt]);

    await new Promise((r) => setTimeout(r, 700));
    setAgentState("THINKING");
    const underEvt: AgentTimelineEvent = {
      id: `evt-${Date.now()}-under`,
      category: "REASONING",
      title: "Visual Analysis in Progress",
      description: "Analyzing visual context...",
      timestamp: time(),
      status: "completed",
      details: {
        isLivePerception: true,
      },
    };
    setEvents((prev) => [...prev, underEvt]);

    try {
      const res = await fetch("/api/perception", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64Image }),
      });

      if (!res.ok) throw new Error("Vision perception route returned error status");
      const data: PerceptionAnalysisResult = await res.json();

      const visionObsEvt: AgentTimelineEvent = {
        id: `evt-${Date.now()}-vision`,
        category: "OBSERVATION",
        title: "Multimodal Vision Insights",
        description: data.observations.join(" • ") || "Captured desktop environment frame.",
        timestamp: time(),
        status: "completed",
        details: {
          isLivePerception: true,
          metrics: {
            "Active Application": data.activeApplication || "Unknown",
            "Confidence Score": `${data.confidence}%`,
            "Visible Error": data.visibleError || "None detected",
          },
          logs: data.observations,
        },
      };
      setEvents((prev) => [...prev, visionObsEvt]);

      const sitEvt: AgentTimelineEvent = {
        id: `evt-${Date.now()}-sit`,
        category: "DETECTION",
        title: "Situation Model Updated",
        description: `Model updated: Active App [${data.activeApplication || "Unknown"}], Detected Issue [${data.possibleIssue || "None"}]`,
        timestamp: time(),
        status: "completed",
        details: {
          isLivePerception: true,
          suggestedFix: data.possibleIssue || "No immediate action required.",
        },
      };
      setEvents((prev) => [...prev, sitEvt]);

      setSituation((prev) => ({
        ...prev,
        currentApp: data.activeApplication || "Active Desktop Window",
        screenState: data.screenState || "Active Display Surface",
        detectedIssue: data.visibleError || data.possibleIssue || "None isolated",
        confidenceScore: data.confidence || prev.confidenceScore,
        agentState: "THINKING",
        detectedElements: data.detectedElements,
        recentActions: [
          `Analyzed live screen capture (${data.confidence}% confidence)`,
          ...prev.recentActions,
        ],
      }));

      setPerception([
        { id: "1", icon: "Eye", label: "Screen captured", value: "Live Stream", status: "active" },
        { id: "2", icon: "Monitor", label: data.activeApplication || "Active App", value: "Foreground", status: "normal" },
        { id: "3", icon: "Terminal", label: "Terminal", value: "Detected", status: "normal" },
        { id: "4", icon: "Globe", label: "Browser", value: "Active", status: "normal" },
        { id: "5", icon: "AlertTriangle", label: "Issue", value: data.visibleError ? "Error detected" : "Normal", status: data.visibleError ? "error" : "normal" },
      ]);
    } catch (err: any) {
      handleScreenCaptureError(err.message || "Failed to analyze screen capture");
    }
  };

  const handleScreenCaptureError = (errorMsg: string) => {
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    setEvents((prev) => [
      ...prev,
      {
        id: `evt-${Date.now()}-err`,
        category: "DETECTION",
        title: "Perception Sensor Notice",
        description: errorMsg,
        timestamp: time,
        status: "failed",
      },
    ]);
  };

  const submitUserIntent = async (intentText: string) => {
    if (!intentText.trim()) return;

    setAgentState("OBSERVING");
    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

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

    setIsLivePerceptionActive(false);
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
    setIsLivePerceptionActive(false);
    setIsScreenSharing(false);
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
        isLivePerceptionActive,
        setIsLivePerceptionActive,
        activeNavRail,
        setActiveNavRail,
        approveAction,
        rejectAction,
        submitUserIntent,
        captureAndAnalyzeScreen,
        handleScreenCaptureError,
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
