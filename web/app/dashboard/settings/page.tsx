'use client';

import React, { useState } from 'react';
import { useTheme } from '../../../lib/themeContext';
import { Settings, Key, Shield, Users, Plus, Trash2, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
  const { currentTheme } = useTheme();
  const [apiKeys, setApiKeys] = useState([
    { id: 'key_01', name: 'Production Agent Cluster Key', prefix: 'sn_live_9f8a...', created: '2026-10-01', status: 'Active' },
    { id: 'key_02', name: 'Staging CI/CD Ingestion Key', prefix: 'sn_stag_77e1...', created: '2026-10-15', status: 'Active' },
  ]);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');

  const handleCreateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    const newK = {
      id: `key_${Date.now()}`,
      name: newKeyName.trim(),
      prefix: `sn_live_${Math.random().toString(36).substring(2, 6)}...`,
      created: 'Today',
      status: 'Active',
    };

    setApiKeys([...apiKeys, newK]);
    setNewKeyName('');
    setShowKeyModal(false);
  };

  const handleRevoke = (id: string) => {
    setApiKeys(apiKeys.filter((k) => k.id !== id));
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b" style={{ borderColor: currentTheme.surfaceBorder }}>
        <h1 className="text-2xl font-bold text-white tracking-tight">Organization & Security Settings</h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage API authentication keys, role-based access controls, and retention parameters.
        </p>
      </div>

      {/* API Key Management */}
      <div
        className="rounded-2xl border p-6 space-y-6 shadow-xl"
        style={{
          backgroundColor: currentTheme.surface,
          borderColor: currentTheme.surfaceBorder,
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4" style={{ borderColor: currentTheme.surfaceBorder }}>
          <div>
            <div className="flex items-center gap-2">
              <Key className="h-4 w-4" style={{ color: currentTheme.primary }} />
              <h2 className="text-sm font-bold text-white">Integration API Keys</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Keys used by the SentinelOps Python SDK to authenticate agent tool interception calls.
            </p>
          </div>

          <button
            onClick={() => setShowKeyModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-950 transition-all hover:opacity-90 shadow-md"
            style={{ backgroundColor: currentTheme.primary }}
          >
            <Plus className="h-4 w-4" />
            <span>Generate New Key</span>
          </button>
        </div>

        <div className="space-y-3 font-mono text-xs">
          {apiKeys.map((k) => (
            <div
              key={k.id}
              className="flex items-center justify-between p-3.5 rounded-xl border transition-colors hover:bg-white/[0.02]"
              style={{
                borderColor: currentTheme.surfaceBorder,
                backgroundColor: 'rgba(0,0,0,0.25)',
              }}
            >
              <div>
                <div className="font-sans font-semibold text-white text-xs">{k.name}</div>
                <div className="text-slate-400 text-[11px] mt-0.5">{k.prefix}</div>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-bold border"
                  style={{
                    backgroundColor: currentTheme.badgeBg,
                    borderColor: currentTheme.surfaceBorder,
                    color: currentTheme.badgeText,
                  }}
                >
                  {k.status}
                </span>
                <span className="text-slate-500 text-[11px]">{k.created}</span>
                <button
                  onClick={() => handleRevoke(k.id)}
                  className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors"
                  title="Revoke Key"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RBAC Member Matrix */}
      <div
        className="rounded-2xl border p-6 space-y-4 shadow-xl"
        style={{
          backgroundColor: currentTheme.surface,
          borderColor: currentTheme.surfaceBorder,
        }}
      >
        <div className="flex items-center gap-2 border-b pb-4" style={{ borderColor: currentTheme.surfaceBorder }}>
          <Users className="h-4 w-4" style={{ color: currentTheme.primary }} />
          <h2 className="text-sm font-bold text-white">Role-Based Access Control (RBAC)</h2>
        </div>

        <div className="space-y-3 text-xs">
          <div
            className="p-3.5 rounded-xl border flex items-center justify-between"
            style={{
              borderColor: currentTheme.surfaceBorder,
              backgroundColor: 'rgba(0,0,0,0.25)',
            }}
          >
            <div>
              <div className="text-white font-semibold">Elena Rostova</div>
              <div className="text-slate-400 text-[11px]">elena@apexcapital.io</div>
            </div>
            <span
              className="px-2 py-0.5 rounded text-[10px] font-mono font-bold border"
              style={{
                backgroundColor: currentTheme.badgeBg,
                borderColor: currentTheme.surfaceBorder,
                color: currentTheme.badgeText,
              }}
            >
              SECURITY_ADMINISTRATOR
            </span>
          </div>

          <div
            className="p-3.5 rounded-xl border flex items-center justify-between"
            style={{
              borderColor: currentTheme.surfaceBorder,
              backgroundColor: 'rgba(0,0,0,0.25)',
            }}
          >
            <div>
              <div className="text-white font-semibold">Marcus Vance</div>
              <div className="text-slate-400 text-[11px]">marcus@apexcapital.io</div>
            </div>
            <span
              className="px-2 py-0.5 rounded text-[10px] font-mono font-bold border"
              style={{
                backgroundColor: currentTheme.badgeBg,
                borderColor: currentTheme.surfaceBorder,
                color: currentTheme.badgeText,
              }}
            >
              APPROVER
            </span>
          </div>

          <div
            className="p-3.5 rounded-xl border flex items-center justify-between"
            style={{
              borderColor: currentTheme.surfaceBorder,
              backgroundColor: 'rgba(0,0,0,0.25)',
            }}
          >
            <div>
              <div className="text-white font-semibold">David K. (Auditing)</div>
              <div className="text-slate-400 text-[11px]">david.audit@external.com</div>
            </div>
            <span
              className="px-2 py-0.5 rounded border text-slate-300 text-[10px] font-mono font-bold"
              style={{ borderColor: currentTheme.surfaceBorder }}
            >
              READ_ONLY_AUDITOR
            </span>
          </div>
        </div>
      </div>

      {/* Key Generation Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <form
            onSubmit={handleCreateKey}
            className="w-full max-w-md rounded-2xl border p-6 space-y-4 shadow-2xl"
            style={{
              backgroundColor: currentTheme.surface,
              borderColor: currentTheme.surfaceBorder,
            }}
          >
            <h3 className="text-sm font-bold text-white">Create Integration API Key</h3>
            <input
              type="text"
              required
              placeholder="Key label (e.g. Production Ingestion Key)"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              className="w-full rounded-xl border bg-black/40 px-3.5 py-2.5 text-xs text-white focus:outline-none"
              style={{ borderColor: currentTheme.surfaceBorder }}
            />
            <div className="flex justify-end gap-2 pt-2 border-t" style={{ borderColor: currentTheme.surfaceBorder }}>
              <button
                type="button"
                onClick={() => setShowKeyModal(false)}
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
                Generate Key
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
