# RESOLVEAI 🛡️

> **"See. Understand. Act. Resolve."**

ResolveAI is a real-time multimodal AI operating console that perceives a user's digital environment through voice, screen context, and active terminal tracebacks, reasons about problems, proposes human-authorized actions, executes safe sandbox scripts, and verifies the result in closed-loop probes.

---

## 🌟 Architecture Overview

```
Browser
   |
   | HTTPS / Streamed Chunks
   v
ResolveAI Next.js Application (/api/agent & /api/local-agent)
   |
   +-- Multimodal Reasoning Engine (Groq Llama 3.3 70B)
   |
   | Authenticated Bearer Token Header (RESOLVEAI_AGENT_TOKEN)
   v
ResolveAI Local Agent (Node.js/TypeScript @ http://localhost:3001)
   |
   +-- get_process_status      (READ_ONLY)
   +-- inspect_port            (READ_ONLY)
   +-- get_recent_terminal_output (READ_ONLY)
   +-- restart_server          (MUTATING - Requires explicit Human Approval)
```

---

## 📁 Repository Structure

```
resolve-ai/
├── app/
│   ├── page.tsx               # Landing Page (Hero, Flow, Feature Cards, Preview)
│   ├── workspace/page.tsx     # Full 3-Zone Live Operating Console (/workspace)
│   ├── app/page.tsx           # Full 3-Zone Live Operating Console (/app)
│   ├── api/
│   │   ├── chat/route.ts      # LLM Chat Reasoning Route
│   │   ├── agent/route.ts     # Multimodal Event Streaming Route
│   │   ├── local-agent/route.ts # Next.js Server Bridge to Local Agent
│   │   ├── perception/route.ts# Real Vision Model Perception Route
│   │   └── verify/route.ts    # Closed-Loop HTTP Verification Probe
│   └── layout.tsx
├── components/
│   └── resolve/
│       ├── AgentTimeline.tsx       # AI Cognition & Action Stream
│       ├── AgentEvent.tsx          # Structured Event Cards
│       ├── SituationModel.tsx      # Signature Digital Situation Model Telemetry
│       ├── PerceptionStream.tsx    # Live Perception Vision Sensor Bar
│       ├── AgentState.tsx          # Agent State Indicator (LISTENING, OBSERVING...)
│       ├── VoiceBar.tsx            # Voice & Multimodal Prompt Bar
│       ├── ScreenCapture.tsx       # Ephemeral Screen Frame Capture Utility
│       ├── ActionApproval.tsx      # Safe Human Authorization Component
│       └── VerificationStatus.tsx  # Closed-Loop Verification Component
├── local-agent/                    # PHASE 5: Standalone Local Agent Bridge
│   ├── src/
│   │   ├── index.ts               # Local Agent Runner Entrypoint
│   │   ├── server.ts              # HTTP Server & Router (/health, /tool)
│   │   ├── auth.ts                # Bearer Token Validator
│   │   ├── registry.ts            # Strict Allowlisted Tool Registry
│   │   ├── permissions.ts         # READ_ONLY vs MUTATING Permission Policy
│   │   └── tools/
│   │       ├── process.ts         # get_process_status Inspector
│   │       ├── port.ts            # inspect_port Socket Probe
│   │       ├── terminal.ts        # get_recent_terminal_output Log Reader
│   │       └── server.ts          # restart_server Profile Restarter
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── lib/
│   ├── ai/
│   │   ├── agent.ts          # Groq Llama 3.3 Agent Runner
│   │   ├── prompts.ts        # System Prompts & Templates
│   │   └── models.ts         # Model Selection Utilities
│   ├── tools/
│   │   ├── index.ts          # Tool Barrel Exports
│   │   ├── diagnostics.ts    # Server-Side Diagnostic Tool Registry
│   │   ├── browser.ts        # Browser & HTTP Telemetry Tools
│   │   └── mock-tools.ts     # Safe Execution Sandbox Tools
│   └── situation/
│       └── model.ts          # Digital Situation Model Data Structures
├── types/
│   └── resolve.ts            # Central TypeScript Definitions
├── .env.example              # Environment Configuration Template
└── package.json
```

---

## 🚀 Quick Start

### 1. Launch Next.js Application
```bash
# Install dependencies & start dev server
npm install
npm run dev
```

### 2. Launch ResolveAI Local Agent (Optional - Phase 5 Bridge)
```bash
# Navigate to local-agent directory
cd local-agent

# Install dependencies & start local agent
npm install
npm run dev
```

The Local Agent will start at `http://localhost:3001` and expose `GET /health` and `POST /tool`.

---

## 🔒 Security & Privacy Safeguards

- **Strict Allowlisted Tool Registry**: Arbitrary shell execution (`POST /execute-shell`, `bash`, `powershell`, `rm`) is completely disabled.
- **Human-in-the-Loop Authorization**: Mutating tools (`restart_server`) require explicit click authorization from the user.
- **Server-Side Token Storage**: Agent credentials (`RESOLVEAI_AGENT_TOKEN`) remain on the server and are never exposed to browser JavaScript.
- **Cloud Fallback**: If the Local Agent is not running, the application gracefully displays `LOCAL AGENT OFFLINE` and uses cloud endpoint diagnostics.
