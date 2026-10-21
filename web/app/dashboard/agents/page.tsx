'use client';

import React, { useState } from 'react';
import { INITIAL_AGENTS } from '../../../lib/dataStore';
import { Agent } from '../../../lib/types';
import { useTheme } from '../../../lib/themeContext';
import { Bot, Plus, Shield, Search, CheckCircle2, AlertTriangle, Key, ExternalLink, X } from 'lucide-react';

export default function AgentInventoryPage() {
  const { currentTheme } = useTheme();
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b" style={{ borderColor: currentTheme.surfaceBorder }}>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Agent Fleet Inventory</h1>
          <p className="text-xs text-slate-400 mt-1">
            Registered autonomous agents, bound credentials, and tool privilege boundaries.
          </p>
        </div>

        <button
          onClick={() => setShowRegisterModal(true)}
          className="flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold text-slate-950 transition-all hover:opacity-90 shadow-md"
          style={{ backgroundColor: currentTheme.primary }}
        >
          <Plus className="h-4 w-4" />
          <span>Register New Agent</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div
        className="flex items-center gap-4 rounded-xl border p-3"
        style={{
          backgroundColor: currentTheme.surface,
          borderColor: currentTheme.surfaceBorder,
        }}
      >
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
            className="rounded-2xl border p-5 transition-all cursor-pointer flex flex-col justify-between shadow-lg hover:-translate-y-0.5"
            style={{
              backgroundColor: currentTheme.surface,
              borderColor: currentTheme.surfaceBorder,
            }}
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">{agent.name}</h3>
                    <span
                      className="font-mono text-[10px] uppercase px-1.5 py-0.5 rounded border"
                      style={{
                        backgroundColor: currentTheme.badgeBg,
                        borderColor: currentTheme.surfaceBorder,
                        color: currentTheme.badgeText,
                      }}
                    >
                      {agent.environment}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{agent.description}</p>
                </div>

                <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 uppercase tracking-wider font-mono border ${
                  agent.status === 'healthy'
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                }`}>
                  {agent.status}
                </span>
              </div>

              {/* Tools chips */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {agent.tools.map((t) => (
                  <span
                    key={t}
                    className="font-mono text-[10px] px-2 py-0.5 rounded border"
                    style={{
                      backgroundColor: currentTheme.badgeBg,
                      borderColor: currentTheme.surfaceBorder,
                      color: currentTheme.accent,
                    }}
                  >
                    {t}()
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t flex items-center justify-between text-[11px] font-mono text-slate-400" style={{ borderColor: currentTheme.surfaceBorder }}>
              <span>Actions: <strong className="text-white">{agent.evaluatedActions.toLocaleString()}</strong></span>
              <span>Key: {agent.tokenFingerprint}</span>
            </div>
          </div>
        ))}
      </div>

      {/* AGENT DETAIL DRAWER / MODAL */}
      {selectedAgent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div
            className="w-full max-w-2xl rounded-2xl border p-6 sm:p-8 space-y-6 shadow-2xl"
            style={{
              backgroundColor: currentTheme.surface,
              borderColor: currentTheme.surfaceBorder,
            }}
          >
            <div className="flex items-start justify-between border-b pb-4" style={{ borderColor: currentTheme.surfaceBorder }}>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-white">{selectedAgent.name}</h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 uppercase font-mono border border-emerald-500/40">
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
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-lg border font-mono"
                      style={{
                        backgroundColor: currentTheme.badgeBg,
                        borderColor: currentTheme.surfaceBorder,
                        color: currentTheme.accent,
                      }}
                    >
                      {t}()
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Credential Fingerprint</label>
                <div
                  className="p-3 rounded-xl border font-mono text-slate-300 flex items-center justify-between"
                  style={{
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    borderColor: currentTheme.surfaceBorder,
                  }}
                >
                  <span>{selectedAgent.tokenFingerprint}</span>
                  <span className="text-xs text-emerald-400">Verified Active</span>
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Telemetry Summary</label>
                <div className="grid grid-cols-2 gap-4 font-mono">
                  <div
                    className="p-3.5 rounded-xl border"
                    style={{
                      backgroundColor: 'rgba(0,0,0,0.3)',
                      borderColor: currentTheme.surfaceBorder,
                    }}
                  >
                    <div className="text-slate-400">Total Interceptions</div>
                    <div className="text-base font-bold text-white mt-1">{selectedAgent.evaluatedActions}</div>
                  </div>
                  <div
                    className="p-3.5 rounded-xl border"
                    style={{
                      backgroundColor: 'rgba(0,0,0,0.3)',
                      borderColor: currentTheme.surfaceBorder,
                    }}
                  >
                    <div className="text-slate-400">Last Seen Active</div>
                    <div className="text-base font-bold text-emerald-400 mt-1">{selectedAgent.lastSeen}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REGISTER AGENT MODAL */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <form
            onSubmit={handleRegisterAgent}
            className="w-full max-w-md rounded-2xl border p-6 space-y-4 shadow-2xl"
            style={{
              backgroundColor: currentTheme.surface,
              borderColor: currentTheme.surfaceBorder,
            }}
          >
            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: currentTheme.surfaceBorder }}>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Bot className="w-4 h-4" style={{ color: currentTheme.primary }} />
                <span>Register Autonomous Agent</span>
              </h3>
              <button onClick={() => setShowRegisterModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Agent Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SettlementWorker_v2"
                  value={newAgentName}
                  onChange={(e) => setNewAgentName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border text-white focus:outline-none"
                  style={{ borderColor: currentTheme.surfaceBorder }}
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Environment</label>
                <select
                  value={newAgentEnv}
                  onChange={(e) => setNewAgentEnv(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border text-white focus:outline-none"
                  style={{ borderColor: currentTheme.surfaceBorder }}
                >
                  <option value="production">Production</option>
                  <option value="staging">Staging</option>
                  <option value="development">Development</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t" style={{ borderColor: currentTheme.surfaceBorder }}>
              <button
                type="button"
                onClick={() => setShowRegisterModal(false)}
                className="px-3.5 py-2 rounded-xl border text-xs text-slate-300 hover:bg-white/5"
                style={{ borderColor: currentTheme.surfaceBorder }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 transition-all hover:opacity-90 shadow-md"
                style={{ backgroundColor: currentTheme.primary }}
              >
                Register Agent
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
