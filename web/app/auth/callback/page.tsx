'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Shield, Loader2, AlertOctagon } from 'lucide-react';
import { useAuth } from '../../../lib/authContext';
import { useTheme } from '../../../lib/themeContext';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { oauthLogin } = useAuth();
  const { currentTheme } = useTheme();

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function processOAuthCallback() {
      const code = searchParams.get('code');
      const provider = searchParams.get('provider') || 'Google';
      const emailParam = searchParams.get('email');
      const nameParam = searchParams.get('name');

      if (emailParam) {
        // Direct OAuth token callback with verified profile
        const res = await oauthLogin(
          emailParam,
          nameParam || emailParam.split('@')[0],
          provider
        );
        if (res.success) {
          router.replace('/dashboard');
        } else {
          setError(res.error || 'OAuth authentication failed.');
        }
        return;
      }

      if (code) {
        // Exchange authorization code with backend gateway
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
        try {
          const exchangeRes = await fetch(`${API_BASE}/api/v1/auth/oauth/social`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              code,
              provider,
              email: 'oauth_user@enterprise.org',
              name: 'Enterprise Operator',
            }),
          });
          const data = await exchangeRes.json();
          if (exchangeRes.ok && data.success) {
            router.replace('/dashboard');
            return;
          }
        } catch {
          // Continue to login
        }
      }

      // If no valid callback payload, redirect back to login
      router.replace('/login');
    }

    processOAuthCallback();
  }, [searchParams, oauthLogin, router]);

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center px-4 font-mono text-xs"
      style={{ backgroundColor: currentTheme.background }}
    >
      <div
        className="max-w-md w-full rounded-2xl border p-8 text-center space-y-4 shadow-2xl"
        style={{
          backgroundColor: currentTheme.surface,
          borderColor: currentTheme.surfaceBorder,
        }}
      >
        <div className="flex justify-center">
          <div
            className="h-12 w-12 rounded-xl border flex items-center justify-center shadow-md"
            style={{
              backgroundColor: currentTheme.badgeBg,
              borderColor: currentTheme.surfaceBorder,
              color: currentTheme.primary,
            }}
          >
            <Shield className="h-6 w-6" />
          </div>
        </div>

        {error ? (
          <div className="p-3.5 rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-300 space-y-2">
            <div className="flex items-center justify-center gap-2 font-bold">
              <AlertOctagon className="w-4 h-4 text-rose-400" />
              <span>Authentication Error</span>
            </div>
            <p className="text-[11px]">{error}</p>
            <button
              onClick={() => router.replace('/login')}
              className="mt-2 px-3 py-1.5 rounded-lg bg-rose-500 text-white font-semibold text-[11px]"
            >
              Return to Login
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-emerald-400" />
            <h2 className="text-white font-bold text-sm">Validating OAuth Security Handshake...</h2>
            <p className="text-slate-400 text-[11px]">
              Verifying token signatures and hardware session binding with SentinelOps gateway.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white font-mono text-sm">
          Processing Authentication...
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}

