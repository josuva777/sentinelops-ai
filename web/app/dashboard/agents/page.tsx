'use client';

import React, { useState } from 'react';
import { INITIAL_AGENTS, INITIAL_POLICIES } from '../../../lib/dataStore';
import { Agent } from '../../../lib/types';
import { Bot, Plus, Shield, Search, CheckCircle2, AlertTriangle, Key, ExternalLink, X } from 'lucide-react';

export default function AgentInventoryPage() {
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentEnv, setNewAgentEnv] = useState<'production' | 'staging' | 'development'>('production');

  const filteredAgents = agents.filter(
    (a) =>
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRegisterAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgentName.trim()) return;

    const newAgent: Agent = {
      id: `agent_${Date.now()}`,
      name: newAgentName.trim(),
      description: 'Newly registered autonomous agent awaiting first tool evaluation heartbeat',
      status: 'healthy',
      environment: newAgentEnv,
      tools: ['query_database', 'call_api', 'read_cache'],
      activePolicyId: 'pol_dev_default',
      tokenFingerprint: `sn_live_${Math.random().toString(36).substring(2, 6)}...${Math.random().toString(36).substring(2, 6)}`,
      lastSeen: 'Just now',
      evaluatedActions: 0,
    };

    setAgents([newAgent, ...agents]);
    setNewAgentName('');
    setShowRegisterModal(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Agent Fleet Inventory</h1>
          <p className="text-xs text-slate-400 mt-1">
            Registered autonomous agents, bound credentials, and tool privilege boundaries.
          </p>
        </div>

        <button
          onClick={() => setShowRegisterModal(true)}
          className="flex items-center gap-2 rounded-lg bg-brand-cyan px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-cyan-400 transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Register New Agent</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center gap-4 rounded-xl border border-surface-border bg-surface p-3">
        <Search className="h-4 w-4 text-slate-400 shrink-0 ml-2" />
        <input
          type="text"
          placeholder="Filter agents by name, tool, or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
        />
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAgents.map((agent) => (
          <div
            key={agent.id}
            onClick={() => setSelectedAgent(agent)}
            className="rounded-xl border border-surface-border bg-surface p-5 hover:border-brand-cyan/60 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">{agent.name}</h3>
                    <span className="font-mono text-[10px] uppercase text-slate-400 px-1.5 py-0.5 rounded bg-surface-subtle border border-surface-border">
                      {agent.environment}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{agent.description}</p>
                </div>

                <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 uppercase tracking-wider ${
                  agent.status === 'healthy'
                    ? 'bg-status-success/20 text-status-success border border-status-success/40'
                    : agent.status === 'degraded'
                    ? 'bg-status-warning/20 text-status-warning border border-status-warning/40'
                    : 'bg-surface-border text-slate-400'
                }`}>
                  {agent.status}
                </span>
              </div>

              {/* Tools chips */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {agent.tools.map((t) => (
                  <span
                    key={t}
                    className="font-mono text-[10px] text-brand-cyan bg-brand-cyan/10 border border-brand-cyan/20 px-2 py-0.5 rounded"
                  >
                    {t}()
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-surface-border flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Actions: <strong className="text-white">{agent.evaluatedActions.toLocaleString()}</strong></span>
              <span>Key: {agent.tokenFingerprint}</span>
            </div>
          </div>
        ))}
      </div>

      {/* AGENT DETAIL DRAWER / MODAL */}
      {selectedAgent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-surface-border bg-surface p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between border-b border-surface-border pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-white">{selectedAgent.name}</h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-status-success/20 text-status-success uppercase font-mono">
                    {selectedAgent.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 font-mono">ID: {selectedAgent.id}</p>
              </div>
              <button onClick={() => setSelectedAgent(null)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Guarded Tools Allowlist</label>
                <div className="flex flex-wrap gap-2">
                  {selectedAgent.tools.map((t) => (
                    <span key={t} className="px-2.5 py-1 rounded bg-surface-subtle border border-surface-border font-mono text-brand-cyan">
                      {t}()
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Credential Fingerprint</label>
                <div className="p-3 rounded-lg bg-surface-subtle border border-surface-border font-mono text-slate-300 flex items-center justify-between">
                  <span>{selectedAgent.tokenFingerprint}</span>
                  <button className="text-xs text-brand-cyan hover:underline">Rotate Token</button>
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Telemetry Summary</label>
                <div className="grid grid-cols-2 gap-4 font-mono">
                  <div className="p-3 rounded-lg bg-surface-subtle border border-surface-border">
                    <div className="text-slate-400">Total Interceptions</div>
                    <div className="text-sm font-bold text-white mt-1">{selectedAgent.evaluatedActions}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-surface-subtle border border-surface-border">
                    <div className="text-slate-400">Last Seen Active</div>
                    <div className="text-sm font-bold text-status-success mt-1">{selectedAgent.lastSeen}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-surface-border flex justify-end">
              <button
                onClick={() => setSelectedAgent(null)}
                className="px-4 py-2 rounded-lg bg-surface-subtle border border-surface-border text-xs text-white hover:border-slate-500"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REGISTER NEW AGENT MODAL */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <form onSubmit={handleRegisterAgent} className="w-full max-w-lg rounded-2xl border border-surface-border bg-surface p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <h3 className="text-sm font-bold text-white">Register Autonomous Agent</h3>
              <button type="button" onClick={() => setShowRegisterModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Agent Name</label>
              <input
                type="text"
                required
                placeholder="e.g. TreasurySettlementBot"
                value={newAgentName}
                onChange={(e) => setNewAgentName(e.target.value)}
                className="w-full rounded-lg border border-surface-border bg-surface-subtle px-3.5 py-2 text-xs text-white focus:border-brand-cyan focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Target Environment</label>
              <select
                value={newAgentEnv}
                onChange={(e) => setNewAgentEnv(e.target.value as any)}
                className="w-full rounded-lg border border-surface-border bg-surface-subtle px-3.5 py-2 text-xs text-white focus:border-brand-cyan focus:outline-none"
              >
                <option value="production">Production</option>
                <option value="staging">Staging</option>
                <option value="development">Development</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-surface-border">
              <button
                type="button"
                onClick={() => setShowRegisterModal(false)}
                className="px-4 py-2 rounded-lg border border-surface-border text-xs text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-brand-cyan text-xs font-semibold text-slate-950 hover:bg-cyan-400"
              >
                Generate Credentials
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
