'use client';

import React, { useState } from 'react';
import { INITIAL_POLICIES } from '../../../lib/dataStore';
import { Policy, PolicyRule } from '../../../lib/types';
import { useTheme } from '../../../lib/themeContext';
import { Sliders, Plus, Shield, CheckCircle2, XCircle, Clock, AlertTriangle, Play } from 'lucide-react';

export default function PolicyCentrePage() {
  const { currentTheme } = useTheme();
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b" style={{ borderColor: currentTheme.surfaceBorder }}>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Policy Centre</h1>
          <p className="text-xs text-slate-400 mt-1">
            Deterministic rule definitions, parameter constraints, and fail-closed security baselines.
          </p>
        </div>

        <button
          className="flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold text-slate-950 transition-all hover:opacity-90 shadow-md"
          style={{ backgroundColor: currentTheme.primary }}
        >
          <Plus className="h-4 w-4" />
          <span>New Security Policy</span>
        </button>
      </div>

      {/* Policy Selector Tabs */}
      <div className="flex gap-2 border-b overflow-x-auto pb-2" style={{ borderColor: currentTheme.surfaceBorder }}>
        {policies.map((p) => {
          const isSelected = activePolicyId === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setActivePolicyId(p.id)}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all shrink-0 border ${
                isSelected
                  ? 'font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white border-transparent'
              }`}
              style={{
                backgroundColor: isSelected ? currentTheme.badgeBg : 'transparent',
                borderColor: isSelected ? currentTheme.surfaceBorder : 'transparent',
                color: isSelected ? currentTheme.badgeText : undefined,
              }}
            >
              {p.name} (v{p.version})
            </button>
          );
        })}
      </div>

      {/* Selected Policy Header Card */}
      <div
        className="rounded-2xl border p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl"
        style={{
          backgroundColor: currentTheme.surface,
          borderColor: currentTheme.surfaceBorder,
        }}
      >
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-white">{currentPolicy.name}</h2>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${
              currentPolicy.mode === 'ENFORCE'
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
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
            className="px-4 py-2 rounded-xl border text-xs font-mono transition-colors hover:bg-white/5"
            style={{
              borderColor: currentTheme.surfaceBorder,
              color: currentTheme.accent,
            }}
          >
            Switch to {currentPolicy.mode === 'ENFORCE' ? 'Simulate Mode' : 'Enforce Mode'}
          </button>
        </div>
      </div>

      {/* Policy Rules Table */}
      <div
        className="rounded-2xl border overflow-hidden shadow-xl"
        style={{
          backgroundColor: currentTheme.surface,
          borderColor: currentTheme.surfaceBorder,
        }}
      >
        <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: currentTheme.surfaceBorder }}>
          <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 font-mono">
            <Shield className="h-4 w-4" style={{ color: currentTheme.primary }} />
            <span>Deterministic Rules Evaluated by Gateway ({currentPolicy.rules.length})</span>
          </div>
        </div>

        <div className="divide-y" style={{ borderColor: currentTheme.surfaceBorder }}>
          {currentPolicy.rules.map((rule) => (
            <div
              key={rule.id}
              className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
            >
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider font-mono border ${
                    rule.action === 'DENY'
                      ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                      : rule.action === 'REQUIRE_APPROVAL'
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  }`}>
                    {rule.action}
                  </span>
                  <span className="text-xs font-bold text-white">{rule.name}</span>
                </div>

                <div className="font-mono text-xs" style={{ color: currentTheme.accent }}>
                  Tool: <span className="text-white">{rule.toolPattern}()</span>
                  {rule.paramConstraint && (
                    <span className="ml-3 text-slate-400 font-normal">
                      Condition: <code style={{ color: currentTheme.accent }}>{rule.paramConstraint}</code>
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{rule.description}</p>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <span className="text-[10px] font-mono text-slate-500">ID: {rule.id}</span>
                <button
                  className="px-3 py-1 text-xs text-slate-400 hover:text-white rounded-lg border transition-colors"
                  style={{ borderColor: currentTheme.surfaceBorder }}
                >
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
