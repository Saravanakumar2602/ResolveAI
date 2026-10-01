"use client";

import React, { useState } from "react";
import {
  Mic,
  MicOff,
  Monitor,
  Paperclip,
  Square,
  Send,
  Sparkles,
  Zap,
  Volume2,
} from "lucide-react";

interface VoiceBarProps {
  onSubmit: (intent: string) => void;
  isMicActive: boolean;
  onToggleMic: () => void;
  isScreenSharing: boolean;
  onToggleScreenShare: () => void;
  onInterrupt: () => void;
}

export const VoiceBar: React.FC<VoiceBarProps> = ({
  onSubmit,
  isMicActive,
  onToggleMic,
  isScreenSharing,
  onToggleScreenShare,
  onInterrupt,
}) => {
  const [inputText, setInputText] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSubmit(inputText);
    setInputText("");
  };

  const handleQuickPrompt = (prompt: string) => {
    setInputText(prompt);
    onSubmit(prompt);
  };

  return (
    <div className="border-t border-zinc-800/80 bg-zinc-950/90 backdrop-blur-xl p-3 flex flex-col gap-2">
      {/* Quick Suggestion Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-[11px] font-mono no-scrollbar">
        <span className="text-zinc-500 flex items-center gap-1 shrink-0">
          <Sparkles className="w-3 h-3 text-cyan-400" /> Quick Intents:
        </span>
        <button
          onClick={() => handleQuickPrompt("Fix local dev server crash and verify port 3000")}
          className="shrink-0 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 px-2.5 py-1 rounded-full transition-colors hover:border-cyan-500/40"
        >
          ⚡ Fix localhost:3000 crash
        </button>
        <button
          onClick={() => handleQuickPrompt("Inspect missing environment variables and update .env")}
          className="shrink-0 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 px-2.5 py-1 rounded-full transition-colors hover:border-purple-500/40"
        >
          🔍 Inspect .env parameters
        </button>
        <button
          onClick={() => handleQuickPrompt("Run build verification and audit console warnings")}
          className="shrink-0 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 px-2.5 py-1 rounded-full transition-colors hover:border-emerald-500/40"
        >
          🛡 Run build verification
        </button>
      </div>

      {/* Main Form Input Bar */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2.5">
        {/* Screen Share Button */}
        <button
          type="button"
          onClick={onToggleScreenShare}
          className={`p-2.5 rounded-lg border transition-all ${
            isScreenSharing
              ? "bg-cyan-950/60 border-cyan-500/50 text-cyan-400 glow-cyan"
              : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
          }`}
          title={isScreenSharing ? "Screen Sharing Active (60fps)" : "Enable Screen Perception"}
        >
          <Monitor className="w-4 h-4" />
        </button>

        {/* Attachment Button */}
        <button
          type="button"
          className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
          title="Attach diagnostic file or log snippet"
        >
          <Paperclip className="w-4 h-4" />
        </button>

        {/* Text Input Container */}
        <div className="flex-1 relative flex items-center bg-zinc-900/90 border border-zinc-800 focus-within:border-cyan-500/50 rounded-lg px-3 transition-all">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Tell ResolveAI what you need..."
            className="w-full bg-transparent py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none font-sans"
          />

          {/* Animated Mic Waveform when mic is active */}
          {isMicActive && (
            <div className="flex items-center gap-1 px-2 py-1 bg-cyan-950/80 rounded border border-cyan-500/40 mr-2">
              <span className="w-1 h-3 bg-cyan-400 rounded-full animate-waveform"></span>
              <span className="w-1 h-5 bg-cyan-400 rounded-full animate-waveform" style={{ animationDelay: "0.2s" }}></span>
              <span className="w-1 h-2 bg-cyan-400 rounded-full animate-waveform" style={{ animationDelay: "0.4s" }}></span>
              <span className="text-[10px] font-mono text-cyan-300 font-bold ml-1">LISTENING</span>
            </div>
          )}

          {inputText.trim() && (
            <button
              type="submit"
              className="p-1 rounded text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Prominent Center Microphone Button */}
        <button
          type="button"
          onClick={onToggleMic}
          className={`relative p-3 rounded-full border transition-all duration-300 active:scale-95 ${
            isMicActive
              ? "bg-rose-500 border-rose-400 text-white shadow-lg shadow-rose-500/40 animate-pulse"
              : "bg-cyan-500 hover:bg-cyan-400 border-cyan-400 text-zinc-950 font-bold shadow-lg shadow-cyan-500/25"
          }`}
          title={isMicActive ? "Stop Voice Mode" : "Activate Multimodal Voice Input"}
        >
          {isMicActive ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        {/* Stop / Interrupt Execution Button */}
        <button
          type="button"
          onClick={onInterrupt}
          className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-rose-400 transition-colors"
          title="Interrupt Agent Execution"
        >
          <Square className="w-4 h-4 fill-current" />
        </button>
      </form>
    </div>
  );
};
