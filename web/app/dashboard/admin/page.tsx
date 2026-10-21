'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTheme } from '../../../lib/themeContext';
import { useAuth, UserSession } from '../../../lib/authContext';
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
  UserX,
  ShieldCheck,
  AlertOctagon,
  ArrowRight,
  Shield,
} from 'lucide-react';

interface ApiKeyItem {
  id: string;
  name: string;
  prefix: string;
  scope: string;
  createdAt: string;
  status: 'active' | 'revoked';
}

const INITIAL_KEYS: ApiKeyItem[] = [
  { id: 'key_prod_01', name: 'Production Gateway Master Key', prefix: 'sn_live_8f3a...', scope: 'events:evaluate, approvals:write', createdAt: '2026-09-12', status: 'active' },
  { id: 'key_stag_02', name: 'Staging CI/CD Ingestion Key', prefix: 'sn_stag_4c1e...', scope: 'events:evaluate', createdAt: '2026-10-01', status: 'active' },
  { id: 'key_audit_03', name: 'External Auditor Read-Only Key', prefix: 'sn_audit_99bb...', scope: 'audit:verify, audit:read', createdAt: '2026-10-14', status: 'active' },
];

export default function AdminPage() {
  const { currentTheme } = useTheme();
  const { currentUser, allUsers, suspendUser, reactivateUser, switchRole } = useAuth();

  const [killSwitchActive, setKillSwitchActive] = useState<boolean>(false);
  const [keys, setKeys] = useState<ApiKeyItem[]>(INITIAL_KEYS);
  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);
  const [newKeyName, setNewKeyName] = useState<string>('');
  const [newKeyScope, setNewKeyScope] = useState<string>('events:evaluate, approvals:write');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // RBAC GUARD: Only SUPER_ADMIN can view the Operations Center
  if (currentUser.role !== 'SUPER_ADMIN') {
    return (
      <div
        className="max-w-2xl mx-auto my-16 p-8 rounded-3xl border shadow-2xl text-center space-y-6"
        style={{
          backgroundColor: currentTheme.surface,
          borderColor: currentTheme.surfaceBorder,
          boxShadow: `0 25px 60px -12px rgba(0,0,0,0.95), 0 0 35px -5px ${currentTheme.glow}`,
        }}
      >
        <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center border text-rose-500 border-rose-500/30 bg-rose-500/10 shadow-lg">
          <Lock className="w-8 h-8" />
        </div>
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded border border-rose-500/40 text-rose-400 bg-rose-500/10 font-bold">
            HTTP 403 — Privileged Operations Center Restricted
          </span>
          <h2 className="text-2xl font-black text-white mt-3">Enterprise Admin Authorization Required</h2>
          <p className="text-xs text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
            The Administration Center controls fleet kill-switches, master HMAC tokens, and account governance.
            Your current session profile is <strong className="text-white font-mono">{currentUser.role}</strong> ({currentUser.email}).
          </p>
        </div>

        <div className="p-4 rounded-xl border border-white/5 bg-black/40 text-left text-xs font-mono space-y-1.5 text-slate-400">
          <div>• Workspace Organization: <strong className="text-white">{currentUser.company}</strong></div>
          <div>• Assigned Role: <strong className="text-amber-400">{currentUser.role}</strong></div>
          <div>• Anti-Hijacking Policy: <strong className="text-emerald-400">Hardware Session Token Bound</strong></div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => switchRole('SUPER_ADMIN')}
            className="px-5 py-2.5 rounded-xl font-mono text-xs font-bold text-slate-950 transition-all hover:opacity-90 shadow-lg"
            style={{ backgroundColor: currentTheme.primary }}
          >
            Elevate to Super Admin (Demo Mode)
          </button>
          <Link
            href="/dashboard"
            className="px-5 py-2.5 rounded-xl border font-mono text-xs text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
            style={{ borderColor: currentTheme.surfaceBorder }}
          >
            Return to Overview
          </Link>
        </div>
      </div>
    );
  }

  const toggleKillSwitch = () => {
    const next = !killSwitchActive;
    setKillSwitchActive(next);
    setActionSuccess(
      next
        ? 'EMERGENCY LOCKDOWN ACTIVATED: All agent tool calls are halted immediately!'
        : 'Normal enforcement mode restored.'
    );
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
    setKeys(keys.map((k) => (k.id === keyId ? { ...k, status: 'revoked' } : k)));
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
            <span className="text-xs font-mono text-slate-500">Tenant: {currentUser.company}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Platform Administration & Fleet Controls
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Super-admin operations, fleet kill-switch, session governance, and cryptographic HMAC token management.
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
          className="p-4 rounded-xl border flex items-center justify-between font-mono text-xs shadow-lg animate-in fade-in"
          style={{
            borderColor: killSwitchActive ? '#f43f5e' : currentTheme.primary,
            backgroundColor: killSwitchActive ? 'rgba(244, 63, 94, 0.15)' : currentTheme.badgeBg,
            color: killSwitchActive ? '#f43f5e' : currentTheme.badgeText,
          }}
        >
          <div className="flex items-center gap-2.5">
            {killSwitchActive ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* EMERGENCY FLEET KILL-SWITCH HERO PANEL */}
      <div
        className={`rounded-2xl border-2 p-6 sm:p-8 transition-all duration-300 shadow-2xl relative overflow-hidden ${
          killSwitchActive
            ? 'border-rose-500 bg-rose-950/20 shadow-rose-900/30'
            : 'border-white/10 bg-black/40'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <ShieldAlert className={`w-5 h-5 ${killSwitchActive ? 'text-rose-500 animate-pulse' : 'text-slate-400'}`} />
              <span className={`text-xs font-mono font-bold tracking-wider uppercase ${killSwitchActive ? 'text-rose-400' : 'text-slate-400'}`}>
                Emergency Operations Control
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Global Autonomous Fleet Kill-Switch
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Instantly terminates all inbound tool invocations across all 4 monitored agents. When active, every pre-flight gate returns <strong className="text-rose-400 font-mono">DENY (FAIL-CLOSED LOCKDOWN)</strong> within sub-1ms, severing unauthorized DB/API mutations.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              onClick={toggleKillSwitch}
              className={`w-full sm:w-auto px-6 py-3.5 rounded-xl font-mono text-xs font-black tracking-wider transition-all duration-200 shadow-xl flex items-center justify-center gap-2.5 ${
                killSwitchActive
                  ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-emerald-500/20'
                  : 'bg-rose-600 text-white hover:bg-rose-500 shadow-rose-600/30'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>{killSwitchActive ? 'RESTORE NORMAL TRAFFIC' : 'TRIGGER EMERGENCY LOCKDOWN'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* USER & SESSION GOVERNANCE DIRECTORY (ANTI-HIJACKING) */}
      <div
        className="rounded-2xl border p-6 shadow-xl"
        style={{
          backgroundColor: currentTheme.surface,
          borderColor: currentTheme.surfaceBorder,
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
          <div className="flex items-center gap-2.5">
            <Users className="w-5 h-5" style={{ color: currentTheme.primary }} />
            <div>
              <h3 className="text-sm font-bold text-white">Active User Sessions & Anti-Hijacking Governance</h3>
              <p className="text-[11px] text-slate-400">Monitor active sessions, terminate compromised accounts, and enforce hardware tokens</p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-slate-500">{allUsers.length} Registered Accounts</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b text-slate-400 text-[11px]" style={{ borderColor: currentTheme.surfaceBorder }}>
                <th className="pb-3 font-semibold">User & Organization</th>
                <th className="pb-3 font-semibold">Role Profile</th>
                <th className="pb-3 font-semibold">Plan Tier</th>
                <th className="pb-3 font-semibold">Device & IP Location</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Session Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {allUsers.map((u) => {
                const isCurrent = u.id === currentUser.id;
                return (
                  <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5">
                      <div className="font-bold text-white flex items-center gap-2">
                        <span>{u.name}</span>
                        {isCurrent && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/10 text-slate-300 font-sans">
                            You
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400">{u.email}</div>
                      <div className="text-[10px] text-slate-500">{u.company}</div>
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
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5">
                      <span className="font-bold text-slate-200">
                        {u.tier === 'FREE' ? 'Starter (Free)' : u.tier === 'TEAM' ? '★ SecOps Team' : '🛡️ Enterprise'}
                      </span>
                      <div className="text-[10px] text-slate-500">
                        {u.toolCallsUsed.toLocaleString()} / {u.toolCallsLimit.toLocaleString()} calls
                      </div>
                    </td>
                    <td className="py-3.5 text-slate-400 max-w-xs truncate">
                      <div className="text-white text-[11px]">{u.ipAddress}</div>
                      <div className="text-[10px] text-slate-500 truncate">{u.device}</div>
                    </td>
                    <td className="py-3.5">
                      {u.isSuspended ? (
                        <span className="inline-flex items-center gap-1.5 text-rose-400 text-[11px] font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          Suspended (Locked)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-emerald-400 text-[11px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Active
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 text-right space-x-2">
                      {u.isSuspended ? (
                        <button
                          onClick={() => {
                            reactivateUser(u.id);
                            setActionSuccess(`Account '${u.email}' reactivated successfully.`);
                          }}
                          className="text-[11px] text-emerald-400 hover:underline font-bold"
                        >
                          Reactivate
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            suspendUser(u.id);
                            setActionSuccess(`Account '${u.email}' suspended immediately. All session tokens revoked.`);
                          }}
                          className="text-[11px] text-rose-400 hover:text-rose-300 hover:underline"
                        >
                          Terminate / Suspend
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MASTER KEYS DIRECTORY */}
      <div
        className="rounded-2xl border p-6 shadow-xl"
        style={{
          backgroundColor: currentTheme.surface,
          borderColor: currentTheme.surfaceBorder,
        }}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <Key className="w-5 h-5" style={{ color: currentTheme.primary }} />
            <div>
              <h3 className="text-sm font-bold text-white">Cryptographic Ingestion & Gateway Keys</h3>
              <p className="text-[11px] text-slate-400">SHA-256 HMAC master credentials for in-line runtime authorization</p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-slate-500">{keys.length} Active Keys</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b text-slate-400 text-[11px]" style={{ borderColor: currentTheme.surfaceBorder }}>
                <th className="pb-3 font-semibold">Label & Prefix</th>
                <th className="pb-3 font-semibold">Scope</th>
                <th className="pb-3 font-semibold">Created</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {keys.map((k) => (
                <tr key={k.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5">
                    <div className="font-bold text-white">{k.name}</div>
                    <div className="text-[11px] text-slate-400">{k.prefix}</div>
                  </td>
                  <td className="py-3.5 text-slate-300">{k.scope}</td>
                  <td className="py-3.5 text-slate-400">{k.createdAt}</td>
                  <td className="py-3.5">
                    {k.status === 'active' ? (
                      <span className="inline-flex items-center gap-1.5 text-emerald-400 text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-slate-500 text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                        Revoked
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 text-right">
                    {k.status === 'active' && (
                      <button
                        onClick={() => handleRevokeKey(k.id)}
                        className="text-[11px] text-rose-400 hover:text-rose-300 transition-colors"
                      >
                        Revoke
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ISSUE KEY MODAL */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div
            className="w-full max-w-md rounded-2xl border p-6 shadow-2xl space-y-4"
            style={{
              backgroundColor: currentTheme.surface,
              borderColor: currentTheme.surfaceBorder,
              boxShadow: `0 25px 50px -12px rgba(0,0,0,0.95), 0 0 30px -5px ${currentTheme.glow}`,
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
