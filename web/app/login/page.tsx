'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Shield,
  ArrowRight,
  Lock,
  Mail,
  KeyRound,
  Building2,
  User,
  AlertOctagon,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Fingerprint,
  Github,
  Globe,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useTheme } from '../../lib/themeContext';
import { useAuth } from '../../lib/authContext';

type AuthMethod = 'otp' | 'password' | 'social';
type OTPStage = 'email' | 'code' | 'finalize';

export default function LoginPage() {
  const router = useRouter();
  const { currentTheme } = useTheme();
  const { login, sendOTP, verifyOTP, finalizeOTP, oauthLogin } = useAuth();

  // Active Method
  const [method, setMethod] = useState<AuthMethod>('otp');

  // Email OTP Flow State
  const [otpStage, setOtpStage] = useState<OTPStage>('email');
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [dispatchedDevOtp, setDispatchedDevOtp] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(60);
  const [isCounting, setIsCounting] = useState(false);

  // Finalization State for New User
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Password Login State
  const [pwdEmail, setPwdEmail] = useState('josuva732006@gmail.com');
  const [pwdPassword, setPwdPassword] = useState('josuva/12345');

  // Modal / Feedback State
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [showSSOModal, setShowSSOModal] = useState(false);
  const [ssoDomain, setSsoDomain] = useState('');

  // Timer for OTP countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCounting && countdown > 0) {
      interval = setInterval(() => setCountdown((c) => c - 1), 1000);
    } else if (countdown === 0) {
      setIsCounting(false);
    }
    return () => clearInterval(interval);
  }, [isCounting, countdown]);

  // Handle 1-Click Master Admin Pre-fill
  const fillMasterAdmin = () => {
    setMethod('password');
    setPwdEmail('josuva732006@gmail.com');
    setPwdPassword('josuva/12345');
    setErrorMsg(null);
  };

  // Step 1: Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    const res = await sendOTP(email);
    setIsLoading(false);

    if (res.success) {
      setDispatchedDevOtp(res.dev_otp || null);
      setSuccessMsg(res.message || `Verification code sent to ${email}`);
      setOtpStage('code');
      setCountdown(60);
      setIsCounting(true);
    } else {
      setErrorMsg(res.error || 'Failed to dispatch verification email.');
    }
  };

  // Handle OTP digit changes
  const handleDigitChange = (index: number, val: string) => {
    if (val.length > 1) {
      // Handle paste of 6 digits
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

  // Step 2: Verify OTP
  const handleVerifyOtp = async (codeToVerify?: string) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    const fullCode = codeToVerify || otpCode.join('');
    if (fullCode.length !== 6) {
      setErrorMsg('Please enter all 6 digits of your verification code.');
      return;
    }

    setIsLoading(true);
    const res = await verifyOTP(email, fullCode);
    setIsLoading(false);

    if (res.success) {
      if (res.is_new_user) {
        setSuccessMsg('Email verified! Set your enterprise password and organization name to complete onboarding.');
        setOtpStage('finalize');
      } else {
        setSuccessMsg('Identity verified! Redirecting to SentinelOps Console...');
        setTimeout(() => router.push('/dashboard'), 600);
      }
    } else {
      setErrorMsg(res.error || 'Invalid verification code. Please try again.');
    }
  };

  // Step 3: Finalize New User Registration
  const handleFinalizeRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!newPassword || newPassword.length < 8) {
      setErrorMsg('Password must be at least 8 characters with numbers & symbols.');
      return;
    }

    setIsLoading(true);
    const res = await finalizeOTP(email, newPassword, name || email.split('@')[0], company || 'Autonomous Org');
    setIsLoading(false);

    if (res.success) {
      setSuccessMsg('Organization workspace initialized! Launching console...');
      setTimeout(() => router.push('/dashboard'), 600);
    } else {
      setErrorMsg(res.error || 'Failed to complete registration.');
    }
  };

  // Standard Password Authentication
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const result = await login(pwdEmail, pwdPassword);
      if (!result.success) {
        setErrorMsg(result.error || 'Authentication failed.');
        setIsLoading(false);
        return;
      }
      setIsLoading(false);
      router.push('/dashboard');
    } catch {
      setErrorMsg('Network error connecting to SentinelOps gateway.');
      setIsLoading(false);
    }
  };

  // Simulated Social OAuth Sign-in
  const handleOAuthSignIn = async (provider: 'Google' | 'GitHub' | 'Okta' | 'Passkey', chosenEmail?: string, chosenName?: string) => {
    setErrorMsg(null);
    setIsLoading(true);
    const targetEmail = chosenEmail || (provider === 'Google' ? 'security.director@acme-defense.com' : 'lead.architect@agents.io');
    const targetName = chosenName || (provider === 'Google' ? 'Dr. Victor Vance' : 'Kaelen Cross');

    const res = await oauthLogin(targetEmail, targetName, provider, `${targetName}'s Defense Fleet`);
    setIsLoading(false);
    setShowGoogleModal(false);
    setShowSSOModal(false);

    if (res.success) {
      router.push('/dashboard');
    } else {
      setErrorMsg(res.error || `${provider} sign-in failed.`);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center px-4 py-8 relative transition-colors duration-300"
      style={{ backgroundColor: currentTheme.background }}
    >
      <div className="absolute inset-0 bg-grid-pattern opacity-25 radial-fade pointer-events-none" />

      {/* Main Authentication Container */}
      <div
        className="w-full max-w-lg rounded-2xl border p-8 relative z-10 shadow-2xl space-y-6"
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
            <span className="text-xl font-extrabold text-white tracking-tight">SentinelOps AI</span>
          </Link>
          <h1 className="text-lg font-bold text-white tracking-tight">
            Enterprise Security Gateway & Tenant Sign-In
          </h1>
          <p className="text-xs text-slate-400">
            Hardware-bound biometric sessions • OWASP LLM01 In-Line Guardrails
          </p>
        </div>

        {/* Omnichannel Authentication Method Tabs */}
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
              setMethod('otp');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 rounded-lg text-center font-semibold transition-all flex items-center justify-center gap-1.5 ${
              method === 'otp' ? 'bg-white/10 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-emerald-400" />
            <span>Email OTP Code</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMethod('social');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 rounded-lg text-center font-semibold transition-all flex items-center justify-center gap-1.5 ${
              method === 'social' ? 'bg-white/10 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>One-Tap SSO</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMethod('password');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 rounded-lg text-center font-semibold transition-all flex items-center justify-center gap-1.5 ${
              method === 'password' ? 'bg-white/10 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Master Password</span>
          </button>
        </div>

        {/* Feedback Alerts */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-300 text-xs flex items-start gap-2.5 animate-fadeIn">
            <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">{errorMsg}</div>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 text-xs flex items-start gap-2.5 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">{successMsg}</div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* METHOD 1: EMAIL OTP VERIFICATION FLOW */}
        {/* ------------------------------------------------------------- */}
        {method === 'otp' && (
          <div className="space-y-4">
            {otpStage === 'email' && (
              <form onSubmit={handleSendOtp} className="space-y-4 font-mono text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5 flex items-center justify-between">
                    <span>Corporate Work Email</span>
                    <span className="text-[10px] text-slate-500">6-Digit Single-Use Code</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="security_lead@acme-corp.com"
                      className="w-full rounded-xl border bg-black/40 pl-10 pr-3.5 py-2.5 text-white focus:outline-none focus:ring-1"
                      style={{ borderColor: currentTheme.surfaceBorder }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1.5 leading-relaxed">
                    🛡️ <strong className="text-slate-300">Sybil Guard Active:</strong> Disposable/temporary email domains are blocked. We dispatch a 6-digit cryptographic verification code to prove organizational domain ownership.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl py-3 font-bold text-slate-950 transition-all hover:opacity-90 disabled:opacity-50 shadow-lg mt-3"
                  style={{ backgroundColor: currentTheme.primary }}
                >
                  {isLoading ? (
                    <span>Generating Cryptographic Token...</span>
                  ) : (
                    <>
                      <span>Send 6-Digit Verification Code</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {otpStage === 'code' && (
              <div className="space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Enter verification code sent to:</span>
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
                <div className="text-sm font-bold text-white bg-black/30 p-2.5 rounded-lg border border-slate-800 text-center">
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
                      className="w-12 h-14 text-center text-xl font-mono font-bold rounded-xl border bg-black/50 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all shadow-inner"
                      style={{ borderColor: currentTheme.surfaceBorder }}
                    />
                  ))}
                </div>

                {/* Simulated Enterprise Inbox Drawer (Zero Friction Testing) */}
                {dispatchedDevOtp && (
                  <div className="p-3.5 rounded-xl border border-cyan-500/40 bg-cyan-950/20 text-cyan-200 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-cyan-400" />
                        Enterprise Inbox Simulator
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono">
                        Dev / Local Testing Mode
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      SentinelOps Gateway dispatched OTP: <strong className="text-white font-mono text-sm tracking-wider">[{dispatchedDevOtp}]</strong>
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        const split = dispatchedDevOtp.split('');
                        setOtpCode(split);
                        handleVerifyOtp(dispatchedDevOtp);
                      }}
                      className="w-full py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 font-semibold text-center transition-colors"
                    >
                      ⚡ Auto-Fill & Verify OTP [{dispatchedDevOtp}]
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-between text-slate-400 pt-2">
                  <span className="text-[11px]">
                    {isCounting ? `Resend available in ${countdown}s` : 'Code expired?'}
                  </span>
                  <button
                    type="button"
                    disabled={isCounting || isLoading}
                    onClick={handleSendOtp}
                    className="text-cyan-400 hover:underline disabled:text-slate-600 disabled:no-underline text-[11px] font-semibold"
                  >
                    Resend New Code
                  </button>
                </div>

                <button
                  type="button"
                  disabled={isLoading || otpCode.join('').length !== 6}
                  onClick={() => handleVerifyOtp()}
                  className="w-full flex items-center justify-center gap-2 rounded-xl py-3 font-bold text-slate-950 transition-all hover:opacity-90 disabled:opacity-50 shadow-lg mt-2"
                  style={{ backgroundColor: currentTheme.primary }}
                >
                  {isLoading ? <span>Verifying OTP Hash...</span> : <span>Confirm & Verify Code</span>}
                </button>
              </div>
            )}

            {otpStage === 'finalize' && (
              <form onSubmit={handleFinalizeRegistration} className="space-y-4 font-mono text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Sarah Connor"
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
                      placeholder="Acme Defense Systems"
                      className="w-full rounded-xl border bg-black/40 pl-10 pr-3.5 py-2.5 text-white focus:outline-none"
                      style={{ borderColor: currentTheme.surfaceBorder }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Set Custom Enterprise Password</label>
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
                  <p className="text-[10px] text-slate-500 mt-1">Minimum 8 characters with salt encryption.</p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl py-3 font-bold text-slate-950 transition-all hover:opacity-90 disabled:opacity-50 shadow-lg mt-2"
                  style={{ backgroundColor: currentTheme.primary }}
                >
                  {isLoading ? <span>Initializing Workspace...</span> : <span>Complete Registration & Launch Console</span>}
                </button>
              </form>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* METHOD 2: OMNICHANNEL ONE-TAP SSO */}
        {/* ------------------------------------------------------------- */}
        {method === 'social' && (
          <div className="space-y-3 font-mono text-xs">
            <p className="text-slate-400 text-xs mb-2 leading-relaxed">
              Authenticate instantly with your organization's centralized identity provider (IdP):
            </p>

            {/* Google Sign In */}
            <button
              type="button"
              disabled={isLoading}
              onClick={() => setShowGoogleModal(true)}
              className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-700 bg-white/5 hover:bg-white/10 text-white font-semibold transition-all hover:border-slate-500"
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
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
                <span>Continue with Google Workspace</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>

            {/* GitHub Sign In */}
            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleOAuthSignIn('GitHub', 'developer@agentcraft.ai', 'GitHub SecOps Engineer')}
              className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-700 bg-white/5 hover:bg-white/10 text-white font-semibold transition-all hover:border-slate-500"
            >
              <div className="flex items-center gap-3">
                <Github className="w-5 h-5 text-white" />
                <span>Continue with GitHub Developer SSO</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>

            {/* Enterprise SAML / Okta SSO */}
            <button
              type="button"
              disabled={isLoading}
              onClick={() => setShowSSOModal(true)}
              className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-700 bg-white/5 hover:bg-white/10 text-white font-semibold transition-all hover:border-slate-500"
            >
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-indigo-400" />
                <span>Enterprise SSO (Okta / Azure AD / SAML)</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>

            {/* WebAuthn / Passkey / Windows Hello */}
            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleOAuthSignIn('Passkey', 'biometric.secops@sentinelops.ai', 'Biometric Hardware Key Holder')}
              className="w-full flex items-center justify-between p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-950/20 hover:bg-emerald-950/30 text-emerald-300 font-semibold transition-all"
            >
              <div className="flex items-center gap-3">
                <Fingerprint className="w-5 h-5 text-emerald-400" />
                <span>Passkey / Windows Hello Hardware Key</span>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-mono">
                FIDO2 / Fast
              </span>
            </button>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* METHOD 3: DIRECT MASTER PASSWORD AUTHENTICATION */}
        {/* ------------------------------------------------------------- */}
        {method === 'password' && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4 font-mono text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Corporate Work Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={pwdEmail}
                  onChange={(e) => setPwdEmail(e.target.value)}
                  placeholder="josuva732006@gmail.com"
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
                  value={pwdPassword}
                  onChange={(e) => setPwdPassword(e.target.value)}
                  className="w-full rounded-xl border bg-black/40 pl-10 pr-3.5 py-2.5 text-white focus:outline-none"
                  style={{ borderColor: currentTheme.surfaceBorder }}
                />
              </div>
            </div>

            {pwdEmail.trim().toLowerCase() === 'josuva732006@gmail.com' && (
              <div className="p-3 rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-300 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base">👑</span>
                  <span className="font-semibold">Supreme Master Admin Recognized</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 bg-amber-500/20 rounded font-bold">SUPER_ADMIN</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-xl py-3 font-bold text-slate-950 transition-all hover:opacity-90 disabled:opacity-50 shadow-lg mt-2"
              style={{ backgroundColor: currentTheme.primary }}
            >
              {isLoading ? (
                <span>Authenticating Credentials...</span>
              ) : (
                <>
                  <span>Authenticate Session</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            {/* Quick Master Admin Helper */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={fillMasterAdmin}
                className="text-amber-400/80 hover:text-amber-300 text-[11px] underline font-semibold flex items-center justify-center gap-1 mx-auto"
              >
                <span>👑 1-Click Fill Supreme Master Admin (Josuva)</span>
              </button>
            </div>
          </form>
        )}

        {/* Footer Navigation */}
        <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-slate-800">
          <Link href="/" className="hover:text-white transition-colors">
            ← Back to Public Website
          </Link>
          <Link href="/#pricing" className="text-cyan-400 hover:underline">
            View Enterprise Pricing →
          </Link>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* GOOGLE ACCOUNT CHOOSER SIMULATION MODAL */}
      {/* ------------------------------------------------------------- */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl space-y-4 font-mono text-xs text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
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
                <span className="font-bold text-sm">Choose Google Account</span>
              </div>
              <button
                type="button"
                onClick={() => setShowGoogleModal(false)}
                className="text-slate-400 hover:text-white text-base"
              >
                ✕
              </button>
            </div>

            <p className="text-slate-400 text-[11px]">
              Select which Google account you wish to authenticate with SentinelOps AI:
            </p>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleOAuthSignIn('Google', 'alex.cross@cybersec-ops.io', 'Alex Cross (Lead SecOps)')}
                className="w-full p-2.5 rounded-xl border border-slate-800 bg-white/5 hover:bg-white/10 text-left flex items-center gap-3 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                  A
                </div>
                <div>
                  <div className="font-bold text-white">Alex Cross (Lead SecOps)</div>
                  <div className="text-[10px] text-slate-400">alex.cross@cybersec-ops.io</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleOAuthSignIn('Google', 'sarah.director@defense-ai.com', 'Sarah Director (CISO)')}
                className="w-full p-2.5 rounded-xl border border-slate-800 bg-white/5 hover:bg-white/10 text-left flex items-center gap-3 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  S
                </div>
                <div>
                  <div className="font-bold text-white">Sarah Director (CISO)</div>
                  <div className="text-[10px] text-slate-400">sarah.director@defense-ai.com</div>
                </div>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowGoogleModal(false)}
              className="w-full py-2 rounded-xl border border-slate-700 text-slate-400 hover:text-white text-center font-semibold mt-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* ENTERPRISE SSO / SAML MODAL */}
      {/* ------------------------------------------------------------- */}
      {showSSOModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl space-y-4 font-mono text-xs text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-indigo-400" />
                <span className="font-bold text-sm">Enterprise SAML / Okta SSO</span>
              </div>
              <button
                type="button"
                onClick={() => setShowSSOModal(false)}
                className="text-slate-400 hover:text-white text-base"
              >
                ✕
              </button>
            </div>

            <p className="text-slate-400 text-[11px]">
              Enter your corporate domain or IdP identity prefix (e.g. <code>acme-corp.okta.com</code>):
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleOAuthSignIn('Okta', `sso_user@${ssoDomain || 'acme-corp.com'}`, `Enterprise SSO (${ssoDomain || 'Acme'})`);
              }}
              className="space-y-3"
            >
              <input
                type="text"
                required
                value={ssoDomain}
                onChange={(e) => setSsoDomain(e.target.value)}
                placeholder="acme-corp.com"
                className="w-full rounded-xl border border-slate-700 bg-black/40 px-3 py-2 text-white focus:outline-none"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-white shadow-lg transition-colors"
              >
                Redirect to Corporate IdP
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
