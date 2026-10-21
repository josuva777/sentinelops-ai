# Changelog

All notable changes to the SentinelOps AI platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2026-10-21

### Added
- **Strict Enterprise RBAC Isolation**: Non-admin roles (Developer, Auditor, Viewer) accessing `/dashboard/admin` receive an **HTTP 403 Access Denied** lockscreen with role details, hardware token binding assurances, and demo mode role elevation.
- **Active Session Governance & Kill-Switch**: Enterprise Admin Center includes an active user session table tracking user identity, organization, role profile, IP address, and device fingerprints with a 1-click "Terminate / Suspend" kill-switch to halt account takeovers and bot hijacking.
- **Anti-Sybil Account Creation Defense**: Dual-mode `/login` page enforces corporate email validation and actively blocks throwaway burner domains (`tempmail.com`, `mailinator.com`, etc.) to protect against trial abuse and bot farm syndication.
- **Dynamic Tier Badging & Monthly Quota Metering**: Tenant sidebar displays real-time quota progress meters (50,000 to 1,000,000 calls) with tier badges (`Starter Plan (Free)`, `★ SecOps Team`, `🛡️ Enterprise Defense`) and a self-serve 1-click modal to activate the $119/mo SecOps Team plan.
- **Direct Windows Desktop Web App Launcher & PWA**: Chrome/Edge PWA manifest (`manifest.json`) for chromeless window execution, plus a 1-click Windows Desktop Launcher (`Launch-SentinelOps-Desktop.bat`) and desktop shortcut placed directly on the user's desktop.
- **Direct Standalone Android APK Release**: Packaged native `.apk` deliverable in `releases/sentinelops-agent-security-v1.0.0.apk` and `web/public/downloads/sentinelops-mobile.apk` with cryptographic SHA-256 release metadata (`releases/LATEST_RELEASE.json`).
- **Playwright E2E Verification Suite**: Automated verification script (`web/scripts/verify_auth_rbac_pwa.mjs`) asserting 100% pass across RBAC lockscreen, session kill-switch, Anti-Sybil blocking, plan upgrade, and PWA modals.

## [1.1.0] - 2026-10-21

### Added
- **OWASP LLM01 Guardrail Pre-Flight Interception**: Deterministic AST and regex scope containment filtering prompt injections, jailbreaks, and sensitive credential dumps before generative evaluation.
- **Grounded Vector RAG AI Security Copilot**: Contextual retrieval over OWASP Top 10 for Agentic AI with mathematical pure-Python cosine similarity fallback.
- **Transparent Multi-Tier Commercial Pricing**: Enterprise pricing matrix (`/pricing`) featuring monthly/annual billing toggles, interactive contact sales modal, and SOC2/HIPAA trust badges.
- **Full-Screen 60fps Multi-Palette Engine**: Cyberpunk Matrix, Swiss Bauhaus, Avionics Amber, Oceanic Cobalt, and Lockdown Crimson with zero hardcoded hex leakage.
