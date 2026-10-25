'use client';

import Link from 'next/link';
import { Shield, ArrowRight } from 'lucide-react';
import { ThemeSelector } from './ThemeSelector';
import { InstallDesktopApp } from './InstallDesktopApp';
import { useTheme } from '../lib/themeContext';

export function Navbar() {
  const { currentTheme } = useTheme();

  return (
    <header
      className="sticky top-0 z-50 w-full border-b backdrop-blur-md transition-colors duration-300"
      style={{
        borderColor: currentTheme.surfaceBorder,
        backgroundColor: `${currentTheme.background}d0`,
      }}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 group">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg border transition-all duration-300 overflow-hidden p-0.5"
            style={{
              borderColor: currentTheme.surfaceBorder,
              backgroundColor: currentTheme.surface,
              boxShadow: `0 0 15px -3px ${currentTheme.glow}`,
            }}
          >
            <img src="/branding/shield_emblem.png" alt="SentinelOps Shield" className="h-full w-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-white text-base">SentinelOps</span>
              <span
                className="rounded px-1.5 py-0.5 text-[10px] font-semibold border font-mono"
                style={{
                  backgroundColor: currentTheme.badgeBg,
                  color: currentTheme.badgeText,
                  borderColor: currentTheme.surfaceBorder,
                }}
              >
                AI
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono tracking-wider">DETERMINISTIC AGENT GUARDRAILS</p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <Link href="/#about" className="hover:text-white transition-colors whitespace-nowrap">
            About Us
          </Link>
          <Link href="/#architecture" className="hover:text-white transition-colors whitespace-nowrap">
            Architecture
          </Link>
          <Link href="/#simulator" className="hover:text-white transition-colors whitespace-nowrap">
            Simulator
          </Link>
          <Link href="/docs" className="hover:text-white transition-colors whitespace-nowrap">
            Docs & API
          </Link>
          <Link href="/pricing" className="hover:text-white transition-colors whitespace-nowrap">
            Pricing
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {/* Desktop Web App Installer */}
          <InstallDesktopApp />

          {/* Theme Palette Switcher */}
          <ThemeSelector />

          <div
            className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full border text-xs text-slate-300 font-mono"
            style={{
              backgroundColor: currentTheme.surface,
              borderColor: currentTheme.surfaceBorder,
            }}
          >
            <span className="h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: currentTheme.primary }} />
            <span className="text-[11px]">Enforcement: Active</span>
          </div>

          <Link
            href="/login"
            className="hidden sm:block text-xs font-semibold text-slate-300 hover:text-white transition-colors whitespace-nowrap px-2"
          >
            Sign In
          </Link>

          <Link
            href="/signup"
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold text-slate-950 transition-all duration-300 hover:opacity-90 shadow-lg whitespace-nowrap"
            style={{
              backgroundColor: currentTheme.primary,
              boxShadow: `0 0 20px -3px ${currentTheme.glow}`,
            }}
          >
            <span>Get Started</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
