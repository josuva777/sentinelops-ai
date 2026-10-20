'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('elena@apexcapital.io');
  const [password, setPassword] = useState('••••••••••••');
  const [role, setRole] = useState('SECURITY_ADMINISTRATOR');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      router.push('/dashboard');
    }, 400);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-center items-center px-4 relative">
      <div className="absolute inset-0 bg-grid-pattern opacity-25 radial-fade pointer-events-none" />

      <div className="w-full max-w-md rounded-2xl border border-surface-border bg-surface p-8 relative z-10 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 mb-2">
            <div className="h-9 w-9 rounded-xl bg-surface-subtle border border-brand-cyan/40 flex items-center justify-center">
              <Shield className="h-5 w-5 text-brand-cyan" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">SentinelOps AI</span>
          </Link>
          <h1 className="text-xl font-bold text-white">Sign In to Security Console</h1>
          <p className="text-xs text-slate-400">Enter authorized workspace credentials</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">Corporate Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-surface-border bg-surface-subtle px-3.5 py-2 text-xs text-white focus:border-brand-cyan focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">Password / Hardware Key</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-surface-border bg-surface-subtle px-3.5 py-2 text-xs text-white focus:border-brand-cyan focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">Simulated Workspace Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-lg border border-surface-border bg-surface-subtle px-3.5 py-2 text-xs text-brand-cyan focus:border-brand-cyan focus:outline-none"
            >
              <option value="SECURITY_ADMINISTRATOR">Security Administrator (Full Policy & Agent Control)</option>
              <option value="APPROVER">Approver (Human Sign-off Authorized)</option>
              <option value="DEVELOPER">Developer (Agent Registration & Diagnostics)</option>
              <option value="READ_ONLY_AUDITOR">Read-Only Auditor (Audit Ledger Inspection)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-brand-cyan py-2.5 text-xs font-semibold text-slate-950 hover:bg-cyan-400 transition-colors shadow-sm glow-cyan font-bold"
          >
            <span>{isLoading ? 'Verifying Session...' : 'Authenticate & Enter Console'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-surface-border text-center text-xs text-slate-500 font-mono">
          Strict tenant isolation enforced. Multi-factor authenticated.
        </div>
      </div>
    </div>
  );
}
