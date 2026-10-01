"use client";

import React from "react";
import { CheckCircle2, AlertTriangle, Loader2, RefreshCw, Search } from "lucide-react";
import { EventStatus } from "@/types/resolve";
import { useAgent } from "@/lib/agent-context";

interface VerificationStatusProps {
  metrics?: Record<string, string | number>;
  status?: EventStatus;
}

export const VerificationStatus: React.FC<VerificationStatusProps> = ({ metrics, status = "completed" }) => {
  const { runLiveDemo, submitUserIntent } = useAgent();
  const isVerified = status === "completed";
  const isFailed = status === "failed";

  return (
    <div
      className={`mt-3 p-4 rounded-xl border transition-all duration-300 ${
        isVerified
          ? "bg-emerald-950/20 border-emerald-500/40 shadow-lg shadow-emerald-500/5"
          : isFailed
          ? "bg-rose-950/30 border-rose-500/50 shadow-lg shadow-rose-500/10"
          : "bg-indigo-950/20 border-indigo-500/40 animate-pulse"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider uppercase">
          {isVerified ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-300">✓ VERIFIED</span>
            </>
          ) : isFailed ? (
            <>
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span className="text-rose-300">VERIFICATION FAILED</span>
            </>
          ) : (
            <>
              <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
              <span className="text-indigo-300">VERIFYING</span>
            </>
          )}
        </div>

        <span
          className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${
            isVerified
              ? "text-emerald-300 bg-emerald-950/60 border-emerald-500/40"
              : isFailed
              ? "text-rose-300 bg-rose-950/60 border-rose-500/40"
              : "text-indigo-300 bg-indigo-950/60 border-indigo-500/40"
          }`}
        >
          {isVerified
            ? "CLOSED-LOOP VERIFICATION PASSED"
            : isFailed
            ? "VERIFICATION FAILED"
            : "PROBING SYSTEM RESPONSE..."}
        </span>
      </div>

      <p className="text-xs font-sans text-zinc-300 mb-2 leading-relaxed">
        {isVerified
          ? "Application responding normally on http://localhost:3000"
          : isFailed
          ? "Reason: Configured development server could not be restarted. http://localhost:3000 remains unreachable."
          : "Checking http://localhost:3000 response headers..."}
      </p>

      {/* Metrics breakdown */}
      {metrics && (
        <div
          className={`grid grid-cols-3 gap-2 mt-2 pt-2 border-t font-mono ${
            isVerified
              ? "border-emerald-500/20"
              : isFailed
              ? "border-rose-500/20"
              : "border-indigo-500/20"
          }`}
        >
          {Object.entries(metrics).map(([key, val]) => (
            <div
              key={key}
              className="bg-zinc-950/80 border border-zinc-800/80 rounded p-2 text-center"
            >
              <span className="block text-[10px] text-zinc-500 uppercase">{key}</span>
              <span
                className={`block text-xs font-bold mt-0.5 ${
                  isVerified ? "text-emerald-400" : isFailed ? "text-rose-400" : "text-indigo-300"
                }`}
              >
                {val}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Failure Path Actions */}
      {isFailed && (
        <div className="flex items-center gap-3 pt-3 border-t border-rose-500/20 mt-3 font-mono">
          <button
            onClick={() => runLiveDemo()}
            className="flex-1 inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow-md transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>

          <button
            onClick={() => submitUserIntent("Inspect system logs and port 3000 processes again.")}
            className="flex-1 inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 font-semibold text-xs transition-all"
          >
            <Search className="w-3.5 h-3.5 text-cyan-400" />
            <span>Inspect Again</span>
          </button>
        </div>
      )}
    </div>
  );
};
