"use client";

import React from "react";
import { Play, X, ShieldAlert, Terminal, FileCode, ShieldCheck } from "lucide-react";

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
  evidenceList = [],
  onApprove,
  onReject,
  isPending = true,
}) => {
  if (!isPending) return null;

  return (
    <div className="mt-3.5 p-4 rounded-lg bg-amber-950/20 border border-amber-500/40 shadow-xl space-y-3">
      <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold tracking-wider uppercase">
        <ShieldAlert className="w-4 h-4 text-amber-400 animate-pulse" />
        <span>ACTION PROPOSED</span>
      </div>

      <div className="space-y-1.5 font-sans">
        <div className="text-sm font-semibold text-zinc-100">
          Restart the development server
        </div>

        {evidenceList.length > 0 && (
          <div className="p-2.5 rounded bg-zinc-950/80 border border-zinc-800 space-y-1 font-mono text-xs text-zinc-300">
            <div className="text-[10px] text-cyan-400 font-bold uppercase mb-1">Evidence Gathered:</div>
            {evidenceList.map((ev, i) => (
              <div key={i} className="flex items-start gap-1.5 text-[11px] font-sans">
                <span className="text-cyan-400 font-mono text-[10px] mt-0.5">•</span>
                <span>{ev}</span>
              </div>
            ))}
          </div>
        )}

        <div className="text-xs text-zinc-400 font-mono pt-1">
          <span className="text-amber-400/90 font-semibold">Reason:</span> The available evidence indicates that the development server is not currently running.
        </div>
      </div>

      {affectedFiles.length > 0 && (
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
          <FileCode className="w-3.5 h-3.5 text-cyan-400" />
          <span>Target Files:</span>
          {affectedFiles.map((file) => (
            <span key={file} className="bg-zinc-900 border border-zinc-800 text-cyan-300 px-1.5 py-0.5 rounded text-[11px]">
              {file}
            </span>
          ))}
        </div>
      )}

      {codeSnippet && (
        <div className="rounded bg-zinc-950/90 border border-zinc-800/90 p-3 font-mono text-xs text-cyan-300 overflow-x-auto">
          <div className="flex items-center justify-between text-[10px] text-zinc-500 border-b border-zinc-800 pb-1 mb-1.5">
            <span className="flex items-center gap-1 font-bold uppercase">
              <Terminal className="w-3 h-3 text-amber-400" /> PROPOSED BASH SCRIPT
            </span>
            <span>MUTATING TOOL</span>
          </div>
          <pre className="text-[11px] leading-relaxed whitespace-pre-wrap">{codeSnippet}</pre>
        </div>
      )}

      <div className="flex items-center gap-3 pt-1 font-mono">
        <button
          onClick={() => onApprove(eventId)}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all duration-200 active:scale-[0.98]"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Approve Action</span>
        </button>

        <button
          onClick={() => onReject(eventId)}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 text-xs font-medium transition-all"
        >
          <X className="w-3.5 h-3.5 text-rose-400" />
          <span>Reject</span>
        </button>
      </div>
    </div>
  );
};
