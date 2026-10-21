'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, ArrowRight, Lock } from 'lucide-react';
import { useTheme } from '../../lib/themeContext';

export default function LoginPage() {
  const router = useRouter();
  const { currentTheme } = useTheme();
  const [email, setEmail] = useState('elena.rostova@enterprise.corp');
  const [password, setPassword] = useState('••••••••••••');
  const [role, setRole] = useState('SECURITY_ADMINISTRATOR');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push('/dashboard');
    }, 350);
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center px-4 relative transition-colors duration-400"
      style={{ backgroundColor: currentTheme.background }}
    >
      <div className="absolute inset-0 bg-grid-pattern opacity-25 radial-fade pointer-events-none" />

      <div
        className="w-full max-w-md rounded-2xl border p-8 relative z-10 shadow-2xl space-y-6"
        style={{
          backgroundColor: currentTheme.surface,
          borderColor: currentTheme.surfaceBorder,
          boxShadow: `0 25px 50px -12px rgba(0,0,0,0.9), 0 0 30px -8px ${currentTheme.glow}`,
        }}
      >
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 mb-2">
            <div
              className="h-10 w-10 rounded-xl border flex items-center justify-center shadow-md"
              style={{
                backgroundColor: currentTheme.badgeBg,
                borderColor: currentTheme.surfaceBorder,
                color: currentTheme.primary,
              }}
            >
              <Shield className="h-5 w-5" />
            </div>
            <span className="text-xl font-extrabold text-white tracking-tight">SentinelOps AI</span>
          </Link>
          <h1 className="text-lg font-bold text-white">Sign In to Security Operations</h1>
          <p className="text-xs text-slate-400">Enter authorized enterprise workspace credentials</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 font-mono text-xs">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Corporate Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border bg-black/40 px-3.5 py-2.5 text-white focus:outline-none"
              style={{ borderColor: currentTheme.surfaceBorder }}
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Password / Hardware Key</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border bg-black/40 px-3.5 py-2.5 text-white focus:outline-none"
              style={{ borderColor: currentTheme.surfaceBorder }}
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Simulated Workspace Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-xl border bg-black/40 px-3.5 py-2.5 text-white focus:outline-none"
              style={{ borderColor: currentTheme.surfaceBorder }}
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
            className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold text-slate-950 transition-all hover:opacity-90 shadow-lg disabled:opacity-50"
            style={{ backgroundColor: currentTheme.primary }}
          >
            <span>{isLoading ? 'Verifying Session...' : 'Authenticate & Enter Console'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="pt-4 border-t text-center text-xs text-slate-500 font-mono" style={{ borderColor: currentTheme.surfaceBorder }}>
          Strict tenant isolation enforced. Multi-factor authenticated.
        </div>
      </div>
    </div>
  );
}
