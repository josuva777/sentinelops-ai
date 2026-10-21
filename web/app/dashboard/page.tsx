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
  INITIAL_AUDIT_EVENTS,
} from '../../lib/dataStore';
import { useTheme } from '../../lib/themeContext';
import { useOperations } from '../../lib/operationsContext';

export default function DashboardOverviewPage() {
  const { currentTheme } = useTheme();
  const { approvals, alerts } = useOperations();
  const pendingApprovals = approvals.filter((a) => a.status === 'PENDING');
  const criticalAlerts = alerts.filter((a) => a.severity === 'critical' && a.status !== 'RESOLVED');

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Title & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b" style={{ borderColor: currentTheme.surfaceBorder }}>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Security & Operations Overview</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time telemetry and deterministic tool enforcement across all connected AI agents.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/approvals"
            className="flex items-center gap-2 rounded-xl bg-amber-400 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-300 transition-all shadow-lg hover:scale-105"
          >
            <Clock className="h-4 w-4" />
            <span>Review Pending Approvals ({pendingApprovals.length})</span>
          </Link>
        </div>
      </div>

      {/* 4 CORE METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1 */}
        <div
          className="p-6 rounded-2xl border flex flex-col justify-between shadow-lg transition-all duration-300 hover:-translate-y-0.5"
          style={{
            backgroundColor: currentTheme.surface,
            borderColor: currentTheme.surfaceBorder,
          }}
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Monitored Agents</span>
            <Bot className="h-5 w-5" style={{ color: currentTheme.primary }} />
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-white">{INITIAL_AGENTS.length}</div>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono mt-1.5 font-bold">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>3 Healthy, 1 Degraded</span>
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div
          className="p-6 rounded-2xl border flex flex-col justify-between shadow-lg transition-all duration-300 hover:-translate-y-0.5"
          style={{
            backgroundColor: currentTheme.surface,
            borderColor: currentTheme.surfaceBorder,
          }}
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">24h Intercepted Actions</span>
            <Activity className="h-5 w-5" style={{ color: currentTheme.primary }} />
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-white">7,497</div>
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 mt-1.5">
              <span>Avg Latency: <strong style={{ color: currentTheme.accent }}>7.8ms</strong></span>
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div
          className="p-6 rounded-2xl border flex flex-col justify-between shadow-lg transition-all duration-300 hover:-translate-y-0.5"
          style={{
            backgroundColor: currentTheme.surface,
            borderColor: currentTheme.surfaceBorder,
          }}
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">In-Line Halts (DENY)</span>
            <XCircle className="h-5 w-5 text-rose-500" />
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-rose-500">47</div>
            <div className="text-[11px] text-slate-400 font-mono mt-1.5">
              <span>Zero-destruction violations blocked</span>
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div
          className="p-6 rounded-2xl border flex flex-col justify-between shadow-lg transition-all duration-300 hover:-translate-y-0.5"
          style={{
            backgroundColor: currentTheme.surface,
            borderColor: currentTheme.surfaceBorder,
          }}
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Approvals</span>
            <Clock className="h-5 w-5 text-amber-400" />
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-amber-400">{pendingApprovals.length}</div>
            <div className="text-[11px] text-amber-400/90 font-mono mt-1.5 font-bold">
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
          <div
            className="rounded-2xl border shadow-xl overflow-hidden"
            style={{
              backgroundColor: currentTheme.surface,
              borderColor: currentTheme.surfaceBorder,
            }}
          >
            <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: currentTheme.surfaceBorder }}>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Active Security Alerts & Incidents
                </h2>
              </div>
              <Link
                href="/dashboard/alerts"
                className="text-xs font-mono font-bold hover:underline flex items-center gap-1"
                style={{ color: currentTheme.accent }}
              >
                <span>View all</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="divide-y" style={{ borderColor: currentTheme.surfaceBorder }}>
              {alerts.filter(a => a.status !== 'RESOLVED').length === 0 ? (
                <div className="p-8 text-center text-xs font-mono text-emerald-400">
                  ✓ All security alerts resolved. Zero active incidents.
                </div>
              ) : (
                alerts.filter(a => a.status !== 'RESOLVED').map((alert) => (
                <div key={alert.id} className="p-4 hover:bg-white/[0.02] transition-colors flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border font-mono ${
                        alert.severity === 'critical'
                          ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                          : alert.severity === 'high'
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                          : 'bg-white/5 text-slate-300 border-white/10'
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
                    className="shrink-0 px-3 py-1.5 rounded-lg border text-xs font-mono text-slate-300 hover:text-white transition-colors"
                    style={{ borderColor: currentTheme.surfaceBorder }}
                  >
                    Investigate
                  </Link>
                </div>
              )))}
            </div>
          </div>

          {/* Recent Audit Timeline Stream */}
          <div
            className="rounded-2xl border shadow-xl overflow-hidden"
            style={{
              backgroundColor: currentTheme.surface,
              borderColor: currentTheme.surfaceBorder,
            }}
          >
            <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: currentTheme.surfaceBorder }}>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" style={{ color: currentTheme.primary }} />
                <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Tamper-Evident SHA-256 Decision Stream
                </h2>
              </div>
              <Link
                href="/dashboard/activity"
                className="text-xs font-mono font-bold hover:underline flex items-center gap-1"
                style={{ color: currentTheme.accent }}
              >
                <span>Inspect Ledger</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="divide-y text-xs font-mono" style={{ borderColor: currentTheme.surfaceBorder }}>
              {INITIAL_AUDIT_EVENTS.map((evt) => (
                <div key={evt.id} className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 border ${
                      evt.decision === 'ALLOW'
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                        : evt.decision === 'DENY'
                        ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                        : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                    }`}>
                      {evt.decision}
                    </span>
                    <span className="text-white font-medium truncate">{evt.agentName}</span>
                    <span className="text-slate-500">→</span>
                    <span className="truncate font-semibold" style={{ color: currentTheme.accent }}>{evt.toolName}()</span>
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
          <div
            className="rounded-2xl border p-5 shadow-xl"
            style={{
              backgroundColor: currentTheme.surface,
              borderColor: currentTheme.surfaceBorder,
            }}
          >
            <div className="flex items-center justify-between border-b pb-3 mb-4" style={{ borderColor: currentTheme.surfaceBorder }}>
              <h2 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Connected Agent Fleet</h2>
              <Link href="/dashboard/agents" className="text-xs font-mono font-bold hover:underline" style={{ color: currentTheme.accent }}>
                Manage
              </Link>
            </div>

            <div className="space-y-3.5">
              {INITIAL_AGENTS.map((agent) => (
                <div
                  key={agent.id}
                  className="p-3.5 rounded-xl border bg-black/25"
                  style={{ borderColor: currentTheme.surfaceBorder }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">{agent.name}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      agent.status === 'healthy'
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : agent.status === 'degraded'
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                        : 'bg-white/5 text-slate-400 border-white/10'
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
          <div
            className="rounded-2xl border p-5 space-y-3 shadow-xl"
            style={{
              backgroundColor: currentTheme.surface,
              borderColor: currentTheme.surfaceBorder,
            }}
          >
            <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 font-mono">
              <Database className="h-4 w-4" style={{ color: currentTheme.primary }} />
              <span>Integration Status</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              In-line SDK hook active on 4 agent runtimes. Fail-closed fallback is active on all endpoints.
            </p>
            <div className="pt-2">
              <Link
                href="/docs"
                className="text-xs font-mono font-semibold hover:underline flex items-center gap-1"
                style={{ color: currentTheme.accent }}
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
