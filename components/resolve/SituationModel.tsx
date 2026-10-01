"use client";

import React from "react";
import { SituationModelData } from "@/types/resolve";
import { ToolStatus } from "./ToolStatus";
import { AgentState } from "./AgentState";
import {
  Target,
  AppWindow,
  AlertCircle,
  Activity,
  History,
  Wrench,
  Gauge,
  Layers,
  ShieldCheck,
  Server,
  Lock,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface SituationModelProps {
  data: SituationModelData;
  isLivePerception?: boolean;
  onRefresh?: () => void;
}

export const SituationModel: React.FC<SituationModelProps> = ({ data, isLivePerception = false, onRefresh }) => {
  const localAgentConnected = data.localAgent?.connected || false;

  return (
    <aside className="w-80 border-l border-zinc-800/80 bg-zinc-950/95 backdrop-blur-xl flex flex-col h-full overflow-y-auto">
      {/* Signature Telemetry Header */}
      <div className="p-3.5 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-900/60">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isLivePerception ? "bg-emerald-400" : "bg-cyan-400"} opacity-75`}></span>
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isLivePerception ? "bg-emerald-500" : "bg-cyan-500"}`}></span>
          </span>
          <h2 className="text-xs font-mono font-bold tracking-widest text-zinc-100 uppercase">
            DIGITAL SITUATION MODEL
          </h2>
        </div>

        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold border ${
          isLivePerception
            ? "text-emerald-400 bg-emerald-950/60 border-emerald-500/30"
            : "text-amber-400 bg-amber-950/60 border-amber-500/30"
        }`}>
          {isLivePerception ? "LIVE VISION" : "DEMO MODEL"}
        </span>
      </div>

      <div className="p-3.5 space-y-3.5 flex-1 font-mono">
        {/* LOCAL AGENT STATUS BADGE */}
        <div className="bg-zinc-900/80 border border-zinc-800/90 rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-zinc-300 font-bold">
              <Server className="w-3.5 h-3.5 text-cyan-400" />
              <span>LOCAL AGENT BRIDGE</span>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded border uppercase font-bold ${
              localAgentConnected
                ? "text-emerald-300 bg-emerald-950/80 border-emerald-500/50 glow-emerald"
                : "text-zinc-400 bg-zinc-900 border-zinc-800"
            }`}>
              {localAgentConnected ? "LIVE LOCAL AGENT" : "LOCAL AGENT OFFLINE"}
            </span>
          </div>

          <div className="text-[11px] font-sans text-zinc-400 leading-snug">
            {localAgentConnected ? (
              <span className="text-emerald-400 font-mono text-[10px] flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Connected to {data.localAgent?.agentId || "resolveai-local-7f32a"}
              </span>
            ) : (
              <span className="text-zinc-500 font-mono text-[10px] flex items-center gap-1">
                <XCircle className="w-3 h-3 text-zinc-500" />
                Local computer access requires ResolveAI Local Agent.
              </span>
            )}
          </div>

          {/* Capabilities Checklist */}
          {localAgentConnected && data.localAgent?.capabilities && (
            <div className="pt-1 text-[10px] space-y-0.5">
              <span className="text-zinc-500 font-bold block mb-1">CAPABILITIES:</span>
              {data.localAgent.capabilities.map((cap) => (
                <div key={cap} className="flex items-center gap-1 text-emerald-300 font-mono">
                  <span className="text-emerald-400">✓</span>
                  <span>{cap}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* COMPACT SECURITY PANEL */}
        <div className="bg-cyan-950/20 border border-cyan-500/30 rounded-lg p-3 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-bold">
            <Lock className="w-3.5 h-3.5 text-cyan-400" />
            <span>SECURITY SAFEGUARDS</span>
          </div>
          <div className="space-y-1 text-[10px] text-cyan-200/90 font-mono">
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>Read-only diagnostics allowed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>Mutating actions require approval</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>Tools strictly allowlisted</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>Arbitrary shell execution disabled</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>Credentials kept server-side</span>
            </div>
          </div>
        </div>

        {/* Agent Confidence Telemetry Gauge */}
        <div className="bg-zinc-900/80 border border-zinc-800/90 rounded-lg p-3 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <div className="flex items-center gap-1.5 font-bold">
              <Gauge className="w-3.5 h-3.5 text-cyan-400" />
              <span>CONFIDENCE SCORE</span>
            </div>
            <span className="text-xs font-bold text-cyan-400">{data.confidenceScore}%</span>
          </div>
          <div className="w-full bg-zinc-950 rounded-full h-1.5 border border-zinc-800 overflow-hidden">
            <div
              className="bg-cyan-400 h-full rounded-full transition-all duration-500 glow-cyan"
              style={{ width: `${data.confidenceScore}%` }}
            />
          </div>
        </div>

        {/* CURRENT TASK */}
        <div className="bg-zinc-900/60 border border-zinc-800/80 p-2.5 rounded-lg space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-bold uppercase">
            <Target className="w-3 h-3 text-cyan-400" />
            <span>CURRENT TASK</span>
          </div>
          <div className="text-zinc-200 text-xs font-sans font-medium leading-snug">{data.userGoal}</div>
        </div>

        {/* CURRENT APPLICATION */}
        <div className="bg-zinc-900/60 border border-zinc-800/80 p-2.5 rounded-lg space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-bold uppercase">
            <AppWindow className="w-3 h-3 text-blue-400" />
            <span>CURRENT APPLICATION</span>
          </div>
          <div className="text-zinc-200 text-xs font-bold">{data.currentApp || "Unknown Application"}</div>
        </div>

        {/* DETECTED UI ELEMENTS */}
        <div className="bg-zinc-900/60 border border-zinc-800/80 p-2.5 rounded-lg space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-bold uppercase">
            <Layers className="w-3 h-3 text-purple-400" />
            <span>DETECTED UI ELEMENTS</span>
          </div>
          <div className="text-zinc-300 text-[11px] leading-snug">
            {data.detectedElements && data.detectedElements.length > 0 ? (
              <ul className="space-y-0.5">
                {data.detectedElements.map((elem, idx) => (
                  <li key={idx} className="flex items-center gap-1">
                    <span className="text-purple-400">•</span>
                    <span>{elem}</span>
                  </li>
                ))}
              </ul>
            ) : (
              data.screenState
            )}
          </div>
        </div>

        {/* DETECTED ISSUE */}
        <div className="bg-rose-950/20 border border-rose-500/40 p-2.5 rounded-lg space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] text-rose-400 font-bold uppercase">
            <AlertCircle className="w-3 h-3 text-rose-400 animate-pulse" />
            <span>DETECTED ISSUE</span>
          </div>
          <div className="text-rose-200 text-[11px] font-sans font-medium leading-snug">
            {data.detectedIssue || "None isolated"}
          </div>
        </div>

        {/* DIAGNOSTIC EVIDENCE MODEL */}
        {data.diagnosticEvidence && data.diagnosticEvidence.length > 0 && (
          <div className="bg-zinc-900/80 border border-cyan-500/30 p-2.5 rounded-lg space-y-1.5">
            <div className="flex items-center gap-1.5 text-[10px] text-cyan-400 font-bold uppercase">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>DIAGNOSTIC EVIDENCE</span>
            </div>
            <div className="space-y-1 text-[11px] font-sans">
              {data.diagnosticEvidence.map((ev, i) => (
                <div key={i} className="p-1.5 rounded bg-zinc-950/80 border border-zinc-800 text-zinc-300">
                  <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 mb-0.5">
                    <span className="text-cyan-300 font-bold">[{ev.source}]</span>
                    {ev.confidence && <span className="text-zinc-400">{ev.confidence}%</span>}
                  </div>
                  <p className="leading-snug">{ev.observation}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AGENT STATE */}
        <div className="bg-zinc-900/60 border border-zinc-800/80 p-2.5 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-bold uppercase">
            <Activity className="w-3 h-3 text-cyan-400" />
            <span>AGENT STATE</span>
          </div>
          <AgentState state={data.agentState} compact />
        </div>

        {/* RECENT ACTIONS */}
        <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-lg p-3 space-y-2">
          <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-bold uppercase">
            <History className="w-3.5 h-3.5 text-amber-400" />
            <span>RECENT ACTIONS</span>
          </div>
          <ul className="space-y-1 text-[11px] text-zinc-300 font-sans">
            {data.recentActions.map((action, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-cyan-400 font-mono text-[10px] mt-0.5">•</span>
                <span className="leading-snug">{action}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* AVAILABLE PERCEPTION TOOLS */}
        <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-lg p-3 space-y-2">
          <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-bold uppercase">
            <Wrench className="w-3.5 h-3.5 text-emerald-400" />
            <span>CONNECTED PERCEPTION TOOLS</span>
          </div>
          <ToolStatus tools={data.toolsAvailable} />
        </div>
      </div>

      {/* Footer System Status */}
      <div className="p-2.5 border-t border-zinc-800/80 bg-zinc-950 text-[10px] font-mono text-zinc-500 flex items-center justify-between">
        <span>MEM: 412 MB</span>
        <span>LATENCY: 14ms</span>
        <span className="text-emerald-400 font-bold">WS ONLINE</span>
      </div>
    </aside>
  );
};
