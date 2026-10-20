'use client';

import React from 'react';
import Link from 'next/link';
import {
  Shield,
  Bot,
  Activity,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  Database,
  ExternalLink,
} from 'lucide-react';
import {
  INITIAL_AGENTS,
  INITIAL_APPROVALS,
  INITIAL_ALERTS,
  INITIAL_AUDIT_EVENTS,
} from '../../lib/dataStore';

export default function DashboardOverviewPage() {
  const pendingApprovals = INITIAL_APPROVALS.filter((a) => a.status === 'PENDING');
  const criticalAlerts = INITIAL_ALERTS.filter((a) => a.severity === 'critical');

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Title & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Security & Operations Overview</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time telemetry and deterministic tool enforcement across all connected AI agents.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/approvals"
            className="flex items-center gap-2 rounded-lg bg-status-warning px-3.5 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-colors shadow-sm"
          >
            <Clock className="h-4 w-4" />
            <span>Review Pending Approvals ({pendingApprovals.length})</span>
          </Link>
        </div>
      </div>

      {/* 4 CORE METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-5 rounded-xl border border-surface-border bg-surface flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Monitored Agents</span>
            <Bot className="h-4 w-4 text-brand-cyan" />
          </div>
          <div className="mt-4">
            <div className="text-2xl font-extrabold text-white">{INITIAL_AGENTS.length}</div>
            <div className="flex items-center gap-1.5 text-[11px] text-status-success mt-1">
              <span className="h-1.5 w-1.5 rounded-full bg-status-success" />
              <span>3 Healthy, 1 Degraded</span>
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-xl border border-surface-border bg-surface flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">24h Intercepted Actions</span>
            <Activity className="h-4 w-4 text-brand-cyan" />
          </div>
          <div className="mt-4">
            <div className="text-2xl font-extrabold text-white">7,497</div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1">
              <span>Avg Latency: <strong>7.8ms</strong></span>
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-xl border border-surface-border bg-surface flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">In-Line Halts (DENY)</span>
            <XCircle className="h-4 w-4 text-status-critical" />
          </div>
          <div className="mt-4">
            <div className="text-2xl font-extrabold text-status-critical">47</div>
            <div className="text-[11px] text-slate-400 mt-1">
              <span>Zero-destruction violations blocked</span>
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-xl border border-surface-border bg-surface flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Pending Approvals</span>
            <Clock className="h-4 w-4 text-status-warning" />
          </div>
          <div className="mt-4">
            <div className="text-2xl font-extrabold text-status-warning">{pendingApprovals.length}</div>
            <div className="text-[11px] text-status-warning mt-1">
              <span>15m TTL countdown active</span>
            </div>
          </div>
        </div>
      </div>

      {/* TWO COLUMN GRID: ACTIVE ALERTS & AGENT STATUS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols): High-Risk Alerts & Recent Audit Trail */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Security Alerts Table */}
          <div className="rounded-xl border border-surface-border bg-surface overflow-hidden">
            <div className="p-4 border-b border-surface-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-status-warning" />
                <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                  Active Security Alerts & Incidents
                </h2>
              </div>
              <Link href="/dashboard/alerts" className="text-xs text-brand-cyan hover:underline flex items-center gap-1">
                <span>View all</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="divide-y divide-surface-border">
              {INITIAL_ALERTS.map((alert) => (
                <div key={alert.id} className="p-4 hover:bg-surface-subtle transition-colors flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        alert.severity === 'critical'
                          ? 'bg-status-critical/20 text-status-critical border border-status-critical/40'
                          : alert.severity === 'high'
                          ? 'bg-status-warning/20 text-status-warning border border-status-warning/40'
                          : 'bg-surface-border text-slate-300'
                      }`}>
                        {alert.severity}
                      </span>
                      <span className="text-xs font-semibold text-white">{alert.title}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{alert.evidence}</p>
                    <div className="text-[10px] font-mono text-slate-500 flex items-center gap-3">
                      <span>Agent: {alert.agentName}</span>
                      <span>Time: {alert.timestamp}</span>
                      <span>Confidence: {Math.round(alert.confidence * 100)}%</span>
                    </div>
                  </div>

                  <Link
                    href={`/dashboard/alerts`}
                    className="shrink-0 px-2.5 py-1 rounded bg-surface-subtle border border-surface-border text-[11px] text-slate-300 hover:text-white hover:border-slate-400"
                  >
                    Investigate
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Audit Timeline Stream */}
          <div className="rounded-xl border border-surface-border bg-surface overflow-hidden">
            <div className="p-4 border-b border-surface-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-brand-cyan" />
                <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                  Tamper-Evident SHA-256 Decision Stream
                </h2>
              </div>
              <Link href="/dashboard/activity" className="text-xs text-brand-cyan hover:underline flex items-center gap-1">
                <span>Inspect Ledger</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="divide-y divide-surface-border text-xs">
              {INITIAL_AUDIT_EVENTS.map((evt) => (
                <div key={evt.id} className="p-4 flex items-center justify-between gap-4 font-mono">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                      evt.decision === 'ALLOW'
                        ? 'bg-status-success/20 text-status-success'
                        : evt.decision === 'DENY'
                        ? 'bg-status-critical/20 text-status-critical'
                        : 'bg-status-warning/20 text-status-warning'
                    }`}>
                      {evt.decision}
                    </span>
                    <span className="text-white font-medium truncate">{evt.agentName}</span>
                    <span className="text-slate-500">→</span>
                    <span className="text-brand-cyan truncate">{evt.toolName}()</span>
                  </div>

                  <div className="text-[10px] text-slate-500 shrink-0 hidden sm:block">
                    hash:{evt.eventHash.slice(0, 12)}...
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Agent Fleet Health */}
        <div className="space-y-6">
          <div className="rounded-xl border border-surface-border bg-surface p-5">
            <div className="flex items-center justify-between border-b border-surface-border pb-3 mb-4">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">Connected Agent Fleet</h2>
              <Link href="/dashboard/agents" className="text-xs text-brand-cyan hover:underline">
                Manage
              </Link>
            </div>

            <div className="space-y-3.5">
              {INITIAL_AGENTS.map((agent) => (
                <div key={agent.id} className="p-3 rounded-lg border border-surface-border bg-surface-subtle">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">{agent.name}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      agent.status === 'healthy'
                        ? 'bg-status-success/20 text-status-success'
                        : agent.status === 'degraded'
                        ? 'bg-status-warning/20 text-status-warning'
                        : 'bg-surface-border text-slate-400'
                    }`}>
                      {agent.status}
                    </span>
                  </div>
                  <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between font-mono">
                    <span>{agent.tools.length} Tools Guarded</span>
                    <span>{agent.lastSeen}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick SDK Verification Widget */}
          <div className="rounded-xl border border-surface-border bg-surface p-5 space-y-3">
            <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Database className="h-4 w-4 text-brand-cyan" />
              <span>Integration Status</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              In-line SDK hook active on 4 agent runtimes. Fail-closed fallback is active on all endpoints.
            </p>
            <div className="pt-2">
              <Link
                href="/docs"
                className="text-xs font-semibold text-brand-cyan hover:underline flex items-center gap-1"
              >
                <span>View SDK Integration Snippet</span>
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
