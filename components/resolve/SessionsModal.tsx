"use client";

import React from "react";
import { History, Play, CheckCircle2, AlertCircle, Clock, Search, Plus } from "lucide-react";
import { MOCK_PRESET_SCENARIOS } from "@/lib/mock-data";

interface SessionsModalProps {
  onClose: () => void;
  onSelectScenario: (id: string) => void;
}

export const SessionsModal: React.FC<SessionsModalProps> = ({ onClose, onSelectScenario }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-console-card border border-zinc-800 rounded-xl w-full max-w-2xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2 text-zinc-100 font-mono font-bold">
            <History className="w-5 h-5 text-cyan-400" />
            <span>SESSION HISTORY & DIGITAL SCENARIOS</span>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-200 text-xs font-mono">
            ✕ CLOSE
          </button>
        </div>

        <p className="text-xs text-zinc-400">
          Select a predefined digital troubleshooting session or replay recent execution logs.
        </p>

        <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
          {MOCK_PRESET_SCENARIOS.map((s) => (
            <div
              key={s.id}
              onClick={() => {
                onSelectScenario(s.id);
                onClose();
              }}
              className="p-3.5 rounded-lg bg-zinc-950/80 border border-zinc-800 hover:border-cyan-500/40 cursor-pointer transition-all duration-200 flex items-center justify-between group"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono font-bold text-cyan-300 group-hover:text-cyan-200">
                    {s.name}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded">
                    PRESET DEMO
                  </span>
                </div>
                <p className="text-xs text-zinc-400 leading-snug">{s.description}</p>
                <div className="mt-2 flex items-center gap-3 text-[11px] font-mono text-zinc-500">
                  <span>Goal: {s.goal}</span>
                  <span className="text-rose-400">• Issue: {s.issue}</span>
                </div>
              </div>

              <button className="px-3 py-1.5 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-semibold group-hover:bg-cyan-500 group-hover:text-zinc-950 transition-colors">
                Load Session
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
