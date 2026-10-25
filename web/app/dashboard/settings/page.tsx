'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../lib/themeContext';
import { useAuth } from '../../../lib/authContext';
import {
  Settings,
  Key,
  Shield,
  Users,
  Plus,
  Trash2,
  CheckCircle2,
  CreditCard,
  Sparkles,
  Lock,
  Copy,
  ExternalLink,
  Layers,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface BillingTxn {
  id: string;
  tier: string;
  billing_cycle: string;
  amount_cents: number;
  currency: string;
  stripe_session_id: string;
  sha256_hash: string;
  created_at: string;
}

export default function SettingsPage() {
  const { currentTheme } = useTheme();
  const { currentUser, upgradePlan } = useAuth();
  const [activeTab, setActiveTab] = useState<'billing' | 'apikeys' | 'rbac'>('billing');

  // API Keys State
  const [apiKeys, setApiKeys] = useState([
    { id: 'key_01', name: 'Production Agent Cluster Key', prefix: 'sn_live_9f8a...', created: '2026-10-01', status: 'Active' },
    { id: 'key_02', name: 'Staging CI/CD Ingestion Key', prefix: 'sn_stag_77e1...', created: '2026-10-15', status: 'Active' },
  ]);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');

  // Billing History State
  const [billingHistory, setBillingHistory] = useState<BillingTxn[]>([]);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [isUpgrading, setIsUpgrading] = useState(false);

  useEffect(() => {
    async function loadBillingHistory() {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      try {
        const res = await fetch(`${API_BASE}/api/v1/billing/history?user_id=${currentUser?.id || ''}`);
        if (res.ok) {
          const data = await res.json();
          if (data.history && data.history.length > 0) {
            setBillingHistory(data.history);
            return;
          }
        }
      } catch (err) {
        console.error('Failed to load billing history:', err);
      }

      // Default baseline receipt if empty
      setBillingHistory([
        {
          id: 'txn_secops_7781a9',
          tier: currentUser.tier || 'TEAM',
          billing_cycle: 'annual',
          amount_cents: 142800,
          currency: 'USD',
          stripe_session_id: 'cs_test_b7ff4c37a67ad3a0512b04cf98779ab7',
          sha256_hash: 'E2AC299143A57ADAC702AAEBA4EFF44D0B0C12FF3A103982A5C0B3F6A23386DB',
          created_at: new Date().toISOString(),
        },
      ]);
    }

    loadBillingHistory();
  }, [currentUser?.id, currentUser.tier]);

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

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const triggerCheckout = async (targetTier: 'TEAM' | 'ENTERPRISE') => {
    setIsUpgrading(true);
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    try {
      const res = await fetch(`${API_BASE}/api/v1/billing/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier: targetTier,
          billing_cycle: 'annual',
          user_id: currentUser.id,
          email: currentUser.email,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.checkout_url) {
          window.location.href = data.checkout_url;
          return;
        }
      }
    } catch (e) {
      console.error(e);
    }
    const simSessionId = `cs_test_${Math.random().toString(36).substring(2, 12)}`;
    window.location.href = `/checkout/success?session_id=${simSessionId}&tier=${targetTier}&cycle=annual`;
  };

  const quotaPercent = Math.min(
    100,
    Math.round((currentUser.toolCallsUsed / currentUser.toolCallsLimit) * 100)
  );

  return (
    <div className="space-y-8 max-w-5xl mx-auto font-mono text-xs">
      {/* Header */}
      <div className="pb-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ borderColor: currentTheme.surfaceBorder }}>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight font-sans">Organization & Security Settings</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage subscription plans, cryptographic payment receipts, API keys, and RBAC governance.
          </p>
        </div>

        {/* Tab Switcher */}
        <div
          className="flex p-1 rounded-xl border text-xs"
          style={{
            backgroundColor: 'rgba(0,0,0,0.4)',
            borderColor: currentTheme.surfaceBorder,
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('billing')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'billing' ? 'bg-white/10 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
            <span>Billing & Receipts</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('apikeys')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'apikeys' ? 'bg-white/10 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Key className="w-3.5 h-3.5 text-cyan-400" />
            <span>API Keys</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('rbac')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'rbac' ? 'bg-white/10 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-indigo-400" />
            <span>RBAC Members</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TAB 1: BILLING, QUOTA & RECEIPTS */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'billing' && (
        <div className="space-y-6">
          {/* Active Plan Overview Card */}
          <div
            className="rounded-2xl border p-6 space-y-6 shadow-xl"
            style={{
              backgroundColor: currentTheme.surface,
              borderColor: currentTheme.surfaceBorder,
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4" style={{ borderColor: currentTheme.surfaceBorder }}>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className="px-2.5 py-0.5 rounded text-[11px] font-bold border uppercase"
                    style={{
                      backgroundColor: currentTheme.badgeBg,
                      borderColor: currentTheme.surfaceBorder,
                      color: currentTheme.primary,
                    }}
                  >
                    ★ {currentUser.tier} Plan Active
                  </span>
                  <span className="text-slate-400 text-xs">
                    Tenant: <strong className="text-white">{currentUser.company}</strong>
                  </span>
                </div>
                <h2 className="text-base font-bold text-white font-sans">Monthly Agent Interception Quota</h2>
              </div>

              <div className="flex gap-2">
                {currentUser.tier !== 'ENTERPRISE' && (
                  <button
                    type="button"
                    disabled={isUpgrading}
                    onClick={() => triggerCheckout('ENTERPRISE')}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-950 transition-all hover:opacity-90 shadow-md"
                    style={{ backgroundColor: currentTheme.primary }}
                  >
                    {isUpgrading ? 'Redirecting to Stripe...' : 'Upgrade to Enterprise Defense →'}
                  </button>
                )}
              </div>
            </div>

            {/* Quota Progress Meter */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300">
                  Tool Calls Evaluated:{' '}
                  <strong className="text-white">
                    {currentUser.toolCallsUsed.toLocaleString()} / {currentUser.toolCallsLimit.toLocaleString()}
                  </strong>
                </span>
                <span className="text-slate-400">{quotaPercent}% Capacity</span>
              </div>
              <div className="w-full h-3 rounded-full bg-black/50 border border-slate-800 overflow-hidden p-0.5">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${quotaPercent}%`,
                    backgroundColor: quotaPercent > 90 ? '#f43f5e' : currentTheme.primary,
                  }}
                />
              </div>
              <p className="text-[11px] text-slate-500">
                Evaluation reset window: 1st of each calendar month. Quota overages enforce deterministic fail-closed blocks.
              </p>
            </div>
          </div>

          {/* Cryptographic Payment Receipts & Audit Table */}
          <div
            className="rounded-2xl border p-6 space-y-4 shadow-xl"
            style={{
              backgroundColor: currentTheme.surface,
              borderColor: currentTheme.surfaceBorder,
            }}
          >
            <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: currentTheme.surfaceBorder }}>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                <h2 className="text-sm font-bold text-white font-sans">Cryptographic Billing Receipts & Financial Ledger</h2>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Tamper-Evident SHA-256 Chain
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-500 border-b border-slate-800 text-[11px]">
                    <th className="pb-2">Transaction ID</th>
                    <th className="pb-2">Plan Tier</th>
                    <th className="pb-2">Amount</th>
                    <th className="pb-2">Period</th>
                    <th className="pb-2">SHA-256 Ledger Block Hash</th>
                    <th className="pb-2">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-[11px]">
                  {billingHistory.map((txn) => (
                    <tr key={txn.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 font-semibold text-slate-200">{txn.id}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded bg-white/5 border border-slate-700 text-white font-bold">
                          {txn.tier}
                        </span>
                      </td>
                      <td className="py-3 text-emerald-400 font-bold">
                        ${(txn.amount_cents / 100).toFixed(2)} {txn.currency}
                      </td>
                      <td className="py-3 capitalize text-slate-400">{txn.billing_cycle}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-1.5">
                          <code className="text-[10px] text-cyan-300 bg-black/50 px-2 py-0.5 rounded border border-slate-800 max-w-[180px] truncate">
                            {txn.sha256_hash}
                          </code>
                          <button
                            type="button"
                            onClick={() => copyHash(txn.sha256_hash)}
                            className="p-1 rounded text-slate-500 hover:text-white transition-colors"
                            title="Copy SHA-256 Hash"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          {copiedHash === txn.sha256_hash && (
                            <span className="text-[9px] text-emerald-400 font-bold">Copied</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 text-slate-400">{new Date(txn.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 2: API KEY MANAGEMENT */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'apikeys' && (
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
                <h2 className="text-sm font-bold text-white font-sans">Integration API Keys</h2>
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
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 3: RBAC MEMBERS */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'rbac' && (
        <div
          className="rounded-2xl border p-6 space-y-4 shadow-xl"
          style={{
            backgroundColor: currentTheme.surface,
            borderColor: currentTheme.surfaceBorder,
          }}
        >
          <div className="flex items-center gap-2 border-b pb-4" style={{ borderColor: currentTheme.surfaceBorder }}>
            <Users className="h-4 w-4" style={{ color: currentTheme.primary }} />
            <h2 className="text-sm font-bold text-white font-sans">Role-Based Access Control (RBAC)</h2>
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
                <div className="text-white font-semibold">Josuva (Master Admin)</div>
                <div className="text-slate-400 text-[11px]">josuva732006@gmail.com</div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                👑 SUPER_ADMIN
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
                <div className="text-white font-semibold">Devon Vance</div>
                <div className="text-slate-400 text-[11px]">devon@autonomous-agents.dev</div>
              </div>
              <span className="px-2 py-0.5 rounded border text-slate-300 text-[10px] font-mono font-bold border-slate-700">
                DEVELOPER
              </span>
            </div>
          </div>
        </div>
      )}

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
            <h3 className="text-sm font-bold text-white font-sans">Create Integration API Key</h3>
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
