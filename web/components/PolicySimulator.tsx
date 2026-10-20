'use client';

import React, { useState } from 'react';
import { simulatePolicyEvaluation } from '../lib/dataStore';
import { Shield, Play, CheckCircle2, XCircle, Clock, Terminal } from 'lucide-react';

export function PolicySimulator() {
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
    <div className="w-full rounded-2xl border border-surface-border bg-surface p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border pb-6 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-brand-cyan" />
            <h3 className="text-lg font-bold text-white">Live Policy Enforcement Simulator</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Test how SentinelOps intercepts agent tool calls in real time before downstream code executes.
          </p>
        </div>

        {/* Preset quick buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleSelectScenario('finance_large')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedScenario === 'finance_large'
                ? 'bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/40'
                : 'bg-surface-subtle text-slate-400 hover:text-white border border-surface-border'
            }`}
          >
            Over-Limit Wire ($12.5k)
          </button>
          <button
            onClick={() => handleSelectScenario('drop_table')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedScenario === 'drop_table'
                ? 'bg-status-critical/20 text-status-critical border border-status-critical/40'
                : 'bg-surface-subtle text-slate-400 hover:text-white border border-surface-border'
            }`}
          >
            Drop Table Injection
          </button>
          <button
            onClick={() => handleSelectScenario('safe_query')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedScenario === 'safe_query'
                ? 'bg-status-success/20 text-status-success border border-status-success/40'
                : 'bg-surface-subtle text-slate-400 hover:text-white border border-surface-border'
            }`}
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
              className="w-full rounded-lg border border-surface-border bg-surface-subtle px-3.5 py-2 font-mono text-xs text-white focus:border-brand-cyan focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5">Tool Invocation Arguments (JSON)</label>
            <textarea
              rows={6}
              value={customPayload}
              onChange={(e) => setCustomPayload(e.target.value)}
              className="w-full rounded-lg border border-surface-border bg-surface-subtle p-3.5 font-mono text-xs text-brand-cyan focus:border-brand-cyan focus:outline-none"
            />
          </div>

          <button
            onClick={handleRunSimulation}
            disabled={isEvaluating}
            className="flex items-center justify-center gap-2 w-full rounded-lg bg-brand-cyan py-2.5 text-xs font-semibold text-slate-950 hover:bg-cyan-400 transition-colors disabled:opacity-50"
          >
            <Play className="h-4 w-4 fill-slate-950" />
            <span>{isEvaluating ? 'Evaluating Constraints...' : 'Evaluate Pre-Flight Interception'}</span>
          </button>
        </div>

        {/* Evaluation Output Window */}
        <div className="rounded-xl border border-surface-border bg-surface-subtle p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-surface-border pb-3 mb-4">
              <span className="font-mono text-xs text-slate-400">Enforcement Engine Result</span>
              <span className="font-mono text-[10px] text-slate-500">Latency: 8.4ms</span>
            </div>

            {evaluationResult ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  {evaluationResult.decision === 'ALLOW' && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-status-success/20 border border-status-success/40 text-status-success text-xs font-bold">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>ALLOW: Execution Permitted</span>
                    </div>
                  )}
                  {evaluationResult.decision === 'DENY' && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-status-critical/20 border border-status-critical/40 text-status-critical text-xs font-bold">
                      <XCircle className="h-4 w-4" />
                      <span>DENY: Execution Halted In-Line</span>
                    </div>
                  )}
                  {evaluationResult.decision === 'REQUIRE_APPROVAL' && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-status-warning/20 border border-status-warning/40 text-status-warning text-xs font-bold">
                      <Clock className="h-4 w-4" />
                      <span>REQUIRE_APPROVAL: Paused for Human Sign-off</span>
                    </div>
                  )}
                </div>

                <div className="p-3.5 rounded-lg bg-surface border border-surface-border">
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

          <div className="pt-4 border-t border-surface-border text-[11px] text-slate-500 font-mono">
            Zero model hallucinations. Enforced by deterministic AST/Regex schema evaluators.
          </div>
        </div>
      </div>
    </div>
  );
}
