# RESOLVEAI 🛡️

> **"SEE. UNDERSTAND. INVESTIGATE. REASON. ASK. ACT. VERIFY. RESOLVE."**

ResolveAI is a real-time multimodal AI operating console designed for intelligent digital problem solving. It perceives a user's digital environment through voice, real visual screen captures, and terminal context, gathers independent diagnostic evidence, reasons about root causes using structured facts and inferences, requests explicit human approval before executing consequential actions, performs verified system commands, and verifies recovery in a closed-loop probe.

---

## 🌟 Architecture & Core Innovation

```
                               ┌───────────────────────────┐
                               │       User Voice &        │
                               │      Screen Capture       │
                               └─────────────┬─────────────┘
                                             │
                                             ▼
                               ┌───────────────────────────┐
                               │  Multimodal Perception    │
                               │  (Llama 3.2 Vision 11B)   │
                               └─────────────┬─────────────┘
                                             │
                                             ▼
                               ┌───────────────────────────┐
                               │ Digital Situation Model   │
                               │ (Telemetry & Persistent)  │
                               └─────────────┬─────────────┘
                                             │
                                             ▼
                               ┌───────────────────────────┐
                               │  Diagnostic Tool Suite    │
                               │ (Endpoint, Port, Process) │
                               └─────────────┬─────────────┘
                                             │
                                             ▼
                               ┌───────────────────────────┐
                               │  Structured AI Reasoning  │
                               │ (Observed, Inference, Rec)│
                               └─────────────┬─────────────┘
                                             │
                                             ▼
                               ┌───────────────────────────┐
                               │   Human Approval Card     │
                               │ (Mutating Action Shield)  │
                               └─────────────┬─────────────┘
                                             │
                                             ▼
                               ┌───────────────────────────┐
                               │  Local Agent / Bridge     │
                               │ (Token-Authenticated 3001)│
                               └─────────────┬─────────────┘
                                             │
                                             ▼
                               ┌───────────────────────────┐
                               │ Closed-Loop Verification  │
                               │  (HTTP / Port Probe 3000) │
                               └───────────────────────────┘
```

### Core Product Loop
1. **SEE**: Captures display frames, active windows, and audio streams.
2. **UNDERSTAND**: Identifies active applications, visible error tracebacks, and environment state.
3. **INVESTIGATE**: Executes read-only diagnostic tools (`check_endpoint`, `inspect_port`, `get_process_status`).
4. **REASON**: Formulates structured diagnostic evidence (Observed facts, Inference, Recommendation).
5. **ASK**: Displays visual focal point card requesting explicit human approval before performing mutations.
6. **ACT**: Executes safe allowlisted commands via local agent or server bridge.
7. **VERIFY**: Performs closed-loop HTTP probing on target endpoints to confirm resolution.
8. **RESOLVE**: Marks issue resolved only upon successful empirical verification.

---

## 📁 Repository Structure

