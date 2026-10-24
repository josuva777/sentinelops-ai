'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Shield,
  LayoutDashboard,
  Bot,
  Sliders,
  CheckSquare,
  Activity,
  AlertTriangle,
  Sparkles,
  Settings,
  ChevronDown,
  User,
  ExternalLink,
  Menu,
  X,
  ShieldAlert,
  LogOut,
  Zap,
  CreditCard,
  Check,
} from 'lucide-react';
import { useTheme } from '../../lib/themeContext';
import { useOperations } from '../../lib/operationsContext';
import { useAuth } from '../../lib/authContext';
import { ThemeSelector } from '../../components/ThemeSelector';
import { UserGuidance } from '../../components/UserGuidance';
import { NotificationBell } from '../../components/NotificationBell';
import { InstallDesktopApp } from '../../components/InstallDesktopApp';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  badge?: number;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { currentTheme } = useTheme();
  const { unreadAlertCount, pendingApprovalCount } = useOperations();
  const { currentUser, logout, isQuotaExceeded, upgradePlan } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const navItems: NavItem[] = [
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Agent Inventory', href: '/dashboard/agents', icon: Bot },
    { label: 'Policy Centre', href: '/dashboard/policies', icon: Sliders },
    { label: 'Approval Queue', href: '/dashboard/approvals', icon: CheckSquare, badge: pendingApprovalCount },
    { label: 'Audit Timeline', href: '/dashboard/activity', icon: Activity },
    { label: 'Alerts & Incidents', href: '/dashboard/alerts', icon: AlertTriangle, badge: unreadAlertCount },
    { label: 'AI Security Copilot', href: '/dashboard/assistant', icon: Sparkles },
    ...(currentUser.role === 'SUPER_ADMIN' ? [{ label: 'Enterprise Admin', href: '/dashboard/admin', icon: ShieldAlert }] : []),
    { label: 'Settings & Keys', href: '/dashboard/settings', icon: Settings },
  ];

  const quotaPercent = Math.min(
    100,
    Math.round((currentUser.toolCallsUsed / currentUser.toolCallsLimit) * 100)
  );

  return (
    <div
      className="min-h-screen text-foreground flex flex-col md:flex-row transition-colors duration-300"
      style={{ backgroundColor: currentTheme.background }}
    >
      {/* SIDEBAR FOR DESKTOP */}
      <aside
        className="hidden md:flex w-64 flex-col border-r shrink-0 transition-colors duration-300"
        style={{
          backgroundColor: currentTheme.surface,
          borderColor: currentTheme.surfaceBorder,
        }}
      >
        {/* Brand Header */}
        <div
          className="h-16 flex items-center px-6 border-b gap-3"
          style={{ borderColor: currentTheme.surfaceBorder }}
        >
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg border overflow-hidden p-0.5"
            style={{
              backgroundColor: currentTheme.badgeBg,
              borderColor: currentTheme.surfaceBorder,
              color: currentTheme.primary,
            }}
          >
            <img src="/branding/shield_emblem.png" alt="SentinelOps Shield" className="h-full w-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white text-sm">SentinelOps</span>
              <span
                className="text-[10px] font-mono px-1 rounded border font-bold"
                style={{
                  backgroundColor: currentTheme.badgeBg,
                  color: currentTheme.badgeText,
                  borderColor: currentTheme.surfaceBorder,
                }}
              >
                AI
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono tracking-wider">CONSOLE</span>
          </div>
        </div>

        {/* Tenant Switcher & Tier Badging */}
        <div className="p-4 border-b space-y-2.5" style={{ borderColor: currentTheme.surfaceBorder }}>
          <div
            className="rounded-xl border p-2.5 flex items-center justify-between cursor-pointer transition-colors"
            style={{
              borderColor: currentTheme.surfaceBorder,
              backgroundColor: 'rgba(0,0,0,0.3)',
            }}
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: currentTheme.primary }} />
              <div className="truncate">
                <div className="text-xs font-semibold text-white truncate">{currentUser.company}</div>
                <div className="text-[10px] text-slate-400 font-mono">Workspace: Production</div>
              </div>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
          </div>

          {/* Tier Badge & Quota Meter */}
          <div
            className="p-2.5 rounded-xl border font-mono text-xs space-y-1.5"
            style={{
              backgroundColor: 'rgba(0,0,0,0.2)',
              borderColor: currentTheme.surfaceBorder,
            }}
          >
            <div className="flex items-center justify-between text-[11px]">
              {currentUser.tier === 'FREE' && (
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <span>Starter Plan (Free)</span>
                </span>
              )}
              {currentUser.tier === 'TEAM' && (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>★ SecOps Team</span>
                </span>
              )}
              {currentUser.tier === 'ENTERPRISE' && (
                <span className="text-cyan-400 font-bold flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  <span>🛡️ Enterprise Defense</span>
                </span>
              )}

              <button
                onClick={() => setShowUpgradeModal(true)}
                className="text-emerald-400 underline font-bold hover:text-emerald-300 cursor-pointer"
              >
                {currentUser.tier === 'FREE' ? 'Upgrade' : 'Manage Plan'}
              </button>
            </div>

            {/* Quota Progress */}
            <div>
              <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                <span>Monthly Quota</span>
                <span>{quotaPercent}%</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-white/5">
                <div
                  className={`h-full transition-all duration-300 ${
                    quotaPercent >= 95 ? 'bg-rose-500' : 'bg-emerald-400'
                  }`}
                  style={{ width: `${quotaPercent}%` }}
                />
              </div>
              <div className="text-[9px] text-slate-500 mt-1">
                {currentUser.toolCallsUsed.toLocaleString()} / {currentUser.toolCallsLimit.toLocaleString()} calls
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? 'border font-bold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
                style={{
                  backgroundColor: isActive ? currentTheme.badgeBg : 'transparent',
                  borderColor: isActive ? currentTheme.surfaceBorder : 'transparent',
                  color: isActive ? currentTheme.badgeText : undefined,
                  boxShadow: isActive ? `0 0 15px -4px ${currentTheme.glow}` : 'none',
                }}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className="h-4 w-4"
                    style={{ color: isActive ? currentTheme.primary : '#94a3b8' }}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-[10px] font-bold text-slate-950">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile Footer */}
        <div
          className="p-4 border-t flex items-center justify-between"
          style={{ borderColor: currentTheme.surfaceBorder }}
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <div
              className="h-8 w-8 rounded-full border flex items-center justify-center text-xs font-bold"
              style={{
                backgroundColor: currentTheme.badgeBg,
                borderColor: currentTheme.surfaceBorder,
                color: currentTheme.primary,
              }}
            >
              {currentUser.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()}
            </div>
            <div className="truncate">
              <div className="text-xs font-semibold text-white truncate">{currentUser.name}</div>
              <div className="text-[10px] font-mono truncate" style={{ color: currentTheme.accent }}>
                {currentUser.role}
              </div>
            </div>
          </div>
          <Link
            href="/login"
            onClick={() => logout()}
            title="Log Out / Switch User"
            className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-rose-400 transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </Link>
        </div>
      </aside>

      {/* MOBILE HEADER */}
      <div
        className="md:hidden flex h-16 items-center justify-between px-4 border-b"
        style={{
          backgroundColor: currentTheme.surface,
          borderColor: currentTheme.surfaceBorder,
        }}
      >
        <div className="flex items-center gap-2">
          <img src="/branding/shield_emblem.png" alt="SentinelOps Shield" className="h-6 w-6 object-contain" />
          <span className="font-bold text-white text-sm">{currentUser.company}</span>
        </div>
        <div className="flex items-center gap-2">
          <NotificationBell />
          <ThemeSelector />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* MOBILE NAV DRAWER */}
      {mobileMenuOpen && (
        <div
          className="md:hidden border-b px-4 py-3 space-y-1"
          style={{
            backgroundColor: currentTheme.surface,
            borderColor: currentTheme.surfaceBorder,
          }}
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-2 text-sm text-slate-300 hover:text-white"
            >
              <span>{item.label}</span>
              {item.badge && item.badge > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-xs font-bold text-slate-950">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Control Bar */}
        <header
          className="sticky top-0 z-40 h-14 border-b px-6 flex items-center justify-between text-xs backdrop-blur-md shrink-0 transition-colors duration-300"
          style={{
            backgroundColor: currentTheme.surface,
            borderColor: currentTheme.surfaceBorder,
          }}
        >
          <div className="flex items-center gap-3">
            <span className="text-slate-400 hidden sm:inline">Environment:</span>
            <span className="font-mono text-emerald-400 font-semibold flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              US-East Multi-Cluster (Live)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-4 text-slate-400 font-mono text-[11px]">
              <span>Latency: <strong style={{ color: currentTheme.primary }}>7.8ms</strong></span>
              <span>Enforcement: <strong className="text-emerald-400">100% Fail-Closed</strong></span>
            </div>

            {/* Desktop App Installer Pill */}
            <InstallDesktopApp />

            {/* Notification Bell */}
            <NotificationBell />

            {/* Header Theme Switcher */}
            <ThemeSelector />
          </div>
        </header>

        {/* Quota Exceeded Warning Banner */}
        {isQuotaExceeded && (
          <div className="p-3 bg-rose-600/20 border-b border-rose-500/40 text-rose-300 text-xs font-mono px-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>
                <strong>MONTHLY TOOL QUOTA EXHAUSTED:</strong> Starter plan reached 50,000 calls. Pre-flight evaluation is paused.
              </span>
            </div>
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="px-3 py-1 bg-rose-500 text-white rounded font-bold hover:bg-rose-400 transition-colors"
            >
              Upgrade to SecOps Team
            </button>
          </div>
        )}

        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {/* First-Time User Onboarding Guidance Banner */}
          <UserGuidance />

          {children}
        </main>
      </div>

      {/* UPGRADE PLAN MODAL */}
      {showUpgradeModal && (
        <div
          onClick={() => setShowUpgradeModal(false)}
          className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm p-4 sm:p-6 flex min-h-full items-center justify-center animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl border p-5 sm:p-6 shadow-2xl relative my-auto max-h-[90vh] flex flex-col space-y-4"
            style={{
              backgroundColor: currentTheme.surface,
              borderColor: currentTheme.surfaceBorder,
              boxShadow: `0 25px 60px -12px rgba(0,0,0,0.95), 0 0 35px -5px ${currentTheme.glow}`,
            }}
          >
            <button
              onClick={() => setShowUpgradeModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl border flex items-center justify-center text-emerald-400 border-emerald-500/30 bg-emerald-500/10 shadow-md"
              >
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                  Instant Plan Elevation
                </span>
                <h3 className="text-lg font-bold text-white">Upgrade Tenant Plan</h3>
              </div>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {/* SecOps Team Card */}
              <div
                className="p-4 rounded-xl border-2 space-y-2 relative"
                style={{
                  borderColor: currentTheme.primary,
                  backgroundColor: 'rgba(0,0,0,0.4)',
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">★ SecOps Team Tier</span>
                  <span className="font-bold text-emerald-400 text-sm">$119 / mo</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                  Unlocks 1,000,000 monthly intercepted tool calls, 1-tap mobile push approvals with 15m cryptographic TTL, and grounded RAG security copilot.
                </p>
                <button
                  onClick={() => {
                    upgradePlan('TEAM');
                    setShowUpgradeModal(false);
                  }}
                  className="w-full py-2.5 rounded-lg font-bold text-slate-950 transition-all hover:opacity-90 shadow-md text-xs mt-2"
                  style={{ backgroundColor: currentTheme.primary }}
                >
                  Activate SecOps Team (Instant Upgrade)
                </button>
              </div>

              {/* Enterprise Defense Card */}
              <div
                className="p-4 rounded-xl border space-y-2"
                style={{
                  borderColor: currentTheme.surfaceBorder,
                  backgroundColor: 'rgba(0,0,0,0.2)',
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">🛡️ Enterprise Defense</span>
                  <span className="text-slate-400 text-sm">$999+ / mo</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                  Unlimited unmetered calls, private VPC on-premise proxy, HSM key binding, 99.99% SLA, and SOC2 compliance export.
                </p>
                <button
                  onClick={() => {
                    upgradePlan('ENTERPRISE');
                    setShowUpgradeModal(false);
                  }}
                  className="w-full py-2 rounded-lg border text-white font-bold hover:bg-white/10 transition-colors text-xs"
                  style={{ borderColor: currentTheme.surfaceBorder }}
                >
                  Contact Enterprise Sales
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
