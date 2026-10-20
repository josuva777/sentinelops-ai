import Link from 'next/link';
import { Navbar } from '../../components/Navbar';
import { Shield, ArrowLeft, Terminal, CheckCircle2, Code, BookOpen, Lock } from 'lucide-react';

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-brand-cyan hover:underline mb-8"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Homepage</span>
          </Link>

          <div className="border-b border-surface-border pb-8 mb-10">
            <span className="text-xs font-mono text-brand-cyan uppercase">Developer Documentation</span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white mt-2">SentinelOps AI Architecture Guide</h1>
            <p className="text-slate-400 text-sm mt-3 leading-relaxed max-w-3xl">
              Learn how to integrate the SentinelOps Python SDK, define deterministic policy rules, 
              route sensitive agent actions to human approval queues, and verify tamper-evident audit ledgers.
            </p>
          </div>

          <div className="space-y-12">
            {/* Step 1: Installation */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-cyan/20 text-brand-cyan font-bold text-xs">
                  1
                </div>
                <h2 className="text-xl font-bold text-white">SDK Installation</h2>
              </div>
              <p className="text-sm text-slate-300">
                Install the lightweight client library directly from your private registry or package index:
              </p>
              <div className="rounded-lg border border-surface-border bg-surface-subtle p-4 font-mono text-xs text-brand-cyan">
                pip install sentinelops-ai
              </div>
            </section>

            {/* Step 2: Instrumenting Agent Tools */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-cyan/20 text-brand-cyan font-bold text-xs">
                  2
                </div>
                <h2 className="text-xl font-bold text-white">Instrumenting Agent Tools with Pre-Flight Interceptors</h2>
              </div>
              <p className="text-sm text-slate-300">
                Wrap any autonomous agent tool function using the <code className="text-brand-cyan font-mono text-xs">@protect_tool</code> decorator. 
                The interceptor halts execution, transmits sanitized arguments to the SentinelOps enforcement gateway, 
                and evaluates active policy rules before any network sockets or database connections are opened.
              </p>

              <div className="rounded-xl border border-surface-border bg-surface-subtle p-5 font-mono text-xs text-slate-300">
                <pre className="overflow-x-auto leading-relaxed">
{`from sentinelops import SentinelOpsClient, protect_tool
import os

client = SentinelOpsClient(
    agent_id="fin_reconcile_01",
    api_key=os.environ["SENTINELOPS_API_KEY"],
    gateway_url="http://localhost:8000"
)

# 1. Block destructive operations (DENY)
@protect_tool(client=client, tool_name="query_ledger")
def query_database(query: str):
    # If query contains "DROP" or "DELETE", this code is NEVER reached!
    return database.execute(query)

# 2. Require human approval for transactions > $5,000 (REQUIRE_APPROVAL)
@protect_tool(client=client, tool_name="initiate_settlement")
def transfer_funds(beneficiary: str, amount: float):
    # Execution pauses here. The SDK polls for human sign-off via SentinelOps console.
    # Automatically aborts if approval is rejected or 15m TTL expires.
    return banking_api.wire(beneficiary=beneficiary, amount=amount)`}
                </pre>
              </div>
            </section>

            {/* Step 3: Deterministic Policy Rules */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-cyan/20 text-brand-cyan font-bold text-xs">
                  3
                </div>
                <h2 className="text-xl font-bold text-white">Deterministic Rule Schema & Outcomes</h2>
              </div>
              <p className="text-sm text-slate-300">
                Policies are evaluated deterministically using typed AST parsers and regex parameter extractors. 
                Possible evaluation outcomes are strictly limited to three states:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-xl border border-status-success/30 bg-status-success/10">
                  <div className="font-bold text-status-success text-sm">ALLOW</div>
                  <p className="text-slate-300 mt-2">
                    Action parameters satisfy all constraints. The tool function executes immediately.
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-status-critical/30 bg-status-critical/10">
                  <div className="font-bold text-status-critical text-sm">DENY</div>
                  <p className="text-slate-300 mt-2">
                    Action parameters violate an explicit security rule. Intercepted in-line; raises <code className="text-white">SecurityViolation</code>.
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-status-warning/30 bg-status-warning/10">
                  <div className="font-bold text-status-warning text-sm">REQUIRE_APPROVAL</div>
                  <p className="text-slate-300 mt-2">
                    High-risk action routed to human approval queue with a single-use token and 15m expiration timer.
                  </p>
                </div>
              </div>
            </section>

            {/* Step 4: Cryptographic Ledger */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-cyan/20 text-brand-cyan font-bold text-xs">
                  4
                </div>
                <h2 className="text-xl font-bold text-white">SHA-256 Tamper-Evident Hash Chaining</h2>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                Every policy decision is permanently recorded into an append-only audit trail. 
                Each block includes the SHA-256 hash of the previous event:
              </p>
              <div className="p-4 rounded-lg bg-surface border border-surface-border font-mono text-xs text-slate-300">
                event_hash = SHA256(prev_hash + timestamp + agent_id + tool + payload + decision)
              </div>
              <p className="text-xs text-slate-400">
                This mathematical link guarantees that audit records cannot be retroactively altered or deleted without invalidating the cryptographic chain.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
