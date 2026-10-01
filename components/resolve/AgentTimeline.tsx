"use client";

import React, { useRef, useEffect } from "react";
import { AgentTimelineEvent } from "@/lib/mock-data";
import { AgentEvent } from "./AgentEvent";
import { ShieldCheck, Cpu, Eye, Play, Search, Terminal } from "lucide-react";

interface AgentTimelineProps {
  events: AgentTimelineEvent[];
  onApprove: (eventId: string) => void;
  onReject: (eventId: string) => void;
}

export const AgentTimeline: React.FC<AgentTimelineProps> = ({ events, onApprove, onReject }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events.length]);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#050608]">
      {/* Connected AI Cognition Pipeline Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold tracking-wider uppercase text-zinc-200">
            AI COGNITION & ACTION STREAM
          </span>
        </div>

        {/* Pipeline Stage Visualizer */}
        <div className="flex items-center gap-1.5 font-mono text-[10px]">
          <span className="flex items-center gap-1 text-blue-400 bg-blue-950/40 px-2 py-0.5 rounded border border-blue-500/30">
            <Eye className="w-3 h-3" /> PERCEPTION
          </span>
          <span className="text-zinc-600">→</span>
          <span className="flex items-center gap-1 text-purple-400 bg-purple-950/40 px-2 py-0.5 rounded border border-purple-500/30">
            <Cpu className="w-3 h-3" /> REASONING
          </span>
          <span className="text-zinc-600">→</span>
          <span className="flex items-center gap-1 text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">
            <Play className="w-3 h-3" /> ACTION
          </span>
          <span className="text-zinc-600">→</span>
          <span className="flex items-center gap-1 text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
            <Search className="w-3 h-3" /> VERIFICATION
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            AUTONOMOUS PROBE
          </span>
        </div>
      </div>

      {/* Connected Stream Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-1 scroll-smooth">
        {events.map((event) => (
          <AgentEvent key={event.id} event={event} onApprove={onApprove} onReject={onReject} />
        ))}
      </div>
    </div>
  );
};
