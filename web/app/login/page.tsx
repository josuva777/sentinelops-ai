'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, ArrowRight, Lock, UserPlus, AlertOctagon, CheckCircle2, Building2 } from 'lucide-react';
import { useTheme } from '../../lib/themeContext';
import { useAuth, UserRole } from '../../lib/authContext';

export default function LoginPage() {
  const router = useRouter();
  const { currentTheme } = useTheme();
  const { login, register } = useAuth();

  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [email, setEmail] = useState('josuva732006@gmail.com');
  const [password, setPassword] = useState('josuva/12345');
  const [name, setName] = useState('Josuva');
  const [company, setCompany] = useState('SentinelOps Global Command');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      if (mode === 'signin') {
        const result = await login(email, password);
        if (!result.success) {
          setErrorMsg(result.error || 'Authentication failed.');
          setIsLoading(false);
          return;
        }
      } else {
        const result = await register(name, email, company, password);
        if (!result.success) {
          setErrorMsg(result.error || 'Registration failed.');
          setIsLoading(false);
          return;
        }
      }

      setIsLoading(false);
      router.push('/dashboard');
    } catch {
      setErrorMsg('Network error connecting to SentinelOps authentication gateway.');
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center px-4 relative transition-colors duration-300"
      style={{ backgroundColor: currentTheme.background }}
    >
      <div className="absolute inset-0 bg-grid-pattern opacity-25 radial-fade pointer-events-none" />

      <div
        className="w-full max-w-md rounded-2xl border p-8 relative z-10 shadow-2xl space-y-6"
        style={{
          backgroundColor: currentTheme.surface,
          borderColor: currentTheme.surfaceBorder,
          boxShadow: `0 25px 50px -12px rgba(0,0,0,0.95), 0 0 35px -8px ${currentTheme.glow}`,
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
          <h1 className="text-lg font-bold text-white">
            {mode === 'signin' ? 'Sign In to Operations Console' : 'Create Enterprise Tenant Account'}
          </h1>
          <p className="text-xs text-slate-400">
            {mode === 'signin'
              ? 'Enter authorized enterprise credentials & RBAC profile'
              : 'Register your organization to start in-line agent guardrails'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div
          className="flex p-1 rounded-xl border text-xs font-mono"
          style={{
            backgroundColor: 'rgba(0,0,0,0.4)',
            borderColor: currentTheme.surfaceBorder,
          }}
        >
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMsg(null);
            }}
            className={`flex-1 py-1.5 rounded-lg text-center font-semibold transition-all ${
              mode === 'signin' ? 'bg-white/10 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMsg(null);
              setEmail('');
            }}
            className={`flex-1 py-1.5 rounded-lg text-center font-semibold transition-all ${
              mode === 'register' ? 'bg-white/10 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-300 text-xs flex items-start gap-2.5">
            <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">{errorMsg}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Elena Rostova"
                  className="w-full rounded-xl border bg-black/40 px-3.5 py-2.5 text-white focus:outline-none"
                  style={{ borderColor: currentTheme.surfaceBorder }}
                />
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Company / Organization</label>
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Acme Financial"
                  className="w-full rounded-xl border bg-black/40 px-3.5 py-2.5 text-white focus:outline-none"
                  style={{ borderColor: currentTheme.surfaceBorder }}
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Corporate Work Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="elena@enterprise.corp"
              className="w-full rounded-xl border bg-black/40 px-3.5 py-2.5 text-white focus:outline-none"
              style={{ borderColor: currentTheme.surfaceBorder }}
            />
            {mode === 'register' && (
              <p className="text-[10px] text-slate-400 mt-1 font-mono">
                🛡️ Anti-Sybil Guard: Burner/disposable email domains are blocked.
              </p>
            )}
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border bg-black/40 px-3.5 py-2.5 text-white focus:outline-none"
              style={{ borderColor: currentTheme.surfaceBorder }}
            />
          </div>

          {mode === 'signin' && email.trim().toLowerCase() === 'josuva732006@gmail.com' && (
            <div className="p-3 rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-300 text-xs flex items-center gap-2">
              <span className="text-sm">👑</span>
              <span className="font-semibold">Supreme Master Admin Account Recognized</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 rounded-xl py-3 font-bold text-slate-950 transition-all hover:opacity-90 disabled:opacity-50 shadow-lg mt-2"
            style={{ backgroundColor: currentTheme.primary }}
          >
            {isLoading ? (
              <span>Verifying Telemetry Credentials...</span>
            ) : mode === 'signin' ? (
              <>
                <span>Authenticate Session</span>
                <ArrowRight className="h-4 w-4" />
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                <span>Create Organization Workspace</span>
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center text-[11px] font-mono text-slate-400">
          <Link href="/" className="hover:text-white transition-colors">
            ← Back to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}
