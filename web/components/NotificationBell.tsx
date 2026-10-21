'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useOperations } from '../lib/operationsContext';
import { useTheme } from '../lib/themeContext';
import { Bell, Check, ShieldAlert, X, AlertTriangle, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';

export function NotificationBell() {
  const { alerts, unreadAlertCount, updateAlertStatus, clearAllAlerts } = useOperations();
  const { currentTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeAlerts = alerts.filter((a) => a.status !== 'RESOLVED');

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Security Notifications"
        className="relative flex items-center justify-center p-2 rounded-xl border text-slate-300 hover:text-white transition-all duration-200"
        style={{
          borderColor: currentTheme.surfaceBorder,
          backgroundColor: currentTheme.surface,
          boxShadow: unreadAlertCount > 0 ? `0 0 15px -3px ${currentTheme.glow}` : 'none',
        }}
      >
        <Bell className="w-4 h-4" style={{ color: unreadAlertCount > 0 ? currentTheme.primary : '#94a3b8' }} />
        {unreadAlertCount > 0 && (
          <span
            className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold text-slate-950 shadow-md animate-pulse"
            style={{ backgroundColor: currentTheme.primary }}
          >
            {unreadAlertCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl p-3 z-50 border shadow-2xl"
            style={{
              backgroundColor: currentTheme.surface,
              borderColor: currentTheme.surfaceBorder,
              boxShadow: `0 30px 60px -12px rgba(0,0,0,0.95), 0 0 35px -5px ${currentTheme.glow}`,
            }}
          >
            <div className="flex items-center justify-between pb-2 mb-2 border-b" style={{ borderColor: currentTheme.surfaceBorder }}>
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" style={{ color: currentTheme.primary }} />
                <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Notifications ({unreadAlertCount})
                </span>
              </div>
              {unreadAlertCount > 0 ? (
                <button
                  onClick={() => clearAllAlerts()}
                  className="text-[11px] font-mono px-2 py-0.5 rounded border transition-colors hover:opacity-80"
                  style={{
                    backgroundColor: currentTheme.badgeBg,
                    borderColor: currentTheme.surfaceBorder,
                    color: currentTheme.badgeText,
                  }}
                >
                  Clear all
                </button>
              ) : (
                <span className="text-[10px] font-mono text-emerald-400">All cleared ✓</span>
              )}
            </div>

            {activeAlerts.length === 0 ? (
              <div className="py-8 text-center text-xs font-mono text-slate-400 space-y-1">
                <Check className="w-6 h-6 mx-auto text-emerald-400" />
                <p className="font-semibold text-slate-200">Zero active security incidents</p>
                <p className="text-[10px] text-slate-500">All agent actions normal & compliant</p>
              </div>
            ) : (
              <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                {activeAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="p-2.5 rounded-xl border text-xs space-y-1 transition-colors hover:bg-white/[0.03]"
                    style={{
                      borderColor: currentTheme.surfaceBorder,
                      backgroundColor: 'rgba(0,0,0,0.3)',
                    }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded uppercase ${
                            alert.severity === 'critical'
                              ? 'bg-rose-500/20 text-rose-400'
                              : 'bg-amber-500/20 text-amber-400'
                          }`}
                        >
                          {alert.severity}
                        </span>
                        <span className="font-semibold text-white truncate max-w-[170px]">{alert.title}</span>
                      </div>
                      <button
                        onClick={() => updateAlertStatus(alert.id, 'RESOLVED')}
                        title="Dismiss notification"
                        className="text-slate-400 hover:text-white p-0.5 rounded"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">{alert.evidence}</p>
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1">
                      <span>{alert.agentName}</span>
                      <Link
                        href="/dashboard/alerts"
                        onClick={() => setIsOpen(false)}
                        className="hover:underline flex items-center gap-1 font-semibold"
                        style={{ color: currentTheme.accent }}
                      >
                        <span>Investigate</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2 mt-2 border-t flex items-center justify-between text-[10px] font-mono text-slate-400" style={{ borderColor: currentTheme.surfaceBorder }}>
              <Link
                href="/dashboard/alerts"
                onClick={() => setIsOpen(false)}
                className="hover:text-white transition-colors"
              >
                Go to Alerts Center →
              </Link>
              <span>100% Fail-Closed</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

