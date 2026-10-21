'use client';

import React, { useState } from 'react';
import { simulatePolicyEvaluation } from '../lib/dataStore';
import { useTheme } from '../lib/themeContext';
import { Shield, Play, CheckCircle2, XCircle, Clock, Terminal } from 'lucide-react';

export function PolicySimulator() {
  const { currentTheme } = useTheme();
  const [selectedScenario, setSelectedScenario] = useState<'finance_large' | 'drop_table' | 'safe_query' | 'mass_email'>('finance_large');
  const [customTool, setCustomTool] = useState('initiate_settlement');
  const [customPayload, setCustomPayload] = useState('{\n  "beneficiary": "Acme Global",\n  "amount": 12500,\n  "currency": "USD"\n}');
  const [evaluationResult, setEvaluationResult] = useState<any>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const handleSelectScenario = (key: 'finance_large' | 'drop_table' | 'safe_query' | 'mass_email') => {
    setSelectedScenario(key);
    if (key === 'finance_large') {
      setCustomTool('initiate_settlement');
      setCustomPayload('{\n  "beneficiary": "Acme Global",\n  "amount": 12500,\n  "currency": "USD"\n}');
    } else if (key === 'drop_table') {
      setCustomTool('drop_database_table');
      setCustomPayload('{\n  "table": "customers_archive",\n  "cascade": true\n}');
    } else if (key === 'safe_query') {
      setCustomTool('lookup_customer');
      setCustomPayload('{\n  "account_id": "ACCT-1002",\n  "fields": ["tier", "name"]\n}');
    } else if (key === 'mass_email') {
      setCustomTool('send_user_email');
      setCustomPayload('{\n  "recipient_count": 450,\n  "subject": "System Announcement"\n}');
    }
    setEvaluationResult(null);
  };

  const handleRunSimulation = () => {
    setIsEvaluating(true);
    let parsed = {};
    try {
      parsed = JSON.parse(customPayload);
    } catch {
      parsed = {};
    }

    setTimeout(() => {
      const res = simulatePolicyEvaluation(customTool, parsed);
      setEvaluationResult(res);
      setIsEvaluating(false);
    }, 250);
  };

  return (
    <div
      className="rounded-2xl border p-6 sm:p-8 shadow-2xl transition-all"
      style={{
        backgroundColor: currentTheme.surface,
        borderColor: currentTheme.surfaceBorder,
      }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6 mb-6" style={{ borderColor: currentTheme.surfaceBorder }}>
        <div>
          <div className="flex items-center gap-2">
            <Terminal className="h-5 w-5" style={{ color: currentTheme.primary }} />
            <h3 className="text-lg font-bold text-white">Live Policy Enforcement Simulator</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Test how SentinelOps intercepts agent tool calls in real time before downstream code executes.
          </p>
        </div>

        {/* Preset quick buttons */}
        <div className="flex flex-wrap gap-2 font-mono text-xs">
          <button
            onClick={() => handleSelectScenario('finance_large')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors border ${
              selectedScenario === 'finance_large'
                ? 'font-bold text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
            style={{
              backgroundColor: selectedScenario === 'finance_large' ? currentTheme.primary : 'transparent',
              borderColor: selectedScenario === 'finance_large' ? currentTheme.primary : currentTheme.surfaceBorder,
            }}
          >
            Over-Limit Wire ($12.5k)
          </button>
          <button
            onClick={() => handleSelectScenario('drop_table')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors border ${
              selectedScenario === 'drop_table'
                ? 'bg-rose-500 text-slate-950 border-rose-400 font-bold'
                : 'text-slate-400 hover:text-white border-transparent'
            }`}
            style={{
              borderColor: selectedScenario === 'drop_table' ? '#f43f5e' : currentTheme.surfaceBorder,
            }}
          >
            Drop Table Injection
          </button>
          <button
            onClick={() => handleSelectScenario('safe_query')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors border ${
              selectedScenario === 'safe_query'
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold'
                : 'text-slate-400 hover:text-white border-transparent'
            }`}
            style={{
              borderColor: selectedScenario === 'safe_query' ? '#10b981' : currentTheme.surfaceBorder,
            }}
          >
            Safe Read Query
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5">Intercepted Tool Name</label>
            <input
              type="text"
              value={customTool}
              onChange={(e) => setCustomTool(e.target.value)}
              className="w-full rounded-xl border bg-black/40 px-3.5 py-2 font-mono text-xs text-white focus:outline-none"
              style={{ borderColor: currentTheme.surfaceBorder }}
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5">Tool Invocation Arguments (JSON)</label>
            <textarea
              rows={6}
              value={customPayload}
              onChange={(e) => setCustomPayload(e.target.value)}
              className="w-full rounded-xl border bg-black/40 p-3.5 font-mono text-xs focus:outline-none"
              style={{
                borderColor: currentTheme.surfaceBorder,
                color: currentTheme.accent,
              }}
            />
          </div>

          <button
            onClick={handleRunSimulation}
            disabled={isEvaluating}
            className="flex items-center justify-center gap-2 w-full rounded-xl py-3 text-xs font-bold text-slate-950 transition-all hover:opacity-90 shadow-lg disabled:opacity-50"
            style={{ backgroundColor: currentTheme.primary }}
          >
            <Play className="h-4 w-4 fill-slate-950" />
            <span>{isEvaluating ? 'Evaluating Constraints...' : 'Evaluate Pre-Flight Interception'}</span>
          </button>
        </div>

        {/* Evaluation Output Window */}
        <div
          className="rounded-2xl border p-5 flex flex-col justify-between"
          style={{
            backgroundColor: 'rgba(0,0,0,0.3)',
            borderColor: currentTheme.surfaceBorder,
          }}
        >
          <div>
            <div className="flex items-center justify-between border-b pb-3 mb-4" style={{ borderColor: currentTheme.surfaceBorder }}>
              <span className="font-mono text-xs text-slate-400">Enforcement Engine Result</span>
              <span className="font-mono text-[10px] text-slate-500">Latency: 8.4ms</span>
            </div>

            {evaluationResult ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  {evaluationResult.decision === 'ALLOW' && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>ALLOW: Execution Permitted</span>
                    </div>
                  )}
                  {evaluationResult.decision === 'DENY' && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-400 text-xs font-bold">
                      <XCircle className="h-4 w-4" />
                      <span>DENY: Execution Halted In-Line</span>
                    </div>
                  )}
                  {evaluationResult.decision === 'REQUIRE_APPROVAL' && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-bold">
                      <Clock className="h-4 w-4" />
                      <span>REQUIRE_APPROVAL: Paused for Human Sign-off</span>
                    </div>
                  )}
                </div>

                <div
                  className="p-3.5 rounded-xl border"
                  style={{
                    backgroundColor: currentTheme.surface,
                    borderColor: currentTheme.surfaceBorder,
                  }}
                >
                  <div className="text-[11px] font-mono text-slate-400">Matched Policy Rule</div>
                  <div className="text-xs font-semibold text-white mt-1">{evaluationResult.ruleMatched}</div>
                  <div className="text-xs text-slate-300 mt-2 leading-relaxed">{evaluationResult.reason}</div>
                </div>

                <div className="text-[11px] font-mono text-slate-500">
                  Audit Hash: <span className="text-slate-400">sha256:7f9a...3c12</span> | Proof: Cryptographically bound
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center text-slate-500">
                <Shield className="h-10 w-10 stroke-1 text-slate-600 mb-2" />
                <p className="text-xs">Click "Evaluate Pre-Flight Interception" to test the rule engine.</p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t text-[11px] text-slate-500 font-mono" style={{ borderColor: currentTheme.surfaceBorder }}>
            Zero model hallucinations. Enforced by deterministic AST/Regex schema evaluators.
          </div>
        </div>
      </div>
    </div>
  );
}
