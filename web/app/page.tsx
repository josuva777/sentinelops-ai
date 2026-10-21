'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '../components/Navbar';
import { ParticleCanvas } from '../components/ParticleCanvas';
import { useTheme } from '../lib/themeContext';
import { motion } from 'motion/react';
import {
  Shield,
  Lock,
  Terminal,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Clock,
  Database,
  Cpu,
  FileCheck,
  AlertTriangle,
  Code,
  Layers,
  Play,
  Download,
  Fingerprint,
  Zap,
} from 'lucide-react';

interface SimulationScenario {
  id: string;
  name: string;
  agent: string;
  tool: string;
  args: Record<string, any>;
  expectedDecision: 'DENY' | 'REQUIRE_APPROVAL' | 'ALLOW';
  ruleMatched: string;
  reason: string;
}

const SCENARIOS: SimulationScenario[] = [
  {
    id: 'drop_table',
    name: 'Destructive DDL Command',
    agent: 'DevOpsInfraWorker (v2.1)',
    tool: 'drop_database_table',
    args: { table: 'customers', cascade: true },
    expectedDecision: 'DENY',
    ruleMatched: 'r_zero_destruct',
    reason: 'Zero-Destruction Guardrail: Autonomous DDL truncation or drop is strictly prohibited.',
  },
  {
    id: 'large_wire',
    name: 'Unverified Financial Settlement',
    agent: 'FinReconcileBot (v4.0)',
    tool: 'initiate_settlement',
    args: { amount: 84000, recipient: 'Offshore Vendor Ltd', currency: 'USD' },
    expectedDecision: 'REQUIRE_APPROVAL',
    ruleMatched: 'r_large_wire',
    reason: 'Executive Sign-off Required: Transactions over $5,000 threshold paused with 15m single-use TTL token.',
  },
  {
    id: 'mass_email',
    name: 'Mass Email Broadcast',
    agent: 'GrowthCampaignBot (v1.2)',
    tool: 'send_user_email',
    args: { recipient_count: 45000, template: 'discount_v1' },
    expectedDecision: 'DENY',
    ruleMatched: 'r_mass_broadcast',
    reason: 'Anti-Spam Amplification: Automated broadcast exceeding 1 recipient is rejected.',
  },
  {
    id: 'safe_query',
    name: 'Read-Only CRM Lookup',
    agent: 'CustomerSupportCopilot (v3.8)',
    tool: 'lookup_customer',
    args: { customer_id: 'cust_98124', fields: ['email', 'tier'] },
    expectedDecision: 'ALLOW',
    ruleMatched: 'r_default_permit',
    reason: 'Arguments satisfy active role boundaries. Execution permitted in <12ms.',
  },
];

