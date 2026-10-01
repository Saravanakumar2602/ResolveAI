"use client";

import React from "react";
import { Play, X, ShieldAlert, Terminal, FileCode } from "lucide-react";

interface ActionApprovalProps {
  eventId: string;
  codeSnippet?: string;
  affectedFiles?: string[];
  onApprove: (eventId: string) => void;
  onReject: (eventId: string) => void;
  isPending?: boolean;
}

export const ActionApproval: React.FC<ActionApprovalProps> = ({
  eventId,
  codeSnippet,
  affectedFiles = [],
  onApprove,
  onReject,
  isPending = true,
}) => {
  if (!isPending) return null;

  return (
    <div className="mt-3.5 p-4 rounded-lg bg-amber-950/20 border border-amber-500/40 shadow-xl space-y-3">
      <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold tracking-wider uppercase">
        <ShieldAlert className="w-4 h-4 text-amber-400 animate-pulse" />
        <span>ACTION REQUESTED</span>
      </div>

      <div className="space-y-1 font-sans">
        <div className="text-sm font-semibold text-zinc-100">
          Restart development server & generate configuration file
        </div>
        <div className="text-xs text-zinc-400 font-mono">
          <span className="text-amber-400/90 font-semibold">Reason:</span> The current application server is not responding due to missing environment variables.
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
              <Terminal className="w-3 h-3 text-amber-400" /> SYSTEM EXECUTION COMMAND
            </span>
            <span>BASH</span>
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
