'use client';

import Link from 'next/link';
import { Shield, Lock, Terminal, ArrowRight, Activity } from 'lucide-react';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-surface-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface border border-surface-border group-hover:border-brand-cyan/60 transition-colors">
            <Shield className="h-5 w-5 text-brand-cyan" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-white text-base">SentinelOps</span>
              <span className="rounded bg-brand-cyan/10 px-1.5 py-0.5 text-[10px] font-semibold text-brand-cyan border border-brand-cyan/30">
                AI
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono tracking-wider">DETERMINISTIC AGENT GUARDRAILS</p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <Link href="#architecture" className="hover:text-brand-cyan transition-colors">
            Architecture
          </Link>
          <Link href="#simulator" className="hover:text-brand-cyan transition-colors">
            Interactive Simulator
          </Link>
          <Link href="#integrations" className="hover:text-brand-cyan transition-colors">
            SDK & Frameworks
          </Link>
          <Link href="/docs" className="hover:text-brand-cyan transition-colors">
            Documentation
          </Link>
          <Link href="#pricing" className="hover:text-brand-cyan transition-colors">
            Pricing
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-surface border border-surface-border text-xs text-slate-300">
            <span className="h-2 w-2 rounded-full bg-status-success animate-pulse" />
            <span className="font-mono text-[11px]">Enforcement: Online</span>
          </div>

          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-lg bg-brand-cyan px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-cyan-400 transition-colors shadow-sm glow-cyan"
          >
            <span>Launch Console</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
