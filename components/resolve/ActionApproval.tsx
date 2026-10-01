"use client";

import React from "react";
import { Play, X, ShieldAlert, Terminal, FileCode, CheckCircle2, Lock } from "lucide-react";

interface ActionApprovalProps {
  eventId: string;
  codeSnippet?: string;
  affectedFiles?: string[];
  evidenceList?: string[];
  onApprove: (eventId: string) => void;
  onReject: (eventId: string) => void;
  isPending?: boolean;
}

export const ActionApproval: React.FC<ActionApprovalProps> = ({
  eventId,
  codeSnippet,
  affectedFiles = [],
  evidenceList = [
    "Endpoint http://localhost:3000 unreachable",
    "Port 3000 closed",
    "Development process unavailable",
  ],
  onApprove,
  onReject,
  isPending = true,
}) => {
  if (!isPending) return null;

  return (
    <div className="mt-4 p-5 rounded-xl bg-amber-950/30 border-2 border-amber-500/60 shadow-2xl shadow-amber-500/10 space-y-4 relative overflow-hidden transition-all duration-300">
      {/* Background Subtle Amber Accent Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-amber-500/30 pb-2.5">
        <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold tracking-widest uppercase">
          <ShieldAlert className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>ACTION PROPOSED — HUMAN APPROVAL REQUIRED</span>
        </div>

        <span className="inline-flex items-center gap-1 text-[10px] font-mono text-amber-300 bg-amber-950/80 border border-amber-500/40 px-2 py-0.5 rounded font-bold">
          <Lock className="w-3 h-3 text-amber-400" />
          MUTATING PERMISSION
        </span>
      </div>

      {/* Action Title */}
      <div className="space-y-1">
        <div className="text-base font-bold text-white font-mono flex items-center gap-2">
          <span className="text-amber-400">Restart development server</span>
        </div>
      </div>

      {/* Why Section */}
      <div className="space-y-1">
        <div className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">
          WHY
        </div>
        <p className="text-xs text-zinc-200 font-sans leading-relaxed">
          The application is not responding on <code className="text-cyan-300 font-mono bg-zinc-900 px-1 py-0.5 rounded">http://localhost:3000</code>.
        </p>
      </div>

      {/* Evidence Bullet Points */}
      <div className="space-y-1.5">
        <div className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
          EVIDENCE
        </div>
        <div className="p-3 rounded-lg bg-zinc-950/90 border border-zinc-800 space-y-1.5 font-mono text-xs">
          {evidenceList.map((ev, i) => (
            <div key={i} className="flex items-center gap-2 text-zinc-200 text-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span>{ev.startsWith("✓") ? ev : `✓ ${ev}`}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Target Files / Script Code */}
      {affectedFiles.length > 0 && (
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
          <FileCode className="w-3.5 h-3.5 text-cyan-400" />
          <span>Target Files:</span>
          {affectedFiles.map((file) => (
            <span key={file} className="bg-zinc-900 border border-zinc-800 text-cyan-300 px-2 py-0.5 rounded text-[11px]">
              {file}
            </span>
          ))}
        </div>
      )}

      {codeSnippet && (
        <div className="rounded-lg bg-zinc-950/90 border border-zinc-800 p-3 font-mono text-xs text-cyan-300">
          <div className="flex items-center justify-between text-[10px] text-zinc-500 border-b border-zinc-800 pb-1.5 mb-1.5">
            <span className="flex items-center gap-1 font-bold uppercase text-amber-400">
              <Terminal className="w-3.5 h-3.5 text-amber-400" /> MUTATING COMMAND SCRIPT
            </span>
            <span className="text-zinc-400">AWAITING APPROVAL</span>
          </div>
          <pre className="text-[11px] leading-relaxed whitespace-pre-wrap text-emerald-300">{codeSnippet}</pre>
        </div>
      )}

      {/* Action Approval Guarantee Banner */}
      <div className="text-[11px] text-zinc-400 font-sans italic bg-zinc-900/60 p-2.5 rounded border border-zinc-800 flex items-center gap-2">
        <Lock className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
        <span>ResolveAI will NOT execute this command until you explicitly click Approve Action.</span>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-3 pt-1 font-mono">
        <button
          onClick={() => onApprove(eventId)}
          className="flex-1 inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow-xl shadow-amber-500/25 transition-all duration-200 active:scale-[0.98] glow-amber"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Approve Action</span>
        </button>

        <button
          onClick={() => onReject(eventId)}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 text-xs font-semibold transition-all"
        >
          <X className="w-4 h-4 text-rose-400" />
          <span>Reject</span>
        </button>
      </div>
    </div>
  );
};
