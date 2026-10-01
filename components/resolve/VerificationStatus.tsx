"use client";

import React from "react";
import { CheckCircle2, ShieldCheck, Loader2 } from "lucide-react";
import { EventStatus } from "@/types/resolve";

interface VerificationStatusProps {
  metrics?: Record<string, string | number>;
  status?: EventStatus;
}

export const VerificationStatus: React.FC<VerificationStatusProps> = ({ metrics, status = "completed" }) => {
  const isVerified = status === "completed";

  return (
    <div className={`mt-3 p-3.5 rounded-lg border transition-all ${
      isVerified
        ? "bg-emerald-950/20 border-emerald-500/40"
        : "bg-indigo-950/20 border-indigo-500/40 animate-pulse"
    }`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider uppercase">
          {isVerified ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-300">✓ VERIFIED</span>
            </>
          ) : (
            <>
              <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
              <span className="text-indigo-300">VERIFYING</span>
            </>
          )}
        </div>

        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${
          isVerified
            ? "text-emerald-300 bg-emerald-950/60 border-emerald-500/40"
            : "text-indigo-300 bg-indigo-950/60 border-indigo-500/40"
        }`}>
          {isVerified ? "CLOSED-LOOP VERIFICATION PASSED" : "PROBING SYSTEM RESPONSE..."}
        </span>
      </div>

      <p className="text-xs font-sans text-zinc-300 mb-2">
        {isVerified ? "Application responding normally on http://localhost:3000" : "Checking http://localhost:3000 response headers..."}
      </p>

      {metrics && isVerified && (
        <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-emerald-500/20">
          {Object.entries(metrics).map(([key, val]) => (
            <div key={key} className="bg-zinc-950/80 border border-zinc-800/80 rounded p-2 text-center font-mono">
              <span className="block text-[10px] text-zinc-500 uppercase">{key}</span>
              <span className="block text-xs font-bold text-emerald-400 mt-0.5">{val}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
