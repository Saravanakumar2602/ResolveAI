"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Shield,
  Eye,
  Brain,
  Play,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Terminal,
  Activity,
  Globe,
  Lock,
  Cpu,
  Zap,
  ChevronRight,
  Monitor,
  Mic,
} from "lucide-react";

export default function LandingPage() {
  const [activeStep, setActiveStep] = useState<number>(0);

  const flowSteps = [
    {
      title: "PERCEIVE",
      icon: Eye,
      color: "text-cyan-400",
      border: "border-cyan-500/40",
      bg: "bg-cyan-950/40",
      desc: "Captures screen state, open IDE files, terminal output, and voice input in real-time at 60 FPS.",
    },
    {
      title: "UNDERSTAND",
      icon: Brain,
      color: "text-blue-400",
      border: "border-blue-500/40",
      bg: "bg-blue-950/40",
      desc: "Builds a continuous Digital Situation Model mapping user goals, active apps, and isolated error tracebacks.",
    },
    {
      title: "REASON",
      icon: Cpu,
      color: "text-purple-400",
      border: "border-purple-500/40",
      bg: "bg-purple-950/40",
      desc: "Synthesizes multi-step resolution trajectories and evaluates security policies for command execution.",
    },
    {
      title: "ACT",
      icon: Play,
      color: "text-amber-400",
      border: "border-amber-500/40",
      bg: "bg-amber-950/40",
      desc: "Performs authorized system modifications, creates config files, and executes terminal background tasks.",
    },
    {
      title: "VERIFY",
      icon: CheckCircle2,
      color: "text-emerald-400",
      border: "border-emerald-500/40",
      bg: "bg-emerald-950/40",
      desc: "Probes application HTTP endpoints, measures latency, and confirms complete issue resolution.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#050608] text-zinc-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden">
      {/* BACKGROUND GLOW ACCENTS */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-cyan-500/10 via-purple-500/5 to-transparent blur-3xl pointer-events-none z-0" />

      {/* TOP NAVIGATION BAR */}
      <header className="relative z-20 max-w-7xl mx-auto px-6 h-20 flex items-center justify-between border-b border-zinc-800/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center glow-cyan">
            <Shield className="w-5 h-5 text-cyan-400" />
          </div>
          <span className="font-mono font-bold text-lg tracking-widest uppercase">
            RESOLVE<span className="text-cyan-400">AI</span>
          </span>
        </div>

        <div className="flex items-center gap-6 font-mono text-xs text-zinc-400">
          <a href="#how-it-works" className="hover:text-cyan-400 transition-colors">
            Architecture
          </a>
          <a href="#features" className="hover:text-cyan-400 transition-colors">
            Capabilities
          </a>
          <a href="#preview" className="hover:text-cyan-400 transition-colors">
            Live Demo
          </a>
          <Link
            href="/app"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all active:scale-95"
          >
            <span>Launch Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative z-10 max-w-5xl mx-auto pt-24 pb-16 px-6 text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-mono text-xs uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>REAL-TIME MULTIMODAL AI AGENT</span>
        </div>

        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-white font-mono leading-none">
          RESOLVE<span className="text-cyan-400">AI</span>
        </h1>

        <p className="text-xl sm:text-2xl text-cyan-100/90 font-light max-w-3xl mx-auto leading-relaxed">
          &ldquo;An AI agent that understands what is happening on your computer.&rdquo;
        </p>

        <p className="text-base text-zinc-400 max-w-2xl mx-auto font-sans leading-relaxed">
          Talk naturally. Let ResolveAI see the context, reason about the problem, take authorized actions, and verify the result.
        </p>

        {/* CTA BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/app"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-mono font-bold text-sm shadow-xl shadow-cyan-500/25 transition-all duration-200 active:scale-95"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Start Resolving</span>
          </Link>

          <a
            href="#how-it-works"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 font-mono text-sm transition-all"
          >
            <span>See How It Works</span>
            <ChevronRight className="w-4 h-4 text-cyan-400" />
          </a>
        </div>

        {/* Tagline */}
        <div className="pt-6 font-mono text-xs tracking-widest text-zinc-500 uppercase">
          SEE. UNDERSTAND. ACT. RESOLVE.
        </div>
      </section>

      {/* VISUAL FLOW SECTION */}
      <section id="how-it-works" className="relative z-10 max-w-6xl mx-auto py-16 px-6 border-t border-zinc-800/60">
        <div className="text-center mb-12 space-y-2">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest">CLOSED-LOOP AUTONOMY</span>
          <h2 className="text-3xl font-mono font-bold text-white">THE RESOLUTION PIPELINE</h2>
        </div>

        {/* Step Flow Bar */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {flowSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                onMouseEnter={() => setActiveStep(index)}
                className={`p-5 rounded-xl border transition-all duration-300 cursor-pointer ${
                  activeStep === index
                    ? `${step.bg} ${step.border} shadow-lg shadow-cyan-500/10 scale-[1.03]`
                    : "bg-zinc-950/60 border-zinc-800/80 hover:border-zinc-700"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-bold text-zinc-500">0{index + 1}</span>
                  <Icon className={`w-5 h-5 ${step.color}`} />
                </div>
                <h3 className={`font-mono font-bold text-sm mb-2 ${step.color}`}>{step.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* THREE FEATURE CARDS SECTION */}
      <section id="features" className="relative z-10 max-w-6xl mx-auto py-16 px-6 border-t border-zinc-800/60">
        <div className="text-center mb-12 space-y-2">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest">AGENTIC CAPABILITIES</span>
          <h2 className="text-3xl font-mono font-bold text-white">DESIGNED FOR DEEP CONTEXT REASONING</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-xl bg-console-card border border-zinc-800/90 hover:border-cyan-500/40 transition-all duration-300 space-y-4 group">
            <div className="w-12 h-12 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="font-mono font-bold text-lg text-white">MULTIMODAL PERCEPTION</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Combines 60 FPS screen vision, terminal stream analysis, active IDE file buffer inspection, and real-time audio perception into one synchronized sensory stream.
            </p>
            <ul className="space-y-1.5 font-mono text-xs text-zinc-400 pt-2">
              <li className="flex items-center gap-2 text-cyan-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Screen OCR & active app tracking
              </li>
              <li className="flex items-center gap-2 text-cyan-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Voice input with interruption support
              </li>
            </ul>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-xl bg-console-card border border-zinc-800/90 hover:border-purple-500/40 transition-all duration-300 space-y-4 group">
            <div className="w-12 h-12 rounded-lg bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="font-mono font-bold text-lg text-white">DIGITAL SITUATION MODEL</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Maintains a structured, live state model of the user&apos;s goal, open application state, active errors, agent confidence score, and authorized environment tools.
            </p>
            <ul className="space-y-1.5 font-mono text-xs text-zinc-400 pt-2">
              <li className="flex items-center gap-2 text-purple-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" /> Real-time confidence scoring
              </li>
              <li className="flex items-center gap-2 text-purple-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" /> Continuous state telemetry
              </li>
            </ul>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-xl bg-console-card border border-zinc-800/90 hover:border-emerald-500/40 transition-all duration-300 space-y-4 group">
            <div className="w-12 h-12 rounded-lg bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <Play className="w-6 h-6" />
            </div>
            <h3 className="font-mono font-bold text-lg text-white">CLOSED-LOOP ACTION</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Proposes structured actions, requests explicit human authorization, performs verified terminal & file system commands, and probes HTTP endpoints to verify fixes.
            </p>
            <ul className="space-y-1.5 font-mono text-xs text-zinc-400 pt-2">
              <li className="flex items-center gap-2 text-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Human-in-the-Loop authorization
              </li>
              <li className="flex items-center gap-2 text-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Automated HTTP & process verification
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* PRODUCT PREVIEW SECTION */}
      <section id="preview" className="relative z-10 max-w-6xl mx-auto py-16 px-6 border-t border-zinc-800/60">
        <div className="text-center mb-8 space-y-2">
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest">INTERACTIVE CONSOLE</span>
          <h2 className="text-3xl font-mono font-bold text-white">THE RESOLVEAI CONTROL CENTER</h2>
          <p className="text-xs text-zinc-400">Experience the futuristic dark AI operating console in action.</p>
        </div>

        {/* Embedded Interactive Frame Container */}
        <div className="rounded-2xl border border-zinc-800/90 bg-console-card overflow-hidden shadow-2xl glow-cyan">
          {/* Mock Console Top Window Bar */}
          <div className="h-10 bg-zinc-950 px-4 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 font-mono text-xs text-zinc-400">resolveai-console // session-#RES-8942</span>
            </div>

            <Link
              href="/app"
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
            >
              <span>Launch Fullscreen App</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Interactive Workspace Teaser Preview */}
          <div className="p-6 bg-[#050608] grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
            {/* Column 1: Perception Stream */}
            <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 space-y-3">
              <div className="flex items-center gap-2 text-cyan-400 font-bold border-b border-zinc-800 pb-2">
                <Eye className="w-4 h-4" /> PERCEPTION STREAM
              </div>
              <div className="space-y-2 text-[11px]">
                <div className="p-2 bg-cyan-950/40 border border-cyan-500/30 rounded text-cyan-300">
                  👁 Screen detected: VS Code + Terminal
                </div>
                <div className="p-2 bg-amber-950/40 border border-amber-500/30 rounded text-amber-300">
                  ⌨ Terminal exit code 1
                </div>
                <div className="p-2 bg-rose-950/40 border border-rose-500/30 rounded text-rose-300">
                  ⚠ ECONNREFUSED :3000
                </div>
              </div>
            </div>

            {/* Column 2: Agent Event Log */}
            <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 space-y-3">
              <div className="flex items-center gap-2 text-purple-400 font-bold border-b border-zinc-800 pb-2">
                <Brain className="w-4 h-4" /> AGENT REASONING
              </div>
              <div className="space-y-2 text-[11px] font-sans">
                <div className="p-2 bg-zinc-900 border border-zinc-800 rounded text-zinc-300">
                  <span className="font-mono text-cyan-400 block font-bold">USER INTENT:</span>
                  Fix local server crash on port 3000
                </div>
                <div className="p-2 bg-amber-950/20 border border-amber-500/40 rounded text-amber-200">
                  <span className="font-mono text-amber-400 block font-bold">PROPOSED ACTION:</span>
                  Generate .env.local fallback and restart npm run dev
                </div>
              </div>
            </div>

            {/* Column 3: Situation Model */}
            <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold border-b border-zinc-800 pb-2">
                <Activity className="w-4 h-4" /> DIGITAL SITUATION
              </div>
              <div className="space-y-2 text-[11px]">
                <div className="flex justify-between border-b border-zinc-900 pb-1">
                  <span className="text-zinc-500">CONFIDENCE:</span>
                  <span className="text-cyan-400 font-bold">96%</span>
                </div>
                <div className="flex justify-between border-b border-zinc-900 pb-1">
                  <span className="text-zinc-500">APP:</span>
                  <span className="text-zinc-200">VS Code</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">STATE:</span>
                  <span className="text-emerald-400 font-bold">ACTING</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-zinc-950 border-t border-zinc-800 text-center">
            <Link
              href="/app"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-mono font-bold text-xs shadow-lg transition-all"
            >
              <span>Open Interactive Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-zinc-800/80 bg-zinc-950 py-12 px-6 text-center text-xs font-mono text-zinc-500">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span className="text-zinc-300 font-bold">RESOLVEAI</span>
            <span>— Multimodal AI Operating Console</span>
          </div>
          <div>See. Understand. Act. Resolve.</div>
        </div>
      </footer>
    </div>
  );
}