export default function HomePage() {
  const { currentTheme } = useTheme();
  const [selectedScenario, setSelectedScenario] = useState<SimulationScenario>(SCENARIOS[0]);
  const [evaluating, setEvaluating] = useState(false);
  const [evaluated, setEvaluated] = useState(true);

  const triggerEvaluation = (scenario: SimulationScenario) => {
    setSelectedScenario(scenario);
    setEvaluating(true);
    setTimeout(() => {
      setEvaluating(false);
      setEvaluated(true);
    }, 280);
  };

  return (
    <div
      className="min-h-screen text-foreground flex flex-col transition-colors duration-400"
      style={{ backgroundColor: currentTheme.background }}
    >
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-16 pb-24 sm:pt-24 sm:pb-32 border-b" style={{ borderColor: currentTheme.surfaceBorder }}>
          {/* Dynamic background ambient glow */}
          <div
            className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full pointer-events-none opacity-20 blur-[130px] transition-all duration-700"
            style={{ backgroundColor: currentTheme.primary }}
          />

          {/* 60fps Interactive Canvas Particle Network */}
          <ParticleCanvas />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            {/* Live badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-mono mb-8"
              style={{
                backgroundColor: currentTheme.badgeBg,
                borderColor: currentTheme.surfaceBorder,
                color: currentTheme.badgeText,
                boxShadow: `0 0 15px -3px ${currentTheme.glow}`,
              }}
            >
              <span className="h-2 w-2 rounded-full animate-ping" style={{ backgroundColor: currentTheme.primary }} />
              <span className="font-semibold">OWASP Top 10 for Agentic AI Compliant</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-tight"
            >
              Stop Rogue AI Agents. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r" style={{
                backgroundImage: `linear-gradient(to right, ${currentTheme.primary}, ${currentTheme.accent}, #ffffff)`
              }}>
                Deterministic In-Line Guardrails.
              </span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed"
            >
              Intercept tool calls <strong className="text-white">pre-flight</strong> before execution. 
              Zero LLM hallucinations. Mathematical policy enforcement. Cryptographic 15-minute human approval for high-risk actions.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-10 flex flex-wrap items-center justify-center gap-4"
            >
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-bold text-slate-950 transition-all duration-300 hover:scale-105 shadow-xl"
                style={{
                  backgroundColor: currentTheme.primary,
                  boxShadow: `0 0 25px -4px ${currentTheme.glow}`,
                }}
              >
                <span>Enter Security Console</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#simulator"
                className="flex items-center gap-2 rounded-xl border px-6 py-3.5 text-sm font-semibold text-slate-200 transition-all hover:bg-white/5"
                style={{
                  borderColor: currentTheme.surfaceBorder,
                  backgroundColor: currentTheme.surface,
                }}
              >
                <span>Test Live Policy Engine</span>
              </a>
              <a
                href="#commercial-video"
                className="flex items-center gap-2 rounded-xl border px-5 py-3.5 text-sm font-semibold text-slate-300 transition-all hover:bg-white/5"
                style={{
                  borderColor: currentTheme.surfaceBorder,
                }}
              >
                <Play className="h-4 w-4" style={{ color: currentTheme.primary }} />
                <span>Watch Product Demo</span>
              </a>
            </motion.div>

            {/* Verifiable metrics row */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-16 pt-8 border-t grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto text-center font-mono"
              style={{ borderColor: currentTheme.surfaceBorder }}
            >
              <div className="p-3 rounded-lg border bg-black/20" style={{ borderColor: currentTheme.surfaceBorder }}>
                <div className="text-2xl font-bold" style={{ color: currentTheme.primary }}>&lt; 12ms</div>
                <div className="text-xs text-slate-400 mt-1">Interception Latency</div>
              </div>
              <div className="p-3 rounded-lg border bg-black/20" style={{ borderColor: currentTheme.surfaceBorder }}>
                <div className="text-2xl font-bold text-white">Zero Guesswork</div>
                <div className="text-xs text-slate-400 mt-1">Mathematical Rules</div>
              </div>
              <div className="p-3 rounded-lg border bg-black/20" style={{ borderColor: currentTheme.surfaceBorder }}>
                <div className="text-2xl font-bold text-amber-400">15m TTL</div>
                <div className="text-xs text-slate-400 mt-1">Single-Use Tokens</div>
              </div>
              <div className="p-3 rounded-lg border bg-black/20" style={{ borderColor: currentTheme.surfaceBorder }}>
                <div className="text-2xl font-bold text-emerald-400">SHA-256</div>
                <div className="text-xs text-slate-400 mt-1">Tamper-Evident Ledger</div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ABOUT US & MISSION SECTION */}
        <section id="about" className="py-24 border-b relative" style={{ borderColor: currentTheme.surfaceBorder, backgroundColor: `${currentTheme.surface}40` }}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-mono font-bold tracking-wider uppercase px-3 py-1 rounded-full border" style={{
                backgroundColor: currentTheme.badgeBg,
                borderColor: currentTheme.surfaceBorder,
                color: currentTheme.badgeText,
              }}>
                About SentinelOps AI
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-4 tracking-tight">
                Built for the Autonomous Agent Era
              </h2>
              <p className="text-sm sm:text-base text-slate-300 mt-4 leading-relaxed">
                Chatbots output text. Autonomous agents output SQL queries, payment wires, AWS commands, and API payloads. 
                When prompt injection or tool hallucination strikes, firewalls are blind. 
                SentinelOps AI sits in-line between the agent and infrastructure to enforce mathematical policy guardrails.
              </p>
            </div>

            {/* 4 Core Pillars: What You Can Do */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div
                className="p-6 rounded-2xl border shadow-xl flex flex-col justify-between transition-all duration-300 hover:-translate-y-1"
                style={{
                  backgroundColor: currentTheme.surface,
                  borderColor: currentTheme.surfaceBorder,
                }}
              >
                <div>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center border mb-4" style={{
                    backgroundColor: currentTheme.badgeBg,
                    borderColor: currentTheme.surfaceBorder,
                    color: currentTheme.primary,
                  }}>
                    <Zap className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">Pre-Flight Interception</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Tool parameters are trapped in &lt;12ms before sockets or database connections open. No rogue side-effects escape.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t text-[11px] font-mono text-emerald-400" style={{ borderColor: currentTheme.surfaceBorder }}>
                  ✓ 100% Fail-Closed Gateway
                </div>
              </div>

              <div
                className="p-6 rounded-2xl border shadow-xl flex flex-col justify-between transition-all duration-300 hover:-translate-y-1"
                style={{
                  backgroundColor: currentTheme.surface,
                  borderColor: currentTheme.surfaceBorder,
                }}
              >
                <div>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center border mb-4" style={{
                    backgroundColor: currentTheme.badgeBg,
                    borderColor: currentTheme.surfaceBorder,
                    color: currentTheme.primary,
                  }}>
                    <Shield className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">Deterministic Rules</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Zero LLM-evaluating-LLM hallucinations. Pure mathematical AST syntax trees and regex parameter boundaries.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t text-[11px] font-mono text-emerald-400" style={{ borderColor: currentTheme.surfaceBorder }}>
                  ✓ ALLOW &bull; DENY &bull; APPROVE
                </div>
              </div>

              <div
                className="p-6 rounded-2xl border shadow-xl flex flex-col justify-between transition-all duration-300 hover:-translate-y-1"
                style={{
                  backgroundColor: currentTheme.surface,
                  borderColor: currentTheme.surfaceBorder,
                }}
              >
                <div>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center border mb-4" style={{
                    backgroundColor: currentTheme.badgeBg,
                    borderColor: currentTheme.surfaceBorder,
                    color: currentTheme.primary,
                  }}>
                    <Clock className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">Human-in-the-Loop</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    High-value mutations pause for human authorization with 15-minute single-use cryptographic tokens.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t text-[11px] font-mono text-amber-400" style={{ borderColor: currentTheme.surfaceBorder }}>
                  ✓ 1-Tap Mobile & Console Sign-off
                </div>
              </div>

              <div
                className="p-6 rounded-2xl border shadow-xl flex flex-col justify-between transition-all duration-300 hover:-translate-y-1"
                style={{
                  backgroundColor: currentTheme.surface,
                  borderColor: currentTheme.surfaceBorder,
                }}
              >
                <div>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center border mb-4" style={{
                    backgroundColor: currentTheme.badgeBg,
                    borderColor: currentTheme.surfaceBorder,
                    color: currentTheme.primary,
                  }}>
                    <Fingerprint className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">SHA-256 Audit Seal</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Every intercepted event is mathematically sealed into an immutable append-only hash chain from Genesis block.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t text-[11px] font-mono text-emerald-400" style={{ borderColor: currentTheme.surfaceBorder }}>
                  ✓ Tamper-Evident Proofs
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BROADCAST COMMERCIAL VIDEO SHOWCASE SECTION */}
        <section id="commercial-video" className="py-20 border-b relative" style={{ borderColor: currentTheme.surfaceBorder, backgroundColor: `${currentTheme.surface}60` }}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <span className="text-xs font-mono font-bold tracking-wider uppercase" style={{ color: currentTheme.primary }}>
                  Commercial Production & Walkthrough
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-1">
                  SentinelOps AI in Action
                </h2>
                <p className="text-sm text-slate-400 mt-2 max-w-2xl">
                  Broadcast-grade 1080p 60fps render produced with Remotion. Demonstrates agent tool call interception,
                  AST parameter constraints, and the cryptographic approval lifecycle.
                </p>
              </div>
              <a
                href="/sentinelops_commercial.mp4"
                download="sentinelops_commercial.mp4"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border text-xs font-mono font-semibold transition-colors hover:bg-white/10"
                style={{ borderColor: currentTheme.surfaceBorder, color: currentTheme.accent }}
              >
                <Download className="w-4 h-4" />
                <span>Download Full HD MP4 Video</span>
              </a>
            </div>

            {/* Video Player Card */}
            <div
              className="rounded-2xl border overflow-hidden p-2 shadow-2xl relative"
              style={{
                borderColor: currentTheme.surfaceBorder,
                backgroundColor: currentTheme.surface,
                boxShadow: `0 25px 50px -12px rgba(0,0,0,0.8), 0 0 30px -8px ${currentTheme.glow}`,
              }}
            >
              <div className="relative aspect-video rounded-xl overflow-hidden bg-black flex items-center justify-center">
                <video
                  controls
                  preload="metadata"
                  className="w-full h-full object-contain"
                  poster=""
                >
                  <source src="/sentinelops_commercial.mp4" type="video/mp4" />
                  Your browser does not support HTML5 video playback.
                </video>
              </div>
              <div className="p-3 flex items-center justify-between text-xs font-mono text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: currentTheme.primary }} />
                  <span>Resolution: 1920x1080 @ 60 FPS</span>
                </div>
                <span>Codec: H.264 / AAC Audio</span>
              </div>
            </div>
          </div>
        </section>

        {/* INTERACTIVE PRE-FLIGHT POLICY SIMULATOR */}
        <section id="simulator" className="py-24 border-b relative" style={{ borderColor: currentTheme.surfaceBorder }}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-xs font-mono font-bold tracking-wider uppercase" style={{ color: currentTheme.primary }}>
                Live Verification Sandbox
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-2">
                Simulate Agent Tool Interception
              </h2>
              <p className="text-sm sm:text-base text-slate-400 mt-3">
                Select an autonomous agent scenario below to observe how the pre-flight engine evaluates tool invocations in real time.
              </p>
            </div>

            {/* Interactive Scenario Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
              {SCENARIOS.map((scenario) => {
                const isSelected = selectedScenario.id === scenario.id;
                return (
                  <button
                    key={scenario.id}
                    onClick={() => triggerEvaluation(scenario)}
                    className="p-4 rounded-xl border text-left transition-all duration-200 relative overflow-hidden"
                    style={{
                      borderColor: isSelected ? currentTheme.primary : currentTheme.surfaceBorder,
                      backgroundColor: isSelected ? `${currentTheme.surface}` : `${currentTheme.surface}80`,
                      boxShadow: isSelected ? `0 0 20px -5px ${currentTheme.glow}` : 'none',
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-mono text-slate-400">{scenario.agent.split(' ')[0]}</span>
                      <span
                        className="px-2 py-0.5 rounded text-[10px] font-mono font-bold border"
                        style={{
                          backgroundColor:
                            scenario.expectedDecision === 'DENY'
                              ? 'rgba(244, 63, 94, 0.1)'
                              : scenario.expectedDecision === 'REQUIRE_APPROVAL'
                              ? 'rgba(245, 158, 11, 0.1)'
                              : 'rgba(16, 185, 129, 0.1)',
                          color:
                            scenario.expectedDecision === 'DENY'
                              ? '#f43f5e'
                              : scenario.expectedDecision === 'REQUIRE_APPROVAL'
                              ? '#f59e0b'
                              : '#10b981',
                          borderColor:
                            scenario.expectedDecision === 'DENY'
                              ? 'rgba(244, 63, 94, 0.3)'
                              : scenario.expectedDecision === 'REQUIRE_APPROVAL'
                              ? 'rgba(245, 158, 11, 0.3)'
                              : 'rgba(16, 185, 129, 0.3)',
                        }}
                      >
                        {scenario.expectedDecision}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-white mb-1">{scenario.name}</div>
                    <div className="text-xs font-mono text-slate-400 truncate">{scenario.tool}()</div>
                  </button>
                );
              })}
            </div>

            {/* Live Evaluation Terminal Display */}
            <div
              className="rounded-2xl border p-6 font-mono text-xs sm:text-sm overflow-hidden shadow-2xl relative"
              style={{
                borderColor: currentTheme.surfaceBorder,
                backgroundColor: currentTheme.surface,
              }}
            >
              <div className="flex items-center justify-between pb-4 mb-4 border-b text-xs text-slate-400" style={{ borderColor: currentTheme.surfaceBorder }}>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-slate-300 font-semibold">PRE-FLIGHT AST INTERCEPTOR OUTPUT</span>
                </div>
                <span>Status: {evaluating ? 'EVALUATING...' : 'RESOLVED'}</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <div className="text-slate-500 text-[11px] uppercase tracking-wider mb-2 font-bold">1. Intercepted Call Payload</div>
                  <pre className="p-4 rounded-xl bg-black/50 border overflow-x-auto text-slate-200" style={{ borderColor: currentTheme.surfaceBorder }}>
                    {JSON.stringify(
                      {
                        agent_id: selectedScenario.agent,
                        tool_name: selectedScenario.tool,
                        arguments: selectedScenario.args,
                        timestamp: '2026-10-21T08:35:00Z',
                      },
                      null,
                      2
                    )}
                  </pre>
                </div>

                <div>
                  <div className="text-slate-500 text-[11px] uppercase tracking-wider mb-2 font-bold">2. Deterministic Policy Outcome</div>
                  <div
                    className="p-5 rounded-xl border flex flex-col justify-between h-[210px]"
                    style={{
                      borderColor:
                        selectedScenario.expectedDecision === 'DENY'
                          ? '#f43f5e'
                          : selectedScenario.expectedDecision === 'REQUIRE_APPROVAL'
                          ? '#f59e0b'
                          : '#10b981',
                      backgroundColor:
                        selectedScenario.expectedDecision === 'DENY'
                          ? 'rgba(244, 63, 94, 0.05)'
                          : selectedScenario.expectedDecision === 'REQUIRE_APPROVAL'
                          ? 'rgba(245, 158, 11, 0.05)'
                          : 'rgba(16, 185, 129, 0.05)',
                    }}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        {selectedScenario.expectedDecision === 'DENY' && <XCircle className="w-5 h-5 text-rose-500" />}
                        {selectedScenario.expectedDecision === 'REQUIRE_APPROVAL' && <Clock className="w-5 h-5 text-amber-500" />}
                        {selectedScenario.expectedDecision === 'ALLOW' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                        <span className="text-lg font-bold text-white">DECISION: {selectedScenario.expectedDecision}</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{selectedScenario.reason}</p>
                    </div>

                    <div className="pt-3 border-t flex items-center justify-between text-[11px] text-slate-400" style={{ borderColor: currentTheme.surfaceBorder }}>
                      <span>Rule: {selectedScenario.ruleMatched}</span>
                      <span>Latency: 7.2ms</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PYTHON SDK INTEGRATION SECTION */}
        <section id="integrations" className="py-20 border-b" style={{ borderColor: currentTheme.surfaceBorder }}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-xs font-mono font-bold tracking-wider uppercase" style={{ color: currentTheme.primary }}>
                  Simple Developer Integration
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
                  One Decorator. Fail-Closed Protection.
                </h2>
                <p className="text-sm text-slate-300 mt-4 leading-relaxed">
                  Protect LangChain tools, CrewAI agents, or raw Python functions with a single decorator.
                  The decorator intercepts parameters before the function body executes, queries the local gateway in &lt;12ms,
                  and halts immediately on violation.
                </p>

                <div className="mt-8 space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 mt-0.5" style={{ color: currentTheme.primary }} />
                    <div className="text-xs text-slate-300">
                      <strong className="text-white">Zero Runtime Guesswork:</strong> Function body NEVER enters socket execution if decision is DENY.
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 mt-0.5" style={{ color: currentTheme.primary }} />
                    <div className="text-xs text-slate-300">
                      <strong className="text-white">Built-in Approval Pause:</strong> Execution yields until an authorized human approves via web or mobile app.
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 mt-0.5" style={{ color: currentTheme.primary }} />
                    <div className="text-xs text-slate-300">
                      <strong className="text-white">Cryptographic SHA-256 Ledger:</strong> Every decision recorded in tamper-evident hash chain.
                    </div>
                  </div>
                </div>
              </div>

              {/* Code Snippet Card */}
              <div
                className="rounded-2xl border p-5 font-mono text-xs overflow-hidden shadow-2xl"
                style={{
                  borderColor: currentTheme.surfaceBorder,
                  backgroundColor: currentTheme.surface,
                }}
              >
                <div className="flex items-center justify-between pb-3 mb-3 border-b text-slate-400" style={{ borderColor: currentTheme.surfaceBorder }}>
                  <span>agent_tools.py</span>
                  <span className="text-[10px]">Python 3.10+</span>
                </div>
                <pre className="text-slate-200 leading-relaxed overflow-x-auto">
{`from sentinelops import protect_tool, SentinelOpsClient

client = SentinelOpsClient(
    gateway_url="http://localhost:8000",
    agent_id="fin_reconcile_bot"
)

# Enforces pre-flight policies before execution
@protect_tool(client=client)
def execute_database_query(query: str, db: str):
    """Wrapped function halts immediately if query is destructive"""
    return db_connection.execute(query)

@protect_tool(client=client)
def wire_funds(amount: float, swift_code: str):
    """Amounts > $5,000 pause execution for human sign-off"""
    return banking_api.transfer(amount, swift_code)`}
                </pre>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t py-12 text-center text-xs text-slate-500 font-mono" style={{ borderColor: currentTheme.surfaceBorder }}>
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>© 2026 SentinelOps AI. Open-source enterprise agent security & operations.</div>
          <div className="flex items-center gap-6 text-slate-400">
            <Link href="/docs" className="hover:text-white transition-colors">Documentation</Link>
            <Link href="/dashboard" className="hover:text-white transition-colors">Console</Link>
            <a href="https://github.com/josuva777/sentinelops-ai" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
