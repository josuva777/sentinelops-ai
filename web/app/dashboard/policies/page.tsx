'use client';

import React, { useState } from 'react';
import { INITIAL_POLICIES } from '../../../lib/dataStore';
import { Policy, PolicyRule } from '../../../lib/types';
import { Sliders, Plus, Shield, CheckCircle2, XCircle, Clock, AlertTriangle, Play } from 'lucide-react';

export default function PolicyCentrePage() {
  const [policies, setPolicies] = useState<Policy[]>(INITIAL_POLICIES);
  const [activePolicyId, setActivePolicyId] = useState(INITIAL_POLICIES[0].id);

  const currentPolicy = policies.find((p) => p.id === activePolicyId) || policies[0];

  const handleToggleMode = (policyId: string) => {
    setPolicies(
      policies.map((p) => {
        if (p.id === policyId) {
          return { ...p, mode: p.mode === 'ENFORCE' ? 'SIMULATE' : 'ENFORCE' };
        }
        return p;
      })
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Policy Centre</h1>
          <p className="text-xs text-slate-400 mt-1">
            Deterministic rule definitions, parameter constraints, and fail-closed security baselines.
          </p>
        </div>

        <button className="flex items-center gap-2 rounded-lg bg-brand-cyan px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-cyan-400 transition-colors shadow-sm">
          <Plus className="h-4 w-4" />
          <span>New Security Policy</span>
        </button>
      </div>

      {/* Policy Selector Tabs */}
      <div className="flex gap-2 border-b border-surface-border overflow-x-auto pb-2">
        {policies.map((p) => (
          <button
            key={p.id}
            onClick={() => setActivePolicyId(p.id)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
              activePolicyId === p.id
                ? 'bg-surface text-brand-cyan border border-brand-cyan/40'
                : 'text-slate-400 hover:text-white hover:bg-surface-subtle'
            }`}
          >
            {p.name} (v{p.version})
          </button>
        ))}
      </div>

      {/* Selected Policy Header Card */}
      <div className="rounded-xl border border-surface-border bg-surface p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-white">{currentPolicy.name}</h2>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
              currentPolicy.mode === 'ENFORCE'
                ? 'bg-status-success/20 text-status-success border border-status-success/40'
                : 'bg-status-warning/20 text-status-warning border border-status-warning/40'
            }`}>
              MODE: {currentPolicy.mode}
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1.5">{currentPolicy.description}</p>
          <div className="mt-3 flex items-center gap-4 text-[11px] font-mono text-slate-400">
            <span>Author: {currentPolicy.author}</span>
            <span>Last Updated: {currentPolicy.updatedAt}</span>
            <span>Version: v{currentPolicy.version}.0</span>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-3">
          <button
            onClick={() => handleToggleMode(currentPolicy.id)}
            className="px-3.5 py-2 rounded-lg border border-surface-border bg-surface-subtle text-xs font-medium text-slate-200 hover:border-slate-500"
          >
            Switch to {currentPolicy.mode === 'ENFORCE' ? 'Simulate Mode' : 'Enforce Mode'}
          </button>
        </div>
      </div>

      {/* Policy Rules Table */}
      <div className="rounded-xl border border-surface-border bg-surface overflow-hidden">
        <div className="p-4 border-b border-surface-border flex items-center justify-between">
          <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Shield className="h-4 w-4 text-brand-cyan" />
            <span>Deterministic Rules Evaluated by Gateway ({currentPolicy.rules.length})</span>
          </div>
        </div>

        <div className="divide-y divide-surface-border">
          {currentPolicy.rules.map((rule) => (
            <div key={rule.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-surface-subtle transition-colors">
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider font-mono ${
                    rule.action === 'DENY'
                      ? 'bg-status-critical/20 text-status-critical border border-status-critical/40'
                      : rule.action === 'REQUIRE_APPROVAL'
                      ? 'bg-status-warning/20 text-status-warning border border-status-warning/40'
                      : 'bg-status-success/20 text-status-success border border-status-success/40'
                  }`}>
                    {rule.action}
                  </span>
                  <span className="text-xs font-bold text-white">{rule.name}</span>
                </div>

                <div className="font-mono text-xs text-brand-cyan">
                  Tool: <span className="text-white">{rule.toolPattern}()</span>
                  {rule.paramConstraint && (
                    <span className="ml-3 text-slate-400 font-normal">
                      Condition: <code className="text-brand-cyan">{rule.paramConstraint}</code>
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{rule.description}</p>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <span className="text-[10px] font-mono text-slate-500">ID: {rule.id}</span>
                <button className="px-2.5 py-1 text-xs text-slate-400 hover:text-white rounded border border-surface-border">
                  Edit Rule
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
