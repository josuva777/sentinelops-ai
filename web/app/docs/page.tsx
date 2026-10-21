'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '../../components/Navbar';
import { useTheme } from '../../lib/themeContext';
import {
  Shield,
  ArrowLeft,
  Terminal,
  CheckCircle2,
  Code,
  BookOpen,
  Lock,
  Copy,
  Check,
  Zap,
  Layers,
  Fingerprint,
} from 'lucide-react';

export default function DocsPage() {
  const { currentTheme } = useTheme();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const installCode = `pip install sentinelops-ai`;

  const pythonSnippet = `from sentinelops import SentinelOpsClient, protect_tool
import os

client = SentinelOpsClient(
    agent_id="fin_reconcile_01",
    api_key=os.environ["SENTINELOPS_API_KEY"],
    gateway_url="http://localhost:8000"
)

# 1. Block destructive operations (DENY)
@protect_tool(client=client, tool_name="query_ledger")
def query_database(query: str):
    # If query contains "DROP" or "DELETE", code is NEVER executed!
    return database.execute(query)

# 2. Require human approval for transactions > $5,000 (REQUIRE_APPROVAL)
@protect_tool(client=client, tool_name="initiate_settlement")
def transfer_funds(beneficiary: str, amount: float):
    # Execution pauses here. SDK awaits operator sign-off via SentinelOps console.
    # Automatically aborts if rejected or 15m TTL expires.
    return banking_api.wire(beneficiary=beneficiary, amount=amount)`;

  return (
    <div
      className="min-h-screen text-foreground flex flex-col transition-colors duration-400"
      style={{ backgroundColor: currentTheme.background }}
    >
      <Navbar />

      <main className="flex-1 py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono hover:underline mb-8 transition-colors"
            style={{ color: currentTheme.accent }}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Homepage</span>
          </Link>

          <div className="border-b pb-8 mb-10" style={{ borderColor: currentTheme.surfaceBorder }}>
            <div className="flex items-center gap-2">
              <span
                className="text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold border uppercase"
                style={{
                  backgroundColor: currentTheme.badgeBg,
                  borderColor: currentTheme.surfaceBorder,
                  color: currentTheme.badgeText,
                }}
              >
                Developer SDK & Architecture Guide
              </span>
              <span className="text-xs font-mono text-slate-500">v1.4.0 Live</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white mt-3 tracking-tight">
              Integrating SentinelOps AI In-Line Guardrails
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed max-w-3xl">
              Learn how to instrument autonomous agents with pre-flight tool interceptors, define deterministic
              AST policies, handle human approval queues, and cryptographically verify the SHA-256 audit ledger.
            </p>
          </div>

          <div className="space-y-12">
            {/* Step 1: Installation */}
            <section
              className="p-6 rounded-2xl border space-y-4 shadow-xl transition-all"
              style={{
                backgroundColor: currentTheme.surface,
                borderColor: currentTheme.surfaceBorder,
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-xl font-bold text-xs font-mono"
                    style={{
                      backgroundColor: currentTheme.badgeBg,
                      color: currentTheme.primary,
                      border: `1px solid ${currentTheme.surfaceBorder}`,
                    }}
                  >
                    1
                  </div>
                  <h2 className="text-lg font-bold text-white">SDK Client Installation</h2>
                </div>
                <button
                  onClick={() => handleCopy(installCode, 'install')}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-mono text-slate-300 hover:text-white transition-colors"
                  style={{ borderColor: currentTheme.surfaceBorder }}
                >
                  {copiedCode === 'install' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode === 'install' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <p className="text-xs sm:text-sm text-slate-300">
                Install the lightweight zero-dependency Python client library:
              </p>
              <div
                className="rounded-xl border p-4 font-mono text-xs flex items-center justify-between"
                style={{
                  backgroundColor: 'rgba(0,0,0,0.4)',
                  borderColor: currentTheme.surfaceBorder,
                  color: currentTheme.primary,
                }}
              >
                <span>$ {installCode}</span>
                <span className="text-[10px] text-slate-500 font-sans">Pure Python &bull; Zero Cython DLLs</span>
              </div>
            </section>

            {/* Step 2: Instrumenting Agent Tools */}
            <section
              className="p-6 rounded-2xl border space-y-4 shadow-xl transition-all"
              style={{
                backgroundColor: currentTheme.surface,
                borderColor: currentTheme.surfaceBorder,
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-xl font-bold text-xs font-mono"
                    style={{
                      backgroundColor: currentTheme.badgeBg,
                      color: currentTheme.primary,
                      border: `1px solid ${currentTheme.surfaceBorder}`,
                    }}
                  >
                    2
                  </div>
                  <h2 className="text-lg font-bold text-white">Pre-Flight Tool Interception Pattern</h2>
                </div>
                <button
                  onClick={() => handleCopy(pythonSnippet, 'snippet')}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-mono text-slate-300 hover:text-white transition-colors"
                  style={{ borderColor: currentTheme.surfaceBorder }}
                >
                  {copiedCode === 'snippet' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode === 'snippet' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Wrap any agent tool using <code className="font-mono text-xs px-1.5 py-0.5 rounded border" style={{ backgroundColor: currentTheme.badgeBg, borderColor: currentTheme.surfaceBorder, color: currentTheme.primary }}>@protect_tool</code>.
                The interceptor halts execution, transmits sanitized arguments to the SentinelOps gateway, and evaluates active policy rules before any network sockets or database queries are opened.
              </p>

              <div
                className="rounded-xl border p-4 sm:p-5 font-mono text-xs text-slate-300 overflow-x-auto shadow-inner"
                style={{
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  borderColor: currentTheme.surfaceBorder,
                }}
              >
                <pre className="leading-relaxed">{pythonSnippet}</pre>
              </div>
            </section>

            {/* Step 3: Deterministic Policy Rules */}
            <section
              className="p-6 rounded-2xl border space-y-4 shadow-xl transition-all"
              style={{
                backgroundColor: currentTheme.surface,
                borderColor: currentTheme.surfaceBorder,
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-xl font-bold text-xs font-mono"
                  style={{
                    backgroundColor: currentTheme.badgeBg,
                    color: currentTheme.primary,
                    border: `1px solid ${currentTheme.surfaceBorder}`,
                  }}
                >
                  3
                </div>
                <h2 className="text-lg font-bold text-white">Deterministic Rule Schema & Outcomes</h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-300">
                Policies are evaluated deterministically using typed AST parsers and regex parameter extractors without LLM hallucinations.
                The policy engine strictly evaluates to one of three states:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
                <div className="p-4 rounded-xl border bg-emerald-500/10 border-emerald-500/30">
                  <div className="font-bold text-emerald-400 font-mono text-sm">ALLOW</div>
                  <p className="text-slate-300 mt-2 leading-relaxed">
                    Tool parameters satisfy all whitelist constraints. Execution proceeds immediately in &lt;12ms.
                  </p>
                </div>
                <div className="p-4 rounded-xl border bg-rose-500/10 border-rose-500/30">
                  <div className="font-bold text-rose-400 font-mono text-sm">DENY</div>
                  <p className="text-slate-300 mt-2 leading-relaxed">
                    Action parameters violate an explicit security rule. Intercepted in-line; raises <code className="text-white font-mono">SecurityViolation</code>.
                  </p>
                </div>
                <div className="p-4 rounded-xl border bg-amber-500/10 border-amber-500/30">
                  <div className="font-bold text-amber-400 font-mono text-sm">REQUIRE_APPROVAL</div>
                  <p className="text-slate-300 mt-2 leading-relaxed">
                    High-risk action routed to human approval queue with a single-use token and 15-minute expiration timer.
                  </p>
                </div>
              </div>
            </section>

            {/* Step 4: Cryptographic Ledger */}
            <section
              className="p-6 rounded-2xl border space-y-4 shadow-xl transition-all"
              style={{
                backgroundColor: currentTheme.surface,
                borderColor: currentTheme.surfaceBorder,
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-xl font-bold text-xs font-mono"
                  style={{
                    backgroundColor: currentTheme.badgeBg,
                    color: currentTheme.primary,
                    border: `1px solid ${currentTheme.surfaceBorder}`,
                  }}
                >
                  4
                </div>
                <h2 className="text-lg font-bold text-white">SHA-256 Tamper-Evident Hash Chaining</h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Every policy decision is permanently sealed into an append-only audit trail. 
                Each block includes the SHA-256 hash of the preceding block:
              </p>
              <div
                className="p-4 rounded-xl border font-mono text-xs"
                style={{
                  backgroundColor: 'rgba(0,0,0,0.4)',
                  borderColor: currentTheme.surfaceBorder,
                  color: currentTheme.accent,
                }}
              >
                event_hash = SHA256(prev_hash + timestamp + agent_id + tool + payload + decision)
              </div>
              <p className="text-xs text-slate-400">
                This mathematical link guarantees audit records cannot be retroactively modified without invalidating the cryptographic chain.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
