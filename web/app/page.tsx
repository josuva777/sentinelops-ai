import Link from 'next/link';
import { Navbar } from '../components/Navbar';
import { TopologyCanvas } from '../components/TopologyCanvas';
import { PolicySimulator } from '../components/PolicySimulator';
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
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28 border-b border-surface-border">
          <div className="absolute inset-0 bg-grid-pattern opacity-20 radial-fade pointer-events-none" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            {/* Live badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-cyan/30 bg-brand-cyan/10 text-brand-cyan text-xs font-mono mb-8 glow-cyan">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-cyan animate-pulse" />
              <span>OWASP Top 10 for Agentic Applications Ready</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-tight">
              Stop AI Agents <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan via-cyan-300 to-brand-violet">
                Before They Break Production.
              </span>
            </h1>

            {/* Subtext */}
            <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Autonomous agents execute tool calls against databases, APIs, and payment gateways. 
              SentinelOps AI intercepts tool calls <strong className="text-white">in-line</strong> before execution, 
              enforces deterministic policies, and routes high-risk actions to an unforgeable human approval queue.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-xl bg-brand-cyan px-6 py-3.5 text-sm font-bold text-slate-950 hover:bg-cyan-400 transition-colors glow-cyan shadow-lg"
              >
                <span>Enter Security Console</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#simulator"
                className="flex items-center gap-2 rounded-xl border border-surface-border bg-surface px-6 py-3.5 text-sm font-semibold text-slate-200 hover:border-slate-500 transition-colors"
              >
                <span>Test Live Policy Simulator</span>
              </a>
            </div>

            {/* Verifiable metrics row */}
            <div className="mt-14 pt-8 border-t border-surface-border/60 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto text-center font-mono">
              <div>
                <div className="text-2xl font-bold text-brand-cyan">&lt; 12ms</div>
                <div className="text-xs text-slate-400 mt-1">Interception Overhead</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">100% Deterministic</div>
                <div className="text-xs text-slate-400 mt-1">Zero LLM Hallucinations</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-status-warning">15m TTL</div>
                <div className="text-xs text-slate-400 mt-1">Bound Approval Tokens</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-status-success">SHA-256</div>
                <div className="text-xs text-slate-400 mt-1">Chained Audit Ledger</div>
              </div>
            </div>
          </div>
        </section>

        {/* TOPOLOGY VISUALIZER SECTION */}
        <section id="architecture" className="py-20 border-b border-surface-border bg-surface/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <span className="text-xs font-mono font-semibold tracking-wider text-brand-cyan uppercase">
                Architecture & Data Flow
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold text-white mt-2">
                In-Line Pre-Flight Interception vs. Post-Facto Logging
              </h2>
              <p className="text-slate-400 text-sm mt-3 leading-relaxed">
                Most AI monitoring tools read logs after an agent has already executed a query. 
                SentinelOps acts as a strict gateway inside your agent runtime, halting execution 
                until explicit organization policies validate the request parameters.
              </p>
            </div>

            <TopologyCanvas />
          </div>
        </section>

        {/* INTERACTIVE SIMULATOR SECTION */}
        <section id="simulator" className="py-20 border-b border-surface-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <span className="text-xs font-mono font-semibold tracking-wider text-brand-cyan uppercase">
                Interactive Playground
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold text-white mt-2">
                Simulate Policy Enforcement In Real Time
              </h2>
              <p className="text-slate-400 text-sm mt-3 leading-relaxed">
                Select an agent tool scenario below or edit the JSON payload to see how our deterministic engine evaluates 
                boundaries and triggers automated blocks or human approval queues.
              </p>
            </div>

            <PolicySimulator />
          </div>
        </section>

        {/* COMPARISON MATRIX SECTION */}
        <section className="py-20 border-b border-surface-border bg-surface/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-2xl sm:text-4xl font-bold text-white">
                Why Passive AI Observability Is Not Security
              </h2>
              <p className="text-slate-400 text-sm mt-3">
                Logging a database drop after the tables are already erased is useless. 
                Real security requires pre-execution prevention.
              </p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-surface-border bg-surface">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-surface-border bg-surface-subtle font-mono text-slate-300">
                    <th className="py-4 px-6 font-semibold">Capability</th>
                    <th className="py-4 px-6 font-bold text-brand-cyan">SentinelOps AI</th>
                    <th className="py-4 px-6 text-slate-400 font-normal">Standard APM / LLM Observability</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border text-slate-300">
                  <tr>
                    <td className="py-4 px-6 font-medium text-white">Enforcement Point</td>
                    <td className="py-4 px-6 text-brand-cyan font-bold">In-Line (Pre-execution hook)</td>
                    <td className="py-4 px-6 text-slate-400">Post-facto telemetry (After execution)</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-medium text-white">Policy Decision Maker</td>
                    <td className="py-4 px-6 text-brand-cyan font-bold">Deterministic AST & Regex Rules</td>
                    <td className="py-4 px-6 text-slate-400">Fuzzy second LLM prompt evaluation</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-medium text-white">High-Risk Actions</td>
                    <td className="py-4 px-6 text-brand-cyan font-bold">Paused for Human Approval (TTL token)</td>
                    <td className="py-4 px-6 text-slate-400">Sends notification after the breach</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-medium text-white">Audit Log Integrity</td>
                    <td className="py-4 px-6 text-brand-cyan font-bold">Cryptographic SHA-256 Hash Chained</td>
                    <td className="py-4 px-6 text-slate-400">Mutable database entries</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-medium text-white">Network Failure Mode</td>
                    <td className="py-4 px-6 text-brand-cyan font-bold">Fail-Closed Default (Safe)</td>
                    <td className="py-4 px-6 text-slate-400">Fail-Open (Action executes anyway)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* PYTHON SDK INTEGRATION SECTION */}
        <section id="integrations" className="py-20 border-b border-surface-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-mono font-semibold tracking-wider text-brand-cyan uppercase">
                Developer Integration SDK
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold text-white mt-2">
                One Decorator. Zero-Leak Enforcement.
              </h2>
              <p className="text-slate-400 text-sm mt-4 leading-relaxed">
                Add SentinelOps to any Python tool or agent in 3 lines of code. 
                Works out of the box with LangChain, CrewAI, AutoGen, or custom autonomous loops.
              </p>
              <div className="mt-6 space-y-3 text-sm text-slate-300">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-brand-cyan shrink-0" />
                  <span>Intercepts arguments before function execution</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-brand-cyan shrink-0" />
                  <span>Halts immediately on policy violation (Raises SecurityViolation)</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-brand-cyan shrink-0" />
                  <span>Supports polling wait on human approvals</span>
                </div>
              </div>
              <div className="mt-8">
                <Link
                  href="/docs"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-brand-cyan hover:underline"
                >
                  <span>Read full Python SDK documentation</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Code Snippet Box */}
            <div className="rounded-xl border border-surface-border bg-surface-subtle p-5 font-mono text-xs overflow-hidden">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-surface-border text-slate-500">
                <span>agent_example.py</span>
                <span>Python 3.11+</span>
              </div>
              <pre className="text-slate-300 leading-relaxed overflow-x-auto">
{`from sentinelops import SentinelOpsClient, protect_tool

# Initialize with agent credentials
client = SentinelOpsClient(
    agent_id="fin_agent_01",
    api_key="sn_live_9f8a...3b21"
)

# Intercept and guard database tool calls
@protect_tool(client=client, tool_name="query_database")
def execute_sql(query: str):
    # This code NEVER executes if query violates policy
    # e.g. "DROP TABLE" is intercepted and halted in <10ms
    return db.cursor().execute(query)

# Intercept high-value financial settlements
@protect_tool(client=client, tool_name="initiate_wire", require_approval_threshold=5000)
def process_wire(amount: float, recipient: str):
    # Pauses and waits for human sign-off via SentinelOps console
    return banking_api.transfer(amount=amount, to=recipient)`}
              </pre>
            </div>
          </div>
        </section>

        {/* HONEST LIMITATIONS & TRANSPARENCY SECTION */}
        <section className="py-20 border-b border-surface-border bg-surface/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-surface-border bg-surface p-8 sm:p-10">
              <div className="flex items-center gap-3 text-status-warning mb-4">
                <AlertTriangle className="h-6 w-6" />
                <h3 className="text-lg font-bold text-white">Transparent Security Architecture & Scope</h3>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                Security is an ongoing engineering process. To maintain uncompromising integrity, 
                SentinelOps AI explicitly documents what our platform enforces and what requires human architectural oversight:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-400">
                <div className="space-y-2">
                  <div className="font-semibold text-white">What SentinelOps Guarantees:</div>
                  <ul className="list-disc list-inside space-y-1 text-slate-300">
                    <li>Strict in-line halting of instrumented tool functions before socket execution.</li>
                    <li>Deterministic parameter schema validation and numeric bound enforcement.</li>
                    <li>Cryptographically bound, single-use approval tokens with strict 15m expiration.</li>
                    <li>Verifiable SHA-256 hash chaining of all decision telemetry.</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <div className="font-semibold text-white">What SentinelOps Does Not Claim:</div>
                  <ul className="list-disc list-inside space-y-1 text-slate-300">
                    <li>We cannot protect uninstrumented tools that bypass the SDK wrapper.</li>
                    <li>We do not claim 100% autonomous threat immunity against zero-day compiler exploits.</li>
                    <li>Our AI security assistant provides advisory summaries, not live administrative overrides.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PRICING & EARLY ACCESS SECTION */}
        <section id="pricing" className="py-20 border-b border-surface-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-mono font-semibold tracking-wider text-brand-cyan uppercase">
                Commercially Testable Tiers
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold text-white mt-2">
                Honest, Usage-Based Developer Pricing
              </h2>
              <p className="text-slate-400 text-sm mt-3">
                No hidden enterprise gatekeeping. Start with full deterministic policy enforcement today.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Developer Tier */}
              <div className="rounded-xl border border-surface-border bg-surface p-6 flex flex-col justify-between">
                <div>
                  <div className="font-mono text-xs text-brand-cyan">DEVELOPER</div>
                  <div className="text-3xl font-extrabold text-white mt-2">$0</div>
                  <p className="text-xs text-slate-400 mt-2">For individual developers and open-source agents.</p>
                  <ul className="mt-6 space-y-2.5 text-xs text-slate-300">
                    <li className="flex items-center gap-2">✓ Up to 3 Registered Agents</li>
                    <li className="flex items-center gap-2">✓ 10,000 In-Line Interceptions / mo</li>
                    <li className="flex items-center gap-2">✓ Deterministic Policy Engine</li>
                    <li className="flex items-center gap-2">✓ 7-Day Audit Log Retention</li>
                  </ul>
                </div>
                <Link
                  href="/dashboard"
                  className="mt-8 block text-center rounded-lg border border-surface-border bg-surface-subtle py-2.5 text-xs font-semibold text-white hover:border-slate-500"
                >
                  Start Free
                </Link>
              </div>

              {/* Team Pro Tier */}
              <div className="rounded-xl border border-brand-cyan bg-surface-subtle p-6 flex flex-col justify-between relative glow-cyan">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-cyan px-3 py-0.5 text-[10px] font-bold text-slate-950 uppercase tracking-wide">
                  Most Popular
                </div>
                <div>
                  <div className="font-mono text-xs text-brand-cyan">TEAM SECURITY</div>
                  <div className="text-3xl font-extrabold text-white mt-2">$79<span className="text-xs font-normal text-slate-400"> / mo</span></div>
                  <p className="text-xs text-slate-400 mt-2">For engineering teams operating production agent loops.</p>
                  <ul className="mt-6 space-y-2.5 text-xs text-slate-300">
                    <li className="flex items-center gap-2">✓ Unlimited Agents</li>
                    <li className="flex items-center gap-2">✓ 250,000 Interceptions / mo</li>
                    <li className="flex items-center gap-2">✓ Multi-Approver Approval Queues</li>
                    <li className="flex items-center gap-2">✓ SHA-256 Tamper-Evident Ledger</li>
                    <li className="flex items-center gap-2">✓ AI Security Assistant & Export</li>
                    <li className="flex items-center gap-2">✓ 90-Day Audit Retention</li>
                  </ul>
                </div>
                <Link
                  href="/dashboard"
                  className="mt-8 block text-center rounded-lg bg-brand-cyan py-2.5 text-xs font-semibold text-slate-950 hover:bg-cyan-400 font-bold"
                >
                  Deploy Team Console
                </Link>
              </div>

              {/* Enterprise Tier */}
              <div className="rounded-xl border border-surface-border bg-surface p-6 flex flex-col justify-between">
                <div>
                  <div className="font-mono text-xs text-brand-violet">ENTERPRISE CLUSTER</div>
                  <div className="text-3xl font-extrabold text-white mt-2">Custom</div>
                  <p className="text-xs text-slate-400 mt-2">Self-hosted or dedicated private cluster instance.</p>
                  <ul className="mt-6 space-y-2.5 text-xs text-slate-300">
                    <li className="flex items-center gap-2">✓ Self-Hosted Docker / K8s Deployment</li>
                    <li className="flex items-center gap-2">✓ Custom SIEM & Webhook Egress</li>
                    <li className="flex items-center gap-2">✓ Multi-Tenant Workspace SSO (SAML)</li>
                    <li className="flex items-center gap-2">✓ Unlimited Retention & Custom SLA</li>
                  </ul>
                </div>
                <Link
                  href="/dashboard"
                  className="mt-8 block text-center rounded-lg border border-surface-border bg-surface-subtle py-2.5 text-xs font-semibold text-white hover:border-slate-500"
                >
                  Contact Security Architecture
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-surface-border bg-surface py-12 text-xs text-slate-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Shield className="h-4 w-4 text-brand-cyan" />
            <span className="font-bold text-white">SentinelOps AI</span>
            <span>— In-line Guardrails for Autonomous Agents</span>
          </div>

          <div className="flex items-center gap-6 text-slate-400">
            <Link href="/docs" className="hover:text-white">Documentation</Link>
            <Link href="/dashboard" className="hover:text-white">Security Console</Link>
            <span>v1.0.0-PROD</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