```
resolve-ai/
├── app/
│   ├── page.tsx                  # Landing Page (Hero, Flow, Feature Cards, Live Demo CTA)
│   ├── app/page.tsx              # Full 3-Zone Live Operating Console (/app)
│   ├── workspace/page.tsx        # Alternative Workspace Route (/workspace)
│   ├── api/
│   │   ├── agent/                # Multimodal Reasoning & Approved Action Routes
│   │   ├── local-agent/          # Next.js Server Bridge to Local Agent (Port 3001)
│   │   ├── perception/           # Vision Model Perception Route (Llama 3.2 11B)
│   │   └── verify/               # Closed-Loop HTTP Endpoint Probing Route
│   └── layout.tsx
├── components/
│   └── resolve/
│       ├── AgentTimeline.tsx      # Chronological AI Cognition & Action Timeline
│       ├── AgentEvent.tsx         # Structured Event Cards (Tool Badges & Evidence)
│       ├── SituationModel.tsx     # Signature Digital Situation Model Telemetry
│       ├── PerceptionStream.tsx   # Perception Sensor Status Bar
│       ├── AgentState.tsx         # State Indicator (LISTENING, OBSERVING, THINKING...)
│       ├── VoiceBar.tsx           # Voice Input & Screen Share Control Bar
│       ├── ActionApproval.tsx     # Focal Point Human Approval Card
│       └── VerificationStatus.tsx # Closed-Loop Verification Probe Status & Failure Handler
├── lib/
│   ├── demo/
│   │   └── demo-controller.ts     # PHASE 6: Central Orchestration Layer for Live Demo Steps
│   ├── ai/
│   │   ├── agent.ts             # Groq Llama 3.3 70B Intent & Reasoning Engine
│   │   └── prompts.ts           # System Prompts & Structured Outputs
│   ├── tools/
│   │   ├── diagnostics.ts       # Diagnostic Tool Registry (Port, Process, Endpoint)
│   │   └── browser.ts           # HTTP Telemetry Tools
│   ├── situation/
│   │   └── model.ts             # Digital Situation Model Initial State
│   └── agent-context.tsx        # Central State Management Provider
├── local-agent/                   # Standalone Node.js Local Agent Bridge
│   ├── src/
│   │   ├── index.ts              # Local Agent Server Entrypoint
│   │   ├── server.ts             # HTTP Server (/health, /tool)
│   │   ├── auth.ts               # Bearer Token Auth
│   │   ├── registry.ts           # Allowlisted Tool Registry
│   │   ├── permissions.ts        # READ_ONLY vs MUTATING Policy
│   │   └── tools/                # Local Diagnostics & Restart Executable
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── types/
│   └── resolve.ts               # TypeScript Definitions
├── .env.example                 # Environment Variable Documentation
└── package.json
```

---

## 🎬 Single-Click Presentation Demo Instructions

### Option 1: One-Click Demo Mode (Instant / Offline Support)
1. Open the application landing page or workspace (`http://localhost:3000`).
2. Click **`[ RUN LIVE DEMO ]`** in the workspace top bar or **`[ Run Live Demo ]`** on the landing page.
3. Observe the automated progression through:
   - `LISTENING`: User Intent "My application isn't working. Find the problem."
   - `OBSERVING` & `PERCEIVING`: Multimodal screen frame analysis.
   - `INVESTIGATING`: Probing `http://localhost:3000`, checking socket listener on port 3000, inspecting dev process table.
   - `EVIDENCE`: Synthesizing 3 independent diagnostic evidence signals.
   - `REASONING`: Structuring Observed Facts, Inference, and Recommendation.
   - `ACTION PROPOSED`: Awaiting user approval.
4. Click **`[ Approve Action ]`**.
5. Observe execution, closed-loop HTTP verification probing, and final `✓ RESOLVED` state.

---

## 🔐 Environment Variables

### Next.js Web Application (`.env.local`)
```env
# Groq API Key for Llama 3.3 70B Reasoning & Llama 3.2 11B Vision
GROQ_API_KEY=gsk_...

# Token for authenticating with Local Agent
RESOLVEAI_AGENT_TOKEN=resolveai-secret-local-token-2026

# Local Agent Endpoint URL
LOCAL_AGENT_URL=http://localhost:3001
```

### Local Agent (`local-agent/.env`)
```env
PORT=3001
RESOLVEAI_AGENT_TOKEN=resolveai-secret-local-token-2026
RESOLVEAI_LOG_FILE=./agent.log
RESOLVEAI_DEV_SERVER_COMMAND=npm run dev
```

> **Note**: Never expose secret API keys or agent tokens in `NEXT_PUBLIC_*` variables.

---

## 🛡️ Security Model

1. **Strict Tool Allowlist**: Arbitrary shell execution (`rm -rf`, raw terminal commands) is strictly prohibited.
2. **Human Approval Gate**: All mutating operations require explicit button approval (`[ Approve Action ]`).
3. **Closed-Loop Verification**: ResolveAI never claims an issue is fixed without executing an empirical verification probe.
4. **Disclosed Badges**: Every tool result is transparently tagged with `LIVE LOCAL AGENT`, `LIVE TOOL`, or `SIMULATED TOOL`.

---

## ⚠️ Known Limitations

- **Local Agent Requirements**: Real process restarting and port socket diagnostics require starting `local-agent` on port 3001. When offline, cloud probe fallbacks or simulated demo mode are automatically used.
- **Screen Share Permissions**: Browser screen capture relies on standard Web API media permissions (`getDisplayMedia`).
