"use client";

import React from "react";
import { PerceptionStreamItem } from "@/lib/mock-data";
import { Eye, Monitor, Terminal, Globe, AlertTriangle } from "lucide-react";

interface PerceptionStreamProps {
  items: PerceptionStreamItem[];
  isScreenSharing?: boolean;
}

export const PerceptionStream: React.FC<PerceptionStreamProps> = ({ items }) => {
  return (
    <div className="w-full bg-zinc-950/80 border border-zinc-800/80 rounded-lg p-2.5 backdrop-blur-md">
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-blue-400">
            LIVE PERCEPTION STREAM
          </span>
        </div>
        <span className="text-[10px] font-mono text-zinc-500">
          AI IS WATCHING YOUR ENVIRONMENT
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-950/40 border border-blue-500/30 text-xs font-mono text-blue-300">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
          <span>Screen active</span>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-950/40 border border-blue-500/30 text-xs font-mono text-blue-300">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
          <span>Terminal detected</span>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-950/40 border border-blue-500/30 text-xs font-mono text-blue-300">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
          <span>Browser detected</span>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-950/50 border border-rose-500/40 text-xs font-mono text-rose-300 animate-pulse">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
          <span>Error detected</span>
        </div>
      </div>
    </div>
  );
};
