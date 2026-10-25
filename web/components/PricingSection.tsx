'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Check,
  Shield,
  Zap,
  Building2,
  Sparkles,
  HelpCircle,
  ArrowRight,
  Lock,
  ChevronDown,
  ChevronUp,
  X,
  Send,
} from 'lucide-react';
import { useTheme } from '../lib/themeContext';

export function PricingSection() {
  const { currentTheme } = useTheme();
  const [isAnnual, setIsAnnual] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    company: '',
    agents: '10-50',
    notes: '',
  });
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleStartCheckout = async (tier: 'TEAM' | 'ENTERPRISE') => {
    setIsCheckingOut(true);
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    try {
      const res = await fetch(`${API_BASE}/api/v1/billing/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier,
          billing_cycle: isAnnual ? 'annual' : 'monthly',
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.checkout_url) {
          window.location.href = data.checkout_url;
          return;
        }
      }
    } catch (e) {
      console.error('Failed to create checkout session:', e);
    }
    const simSessionId = `cs_test_${Math.random().toString(36).substring(2, 15)}`;
    window.location.href = `/checkout/success?session_id=${simSessionId}&tier=${tier}&cycle=${isAnnual ? 'annual' : 'monthly'}`;
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => {
      setIsContactModalOpen(false);
      setContactSubmitted(false);
      setContactForm({ name: '', email: '', company: '', agents: '10-50', notes: '' });
    }, 2000);
  };

  const faqs = [
    {
      q: 'How does in-line interception operate without adding agent latency?',
      a: 'The SentinelOps proxy runs as a lightweight, pre-flight gate directly in your tool-invocation pipeline. Policy evaluation is strictly deterministic (mathematical regex, AST parsing, and parameter boundary checking) executing in sub-8ms without waiting on slow generative models.',
    },
    {
      q: 'What occurs if SentinelOps loses network connectivity or crashes?',
      a: 'SentinelOps enforces a strict, configurable Fail-Closed posture. If the enforcement gateway cannot be reached or fails to return a signed cryptographic decision, dangerous tool calls (DDL, financial transfers, shell executions) are blocked by default.',
    },
    {
      q: 'Can we deploy SentinelOps inside our private AWS / GCP VPC or air-gapped environment?',
      a: 'Yes. Enterprise customers receive dedicated Docker containers and Kubernetes Helm charts to run SentinelOps entirely within their own private VPC, isolated cloud, or on-premise hardware with zero external telemetry egress.',
    },
    {
      q: 'How does the human-in-the-loop approval flow prevent agent lockups?',
      a: 'When an agent attempts a sensitive tool invocation (e.g., wire transfer > $5,000 or database schema change), SentinelOps places that specific tool thread on hold with a configurable 15-minute TTL. Authorized operators receive instant push alerts on web and mobile to approve or reject with cryptographic HMAC sign-offs.',
    },
  ];

  const comparisonCategories = [
    {
      category: 'Pre-Flight Guardrails & Interception',
      features: [
        { name: 'Connected Agent Runtimes', dev: '3 Agents', team: '25 Agents', ent: 'Unlimited' },
        { name: 'Monthly Intercepted Actions', dev: '50,000', team: '1,000,000', ent: 'Unlimited' },
        { name: 'Sub-8ms In-Line Policy Engine', dev: '✓', team: '✓', ent: '✓' },
        { name: 'Destructive DDL/DML SQL Blockers', dev: '✓', team: '✓', ent: '✓' },
        { name: 'Shell & Command Injection Interception', dev: '✓', team: '✓', ent: '✓' },
        { name: 'Financial Transaction Limits & Guardrails', dev: 'Basic ($1k max)', team: 'Customizable Rules', ent: 'Advanced Multi-Currency' },
      ],
    },
    {
      category: 'Human Approvals & AI Copilot',
      features: [
        { name: '1-Tap Mobile Push Approvals (iOS / Android)', dev: '—', team: '✓ (15m TTL)', ent: '✓ (Custom TTL & Escalations)' },
        { name: 'Real RAG AI Security Copilot', dev: 'Basic', team: '✓ Grounded (OWASP/NIST)', ent: '✓ Private Vector Knowledge' },
        { name: 'Multi-Operator Approval Quorums', dev: '—', team: 'Up to 3 Operators', ent: 'Unlimited Custom RBAC' },
      ],
    },
    {
      category: 'Audit Ledger & Enterprise Compliance',
      features: [
        { name: 'SHA-256 Tamper-Proof Audit Chain', dev: '7 Days Retention', team: '90 Days Retention', ent: '365+ Days / WORM Archive' },
        { name: 'Global Fleet Emergency Kill-Switch', dev: '—', team: '✓ Console Action', ent: '✓ Hardware Key & API Trigger' },
        { name: 'SOC2 Type II, HIPAA & ISO27001 Reports', dev: '—', team: 'Self-Serve Export', ent: 'Audit-Ready Signed Packages' },
        { name: 'Pure-Python Windows Zero-DLL Engine', dev: '✓', team: '✓', ent: '✓' },
        { name: 'Deployment Options', dev: 'Cloud Managed', team: 'Cloud / Hybrid', ent: 'Private VPC / On-Premise' },
        { name: 'Support SLA', dev: 'Community', team: 'Priority (4h response)', ent: '24/7 Dedicated (15m SLA)' },
      ],
    },
  ];

  return (
    <section id="pricing" className="py-24 border-b relative transition-colors duration-300" style={{ borderColor: currentTheme.surfaceBorder }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span
            className="text-xs font-mono font-bold tracking-widest uppercase px-3 py-1 rounded-full border"
            style={{
              backgroundColor: currentTheme.badgeBg,
              color: currentTheme.badgeText,
              borderColor: currentTheme.surfaceBorder,
            }}
          >
            TRANSPARENT ENTERPRISE PRICING
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white mt-4 tracking-tight">
            Predictable Plans for Autonomous Agent Defense
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-4 leading-relaxed">
            From individual agent builders to global financial enterprises running high-frequency autonomous fleets.
            All tiers feature deterministic in-line pre-flight interception and fail-closed security.
          </p>

          {/* Billing Toggle */}
          <div className="mt-8 inline-flex items-center gap-3 p-1.5 rounded-full border shadow-inner" style={{ backgroundColor: currentTheme.surface, borderColor: currentTheme.surfaceBorder }}>
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                !isAnnual ? 'bg-white/10 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 transition-all ${
                isAnnual
                  ? 'text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
              style={{
                backgroundColor: isAnnual ? currentTheme.primary : 'transparent',
              }}
            >
              <span>Annual Billing</span>
              <span className="px-1.5 py-0.5 rounded-full bg-slate-950 text-white text-[10px] font-mono font-bold">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mb-20">
          {/* TIER 1: DEVELOPER */}
          <div
            className="rounded-2xl border p-8 flex flex-col justify-between shadow-xl transition-all duration-300 hover:-translate-y-1"
            style={{
              backgroundColor: currentTheme.surface,
              borderColor: currentTheme.surfaceBorder,
            }}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase">Developer</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-slate-700 text-slate-400">Free Forever</span>
              </div>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl font-black text-white">$0</span>
                <span className="text-xs font-mono text-slate-400">/ forever</span>
              </div>
              <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                For solo engineers, hackers, and teams evaluating deterministic agent interception in dev environments.
              </p>

              <div className="mt-8 space-y-3.5 border-t pt-6" style={{ borderColor: currentTheme.surfaceBorder }}>
                <div className="text-[11px] font-mono uppercase tracking-wider text-slate-300 font-bold">Includes:</div>
                {[
                  'Up to 3 Connected Agent Runtimes',
                  '50,000 monthly intercepted tool calls',
                  'Deterministic Pre-Flight Policy Engine',
                  'DDL, SQL injection, & Shell guardrails',
                  'SHA-256 Audit Trail (7-day retention)',
                  'Pure-Python Windows Zero-DLL Engine',
                  'Community Discord & GitHub Support',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs text-slate-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t" style={{ borderColor: currentTheme.surfaceBorder }}>
              <Link
                href="/signup"
                className="w-full py-3 px-4 rounded-xl border text-center text-xs font-bold font-mono text-white hover:bg-white/5 transition-all block"
                style={{ borderColor: currentTheme.surfaceBorder }}
              >
                Start Building Free
              </Link>
            </div>
          </div>

          {/* TIER 2: TEAM / SECOPS (POPULAR) */}
          <div
            className="rounded-2xl border-2 p-8 flex flex-col justify-between shadow-2xl relative transition-all duration-300 hover:-translate-y-1.5"
            style={{
              backgroundColor: currentTheme.surface,
              borderColor: currentTheme.primary,
              boxShadow: `0 25px 50px -12px rgba(0,0,0,0.8), 0 0 35px -5px ${currentTheme.glow}`,
            }}
          >
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span
                className="px-3 py-1 rounded-full text-[10px] font-mono font-extrabold uppercase tracking-widest text-slate-950 shadow-md flex items-center gap-1.5"
                style={{ backgroundColor: currentTheme.primary }}
              >
                <Sparkles className="w-3 h-3" /> Most Popular
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold tracking-wider uppercase" style={{ color: currentTheme.primary }}>SecOps Team</span>
                <span
                  className="text-[10px] font-mono px-2 py-0.5 rounded border"
                  style={{
                    backgroundColor: currentTheme.badgeBg,
                    color: currentTheme.badgeText,
                    borderColor: currentTheme.surfaceBorder,
                  }}
                >
                  Production Ready
                </span>
              </div>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl font-black text-white">
                  ${isAnnual ? '119' : '149'}
                </span>
                <span className="text-xs font-mono text-slate-400">/ month {isAnnual && '(billed annually)'}</span>
              </div>
              <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                For fast-shipping startups and engineering teams deploying autonomous agent fleets to real customers.
              </p>

              <div className="mt-8 space-y-3.5 border-t pt-6" style={{ borderColor: currentTheme.surfaceBorder }}>
                <div className="text-[11px] font-mono uppercase tracking-wider text-slate-300 font-bold">Everything in Developer, plus:</div>
                {[
                  'Up to 25 Connected Agent Runtimes',
                  '1,000,000 monthly intercepted tool calls',
                  '1-Tap Mobile Push Approvals (iOS / Android)',
                  'Cryptographic Human-in-the-Loop (15m TTL)',
                  'Grounded RAG AI Copilot (OWASP/NIST citations)',
                  '90-Day SHA-256 Audit Ledger History',
                  'Webhook Alerts (Slack, Discord, PagerDuty)',
                  'Multi-Operator RBAC (Admin, SecOps, Auditor)',
                  'Priority Email & Slack Channel Support',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs text-slate-200">
                    <Check className="w-4 h-4 shrink-0" style={{ color: currentTheme.primary }} />
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t" style={{ borderColor: currentTheme.surfaceBorder }}>
              <button
                type="button"
                disabled={isCheckingOut}
                onClick={() => handleStartCheckout('TEAM')}
                className="w-full py-3.5 px-4 rounded-xl text-center text-xs font-bold font-mono text-slate-950 transition-all block shadow-lg hover:opacity-90 disabled:opacity-50"
                style={{
                  backgroundColor: currentTheme.primary,
                  boxShadow: `0 0 20px -3px ${currentTheme.glow}`,
                }}
              >
                {isCheckingOut ? (
                  <span>Initializing Stripe Checkout...</span>
                ) : (
                  <span>Upgrade to SecOps Team ({isAnnual ? '$119/mo' : '$149/mo'}) →</span>
                )}
              </button>
            </div>
          </div>

          {/* TIER 3: ENTERPRISE DEFENSE */}
          <div
            className="rounded-2xl border p-8 flex flex-col justify-between shadow-xl transition-all duration-300 hover:-translate-y-1"
            style={{
              backgroundColor: currentTheme.surface,
              borderColor: currentTheme.surfaceBorder,
            }}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase">Enterprise</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-rose-500/30 text-rose-400 bg-rose-500/10">
                  Mission Critical
                </span>
              </div>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl font-black text-white">Custom</span>
                <span className="text-xs font-mono text-slate-400">/ starting at $999/mo</span>
              </div>
              <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                For financial rails, healthcare organizations, and high-assurance enterprises requiring on-prem isolation and SLAs.
              </p>

              <div className="mt-8 space-y-3.5 border-t pt-6" style={{ borderColor: currentTheme.surfaceBorder }}>
                <div className="text-[11px] font-mono uppercase tracking-wider text-slate-300 font-bold">Everything in SecOps, plus:</div>
                {[
                  'Unlimited Connected Agents & Tool Call Volume',
                  'Sub-millisecond Private VPC / On-Premise Gateway',
                  'Hardware Security Module (HSM) & KMS key binding',
                  'Global Fleet Emergency Kill-Switch controls',
                  '365+ Day WORM Tamper-Proof Audit Archive',
                  'SOC2 Type II, HIPAA & ISO27001 Signed Packages',
                  'Custom SLA (99.99% Uptime Guarantee)',
                  '24/7 Dedicated Incident Response & TAM',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs text-slate-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t" style={{ borderColor: currentTheme.surfaceBorder }}>
              <button
                onClick={() => setIsContactModalOpen(true)}
                className="w-full py-3 px-4 rounded-xl border text-center text-xs font-bold font-mono text-white hover:bg-white/5 transition-all block"
                style={{ borderColor: currentTheme.surfaceBorder }}
              >
                Schedule Architecture Review
              </button>
            </div>
          </div>
        </div>

        {/* ENTERPRISE TRUST BADGES */}
        <div
          className="rounded-2xl border p-6 mb-20 text-center shadow-lg"
          style={{
            backgroundColor: currentTheme.surface,
            borderColor: currentTheme.surfaceBorder,
          }}
        >
          <div className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-4">
            Enterprise Security & Compliance Guarantees
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div className="flex flex-col items-center">
              <Shield className="w-6 h-6 mb-2" style={{ color: currentTheme.primary }} />
              <span className="text-xs font-bold text-white">100% Fail-Closed</span>
              <span className="text-[10px] text-slate-400 mt-0.5">Zero unauthorized fallback</span>
            </div>
            <div className="flex flex-col items-center">
              <Lock className="w-6 h-6 text-emerald-400 mb-2" />
              <span className="text-xs font-bold text-white">SHA-256 Ledger</span>
              <span className="text-[10px] text-slate-400 mt-0.5">Tamper-evident chain</span>
            </div>
            <div className="flex flex-col items-center">
              <Building2 className="w-6 h-6 text-cyan-400 mb-2" />
              <span className="text-xs font-bold text-white">SOC2 & ISO Ready</span>
              <span className="text-[10px] text-slate-400 mt-0.5">Audit-ready exports</span>
            </div>
            <div className="flex flex-col items-center">
              <Zap className="w-6 h-6 text-amber-400 mb-2" />
              <span className="text-xs font-bold text-white">Sub-8ms Gate</span>
              <span className="text-[10px] text-slate-400 mt-0.5">Zero LLM bottleneck</span>
            </div>
          </div>
        </div>

        {/* FEATURE COMPARISON MATRIX */}
        <div className="mb-20">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-extrabold text-white">Detailed Feature Matrix</h3>
            <p className="text-xs text-slate-400 mt-1">Compare capabilities across all SentinelOps AI deployment tiers.</p>
          </div>

          <div
            className="rounded-2xl border overflow-hidden shadow-2xl"
            style={{
              backgroundColor: currentTheme.surface,
              borderColor: currentTheme.surfaceBorder,
            }}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b" style={{ borderColor: currentTheme.surfaceBorder }}>
                    <th className="p-4 text-slate-400 font-mono uppercase text-[11px] w-1/2">Capability</th>
                    <th className="p-4 text-white font-mono uppercase text-[11px] text-center">Developer</th>
                    <th className="p-4 font-mono uppercase text-[11px] text-center" style={{ color: currentTheme.primary }}>SecOps Team</th>
                    <th className="p-4 text-white font-mono uppercase text-[11px] text-center">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonCategories.map((cat, cIdx) => (
                    <React.Fragment key={cIdx}>
                      <tr className="border-b bg-white/[0.02]" style={{ borderColor: currentTheme.surfaceBorder }}>
                        <td colSpan={4} className="p-3 font-mono font-bold text-[11px] uppercase tracking-wider" style={{ color: currentTheme.accent }}>
                          {cat.category}
                        </td>
                      </tr>
                      {cat.features.map((feat, fIdx) => (
                        <tr key={fIdx} className="border-b border-white/5 hover:bg-white/[0.01] transition-colors">
                          <td className="p-4 text-slate-300 font-medium">{feat.name}</td>
                          <td className="p-4 text-center text-slate-400 font-mono">{feat.dev}</td>
                          <td className="p-4 text-center font-mono font-bold" style={{ color: currentTheme.primary }}>{feat.team}</td>
                          <td className="p-4 text-center text-slate-200 font-mono font-bold">{feat.ent}</td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* FAQ ACCORDION */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-extrabold text-white flex items-center justify-center gap-2">
              <HelpCircle className="w-5 h-5" style={{ color: currentTheme.primary }} /> Frequently Asked Questions
            </h3>
            <p className="text-xs text-slate-400 mt-1">Common enterprise deployment, latency, and compliance inquiries.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border overflow-hidden transition-colors"
                  style={{
                    backgroundColor: currentTheme.surface,
                    borderColor: currentTheme.surfaceBorder,
                  }}
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-white hover:opacity-90"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-slate-400 leading-relaxed border-t border-white/5">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CONTACT / DEMO MODAL */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div
            className="rounded-2xl border p-6 sm:p-8 max-w-lg w-full shadow-2xl relative"
            style={{
              backgroundColor: currentTheme.surface,
              borderColor: currentTheme.surfaceBorder,
              boxShadow: `0 25px 60px -12px rgba(0,0,0,0.95), 0 0 35px -5px ${currentTheme.glow}`,
            }}
          >
            <button
              onClick={() => setIsContactModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            {contactSubmitted ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center border text-emerald-400 border-emerald-500/30 bg-emerald-500/10">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white">Architecture Review Requested</h4>
                <p className="text-xs text-slate-400">
                  Thank you, {contactForm.name}. A senior application security engineer will contact your team at {contactForm.email} within 2 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400 font-bold">Enterprise Access</span>
                  <h4 className="text-lg font-bold text-white mt-1">Schedule Architecture Review</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Discuss custom VPC deployments, HSM key signing, high-volume tool quotas, and tailored SLAs.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-mono text-slate-400 block mb-1">Full Name</label>
                    <input
                      required
                      type="text"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder="Jane Doe"
                      className="w-full px-3 py-2 rounded-lg border text-xs bg-black/40 text-white focus:outline-none"
                      style={{ borderColor: currentTheme.surfaceBorder }}
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-slate-400 block mb-1">Work Email</label>
                    <input
                      required
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="jane@company.com"
                      className="w-full px-3 py-2 rounded-lg border text-xs bg-black/40 text-white focus:outline-none"
                      style={{ borderColor: currentTheme.surfaceBorder }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-mono text-slate-400 block mb-1">Company Name</label>
                    <input
                      required
                      type="text"
                      value={contactForm.company}
                      onChange={(e) => setContactForm({ ...contactForm, company: e.target.value })}
                      placeholder="Acme Corp"
                      className="w-full px-3 py-2 rounded-lg border text-xs bg-black/40 text-white focus:outline-none"
                      style={{ borderColor: currentTheme.surfaceBorder }}
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-slate-400 block mb-1">Connected Agents Fleet</label>
                    <select
                      value={contactForm.agents}
                      onChange={(e) => setContactForm({ ...contactForm, agents: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border text-xs bg-black/40 text-white focus:outline-none"
                      style={{ borderColor: currentTheme.surfaceBorder }}
                    >
                      <option value="1-10">1 - 10 Agents</option>
                      <option value="10-50">10 - 50 Agents</option>
                      <option value="50-250">50 - 250 Agents</option>
                      <option value="250+">250+ Agents (Global Fleet)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">Architecture / Security Notes</label>
                  <textarea
                    rows={3}
                    value={contactForm.notes}
                    onChange={(e) => setContactForm({ ...contactForm, notes: e.target.value })}
                    placeholder="E.g., Require private AWS VPC deployment, air-gapped on-premise, or SOC2 Type II compliance pack."
                    className="w-full px-3 py-2 rounded-lg border text-xs bg-black/40 text-white focus:outline-none"
                    style={{ borderColor: currentTheme.surfaceBorder }}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl font-mono text-xs font-bold text-slate-950 flex items-center justify-center gap-2 transition-all hover:opacity-90"
                  style={{ backgroundColor: currentTheme.primary }}
                >
                  <Send className="w-3.5 h-3.5" /> Submit Request
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

