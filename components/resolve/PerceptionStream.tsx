"use client";

import React from "react";
import { PerceptionStreamItem } from "@/types/resolve";
import { Eye, Monitor, Terminal, Globe, AlertTriangle } from "lucide-react";

interface PerceptionStreamProps {
  items: PerceptionStreamItem[];
  isScreenSharing?: boolean;
  isLivePerception?: boolean;
}

export const PerceptionStream: React.FC<PerceptionStreamProps> = ({ items, isLivePerception = false }) => {
  return (
    <div className="w-full bg-zinc-950/80 border border-zinc-800/80 rounded-lg p-2.5 backdrop-blur-md">
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isLivePerception ? "bg-emerald-400" : "bg-blue-400"} opacity-75`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isLivePerception ? "bg-emerald-500" : "bg-blue-500"}`}></span>
          </span>
          <span className={`text-[11px] font-mono font-bold uppercase tracking-wider ${isLivePerception ? "text-emerald-400" : "text-blue-400"}`}>
            {isLivePerception ? "LIVE PERCEPTION STREAM" : "PERCEPTION STREAM"}
          </span>
        </div>

        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase border ${
          isLivePerception
            ? "text-emerald-300 bg-emerald-950/60 border-emerald-500/40"
            : "text-amber-300 bg-amber-950/60 border-amber-500/40"
        }`}>
          {isLivePerception ? "LIVE PERCEPTION ACTIVE" : "DEMO MODE (SIMULATED)"}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {items.map((item) => {
          let badgeColor = "bg-blue-950/40 text-blue-300 border-blue-500/30";
          if (item.status === "active") badgeColor = "bg-emerald-950/50 text-emerald-300 border-emerald-500/40";
          if (item.status === "warning") badgeColor = "bg-amber-950/50 text-amber-300 border-amber-500/40";
          if (item.status === "error") badgeColor = "bg-rose-950/60 text-rose-300 border-rose-500/50 animate-pulse";

          return (
            <div
              key={item.id}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-mono transition-all ${badgeColor}`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              <span className="font-medium">{item.label}</span>
              <span className="text-[10px] opacity-70 border-l border-zinc-700/60 pl-1.5 ml-0.5">
                {item.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
