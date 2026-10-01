"use client";

import React from "react";
import { Activity, ShieldCheck, Terminal, Eye, FileCode } from "lucide-react";

interface ActivityModalProps {
  onClose: () => void;
}

export const ActivityModal: React.FC<ActivityModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-console-card border border-zinc-800 rounded-xl w-full max-w-2xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2 text-zinc-100 font-mono font-bold">
            <Activity className="w-5 h-5 text-emerald-400" />
            <span>SECURITY & SYSTEM AUDIT LOG</span>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-200 text-xs font-mono">
            ✕ CLOSE
          </button>
        </div>

        <p className="text-xs text-zinc-400">
          Cryptographic audit trail of all perception scans, tool executions, and file modifications.
        </p>

        <div className="space-y-2 font-mono text-xs max-h-80 overflow-y-auto">
          {[
            { time: "10:14:24 AM", type: "EXEC", desc: "Executed `npm run dev` background process", status: "SUCCESS" },
            { time: "10:14:22 AM", type: "FS_WRITE", desc: "Created file `.env.local` with SQLite fallback", status: "AUTHORIZED" },
            { time: "10:14:14 AM", type: "PROPOSAL", desc: "Requested human approval for terminal execution", status: "APPROVED" },
            { time: "10:14:04 AM", type: "VISION", desc: "Captured 3840x2160 screen frame & OCR layer", status: "SUCCESS" },
          ].map((log, i) => (
            <div key={i} className="p-2.5 bg-zinc-950/80 border border-zinc-800/80 rounded flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-zinc-500">{log.time}</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-zinc-900 border border-zinc-800 text-cyan-300 font-bold">
                  {log.type}
                </span>
                <span className="text-zinc-300 text-[11px] font-sans">{log.desc}</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded">
                {log.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
