'use client';

import React, { useState } from 'react';
import { INITIAL_APPROVALS } from '../../../lib/dataStore';
import { ApprovalRequest } from '../../../lib/types';
import { CheckSquare, Clock, CheckCircle2, XCircle, Shield, AlertTriangle, ArrowRight } from 'lucide-react';

export default function ApprovalCentrePage() {
  const [approvals, setApprovals] = useState<ApprovalRequest[]>(INITIAL_APPROVALS);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const filtered = approvals.filter((a) => (filter === 'ALL' ? true : a.status === filter));

  const handleApprove = (id: string) => {
    setApprovals(
      approvals.map((a) => {
        if (a.id === id) {
          return {
            ...a,
            status: 'APPROVED',
            decidedBy: 'Elena Rostova (SecOps Lead)',
            decisionNote: 'Authorized one-time settlement via verified ERP invoice check.',
          };
        }
        return a;
      })
    );
    setActionFeedback(`Request ${id} APPROVED. One-time cryptographic token dispatched to agent execution socket.`);
    setTimeout(() => setActionFeedback(null), 4000);
  };

  const handleReject = (id: string) => {
    setApprovals(
      approvals.map((a) => {
        if (a.id === id) {
          return {
            ...a,
            status: 'REJECTED',
            decidedBy: 'Elena Rostova (SecOps Lead)',
            decisionNote: 'Denied by security operator. Tool execution terminated.',
          };
        }
        return a;
      })
    );
    setActionFeedback(`Request ${id} REJECTED. Execution halted fail-closed.`);
    setTimeout(() => setActionFeedback(null), 4000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filter === s
                  ? 'bg-brand-cyan text-slate-950 font-bold'
                  : 'bg-surface text-slate-400 hover:text-white border border-surface-border'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Action Notification Banner */}
      {actionFeedback && (
        <div className="p-4 rounded-xl border border-brand-cyan/40 bg-brand-cyan/10 text-brand-cyan text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* Approval Cards List */}
      <div className="space-y-4">
        {filtered.map((req) => (
          <div
            key={req.id}
            className="rounded-xl border border-surface-border bg-surface p-6 hover:border-slate-600 transition-colors space-y-4"
          >
            {/* Card Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-border pb-4">
              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono tracking-wider ${
                  req.status === 'PENDING'
                    ? 'bg-status-warning/20 text-status-warning border border-status-warning/40'
                    : req.status === 'APPROVED'
                    ? 'bg-status-success/20 text-status-success border border-status-success/40'
                    : 'bg-status-critical/20 text-status-critical border border-status-critical/40'
                }`}>
                  {req.status}
                </span>
                <span className="text-sm font-bold text-white">{req.agentName}</span>
                <span className="text-slate-500">→</span>
                <span className="font-mono text-xs text-brand-cyan">{req.toolName}()</span>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1.5 text-status-warning">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{req.expiresAt}</span>
                </span>
                <span className="text-slate-600">|</span>
                <span>Token: {req.token}</span>
              </div>
            </div>

            {/* Reason & Matched Policy */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-lg bg-surface-subtle border border-surface-border">
                <div className="text-[11px] font-mono text-slate-400 uppercase">Triggered Security Policy</div>
                <div className="text-xs font-semibold text-white mt-1">{req.matchedPolicyRule}</div>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">{req.reason}</p>
              </div>

              {/* Raw Parameter Payload */}
              <div className="p-3.5 rounded-lg bg-surface-subtle border border-surface-border font-mono text-[11px]">
                <div className="text-[11px] text-slate-400 uppercase mb-1">Intercepted Tool Arguments (JSON)</div>
                <pre className="text-brand-cyan overflow-x-auto leading-relaxed">
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
                      className="px-4 py-2 rounded-lg border border-status-critical/40 bg-status-critical/10 text-xs font-semibold text-status-critical hover:bg-status-critical/20 transition-colors flex items-center gap-1.5"
                    >
                      <XCircle className="h-4 w-4" />
                      <span>Reject & Abort</span>
                    </button>
                    <button
                      onClick={() => handleApprove(req.id)}
                      className="px-4 py-2 rounded-lg bg-brand-cyan text-xs font-semibold text-slate-950 hover:bg-cyan-400 transition-colors flex items-center gap-1.5 font-bold shadow-sm"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Approve Execution</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-xs font-mono text-slate-400 flex items-center gap-3">
                  <span>Decided By: <strong className="text-white">{req.decidedBy}</strong></span>
                  <span>Note: {req.decisionNote}</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="rounded-xl border border-surface-border bg-surface p-12 text-center text-slate-400">
            <CheckSquare className="h-8 w-8 mx-auto text-slate-600 mb-2" />
            <p className="text-xs">No approval requests currently in this state.</p>
          </div>
        )}
      </div>
    </div>
  );
}
