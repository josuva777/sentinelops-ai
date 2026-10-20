'use client';

import React, { useState } from 'react';
import { Settings, Key, Shield, Users, Plus, Trash2, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
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
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Organization & Security Settings</h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage API authentication keys, role-based access controls, and retention parameters.
        </p>
      </div>

      {/* API Key Management */}
      <div className="rounded-xl border border-surface-border bg-surface p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Key className="h-4 w-4 text-brand-cyan" />
              <h2 className="text-sm font-bold text-white">Integration API Keys</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Keys used by the SentinelOps Python SDK to authenticate agent tool interception calls.
            </p>
          </div>

          <button
            onClick={() => setShowKeyModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-cyan text-xs font-semibold text-slate-950 hover:bg-cyan-400"
          >
            <Plus className="h-4 w-4" />
            <span>Generate New Key</span>
          </button>
        </div>

        <div className="divide-y divide-surface-border">
          {apiKeys.map((k) => (
            <div key={k.id} className="py-3 flex items-center justify-between font-mono text-xs">
              <div>
                <div className="text-white font-medium">{k.name}</div>
                <div className="text-slate-500 text-[11px] mt-0.5">Prefix: {k.prefix} | Created: {k.created}</div>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded bg-status-success/20 text-status-success text-[10px] font-bold">
                  {k.status}
                </span>
                <button
                  onClick={() => handleRevoke(k.id)}
                  className="p-1.5 text-slate-400 hover:text-status-critical"
                  title="Revoke key"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RBAC Member Matrix */}
      <div className="rounded-xl border border-surface-border bg-surface p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-surface-border pb-4">
          <Users className="h-4 w-4 text-brand-violet" />
          <h2 className="text-sm font-bold text-white">Role-Based Access Control (RBAC)</h2>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-3 rounded-lg bg-surface-subtle border border-surface-border flex items-center justify-between">
            <div>
              <div className="text-white font-semibold">Elena Rostova</div>
              <div className="text-slate-400 text-[11px]">elena@apexcapital.io</div>
            </div>
            <span className="px-2 py-0.5 rounded bg-brand-violet/20 text-brand-violet text-[10px] font-mono font-bold">
              SECURITY_ADMINISTRATOR
            </span>
          </div>

          <div className="p-3 rounded-lg bg-surface-subtle border border-surface-border flex items-center justify-between">
            <div>
              <div className="text-white font-semibold">Marcus Vance</div>
              <div className="text-slate-400 text-[11px]">marcus@apexcapital.io</div>
            </div>
            <span className="px-2 py-0.5 rounded bg-brand-cyan/20 text-brand-cyan text-[10px] font-mono font-bold">
              APPROVER
            </span>
          </div>

          <div className="p-3 rounded-lg bg-surface-subtle border border-surface-border flex items-center justify-between">
            <div>
              <div className="text-white font-semibold">David K. (Auditing)</div>
              <div className="text-slate-400 text-[11px]">david.audit@external.com</div>
            </div>
            <span className="px-2 py-0.5 rounded bg-surface-border text-slate-300 text-[10px] font-mono font-bold">
              READ_ONLY_AUDITOR
            </span>
          </div>
        </div>
      </div>

      {/* Key Generation Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <form onSubmit={handleCreateKey} className="w-full max-w-md rounded-2xl border border-surface-border bg-surface p-6 space-y-4">
            <h3 className="text-sm font-bold text-white">Create Integration API Key</h3>
            <input
              type="text"
              required
              placeholder="Key label (e.g. Scraper Production Ingestion)"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              className="w-full rounded-lg border border-surface-border bg-surface-subtle px-3.5 py-2 text-xs text-white focus:border-brand-cyan focus:outline-none"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowKeyModal(false)}
                className="px-3 py-1.5 rounded-lg border border-surface-border text-xs text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-brand-cyan text-xs font-semibold text-slate-950 hover:bg-cyan-400"
              >
                Generate
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
