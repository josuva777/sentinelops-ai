'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '../../components/Navbar';
import { PricingSection } from '../../components/PricingSection';
import { useTheme } from '../../lib/themeContext';
import { Shield, ArrowRight } from 'lucide-react';

export default function PricingPage() {
  const { currentTheme } = useTheme();

  return (
    <div
      className="min-h-screen text-foreground transition-colors duration-300"
      style={{ backgroundColor: currentTheme.background }}
    >
      <Navbar />

      <main className="pt-8">
        <PricingSection />

        {/* BOTTOM CALL TO ACTION */}
        <section className="py-20 border-b text-center relative" style={{ borderColor: currentTheme.surfaceBorder }}>
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div
              className="rounded-3xl border p-8 sm:p-12 relative overflow-hidden shadow-2xl"
              style={{
                backgroundColor: currentTheme.surface,
                borderColor: currentTheme.surfaceBorder,
                boxShadow: `0 25px 50px -12px rgba(0,0,0,0.8), 0 0 30px -5px ${currentTheme.glow}`,
              }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono mb-4" style={{ backgroundColor: currentTheme.badgeBg, color: currentTheme.badgeText, borderColor: currentTheme.surfaceBorder }}>
                <Shield className="w-3.5 h-3.5" />
                <span>Zero Risk Evaluation</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Ready to Protect Your Autonomous Agents?
              </h2>
              <p className="text-sm text-slate-400 max-w-xl mx-auto mt-3">
                Deploy the SentinelOps deterministic proxy in minutes. Works seamlessly with LangChain, CrewAI, AutoGen, or custom Python agent tool pipelines.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/dashboard"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl font-mono text-xs font-bold text-slate-950 flex items-center justify-center gap-2 shadow-lg hover:opacity-90 transition-all"
                  style={{
                    backgroundColor: currentTheme.primary,
                    boxShadow: `0 0 25px -4px ${currentTheme.glow}`,
                  }}
                >
                  <span>Launch Free Console</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/docs"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl border font-mono text-xs font-bold text-white hover:bg-white/5 transition-all"
                  style={{ borderColor: currentTheme.surfaceBorder }}
                >
                  Read Architecture Docs
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t py-12 text-center text-xs text-slate-500 font-mono" style={{ borderColor: currentTheme.surfaceBorder }}>
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>© 2026 SentinelOps AI. Open-source enterprise agent security & operations.</div>
          <div className="flex items-center gap-6 text-slate-400">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link href="/docs" className="hover:text-white transition-colors">Documentation</Link>
            <Link href="/dashboard" className="hover:text-white transition-colors">Console</Link>
            <a href="https://github.com/josuva777/sentinelops-ai" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
