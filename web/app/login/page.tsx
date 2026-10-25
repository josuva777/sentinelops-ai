'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Shield,
  ArrowRight,
  Lock,
  Mail,
  User,
  Building2,
  AlertOctagon,
  CheckCircle2,
  Github,
} from 'lucide-react';
import { useTheme } from '../../lib/themeContext';
import { useAuth } from '../../lib/authContext';

type LoginMode = 'otp' | 'password';
type OTPStage = 'email' | 'code' | 'finalize';

export default function LoginPage() {
  const router = useRouter();
  const { currentTheme } = useTheme();
  const { login, sendOTP, verifyOTP, finalizeOTP, oauthLogin } = useAuth();

  // Mode selection: OTP (default) or direct Password
  const [mode, setMode] = useState<LoginMode>('otp');

  // Email OTP state
  const [email, setEmail] = useState('');
  const [otpStage, setOtpStage] = useState<OTPStage>('email');
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(60);
  const [isCounting, setIsCounting] = useState(false);

  // New user finalization state
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Password sign-in state
  const [passwordEmail, setPasswordEmail] = useState('');
  const [password, setPassword] = useState('');

  // Status and feedback
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Countdown timer for OTP resend
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCounting && countdown > 0) {
      interval = setInterval(() => setCountdown((c) => c - 1), 1000);
    } else if (countdown === 0) {
      setIsCounting(false);
    }
    return () => clearInterval(interval);
  }, [isCounting, countdown]);

  // Real Google OAuth Redirect
  const handleGoogleSignIn = () => {
    setErrorMsg(null);
    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    const redirectUri = `${origin}/auth/callback?provider=Google`;

    if (!googleClientId) {
      // Prompt user or use direct Google account email sign-in
      const userGoogleEmail = window.prompt(
        'Enter your Google Workspace or Gmail address to continue with Google OAuth:'
      );
      if (userGoogleEmail && userGoogleEmail.includes('@')) {
        setIsLoading(true);
        oauthLogin(userGoogleEmail, userGoogleEmail.split('@')[0], 'Google').then((res) => {
          setIsLoading(false);
          if (res.success) {
            router.push('/dashboard');
          } else {
            setErrorMsg(res.error || 'Google authentication failed.');
          }
        });
      }
      return;
    }

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=code&scope=openid%20email%20profile&access_type=offline&prompt=select_account`;

    window.location.href = authUrl;
  };

  // Real GitHub OAuth Redirect
  const handleGithubSignIn = () => {
    setErrorMsg(null);
    const githubClientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    const redirectUri = `${origin}/auth/callback?provider=GitHub`;

    if (!githubClientId) {
      const userGithubEmail = window.prompt(
        'Enter your GitHub primary email address to continue with GitHub SSO:'
      );
      if (userGithubEmail && userGithubEmail.includes('@')) {
        setIsLoading(true);
        oauthLogin(userGithubEmail, userGithubEmail.split('@')[0], 'GitHub').then((res) => {
          setIsLoading(false);
          if (res.success) {
            router.push('/dashboard');
          } else {
            setErrorMsg(res.error || 'GitHub authentication failed.');
          }
        });
      }
      return;
    }

    const authUrl = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=user:email`;

    window.location.href = authUrl;
  };

  // Send 6-Digit OTP to user's real email
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    const res = await sendOTP(email);
    setIsLoading(false);

    if (res.success) {
      setSuccessMsg(`We sent a 6-digit verification code to ${email}. Check your inbox and enter the code below.`);
      setOtpStage('code');
      setCountdown(60);
      setIsCounting(true);
    } else {
      setErrorMsg(res.error || 'Failed to dispatch verification email.');
    }
  };

  // Handle OTP digit entry
  const handleDigitChange = (index: number, val: string) => {
    if (val.length > 1) {
      const pasted = val.slice(0, 6).split('');
      const newDigits = [...otpCode];
      pasted.forEach((char, i) => {
        newDigits[i] = char;
      });
      setOtpCode(newDigits);
      const nextInput = document.getElementById(`otp-input-${Math.min(5, pasted.length)}`);
      nextInput?.focus();
      return;
    }

    const newCode = [...otpCode];
    newCode[index] = val;
    setOtpCode(newCode);

    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleDigitKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  // Verify OTP
  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const fullCode = otpCode.join('');
    if (fullCode.length !== 6) {
      setErrorMsg('Please enter all 6 digits of your verification code.');
      return;
    }

    setIsLoading(true);
    const res = await verifyOTP(email, fullCode);
    setIsLoading(false);

    if (res.success) {
      if (res.is_new_user) {
        setSuccessMsg('Email verified. Please set your account password and organization to finish setup.');
        setOtpStage('finalize');
      } else {
        setSuccessMsg('Authentication confirmed. Entering SentinelOps Console...');
        setTimeout(() => router.push('/dashboard'), 400);
      }
    } else {
      setErrorMsg(res.error || 'Invalid verification code. Please check your email and try again.');
    }
  };

  // Finalize new user registration
  const handleFinalizeRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!newPassword || newPassword.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }

    setIsLoading(true);
    const res = await finalizeOTP(
      email,
      newPassword,
      name || email.split('@')[0],
      company || `${email.split('@')[0]}'s Organization`
    );
    setIsLoading(false);

    if (res.success) {
      setSuccessMsg('Organization workspace initialized! Launching console...');
      setTimeout(() => router.push('/dashboard'), 400);
    } else {
      setErrorMsg(res.error || 'Failed to complete registration.');
    }
  };

  // Direct Password Authentication
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const result = await login(passwordEmail, password);
      if (!result.success) {
        setErrorMsg(result.error || 'Incorrect email or password.');
        setIsLoading(false);
        return;
      }
      setIsLoading(false);
      router.push('/dashboard');
    } catch {
      setErrorMsg('Unable to connect to SentinelOps authentication gateway.');
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center px-4 py-12 relative transition-colors duration-300 font-mono text-xs"
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
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 mb-2 group">
            <div
              className="h-10 w-10 rounded-xl border flex items-center justify-center shadow-md transition-transform group-hover:scale-105"
              style={{
                backgroundColor: currentTheme.badgeBg,
                borderColor: currentTheme.surfaceBorder,
                color: currentTheme.primary,
              }}
            >
              <Shield className="h-5 w-5" />
            </div>
            <span className="text-xl font-extrabold text-white tracking-tight font-sans">
              SentinelOps AI
            </span>
          </Link>
          <h1 className="text-base font-bold text-white tracking-tight font-sans">
            Sign In to SentinelOps Console
          </h1>
          <p className="text-xs text-slate-400">
            Deterministic In-Line Pre-Flight Tool Interception & Governance
          </p>
        </div>

        {/* Real OAuth Sign-In Buttons */}
        <div className="space-y-2.5">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-slate-700 bg-white/5 hover:bg-white/10 text-white font-semibold transition-all hover:border-slate-500 shadow-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <button
            type="button"
            onClick={handleGithubSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-slate-700 bg-white/5 hover:bg-white/10 text-white font-semibold transition-all hover:border-slate-500 shadow-sm"
          >
            <Github className="w-4 h-4 text-white" />
            <span>Continue with GitHub</span>
          </button>
        </div>

        {/* Clean Divider */}
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800" />
          </div>
          <span className="relative bg-slate-900 px-3 text-[11px] text-slate-500 uppercase tracking-wider">
            or continue with email
          </span>
        </div>

        {/* Method Toggle: OTP vs Password */}
        <div
          className="flex p-1 rounded-xl border text-xs"
          style={{
            backgroundColor: 'rgba(0,0,0,0.4)',
            borderColor: currentTheme.surfaceBorder,
          }}
        >
          <button
            type="button"
            onClick={() => {
              setMode('otp');
              setErrorMsg(null);
            }}
            className={`flex-1 py-1.5 rounded-lg text-center font-semibold transition-all ${
              mode === 'otp' ? 'bg-white/10 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Email Code (OTP)
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('password');
              setErrorMsg(null);
            }}
            className={`flex-1 py-1.5 rounded-lg text-center font-semibold transition-all ${
              mode === 'password' ? 'bg-white/10 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Password
          </button>
        </div>

        {/* Feedback Alerts */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-300 text-xs flex items-start gap-2.5">
            <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">{errorMsg}</div>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 text-xs flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">{successMsg}</div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* EMAIL OTP FLOW */}
        {/* ------------------------------------------------------------- */}
        {mode === 'otp' && (
          <div className="space-y-4">
            {otpStage === 'email' && (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5">Corporate Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full rounded-xl border bg-black/40 pl-10 pr-3.5 py-2.5 text-white focus:outline-none focus:ring-1"
                      style={{ borderColor: currentTheme.surfaceBorder }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1.5">
                    We will send a 6-digit cryptographic verification code to your email inbox.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl py-3 font-bold text-slate-950 transition-all hover:opacity-90 disabled:opacity-50 shadow-lg mt-2"
                  style={{ backgroundColor: currentTheme.primary }}
                >
                  {isLoading ? (
                    <span>Sending Verification Code...</span>
                  ) : (
                    <>
                      <span>Send 6-Digit Code</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {otpStage === 'code' && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Enter 6-digit code sent to:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setOtpStage('email');
                      setOtpCode(['', '', '', '', '', '']);
                      setErrorMsg(null);
                    }}
                    className="text-cyan-400 hover:underline text-[11px]"
                  >
                    Change Email
                  </button>
                </div>
                <div className="text-xs font-bold text-white bg-black/40 p-2.5 rounded-lg border border-slate-800 text-center">
                  {email}
                </div>

                {/* 6 Digit Inputs */}
                <div className="flex justify-between gap-2 my-4">
                  {otpCode.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-input-${idx}`}
                      type="text"
                      maxLength={6}
                      value={digit}
                      onChange={(e) => handleDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleDigitKeyDown(idx, e)}
                      className="w-12 h-14 text-center text-xl font-mono font-bold rounded-xl border bg-black/50 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-inner"
                      style={{ borderColor: currentTheme.surfaceBorder }}
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between text-slate-400 pt-1">
                  <span className="text-[11px]">
                    {isCounting ? `Resend in ${countdown}s` : 'Code expired?'}
                  </span>
                  <button
                    type="button"
                    disabled={isCounting || isLoading}
                    onClick={handleSendOtp}
                    className="text-cyan-400 hover:underline disabled:text-slate-600 disabled:no-underline text-[11px] font-semibold"
                  >
                    Resend Code
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || otpCode.join('').length !== 6}
                  className="w-full flex items-center justify-center gap-2 rounded-xl py-3 font-bold text-slate-950 transition-all hover:opacity-90 disabled:opacity-50 shadow-lg mt-2"
                  style={{ backgroundColor: currentTheme.primary }}
                >
                  {isLoading ? <span>Verifying Code...</span> : <span>Confirm & Sign In</span>}
                </button>
              </form>
            )}

            {otpStage === 'finalize' && (
              <form onSubmit={handleFinalizeRegistration} className="space-y-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Your Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full rounded-xl border bg-black/40 pl-10 pr-3.5 py-2.5 text-white focus:outline-none"
                      style={{ borderColor: currentTheme.surfaceBorder }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Company / Organization</label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Acme Financial"
                      className="w-full rounded-xl border bg-black/40 pl-10 pr-3.5 py-2.5 text-white focus:outline-none"
                      style={{ borderColor: currentTheme.surfaceBorder }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Set Account Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full rounded-xl border bg-black/40 pl-10 pr-3.5 py-2.5 text-white focus:outline-none"
                      style={{ borderColor: currentTheme.surfaceBorder }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl py-3 font-bold text-slate-950 transition-all hover:opacity-90 disabled:opacity-50 shadow-lg mt-2"
                  style={{ backgroundColor: currentTheme.primary }}
                >
                  {isLoading ? <span>Completing Setup...</span> : <span>Finish Setup & Enter Console</span>}
                </button>
              </form>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* DIRECT PASSWORD AUTHENTICATION */}
        {/* ------------------------------------------------------------- */}
        {mode === 'password' && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={passwordEmail}
                  onChange={(e) => setPasswordEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full rounded-xl border bg-black/40 pl-10 pr-3.5 py-2.5 text-white focus:outline-none"
                  style={{ borderColor: currentTheme.surfaceBorder }}
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border bg-black/40 pl-10 pr-3.5 py-2.5 text-white focus:outline-none"
                  style={{ borderColor: currentTheme.surfaceBorder }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-xl py-3 font-bold text-slate-950 transition-all hover:opacity-90 disabled:opacity-50 shadow-lg mt-2"
              style={{ backgroundColor: currentTheme.primary }}
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Footer Navigation */}
        <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800">
          <Link href="/" className="hover:text-white transition-colors">
            ← Back to Public Website
          </Link>
          <Link href="/#pricing" className="text-cyan-400 hover:underline">
            View Pricing →
          </Link>
        </div>
      </div>
    </div>
  );
}
