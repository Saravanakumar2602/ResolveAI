"use client";

import React from "react";
import { Eye, Terminal, Globe, Folder, CheckCircle, Shield } from "lucide-react";

interface ToolStatusProps {
  tools: {
    name: string;
    type: "Screen" | "Terminal" | "Browser" | "Files";
    status: "Active" | "Authorized" | "Connected" | "Standby";
    icon: string;
  }[];
}

const toolIcons: Record<string, React.ElementType> = {
  Screen: Eye,
  Terminal: Terminal,
  Browser: Globe,
  Files: Folder,
};

export const ToolStatus: React.FC<ToolStatusProps> = ({ tools }) => {
  return (
    <div className="space-y-1.5">
      {tools.map((tool) => {
        const Icon = toolIcons[tool.type] || Eye;

        let statusColor = "text-zinc-500 bg-zinc-900 border-zinc-800";
        if (tool.status === "Active") statusColor = "text-cyan-400 bg-cyan-950/40 border-cyan-500/30";
        if (tool.status === "Authorized") statusColor = "text-emerald-400 bg-emerald-950/40 border-emerald-500/30";
        if (tool.status === "Connected") statusColor = "text-purple-400 bg-purple-950/40 border-purple-500/30";

        return (
          <div
            key={tool.name}
            className="flex items-center justify-between p-2 rounded bg-zinc-950/60 border border-zinc-800/80 text-xs font-mono"
          >
            <div className="flex items-center gap-2">
              <Icon className="w-3.5 h-3.5 text-zinc-400" />
              <span className="text-zinc-200 font-medium">{tool.name}</span>
            </div>
            <span className={`text-[10px] px-1.5 py-0.5 rounded border uppercase ${statusColor}`}>
              {tool.status}
            </span>
          </div>
        );
      })}
    </div>
  );
};
