"use client";

import React from "react";
import { Brain, Database, Shield, FileText, Sparkles } from "lucide-react";

interface MemoryModalProps {
  onClose: () => void;
}

export const MemoryModal: React.FC<MemoryModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-console-card border border-zinc-800 rounded-xl w-full max-w-2xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2 text-zinc-100 font-mono font-bold">
            <Brain className="w-5 h-5 text-purple-400" />
            <span>AGENT DIGITAL MEMORY STORE</span>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-200 text-xs font-mono">
            ✕ CLOSE
          </button>
        </div>

        <p className="text-xs text-zinc-400">
          Persistent digital environment memory gathered by ResolveAI across past debugging sessions.
        </p>

        <div className="space-y-3 font-mono text-xs">
          <div className="p-3 bg-zinc-950/80 border border-zinc-800 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="text-purple-300 font-bold">Environment Preference: Package Manager</span>
              <span className="text-[10px] text-zinc-500">Confidence: 99%</span>
            </div>
            <p className="text-zinc-400 text-[11px]">Primary package manager set to `npm`. Fallbacks: `yarn`, `pnpm`.</p>
          </div>

          <div className="p-3 bg-zinc-950/80 border border-zinc-800 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="text-purple-300 font-bold">Known Port Bindings</span>
              <span className="text-[10px] text-zinc-500">Confidence: 94%</span>
            </div>
            <p className="text-zinc-400 text-[11px]">Port 3000 assigned to Next.js dev server. Port 5432 assigned to PostgreSQL local daemon.</p>
          </div>

          <div className="p-3 bg-zinc-950/80 border border-zinc-800 rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="text-purple-300 font-bold">Terminal Security Privileges</span>
              <span className="text-[10px] text-zinc-500">Authorization: Active</span>
            </div>
            <p className="text-zinc-400 text-[11px]">Human approval required for `sudo`, `rm -rf`, and file overwrites outside workspace root.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
