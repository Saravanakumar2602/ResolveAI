"use client";

import React, { useState } from "react";
import { AgentProvider, useAgent } from "@/lib/agent-context";
import { NavRail } from "@/components/resolve/NavRail";
import { AgentState } from "@/components/resolve/AgentState";
import { PerceptionStream } from "@/components/resolve/PerceptionStream";
import { AgentTimeline } from "@/components/resolve/AgentTimeline";
import { SituationModel } from "@/components/resolve/SituationModel";
import { VoiceBar } from "@/components/resolve/VoiceBar";
import { SessionsModal } from "@/components/resolve/SessionsModal";
import { MemoryModal } from "@/components/resolve/MemoryModal";
import { ActivityModal } from "@/components/resolve/ActivityModal";
import { SettingsModal } from "@/components/resolve/SettingsModal";
import { Shield, Radio, Clock, Sparkles, RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";

function WorkspaceContent() {
  const {
    agentState,
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
  } = useAgent();

  const [activeModal, setActiveModal] = useState<string | null>(null);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleNavSelect = (nav: "resolve" | "sessions" | "memory" | "activity" | "settings") => {
    setActiveNavRail(nav);
    if (nav !== "resolve") {
      setActiveModal(nav);
    } else {
      setActiveModal(null);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-console-bg text-console-text overflow-hidden font-sans antialiased select-none">
      {/* LEFT: Narrow Navigation Rail */}
      <NavRail activeNav={activeNavRail} onSelectNav={handleNavSelect} />

      {/* CENTER & RIGHT CONTENT CONTAINER */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* CENTER TOP HEADER BAR */}
        <header className="h-14 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl px-4 flex items-center justify-between z-20">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors mr-2"
              title="Return to Landing Page"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-xs font-mono font-medium">Home</span>
            </Link>

            <div className="h-4 w-px bg-zinc-800" />

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center glow-cyan">
                <Shield className="w-4 h-4 text-cyan-400" />
              </div>
              <span className="font-mono font-bold text-sm tracking-wider text-zinc-100 uppercase">
                RESOLVE<span className="text-cyan-400">AI</span>
              </span>
            </div>

            <div className="h-4 w-px bg-zinc-800" />

            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-zinc-400 font-medium">Live Session #RES-8942</span>
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                ACTIVE PERCEPTION
              </span>
            </div>
          </div>

          {/* Header Right Controls */}
          <div className="flex items-center gap-4">
            {/* Session Timer */}
            <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>{formatTimer(sessionTimer)}</span>
            </div>

            {/* Reset Session Button */}
            <button
              onClick={resetSession}
              className="p-1.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
              title="Reset Agent Session"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            {/* Prominent Agent State Indicator */}
            <AgentState state={agentState} />
          </div>
        </header>

        {/* MAIN WORKSPACE BODY (CENTER TIMELINE + RIGHT SITUATION PANEL) */}
        <div className="flex-1 flex overflow-hidden">
          {/* CENTER: Main AI Workspace */}
          <main className="flex-1 flex flex-col h-full overflow-hidden bg-console-bg">
            {/* Perception Stream Bar */}
            <div className="p-3 border-b border-zinc-800/80 bg-zinc-950/40">
              <PerceptionStream items={perception} isScreenSharing={isScreenSharing} />
            </div>

            {/* Main Conversational Agent Timeline */}
            <AgentTimeline events={events} onApprove={approveAction} onReject={rejectAction} />

            {/* Powerful Voice Interaction Bar */}
            <VoiceBar
              onSubmit={submitUserIntent}
              isMicActive={isMicActive}
              onToggleMic={() => setIsMicActive(!isMicActive)}
              isScreenSharing={isScreenSharing}
              onToggleScreenShare={() => setIsScreenSharing(!isScreenSharing)}
              onInterrupt={() => {
                submitUserIntent("Interrupt task execution");
              }}
            />
          </main>

          {/* RIGHT: Digital Situation Panel */}
          <SituationModel data={situation} onRefresh={resetSession} />
        </div>
      </div>

      {/* MODALS */}
      {activeModal === "sessions" && (
        <SessionsModal
          onClose={() => setActiveModal(null)}
          onSelectScenario={(scenId) => {
            loadScenario(scenId);
            setActiveModal(null);
          }}
        />
      )}
      {activeModal === "memory" && <MemoryModal onClose={() => setActiveModal(null)} />}
      {activeModal === "activity" && <ActivityModal onClose={() => setActiveModal(null)} />}
      {activeModal === "settings" && <SettingsModal onClose={() => setActiveModal(null)} />}
    </div>
  );
}

export default function WorkspacePage() {
  return (
    <AgentProvider>
      <WorkspaceContent />
    </AgentProvider>
  );
}
