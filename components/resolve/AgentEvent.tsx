"use client";

import React, { useState } from "react";
import { AgentTimelineEvent, EventCategory } from "@/lib/mock-data";
import { ActionApproval } from "./ActionApproval";
import { VerificationStatus } from "./VerificationStatus";
import {
  MessageSquare,
  Eye,
  Terminal,
  AlertTriangle,
  Cpu,
  FileCode,
  Play,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Search,
} from "lucide-react";

interface AgentEventProps {
  event: AgentTimelineEvent;
  onApprove: (eventId: string) => void;
  onReject: (eventId: string) => void;
}

const categoryConfig: Record<
  EventCategory,
  { label: string; icon: React.ElementType; color: string; badgeBg: string; border: string; lineGlow: string }
> = {
  USER_INTENT: {
    label: "USER INTENT",
    icon: MessageSquare,
    color: "text-blue-400",
    badgeBg: "bg-blue-950/60 text-blue-300 border-blue-500/40",
    border: "border-blue-500/30",
    lineGlow: "bg-blue-500",
  },
  PERCEPTION: {
    label: "PERCEPTION",
    icon: Eye,
    color: "text-blue-400",
    badgeBg: "bg-blue-950/60 text-blue-300 border-blue-500/40",
    border: "border-blue-500/30",
    lineGlow: "bg-blue-500",
  },
  OBSERVATION: {
    label: "OBSERVATION",
    icon: Terminal,
    color: "text-blue-400",
    badgeBg: "bg-blue-950/60 text-blue-300 border-blue-500/40",
    border: "border-blue-500/30",
    lineGlow: "bg-blue-500",
  },
  DETECTION: {
    label: "DETECTION",
    icon: AlertTriangle,
    color: "text-rose-400",
    badgeBg: "bg-rose-950/60 text-rose-300 border-rose-500/40",
    border: "border-rose-500/30",
    lineGlow: "bg-rose-500",
  },
  REASONING: {
    label: "REASONING",
    icon: Cpu,
    color: "text-purple-400",
    badgeBg: "bg-purple-950/60 text-purple-300 border-purple-500/40",
    border: "border-purple-500/30",
    lineGlow: "bg-purple-500",
  },
  ACTION_PROPOSED: {
    label: "ACTION PROPOSED",
    icon: FileCode,
    color: "text-amber-400",
    badgeBg: "bg-amber-950/60 text-amber-300 border-amber-500/40",
    border: "border-amber-500/40",
    lineGlow: "bg-amber-500",
  },
  ACTION: {
    label: "ACTION",
    icon: Play,
    color: "text-amber-400",
    badgeBg: "bg-amber-950/60 text-amber-300 border-amber-500/40",
    border: "border-amber-500/30",
    lineGlow: "bg-amber-500",
  },
  VERIFICATION: {
    label: "VERIFICATION",
    icon: Search,
    color: "text-emerald-400",
    badgeBg: "bg-emerald-950/60 text-emerald-300 border-emerald-500/40",
    border: "border-emerald-500/30",
    lineGlow: "bg-emerald-500",
  },
  SUCCESS: {
    label: "SUCCESS",
    icon: CheckCircle2,
    color: "text-emerald-400",
    badgeBg: "bg-emerald-950/60 text-emerald-300 border-emerald-500/40",
    border: "border-emerald-500/40",
    lineGlow: "bg-emerald-500",
  },
};

export const AgentEvent: React.FC<AgentEventProps> = ({ event, onApprove, onReject }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const cfg = categoryConfig[event.category] || categoryConfig.REASONING;
  const CategoryIcon = cfg.icon;

  const hasDetails =
    event.details &&
    (event.details.logs?.length ||
      event.details.codeSnippet ||
      event.details.metrics ||
      event.details.suggestedFix);

  return (
    <div className="relative pl-8 pb-6 group transition-all duration-300">
      {/* Continuous Connected Vertical Line */}
      <div className={`absolute left-3 top-7 bottom-0 w-0.5 bg-zinc-800 group-hover:${cfg.lineGlow} transition-colors`} />

      {/* Connected Node Icon */}
      <div
        className={`absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center border bg-zinc-950 ${cfg.border} ${cfg.color} shadow-md z-10`}
      >
        <CategoryIcon className="w-3.5 h-3.5" />
      </div>

      {/* Event Block */}
      <div className={`rounded-lg border bg-zinc-950/90 p-4 transition-all duration-200 hover:border-zinc-700/80 ${cfg.border} shadow-md`}>
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1 text-[11px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded border ${cfg.badgeBg}`}>
              <CategoryIcon className="w-3 h-3" />
              {cfg.label}
            </span>
            <span className="text-sm font-semibold text-zinc-100">{event.title}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[10px] font-mono text-zinc-500">
              <Clock className="w-3 h-3" />
              {event.timestamp}
            </span>

            {hasDetails && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-zinc-500 hover:text-zinc-300 p-0.5 rounded hover:bg-zinc-800 transition-colors"
                title={isExpanded ? "Collapse Details" : "Expand Details"}
              >
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>

        {/* Text */}
        <p className="text-xs text-zinc-300 leading-relaxed font-sans">{event.description}</p>

        {/* Action Approval */}
        {event.category === "ACTION_PROPOSED" && event.requiresApproval && (
          <ActionApproval
            eventId={event.id}
            codeSnippet={event.details?.codeSnippet}
            affectedFiles={event.details?.affectedFiles}
            onApprove={onApprove}
            onReject={onReject}
            isPending={event.status === "pending_approval"}
          />
        )}

        {/* Verification Status */}
        {event.category === "VERIFICATION" && (
          <VerificationStatus metrics={event.details?.metrics} status={event.status} />
        )}

        {/* Details Payload */}
        {hasDetails && isExpanded && event.category !== "ACTION_PROPOSED" && event.category !== "VERIFICATION" && (
          <div className="mt-3 pt-3 border-t border-zinc-800/80 space-y-2 text-xs font-mono">
            {event.details?.metrics && (
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(event.details.metrics).map(([k, v]) => (
                  <div key={k} className="bg-zinc-900/80 border border-zinc-800 p-1.5 rounded">
                    <div className="text-[10px] text-zinc-500">{k}</div>
                    <div className="text-blue-300 font-semibold text-[11px]">{v}</div>
                  </div>
                ))}
              </div>
            )}

            {event.details?.logs && (
              <div className="bg-zinc-950 border border-zinc-800 p-2.5 rounded text-[11px] text-zinc-300 space-y-1">
                <div className="text-[10px] text-zinc-500 font-bold uppercase mb-1">Extracted Diagnostics</div>
                {event.details.logs.map((log, idx) => (
                  <div key={idx} className="leading-snug">{log}</div>
                ))}
              </div>
            )}

            {event.details?.suggestedFix && (
              <div className="bg-purple-950/20 border border-purple-500/30 p-2.5 rounded text-xs text-purple-200">
                <span className="font-semibold text-purple-300 block mb-0.5">Suggested Strategy:</span>
                {event.details.suggestedFix}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
