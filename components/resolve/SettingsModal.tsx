"use client";

import React, { useState } from "react";
import { Settings, Sliders, Shield, Key, Eye, Mic } from "lucide-react";

interface SettingsModalProps {
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const [model, setModel] = useState<string>("gemini-multimodal-v2");
  const [visionFps, setVisionFps] = useState<number>(60);
  const [strictApproval, setStrictApproval] = useState<boolean>(true);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-console-card border border-zinc-800 rounded-xl w-full max-w-2xl p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2 text-zinc-100 font-mono font-bold">
            <Settings className="w-5 h-5 text-cyan-400" />
            <span>RESOLVEAI AGENT SYSTEM SETTINGS</span>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-200 text-xs font-mono">
            ✕ CLOSE
          </button>
        </div>

        <div className="space-y-4 font-mono text-xs">
          {/* AI Model Selection */}
          <div className="p-3.5 bg-zinc-950/80 border border-zinc-800 rounded-lg space-y-2">
            <label className="block text-zinc-200 font-bold flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" /> Multimodal Reasoning Engine
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-zinc-200 focus:border-cyan-500 outline-none"
            >
              <option value="gemini-multimodal-v2">ResolveAI Engine v2 (Real-Time Vision + Audio)</option>
              <option value="gemini-1.5-pro">Gemini 1.5 Pro Multimodal Sandbox</option>
              <option value="local-llama-vision">Local Vision Model (Ollama Dev)</option>
            </select>
          </div>

          {/* Vision Sensor Frame Rate */}
          <div className="p-3.5 bg-zinc-950/80 border border-zinc-800 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-zinc-200 font-bold flex items-center gap-2">
                <Eye className="w-4 h-4 text-blue-400" /> Vision Sampling Rate
              </label>
              <span className="text-cyan-400 font-bold">{visionFps} FPS</span>
            </div>
            <input
              type="range"
              min={15}
              max={60}
              step={15}
              value={visionFps}
              onChange={(e) => setVisionFps(Number(e.target.value))}
              className="w-full accent-cyan-400 bg-zinc-900"
            />
          </div>

          {/* Human-in-the-Loop Approval Policy */}
          <div className="p-3.5 bg-zinc-950/80 border border-zinc-800 rounded-lg flex items-center justify-between">
            <div>
              <div className="text-zinc-200 font-bold flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" /> Strict Action Authorization
              </div>
              <p className="text-[11px] text-zinc-400 font-sans mt-0.5">
                Always prompt for confirmation before running terminal commands or modifying files.
              </p>
            </div>
            <input
              type="checkbox"
              checked={strictApproval}
              onChange={(e) => setStrictApproval(e.target.checked)}
              className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
            />
          </div>

          {/* Environment Variable Config */}
          <div className="p-3.5 bg-zinc-950/80 border border-zinc-800 rounded-lg space-y-2">
            <label className="block text-zinc-200 font-bold flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-400" /> API Keys & Connections
            </label>
            <div className="flex gap-2">
              <input
                type="password"
                placeholder="RESOLVEAI_API_KEY=sk_live_..."
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded px-3 py-1.5 text-xs text-zinc-300 outline-none"
              />
              <button className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold rounded">
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
