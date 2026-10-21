'use client';

import React, { useState } from 'react';
import { useTheme } from '../../../lib/themeContext';
import {
  ShieldAlert,
  Key,
  Users,
  Server,
  Lock,
  RefreshCw,
  Trash2,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Fingerprint,
  Cpu,
  Layers,
  FileText,
} from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Security Architect' | 'Compliance Auditor' | 'Read-Only Operator';
  status: 'active' | 'suspended';
  lastActive: string;
}

interface ApiKeyItem {
  id: string;
  name: string;
  prefix: string;
  scope: string;
  createdAt: string;
  status: 'active' | 'revoked';
}

const INITIAL_MEMBERS: TeamMember[] = [
  { id: 'usr_01', name: 'Alex Rivera', email: 'alex.rivera@enterprise.corp', role: 'Super Admin', status: 'active', lastActive: '2 minutes ago' },
  { id: 'usr_02', name: 'Siddharth Patel', email: 'siddharth@enterprise.corp', role: 'Security Architect', status: 'active', lastActive: '18 minutes ago' },
  { id: 'usr_03', name: 'Elena Rostova', email: 'elena.audit@enterprise.corp', role: 'Compliance Auditor', status: 'active', lastActive: '1 hour ago' },
  { id: 'usr_04', name: 'Marcus Chen', email: 'marcus.ops@enterprise.corp', role: 'Read-Only Operator', status: 'active', lastActive: 'Yesterday' },
];

const INITIAL_KEYS: ApiKeyItem[] = [
  { id: 'key_prod_01', name: 'Production Gateway Master Key', prefix: 'sn_live_8f3a...', scope: 'events:evaluate, approvals:write', createdAt: '2026-09-12', status: 'active' },
  { id: 'key_stag_02', name: 'Staging CI/CD Ingestion Key', prefix: 'sn_stag_4c1e...', scope: 'events:evaluate', createdAt: '2026-10-01', status: 'active' },
  { id: 'key_audit_03', name: 'External Auditor Read-Only Key', prefix: 'sn_audit_99bb...', scope: 'audit:verify, audit:read', createdAt: '2026-10-14', status: 'active' },
];

