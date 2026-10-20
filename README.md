# 🛡️ SentinelOps AI

> **The Enterprise AI Agent Security & Deterministic Policy Enforcement Platform**

SentinelOps AI provides continuous observability, in-line tool interception, deterministic policy enforcement, and tamper-evident audit trails for autonomous AI agent ecosystems.

Unlike passive logging systems that record security breaches after they occur, SentinelOps AI intercepts agent tool invocations **in real time**, enforces explicit organizational constraints (`ALLOW`, `DENY`, `REQUIRE_APPROVAL`), routes sensitive operations to an unforgeable human approval queue, and maintains a cryptographic SHA-256 audit ledger.

---

## 🏛️ Monorepo Architecture

```
sentinelops-ai/
├── web/                 # Next.js 15 Full-Stack Web App, Marketing Site & 3D Topology
├── mobile/              # Expo SDK 52 Cross-Platform Mobile Security Operations App
├── backend/             # FastAPI Deterministic Enforcement Engine & SQLite/Postgres DB
├── sdk/                 # SentinelOps Python SDK with @protect_tool decorator
└── creative-studio/     # Remotion 4K Product Commercial & Interactive Video Walkthrough
```

---

## 🚀 Quickstart

### 1. Backend Enforcement Engine
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Or .venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 2. Full-Stack Web Console & Marketing Site
```bash
cd web
npm install
npm run dev
# Open http://localhost:3000
```

### 3. Mobile Operations App
```bash
cd mobile
npm install
npx expo start
```

---

## 🛡️ Core Security Architecture & Standards
- **OWASP Top 10 for Agentic Applications (2026)**: In-line tool privilege boundaries, prompt-injection defense, and fail-closed interceptors.
- **OWASP ASVS 5.0.0 & API Top 10**: Server-enforced RBAC, strict tenant isolation, parameter bounds checking.
- **Tamper-Evident Ledger**: SHA-256 hash chaining on all security events and approval decisions.
- **WCAG 2.2 AA**: Accessible keyboard navigation, high-contrast design tokens, and reduced-motion support.
