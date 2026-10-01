"use client";

import React from "react";
import {
  Compass,
  History,
  Brain,
  Activity,
  Settings,
  Shield,
  User,
  Radio,
  Sparkles,
} from "lucide-react";

interface NavRailProps {
  activeNav: "resolve" | "sessions" | "memory" | "activity" | "settings";
  onSelectNav: (nav: "resolve" | "sessions" | "memory" | "activity" | "settings") => void;
}

const navItems = [
  { id: "resolve", label: "Resolve", icon: Compass },
  { id: "sessions", label: "Sessions", icon: History },
  { id: "memory", label: "Memory", icon: Brain },
  { id: "activity", label: "Activity", icon: Activity },
  { id: "settings", label: "Settings", icon: Settings },
] as const;

export const NavRail: React.FC<NavRailProps> = ({ activeNav, onSelectNav }) => {
  return (
    <aside className="w-16 border-r border-zinc-800/80 bg-console-card/95 backdrop-blur-xl flex flex-col items-center justify-between py-3 z-30">
      {/* Top Logo */}
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center glow-cyan shadow-lg cursor-pointer">
          <Shield className="w-5 h-5 text-cyan-400" />
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-2 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectNav(item.id)}
                className={`group relative p-2.5 rounded-lg border transition-all duration-200 flex flex-col items-center gap-1 ${
                  isActive
                    ? "bg-cyan-950/60 border-cyan-500/40 text-cyan-400"
                    : "bg-transparent border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                }`}
                title={item.label}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[9px] font-mono font-medium">{item.label}</span>

                {/* Active Indicator bar */}
                {isActive && (
                  <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-6 bg-cyan-400 rounded-r-full shadow-sm shadow-cyan-400" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom User & Connection Status */}
      <div className="flex flex-col items-center gap-3">
        {/* Connection Status indicator */}
        <div className="flex flex-col items-center gap-0.5" title="Connection: Active WebSocket (14ms)">
          <div className="relative flex items-center justify-center">
            <span className="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </div>
          <span className="text-[8px] font-mono text-emerald-400 uppercase font-semibold">LIVE</span>
        </div>

        {/* User Profile Avatar */}
        <div className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:border-cyan-500/40 transition-colors cursor-pointer" title="Dev Console User">
          <User className="w-4 h-4" />
        </div>
      </div>
    </aside>
  );
};
