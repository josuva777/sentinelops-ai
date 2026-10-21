'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '../lib/themeContext';
import {
  Compass,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';

interface GuideStep {
  id: string;
  title: string;
  description: string;
  href: string;
  badge: string;
}

const GUIDE_STEPS: GuideStep[] = [
  {
    id: 'step_fleet',
    title: '1. Inspect Monitored Agent Fleet',
    description: 'Verify connected autonomous agents, credential fingerprints, and tool execution boundaries.',
    href: '/dashboard/agents',
    badge: 'Inventory',
  },
  {
    id: 'step_policy',
    title: '2. Configure Deterministic Guardrails',
    description: 'Review active AST regex patterns, transaction thresholds, and toggle between SIMULATE and ENFORCE.',
    href: '/dashboard/policies',
    badge: 'Policies',
  },
  {
    id: 'step_approvals',
    title: '3. Test Human-in-the-Loop Approval Queue',
    description: 'Simulate high-risk operations bound to single-use 15-minute TTL tokens awaiting operator authorization.',
    href: '/dashboard/approvals',
    badge: '15m TTL',
  },
  {
    id: 'step_ledger',
    title: '4. Cryptographically Verify SHA-256 Ledger',
    description: 'Run the client-side cryptographic proof calculator to verify the unbroken hash chain from the Genesis block.',
    href: '/dashboard/activity',
    badge: 'Integrity',
  },
  {
    id: 'step_assistant',
    title: '5. Query Evidence-Grounded AI Security Copilot',
    description: 'Ask questions regarding security incidents with grounded citations to OWASP Agentic Top 10 standards.',
    href: '/dashboard/assistant',
    badge: 'Real RAG',
  },
];

export function UserGuidance() {
  const { currentTheme } = useTheme();
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('sentinelops_guidance_completed');
      if (saved) {
        setCompletedSteps(JSON.parse(saved));
      }
      const savedExpanded = localStorage.getItem('sentinelops_guidance_expanded');
      if (savedExpanded !== null) {
        setIsExpanded(JSON.parse(savedExpanded));
      }
      const savedDismissed = localStorage.getItem('sentinelops_guidance_dismissed');
      if (savedDismissed !== null) {
        setIsDismissed(JSON.parse(savedDismissed));
      }
    } catch (e) {
      // Ignore
    }
  }, []);

  const toggleStep = (stepId: string) => {
    let next: string[];
    if (completedSteps.includes(stepId)) {
      next = completedSteps.filter((s) => s !== stepId);
    } else {
      next = [...completedSteps, stepId];
    }
    setCompletedSteps(next);
    localStorage.setItem('sentinelops_guidance_completed', JSON.stringify(next));
  };

  const toggleExpand = () => {
    const next = !isExpanded;
    setIsExpanded(next);
    localStorage.setItem('sentinelops_guidance_expanded', JSON.stringify(next));
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('sentinelops_guidance_dismissed', JSON.stringify(true));
  };

  const handleRestore = () => {
    setIsDismissed(false);
    setIsExpanded(true);
    localStorage.setItem('sentinelops_guidance_dismissed', JSON.stringify(false));
  };

  const progressPercent = Math.round((completedSteps.length / GUIDE_STEPS.length) * 100);

  if (isDismissed) {
    return (
      <div className="mb-6 flex justify-end">
        <button
          onClick={handleRestore}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all hover:opacity-90"
          style={{
            backgroundColor: currentTheme.badgeBg,
            borderColor: currentTheme.surfaceBorder,
            color: currentTheme.badgeText,
          }}
        >
          <Sparkles className="w-3.5 h-3.5" style={{ color: currentTheme.primary }} />
          <span>Quickstart Tour ({progressPercent}%)</span>
        </button>
      </div>
    );
  }

  return (
    <div
      className="mb-8 rounded-2xl border p-5 transition-all duration-300 shadow-xl relative overflow-hidden"
      style={{
        backgroundColor: currentTheme.surface,
        borderColor: currentTheme.surfaceBorder,
        boxShadow: `0 15px 30px -10px rgba(0,0,0,0.5), 0 0 20px -6px ${currentTheme.glow}`,
      }}
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center border"
            style={{
              backgroundColor: currentTheme.badgeBg,
              borderColor: currentTheme.surfaceBorder,
              color: currentTheme.primary,
            }}
          >
            <Compass className="w-5 h-5 animate-spin" style={{ animationDuration: '24s' }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-wide">Operator Quickstart Guidance</h3>
              <span
                className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border"
                style={{
                  backgroundColor: currentTheme.badgeBg,
                  color: currentTheme.badgeText,
                  borderColor: currentTheme.surfaceBorder,
                }}
              >
                {completedSteps.length} of {GUIDE_STEPS.length} Completed ({progressPercent}%)
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Five essential steps to configure deterministic agent defense and audit verification.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-center">
          {/* Progress bar */}
          <div className="w-28 sm:w-36 bg-black/40 h-2 rounded-full overflow-hidden border border-white/5">
            <div
              className="h-full transition-all duration-500 rounded-full"
              style={{
                width: `${progressPercent}%`,
                backgroundColor: currentTheme.primary,
              }}
            />
          </div>

          <button
            onClick={toggleExpand}
            className="p-1.5 rounded-lg border text-slate-400 hover:text-white transition-colors"
            style={{ borderColor: currentTheme.surfaceBorder }}
            title={isExpanded ? 'Collapse Guidance' : 'Expand Guidance'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button
            onClick={handleDismiss}
            className="p-1.5 rounded-lg border text-slate-400 hover:text-rose-400 transition-colors"
            style={{ borderColor: currentTheme.surfaceBorder }}
            title="Dismiss Tour"
          >
            <span className="text-xs font-mono font-bold">✕</span>
          </button>
        </div>
      </div>

      {/* Expandable Step List */}
      {isExpanded && (
        <div className="mt-5 pt-4 border-t space-y-2.5" style={{ borderColor: currentTheme.surfaceBorder }}>
          {GUIDE_STEPS.map((step) => {
            const isDone = completedSteps.includes(step.id);
            return (
              <div
                key={step.id}
                className={`p-3 rounded-xl border flex items-center justify-between gap-4 transition-all duration-200 ${
                  isDone ? 'bg-black/30 opacity-75' : 'bg-black/15 hover:bg-black/25'
                }`}
                style={{ borderColor: currentTheme.surfaceBorder }}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleStep(step.id)}
                    className="mt-0.5 text-slate-400 hover:text-white transition-colors"
                    title={isDone ? 'Mark Incomplete' : 'Mark Completed'}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-500 hover:text-slate-300" />
                    )}
                  </button>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold ${isDone ? 'line-through text-slate-400' : 'text-white'}`}>
                        {step.title}
                      </span>
                      <span
                        className="text-[9px] font-mono px-1.5 py-0.2 rounded border uppercase"
                        style={{
                          borderColor: currentTheme.surfaceBorder,
                          color: currentTheme.accent,
                        }}
                      >
                        {step.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{step.description}</p>
                  </div>
                </div>

                <Link
                  href={step.href}
                  className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono font-semibold transition-colors hover:bg-white/10"
                  style={{
                    borderColor: currentTheme.surfaceBorder,
                    color: currentTheme.badgeText,
                  }}
                >
                  <span>Open</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

