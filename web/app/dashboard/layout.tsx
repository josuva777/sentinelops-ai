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
} from 'lucide-react';
import { INITIAL_APPROVALS } from '../../lib/dataStore';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
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
    { label: 'Settings & Keys', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      {/* SIDEBAR FOR DESKTOP */}
      <aside className="hidden md:flex w-64 flex-col border-r border-surface-border bg-surface shrink-0">
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-surface-border gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-subtle border border-brand-cyan/40">
            <Shield className="h-4 w-4 text-brand-cyan" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white text-sm">SentinelOps</span>
              <span className="text-[10px] font-mono text-brand-cyan bg-brand-cyan/10 px-1 rounded border border-brand-cyan/30">
                AI
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">ENFORCEMENT CONSOLE</span>
          </div>
        </div>

        {/* Tenant Switcher */}
        <div className="p-4 border-b border-surface-border">
          <div className="rounded-xl border border-surface-border bg-surface-subtle p-2.5 flex items-center justify-between cursor-pointer hover:border-slate-500 transition-colors">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="h-2 w-2 rounded-full bg-status-success shrink-0" />
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
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30'
                    : 'text-slate-300 hover:bg-surface-subtle hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 ${isActive ? 'text-brand-cyan' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-status-warning text-[10px] font-bold text-slate-950">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-surface-border flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="h-8 w-8 rounded-full bg-brand-violet/20 border border-brand-violet/40 flex items-center justify-center text-xs font-bold text-brand-violet">
              ER
            </div>
            <div className="truncate">
              <div className="text-xs font-medium text-white truncate">Elena Rostova</div>
              <div className="text-[10px] text-brand-cyan font-mono">SecOps Lead</div>
            </div>
          </div>
          <Link href="/" title="Back to public site">
            <ExternalLink className="h-4 w-4 text-slate-400 hover:text-white" />
          </Link>
        </div>
      </aside>

      {/* MOBILE HEADER */}
      <div className="md:hidden flex h-16 items-center justify-between px-4 border-b border-surface-border bg-surface">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-brand-cyan" />
          <span className="font-bold text-white text-sm">SentinelOps AI</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-slate-300 hover:text-white"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* MOBILE NAV DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-surface-border bg-surface px-4 py-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-2 text-sm text-slate-300 hover:text-white"
            >
              <span>{item.label}</span>
              {item.badge && item.badge > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-status-warning text-xs font-bold text-slate-950">
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
        <header className="h-14 border-b border-surface-border bg-surface/50 px-6 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <span className="text-slate-400">Environment:</span>
            <span className="font-mono text-status-success font-semibold flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-status-success animate-pulse" />
              US-East Multi-Cluster (Live)
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
            <span>Interception Latency: <strong className="text-brand-cyan">7.8ms</strong></span>
            <span>Policy Status: <strong className="text-status-success">100% Fail-Closed</strong></span>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
