'use client';

import React, { useState } from 'react';
import { useOperations } from '../../../lib/operationsContext';
import { useTheme } from '../../../lib/themeContext';
import { ApprovalRequest } from '../../../lib/types';
import { CheckSquare, Clock, CheckCircle2, XCircle, Shield, AlertTriangle, ArrowRight } from 'lucide-react';

export default function ApprovalCentrePage() {
  const { approvals, approveRequest, rejectRequest } = useOperations();
  const { currentTheme } = useTheme();
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const filtered = approvals.filter((a) => (filter === 'ALL' ? true : a.status === filter));

  const handleApprove = (id: string) => {
    approveRequest(id, 'Authorized via SecOps approval queue.');
    setActionFeedback(`Request ${id} APPROVED. One-time cryptographic token dispatched to agent execution socket.`);
    setTimeout(() => setActionFeedback(null), 4000);
  };

  const handleReject = (id: string) => {
    rejectRequest(id, 'Denied by security operator. Tool execution terminated.');
    setActionFeedback(`Request ${id} REJECTED. Execution halted fail-closed.`);
    setTimeout(() => setActionFeedback(null), 4000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b" style={{ borderColor: currentTheme.surfaceBorder }}>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Human Approval Queue</h1>
          <p className="text-xs text-slate-400 mt-1">
            Autonomous agent tool requests paused by deterministic policy rules awaiting authorized human sign-off.
          </p>
        </div>

        {/* Status Filters */}
        <div className="flex gap-2">
          {(['PENDING', 'APPROVED', 'REJECTED', 'ALL'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-colors border ${
                filter === s
                  ? 'font-bold text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
              style={{
                backgroundColor: filter === s ? currentTheme.primary : currentTheme.surface,
                borderColor: filter === s ? currentTheme.primary : currentTheme.surfaceBorder,
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Action Notification Banner */}
      {actionFeedback && (
        <div
          className="p-4 rounded-xl border text-xs font-mono flex items-center gap-2 shadow-lg animate-in fade-in"
          style={{
            borderColor: currentTheme.primary,
            backgroundColor: currentTheme.badgeBg,
            color: '#ffffff',
          }}
        >
          <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: currentTheme.primary }} />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* Approval Cards List */}
      <div className="space-y-4">
        {filtered.map((req) => (
          <div
            key={req.id}
            className="rounded-2xl border p-6 space-y-4 shadow-xl transition-all"
            style={{
              backgroundColor: currentTheme.surface,
              borderColor: currentTheme.surfaceBorder,
            }}
          >
            {/* Card Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4" style={{ borderColor: currentTheme.surfaceBorder }}>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono tracking-wider border ${
                  req.status === 'PENDING'
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                    : req.status === 'APPROVED'
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                }`}>
                  {req.status}
                </span>
                <span className="text-sm font-bold text-white">{req.agentName}</span>
                <span className="text-slate-500">→</span>
                <span className="font-mono text-xs" style={{ color: currentTheme.accent }}>{req.toolName}()</span>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1.5 text-amber-400">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{req.expiresAt}</span>
                </span>
                <span className="text-slate-600">|</span>
                <span>Token: {req.token}</span>
              </div>
            </div>

            {/* Reason & Matched Policy */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div
                className="p-3.5 rounded-xl border"
                style={{
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  borderColor: currentTheme.surfaceBorder,
                }}
              >
                <div className="text-[11px] font-mono text-slate-400 uppercase">Triggered Security Policy</div>
                <div className="text-xs font-semibold text-white mt-1">{req.matchedPolicyRule}</div>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">{req.reason}</p>
              </div>

              {/* Raw Parameter Payload */}
              <div
                className="p-3.5 rounded-xl border font-mono text-[11px]"
                style={{
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  borderColor: currentTheme.surfaceBorder,
                }}
              >
                <div className="text-[11px] text-slate-400 uppercase mb-1">Intercepted Tool Arguments (JSON)</div>
                <pre className="overflow-x-auto leading-relaxed" style={{ color: currentTheme.accent }}>
                  {JSON.stringify(req.payload, null, 2)}
                </pre>
              </div>
            </div>

            {/* Operator Actions / Decision Log */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {req.status === 'PENDING' ? (
                <>
                  <div className="text-xs text-slate-400">
                    Review arguments carefully before approving. Action execution will be cryptographically signed.
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleReject(req.id)}
                      className="px-4 py-2 rounded-xl border border-rose-500/40 bg-rose-500/10 text-xs font-semibold text-rose-400 hover:bg-rose-500/20 transition-colors flex items-center gap-1.5"
                    >
                      <XCircle className="h-4 w-4" />
                      <span>Reject & Abort</span>
                    </button>
                    <button
                      onClick={() => handleApprove(req.id)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 transition-all hover:opacity-90 shadow-md flex items-center gap-1.5"
                      style={{ backgroundColor: currentTheme.primary }}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Approve Execution</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-xs font-mono text-slate-400 flex items-center gap-3">
                  <span>Decided: <strong className="text-white">{req.status}</strong></span>
                  <span>Notes: {req.decisionNote || 'Evaluated via console'}</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div
            className="rounded-2xl border p-12 text-center text-slate-400"
            style={{
              backgroundColor: currentTheme.surface,
              borderColor: currentTheme.surfaceBorder,
            }}
          >
            <CheckSquare className="h-8 w-8 mx-auto text-emerald-400 mb-2" />
            <p className="text-xs font-mono">No approval requests currently in this state.</p>
          </div>
        )}
      </div>
    </div>
  );
}
