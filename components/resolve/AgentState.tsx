"use client";

import React from "react";
import { AgentStateType } from "@/lib/mock-data";
import { Mic, Eye, Cpu, Play, CheckCircle2, Search, Loader2 } from "lucide-react";

interface AgentStateProps {
  state: AgentStateType;
  compact?: boolean;
}

export const AgentState: React.FC<AgentStateProps> = ({ state, compact = false }) => {
  switch (state) {
    case "LISTENING":
      return (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-semibold tracking-wider uppercase backdrop-blur-md shadow-[0_0_15px_rgba(0,240,255,0.15)]">
          {/* Subtle audio waveform animation */}
          <div className="flex items-center gap-0.5 h-3">
            <span className="w-0.5 bg-cyan-400 rounded-full animate-waveform" style={{ animationDelay: "0ms" }} />
            <span className="w-0.5 bg-cyan-400 rounded-full animate-waveform" style={{ animationDelay: "150ms" }} />
            <span className="w-0.5 bg-cyan-400 rounded-full animate-waveform" style={{ animationDelay: "300ms" }} />
          </div>
          <Mic className="w-3.5 h-3.5 text-cyan-400" />
          <span>LISTENING</span>
        </div>
      );

    case "OBSERVING":
      return (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-950/40 border border-blue-500/40 text-blue-300 font-mono text-xs font-semibold tracking-wider uppercase backdrop-blur-md shadow-[0_0_15px_rgba(59,130,246,0.15)]">
          {/* Visual scanning indicator */}
          <div className="relative w-3.5 h-3.5 flex items-center justify-center">
            <span className="absolute inset-0 rounded-full border border-blue-400 animate-ping opacity-60" />
            <Eye className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <span>OBSERVING</span>
        </div>
      );

    case "THINKING":
      return (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-950/40 border border-purple-500/40 text-purple-300 font-mono text-xs font-semibold tracking-wider uppercase backdrop-blur-md shadow-[0_0_15px_rgba(168,85,247,0.15)]">
          {/* Animated processing indicator */}
          <Cpu className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
          <span>THINKING</span>
          <div className="flex gap-1 items-center">
            <span className="w-1 h-1 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-1 h-1 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-1 h-1 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      );

    case "ACTING":
      return (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-950/40 border border-amber-500/40 text-amber-300 font-mono text-xs font-semibold tracking-wider uppercase backdrop-blur-md shadow-[0_0_15px_rgba(245,158,11,0.15)]">
          {/* Tool/action execution indicator */}
          <Play className="w-3.5 h-3.5 text-amber-400 fill-current animate-pulse" />
          <span>ACTING</span>
        </div>
      );

    case "VERIFYING":
      return (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-950/40 border border-indigo-500/40 text-indigo-300 font-mono text-xs font-semibold tracking-wider uppercase backdrop-blur-md shadow-[0_0_15px_rgba(99,102,241,0.15)]">
          {/* Circular verification spinner */}
          <Loader2 className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
          <span>VERIFYING</span>
        </div>
      );

    case "RESOLVED":
      return (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-semibold tracking-wider uppercase backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.2)]">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>RESOLVED</span>
        </div>
      );

    default:
      return null;
  }
};
