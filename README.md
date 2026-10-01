# RESOLVEAI 🛡️

> **"See. Understand. Act. Resolve."**

ResolveAI is a real-time multimodal AI operating console that perceives a user's digital environment through voice, screen context, and active terminal tracebacks, reasons about problems, proposes human-authorized actions, executes safe sandbox scripts, and verifies the result in closed-loop probes.

---

## 🌟 Architecture Overview

```
User Voice/Text Input
       ↓
Next.js 15 Server API (/api/agent)
       ↓
Multimodal Reasoning Engine (Groq Llama 3.3 70B)
       ↓
Digital Situation Model Telemetry
       ↓
Tool Selection & Human Approval (/api/agent/approve)
       ↓
Safe Execution & Closed-Loop Verification Probe (/api/verify)
       ↓
Updated Situation Model & Real-Time Stream Response
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
│   │   └── verify/route.ts    # Closed-Loop HTTP Verification Probe
│   └── layout.tsx
├── components/
│   └── resolve/
│       ├── AgentTimeline.tsx       # AI Cognition & Action Stream
│       ├── AgentEvent.tsx          # Structured Event Cards
│       ├── SituationModel.tsx      # Signature Digital Situation Model Telemetry
│       ├── PerceptionStream.tsx    # Live Perception Vision Sensor Bar
│       ├── AgentState.tsx          # Agent State Indicator (LISTENING, OBSERVING, THINKING...)
│       ├── VoiceBar.tsx            # Voice & Multimodal Prompt Bar
│       ├── ActionApproval.tsx      # Safe Human Authorization Component
│       └── VerificationStatus.tsx  # Closed-Loop Verification Component
├── lib/
│   ├── ai/
│   │   ├── agent.ts          # Groq Llama 3.3 Agent Runner
│   │   ├── prompts.ts        # System Prompts & Templates
│   │   └── models.ts         # Model Selection Utilities
│   ├── tools/
│   │   ├── index.ts          # Tool Barrel Exports
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

```bash
# 1. Clone repository & install dependencies
npm install

# 2. Copy environment variables
cp .env.example .env.local

# 3. Launch local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the Landing Page or [http://localhost:3000/workspace](http://localhost:3000/workspace) for the live AI operating console.

---

## 🔒 Security & Privacy

- **Human-in-the-Loop Authorization**: Consequential actions require explicit user approval.
- **Server-Side API Key Protection**: API keys are kept in `.env.local` and never exposed to browser clients.
- **Demo Simulation Mode**: Clear visual indicators (`DEMO MODE`) when tool calls are executed in a safe local sandbox.
