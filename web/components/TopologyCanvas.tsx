'use client';

import React, { useState } from 'react';
import { useTheme } from '../lib/themeContext';
import { Shield, Database, Send, Server, AlertTriangle, CheckCircle2, XCircle, Clock } from 'lucide-react';

interface NodeInfo {
  id: string;
  name: string;
  type: 'agent' | 'gateway' | 'decision' | 'resource';
  status: 'allowed' | 'blocked' | 'paused' | 'neutral';
  desc: string;
}

export function TopologyCanvas() {
  const { currentTheme } = useTheme();
  const [activeNode, setActiveNode] = useState<NodeInfo | null>(null);

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl border p-6 sm:p-8 backdrop-blur-sm shadow-2xl transition-all"
      style={{
        backgroundColor: currentTheme.surface,
        borderColor: currentTheme.surfaceBorder,
      }}
    >
      {/* Precision grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-25 radial-fade pointer-events-none" />

      {/* Header telemetry pill */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b pb-4 mb-6" style={{ borderColor: currentTheme.surfaceBorder }}>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full animate-ping" style={{ backgroundColor: currentTheme.primary }} />
          <span className="font-mono text-xs uppercase tracking-wider text-slate-300">
            Live Topology: In-Line Tool Execution Boundary
          </span>
        </div>
        <span className="font-mono text-[11px] text-slate-500">Mode: Deterministic Pre-Flight Gate</span>
      </div>

      {/* Interactive Topology Mesh */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
        {/* Column 1: Autonomous Agents */}
        <div className="space-y-4">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">1. Autonomous Agents</div>
          
          <div
            onMouseEnter={() => setActiveNode({
              id: 'ag-fin',
              name: 'FinReconcileBot',
              type: 'agent',
              status: 'paused',
              desc: 'Autonomous agent requesting $14,850 settlement wire via JPMorgan API.'
            })}
            className="p-3.5 rounded-xl border transition-all cursor-pointer group hover:bg-white/[0.02]"
            style={{
              borderColor: currentTheme.surfaceBorder,
              backgroundColor: 'rgba(0,0,0,0.3)',
            }}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white text-xs">FinReconcileBot</span>
              <span className="h-2 w-2 rounded-full bg-amber-400" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Tool: initiate_settlement</p>
          </div>

          <div
            onMouseEnter={() => setActiveNode({
              id: 'ag-devops',
              name: 'DevOpsInfraWorker',
              type: 'agent',
              status: 'blocked',
              desc: 'Agent hallucinated DROP TABLE customers_archive query during cluster clean.'
            })}
            className="p-3.5 rounded-xl border transition-all cursor-pointer hover:bg-white/[0.02]"
            style={{
              borderColor: currentTheme.surfaceBorder,
              backgroundColor: 'rgba(0,0,0,0.3)',
            }}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white text-xs">DevOpsInfraWorker</span>
              <span className="h-2 w-2 rounded-full bg-rose-500" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Tool: drop_database_table</p>
          </div>

          <div
            onMouseEnter={() => setActiveNode({
              id: 'ag-support',
              name: 'CustomerSupportCopilot',
              type: 'agent',
              status: 'allowed',
              desc: 'Querying synthetic CRM account metadata for valid tier-1 support ticket.'
            })}
            className="p-3.5 rounded-xl border transition-all cursor-pointer hover:bg-white/[0.02]"
            style={{
              borderColor: currentTheme.surfaceBorder,
              backgroundColor: 'rgba(0,0,0,0.3)',
            }}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white text-xs">SupportCopilot</span>
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Tool: lookup_customer</p>
          </div>
        </div>

        {/* Column 2: SentinelOps Interceptor */}
        <div
          className="flex flex-col items-center justify-center p-6 rounded-2xl border text-center relative shadow-xl"
          style={{
            backgroundColor: currentTheme.badgeBg,
            borderColor: currentTheme.surfaceBorder,
            boxShadow: `0 0 25px -5px ${currentTheme.glow}`,
          }}
        >
          <div
            className="h-12 w-12 rounded-xl flex items-center justify-center mb-3 border shadow-md"
            style={{
              backgroundColor: currentTheme.surface,
              borderColor: currentTheme.surfaceBorder,
              color: currentTheme.primary,
            }}
          >
            <Shield className="h-6 w-6" />
          </div>
          <span className="text-sm font-bold text-white">SentinelOps In-Line Interceptor</span>
          <span className="text-[11px] font-mono mt-1 font-semibold" style={{ color: currentTheme.accent }}>@protect_tool Hook</span>
          <p className="text-xs text-slate-400 mt-3 leading-relaxed">
            Halts execution before bytes reach network sockets. Evaluates constraints in &lt;12ms.
          </p>
        </div>

        {/* Column 3: Deterministic Policy Engine */}
        <div className="space-y-3">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">2. Deterministic Decision</div>

          <div className="p-3 rounded-xl border border-rose-500/30 bg-rose-500/10 flex items-center gap-3">
            <XCircle className="h-5 w-5 text-rose-400 shrink-0" />
            <div>
              <span className="text-xs font-bold text-rose-400">DENY (Halted)</span>
              <p className="text-[10px] text-slate-300">Violates Zero-Destruction Rule</p>
            </div>
          </div>

          <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-center gap-3">
            <Clock className="h-5 w-5 text-amber-400 shrink-0" />
            <div>
              <span className="text-xs font-bold text-amber-400">REQUIRE APPROVAL</span>
              <p className="text-[10px] text-slate-300">Amount &gt; $5,000 threshold</p>
            </div>
          </div>

          <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
            <div>
              <span className="text-xs font-bold text-emerald-400">ALLOW</span>
              <p className="text-[10px] text-slate-300">Read-only CRM bounds verified</p>
            </div>
          </div>
        </div>

        {/* Column 4: Production Sinks / Targets */}
        <div className="space-y-4">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">3. Protected Targets</div>

          <div
            className="p-3.5 rounded-xl border flex items-center gap-3"
            style={{
              borderColor: currentTheme.surfaceBorder,
              backgroundColor: 'rgba(0,0,0,0.3)',
            }}
          >
            <Database className="h-5 w-5 text-slate-300" />
            <div>
              <span className="text-xs font-semibold text-white">Production Database</span>
              <p className="text-[10px] text-emerald-400">Protected from DROPs</p>
            </div>
          </div>

          <div
            className="p-3.5 rounded-xl border flex items-center gap-3"
            style={{
              borderColor: currentTheme.surfaceBorder,
              backgroundColor: 'rgba(0,0,0,0.3)',
            }}
          >
            <Server className="h-5 w-5 text-slate-300" />
            <div>
              <span className="text-xs font-semibold text-white">Core Banking Gateway</span>
              <p className="text-[10px] text-amber-400">Human Sign-off Bound</p>
            </div>
          </div>

          <div
            className="p-3.5 rounded-xl border flex items-center gap-3"
            style={{
              borderColor: currentTheme.surfaceBorder,
              backgroundColor: 'rgba(0,0,0,0.3)',
            }}
          >
            <Send className="h-5 w-5 text-slate-300" />
            <div>
              <span className="text-xs font-semibold text-white">CRM & Support API</span>
              <p className="text-[10px] text-emerald-400">1:1 Scope Enforced</p>
            </div>
          </div>
        </div>
      </div>

      {/* Live Inspection Drawer */}
      <div className="mt-6 pt-4 border-t flex items-center justify-between text-xs text-slate-400" style={{ borderColor: currentTheme.surfaceBorder }}>
        <div>
          {activeNode ? (
            <span className="text-slate-200">
              <strong style={{ color: currentTheme.accent }}>{activeNode.name}</strong>: {activeNode.desc}
            </span>
          ) : (
            <span>Hover over any agent or decision node to inspect the real-time security boundary.</span>
          )}
        </div>
        <span className="font-mono text-[10px] text-emerald-400">SHA-256 Ledger: Chained ✓</span>
      </div>
    </div>
  );
}