export default function AdminPage() {
  const { currentTheme } = useTheme();
  const [killSwitchActive, setKillSwitchActive] = useState<boolean>(false);
  const [members, setMembers] = useState<TeamMember[]>(INITIAL_MEMBERS);
  const [keys, setKeys] = useState<ApiKeyItem[]>(INITIAL_KEYS);
  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);
  const [newKeyName, setNewKeyName] = useState<string>('');
  const [newKeyScope, setNewKeyScope] = useState<string>('events:evaluate, approvals:write');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const toggleKillSwitch = () => {
    const next = !killSwitchActive;
    setKillSwitchActive(next);
    setActionSuccess(next ? 'EMERGENCY LOCKDOWN ACTIVATED: All agent tool calls are halted immediately!' : 'Normal enforcement mode restored.');
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const handleGenerateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName) return;
    const rand = Math.random().toString(36).substring(2, 7);
    const newKey: ApiKeyItem = {
      id: `key_${rand}`,
      name: newKeyName,
      prefix: `sn_live_${rand}...`,
      scope: newKeyScope,
      createdAt: 'Just now',
      status: 'active',
    };
    setKeys([newKey, ...keys]);
    setNewKeyName('');
    setShowKeyModal(false);
    setActionSuccess(`Master Key '${newKey.name}' generated successfully.`);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  const handleRevokeKey = (keyId: string) => {
    setKeys(keys.map(k => k.id === keyId ? { ...k, status: 'revoked' } : k));
    setActionSuccess('Master Ingestion Key revoked immediately.');
    setTimeout(() => setActionSuccess(null), 4000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b" style={{ borderColor: currentTheme.surfaceBorder }}>
        <div>
          <div className="flex items-center gap-2">
            <span
              className="text-[10px] font-mono px-2 py-0.5 rounded font-bold border uppercase"
              style={{
                backgroundColor: currentTheme.badgeBg,
                borderColor: currentTheme.surfaceBorder,
                color: currentTheme.badgeText,
              }}
            >
              Enterprise Admin Center
            </span>
            <span className="text-xs font-mono text-slate-500">Tenant: org_ent_9821</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Platform Administration & Fleet Controls
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Super-admin settings, fleet kill-switch, cryptographic token management, and role-based access control.
          </p>
        </div>

        <button
          onClick={() => setShowKeyModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-slate-950 transition-all hover:opacity-90 shadow-lg self-start sm:self-center"
          style={{
            backgroundColor: currentTheme.primary,
            boxShadow: `0 0 20px -4px ${currentTheme.glow}`,
          }}
        >
          <Plus className="w-4 h-4" />
          <span>Issue Master Key</span>
        </button>
      </div>

      {/* Success Notification Alert */}
      {actionSuccess && (
        <div
          className="p-4 rounded-xl border flex items-center justify-between font-mono text-xs shadow-lg animate-in fade-in slide-in-from-top-2"
          style={{
            borderColor: killSwitchActive ? '#f43f5e' : currentTheme.primary,
            backgroundColor: killSwitchActive ? 'rgba(244, 63, 94, 0.15)' : currentTheme.badgeBg,
            color: '#ffffff',
          }}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" style={{ color: killSwitchActive ? '#f43f5e' : currentTheme.primary }} />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* EMERGENCY FLEET KILL-SWITCH HERO BANNER */}
      <div
        className="rounded-2xl border p-6 transition-all duration-300 shadow-2xl relative overflow-hidden"
        style={{
          borderColor: killSwitchActive ? '#f43f5e' : currentTheme.surfaceBorder,
          backgroundColor: currentTheme.surface,
          boxShadow: killSwitchActive
            ? '0 0 40px -5px rgba(244, 63, 94, 0.35)'
            : `0 15px 30px -10px rgba(0,0,0,0.5)`,
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center border shrink-0 transition-colors"
              style={{
                backgroundColor: killSwitchActive ? 'rgba(244, 63, 94, 0.2)' : currentTheme.badgeBg,
                borderColor: killSwitchActive ? '#f43f5e' : currentTheme.surfaceBorder,
                color: killSwitchActive ? '#f43f5e' : currentTheme.primary,
              }}
            >
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Global Autonomous Fleet Kill-Switch</h3>
                <span
                  className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border"
                  style={{
                    backgroundColor: killSwitchActive ? 'rgba(244, 63, 94, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                    color: killSwitchActive ? '#f43f5e' : '#10b981',
                    borderColor: killSwitchActive ? 'rgba(244, 63, 94, 0.4)' : 'rgba(16, 185, 129, 0.4)',
                  }}
                >
                  {killSwitchActive ? 'LOCKDOWN ACTIVE' : 'SYSTEM ARMED & ENFORCING'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Emergency override: activating this switch instructs all SentinelOps gateway nodes to immediately return 
                <strong className="text-rose-400"> DENY</strong> for all inbound tool execution requests across all environments.
              </p>
            </div>
          </div>

          <button
            onClick={toggleKillSwitch}
            className={`px-6 py-3 rounded-xl font-mono text-xs font-bold transition-all duration-300 border shadow-lg shrink-0 ${
              killSwitchActive
                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 border-emerald-400'
                : 'bg-rose-600 hover:bg-rose-500 text-white border-rose-500'
            }`}
          >
            {killSwitchActive ? 'RESTORE NORMAL TRAFFIC' : 'TRIGGER EMERGENCY LOCKDOWN'}
          </button>
        </div>
      </div>

      {/* TWO COLUMN GRID: API KEYS & GATEWAY TELEMETRY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Master API Keys Management (2 cols) */}
        <div
          className="lg:col-span-2 rounded-2xl border p-6 shadow-xl"
          style={{
            backgroundColor: currentTheme.surface,
            borderColor: currentTheme.surfaceBorder,
          }}
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <Key className="w-5 h-5" style={{ color: currentTheme.primary }} />
              <div>
                <h3 className="text-sm font-bold text-white">Master Ingestion API Keys</h3>
                <p className="text-[11px] text-slate-400">HMAC-SHA256 authenticated gateway ingress credentials</p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-slate-500">{keys.filter(k => k.status === 'active').length} Active</span>
          </div>

          <div className="space-y-3">
            {keys.map((k) => (
              <div
                key={k.id}
                className="p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-black/20"
                style={{ borderColor: currentTheme.surfaceBorder }}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{k.name}</span>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase ${
                        k.status === 'active' ? 'text-emerald-400 border-emerald-500/30' : 'text-rose-400 border-rose-500/30'
                      }`}
                    >
                      {k.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5 text-[11px] font-mono text-slate-400">
                    <span className="text-slate-300 font-semibold">{k.prefix}</span>
                    <span>•</span>
                    <span>Scope: {k.scope}</span>
                    <span>•</span>
                    <span>Issued: {k.createdAt}</span>
                  </div>
                </div>

                {k.status === 'active' && (
                  <button
                    onClick={() => handleRevokeKey(k.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-mono text-rose-400 hover:bg-rose-500/10 border-rose-500/30 transition-colors self-end sm:self-center"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Revoke</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Node Infrastructure Health (1 col) */}
        <div
          className="rounded-2xl border p-6 shadow-xl flex flex-col justify-between"
          style={{
            backgroundColor: currentTheme.surface,
            borderColor: currentTheme.surfaceBorder,
          }}
        >
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Server className="w-5 h-5" style={{ color: currentTheme.primary }} />
              <h3 className="text-sm font-bold text-white">Gateway Ingestion Nodes</h3>
            </div>
            <p className="text-xs text-slate-400 mb-5 leading-relaxed">
              Global deterministic evaluation nodes maintaining zero-latency fail-closed state machines.
            </p>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-xl border bg-black/25 flex items-center justify-between" style={{ borderColor: currentTheme.surfaceBorder }}>
                <div>
                  <div className="font-bold text-white text-[11px]">node-us-east-virginia</div>
                  <div className="text-[10px] text-slate-400">Primary Gateway</div>
                </div>
                <div className="text-right">
                  <span className="text-emerald-400 text-[10px] font-bold">ONLINE</span>
                  <div className="text-[10px] text-slate-400 mt-0.5">8.4ms avg</div>
                </div>
              </div>

              <div className="p-3 rounded-xl border bg-black/25 flex items-center justify-between" style={{ borderColor: currentTheme.surfaceBorder }}>
                <div>
                  <div className="font-bold text-white text-[11px]">node-eu-west-frankfurt</div>
                  <div className="text-[10px] text-slate-400">Failover Cluster</div>
                </div>
                <div className="text-right">
                  <span className="text-emerald-400 text-[10px] font-bold">ONLINE</span>
                  <div className="text-[10px] text-slate-400 mt-0.5">11.1ms avg</div>
                </div>
              </div>

              <div className="p-3 rounded-xl border bg-black/25 flex items-center justify-between" style={{ borderColor: currentTheme.surfaceBorder }}>
                <div>
                  <div className="font-bold text-white text-[11px]">node-ap-southeast-singapore</div>
                  <div className="text-[10px] text-slate-400">Regional Gateway</div>
                </div>
                <div className="text-right">
                  <span className="text-emerald-400 text-[10px] font-bold">ONLINE</span>
                  <div className="text-[10px] text-slate-400 mt-0.5">9.6ms avg</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t flex items-center justify-between text-xs font-mono text-slate-400" style={{ borderColor: currentTheme.surfaceBorder }}>
            <span>Block Chaining Height</span>
            <span className="font-bold text-white">#1,842 sealed</span>
          </div>
        </div>
      </div>

      {/* TEAM DIRECTORY & RBAC MATRIX */}
      <div
        className="rounded-2xl border p-6 shadow-xl"
        style={{
          backgroundColor: currentTheme.surface,
          borderColor: currentTheme.surfaceBorder,
        }}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <Users className="w-5 h-5" style={{ color: currentTheme.primary }} />
            <div>
              <h3 className="text-sm font-bold text-white">Organization Access & Role Matrix</h3>
              <p className="text-[11px] text-slate-400">Server-enforced access controls across security roles</p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-slate-500">{members.length} Members</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b text-slate-400 text-[11px]" style={{ borderColor: currentTheme.surfaceBorder }}>
                <th className="pb-3 font-semibold">User</th>
                <th className="pb-3 font-semibold">Role</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Last Active</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {members.map((m) => (
                <tr key={m.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5">
                    <div className="font-bold text-white">{m.name}</div>
                    <div className="text-[11px] text-slate-400">{m.email}</div>
                  </td>
                  <td className="py-3.5">
                    <span
                      className="px-2 py-0.5 rounded text-[10px] font-bold border"
                      style={{
                        backgroundColor: currentTheme.badgeBg,
                        borderColor: currentTheme.surfaceBorder,
                        color: currentTheme.accent,
                      }}
                    >
                      {m.role}
                    </span>
                  </td>
                  <td className="py-3.5">
                    <span className="inline-flex items-center gap-1.5 text-emerald-400 text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Active
                    </span>
                  </td>
                  <td className="py-3.5 text-slate-400">{m.lastActive}</td>
                  <td className="py-3.5 text-right">
                    <button className="text-[11px] text-slate-400 hover:text-white transition-colors">
                      Edit Role
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ISSUE KEY MODAL */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div
            className="w-full max-w-md rounded-2xl border p-6 shadow-2xl space-y-4"
            style={{
              backgroundColor: currentTheme.surface,
              borderColor: currentTheme.surfaceBorder,
              boxShadow: `0 25px 50px -12px rgba(0,0,0,0.9), 0 0 30px -5px ${currentTheme.glow}`,
            }}
          >
            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: currentTheme.surfaceBorder }}>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Key className="w-4 h-4" style={{ color: currentTheme.primary }} />
                <span>Issue Master Ingestion Key</span>
              </h3>
              <button onClick={() => setShowKeyModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleGenerateKey} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Key Label / Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AWS Lambda Worker Key"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border text-white focus:outline-none"
                  style={{ borderColor: currentTheme.surfaceBorder }}
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Permission Scope</label>
                <select
                  value={newKeyScope}
                  onChange={(e) => setNewKeyScope(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-black/40 border text-white focus:outline-none"
                  style={{ borderColor: currentTheme.surfaceBorder }}
                >
                  <option value="events:evaluate, approvals:write">Full Agent Ingress (events:evaluate, approvals:write)</option>
                  <option value="events:evaluate">Evaluation Only (events:evaluate)</option>
                  <option value="audit:read, audit:verify">Compliance Auditor (audit:read, audit:verify)</option>
                </select>
              </div>

              <div className="pt-3 border-t flex justify-end gap-3" style={{ borderColor: currentTheme.surfaceBorder }}>
                <button
                  type="button"
                  onClick={() => setShowKeyModal(false)}
                  className="px-4 py-2 rounded-lg border text-slate-300 hover:bg-white/5 transition-colors"
                  style={{ borderColor: currentTheme.surfaceBorder }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg font-bold text-slate-950 transition-all hover:opacity-90 shadow-lg"
                  style={{ backgroundColor: currentTheme.primary }}
                >
                  Create Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

