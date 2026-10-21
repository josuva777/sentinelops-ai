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
} from 'lucide-react';
import { INITIAL_APPROVALS } from '../../lib/dataStore';
import { useTheme } from '../../lib/themeContext';
import { ThemeSelector } from '../../components/ThemeSelector';
import { UserGuidance } from '../../components/UserGuidance';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  badge?: number;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { currentTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pendingCount = INITIAL_APPROVALS.filter((a) => a.status === 'PENDING').length;

  const navItems: NavItem[] = [
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Agent Inventory', href: '/dashboard/agents', icon: Bot },
    { label: 'Policy Centre', href: '/dashboard/policies', icon: Sliders },
    { label: 'Approval Queue', href: '/dashboard/approvals', icon: CheckSquare, badge: pendingCount },
    { label: 'Audit Timeline', href: '/dashboard/activity', icon: Activity },
    { label: 'Alerts & Incidents', href: '/dashboard/alerts', icon: AlertTriangle },
    { label: 'AI Security Copilot', href: '/dashboard/assistant', icon: Sparkles },
    { label: 'Enterprise Admin', href: '/dashboard/admin', icon: ShieldAlert },
    { label: 'Settings & Keys', href: '/dashboard/settings', icon: Settings },
  ];

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
            className="flex h-8 w-8 items-center justify-center rounded-lg border"
            style={{
              backgroundColor: currentTheme.badgeBg,
              borderColor: currentTheme.surfaceBorder,
              color: currentTheme.primary,
            }}
          >
            <Shield className="h-4 w-4" />
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

        {/* Tenant Switcher */}
        <div className="p-4 border-b" style={{ borderColor: currentTheme.surfaceBorder }}>
          <div
            className="rounded-xl border p-2.5 flex items-center justify-between cursor-pointer transition-colors"
            style={{
              borderColor: currentTheme.surfaceBorder,
              backgroundColor: 'rgba(0,0,0,0.25)',
            }}
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: currentTheme.primary }} />
              <div className="truncate">
                <div className="text-xs font-semibold text-white truncate">Apex Global Inc.</div>
                <div className="text-[10px] text-slate-400 font-mono">Workspace: Production</div>
              </div>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
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
              ER
            </div>
            <div className="truncate">
              <div className="text-xs font-semibold text-white truncate">Elena Rostova</div>
              <div className="text-[10px] font-mono" style={{ color: currentTheme.accent }}>SecOps Lead</div>
            </div>
          </div>
          <Link href="/" title="Back to public site" className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
            <ExternalLink className="h-4 w-4" />
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
          <Shield className="h-5 w-5" style={{ color: currentTheme.primary }} />
          <span className="font-bold text-white text-sm">SentinelOps AI</span>
        </div>
        <div className="flex items-center gap-2">
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
          className="h-14 border-b px-6 flex items-center justify-between text-xs backdrop-blur-md"
          style={{
            backgroundColor: `${currentTheme.surface}90`,
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

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-4 text-slate-400 font-mono text-[11px]">
              <span>Latency: <strong style={{ color: currentTheme.primary }}>7.8ms</strong></span>
              <span>Enforcement: <strong className="text-emerald-400">100% Fail-Closed</strong></span>
            </div>

            {/* Header Theme Switcher */}
            <ThemeSelector />
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {/* First-Time User Onboarding Guidance Banner */}
          <UserGuidance />

          {children}
        </main>
      </div>
    </div>
  );
}
