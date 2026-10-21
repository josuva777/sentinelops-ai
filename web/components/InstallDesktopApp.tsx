'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Download, Monitor, Check, X, Shield, ArrowDownToLine } from 'lucide-react';
import { useTheme } from '../lib/themeContext';

export function InstallDesktopApp() {
  const { currentTheme } = useTheme();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleNativeInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDownloadLauncher = () => {
    // Generate .bat script to launch standalone Chrome / Edge window
    const scriptContent = `@echo off
title SentinelOps AI Desktop Launcher
echo Launching SentinelOps AI Enterprise Desktop Window...
start chrome.exe --app="http://localhost:3000/dashboard" || start msedge.exe --app="http://localhost:3000/dashboard" || start http://localhost:3000/dashboard
exit
`;
    const blob = new Blob([scriptContent], { type: 'application/bat' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Launch-SentinelOps-Desktop.bat';
    a.click();
    URL.revokeObjectURL(url);
  };

  const modalContent = isOpen && mounted ? (
    <div
      onClick={() => setIsOpen(false)}
      className="fixed inset-0 z-[9999] overflow-y-auto bg-black/80 backdrop-blur-sm p-4 sm:p-6 flex items-center justify-center animate-in fade-in duration-200"
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
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl border flex items-center justify-center shadow-md shrink-0"
            style={{
              backgroundColor: currentTheme.badgeBg,
              borderColor: currentTheme.surfaceBorder,
              color: currentTheme.primary,
            }}
          >
            <Monitor className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Install SentinelOps AI Desktop App</h3>
            <p className="text-xs text-slate-400">Run as a standalone native window or install on Android</p>
          </div>
        </div>

        <div className="space-y-3 font-mono text-xs overflow-y-auto pr-1">
          {/* Option 1: Browser PWA */}
          <div
            className="p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-black/30"
            style={{ borderColor: currentTheme.surfaceBorder }}
          >
            <div className="space-y-1">
              <div className="font-bold text-white flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Native Progressive Web App (PWA)</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Installs via Chrome, Edge, or Brave directly into your Windows Start Menu & Taskbar.
              </div>
            </div>

            <button
              onClick={handleNativeInstall}
              className="px-4 py-2 rounded-lg font-bold text-slate-950 transition-all hover:opacity-90 shrink-0 shadow-md text-xs cursor-pointer"
              style={{ backgroundColor: currentTheme.primary }}
            >
              {isInstalled ? 'Installed ✓' : 'Install PWA'}
            </button>
          </div>

          {/* Option 2: Windows Desktop Launcher Script */}
          <div
            className="p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-black/30"
            style={{ borderColor: currentTheme.surfaceBorder }}
          >
            <div className="space-y-1">
              <div className="font-bold text-white flex items-center gap-2">
                <ArrowDownToLine className="w-3.5 h-3.5 text-cyan-400" />
                <span>Windows Desktop App Launcher (.bat)</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Downloads a 1-click launcher shortcut to open SentinelOps in dedicated app mode on your desktop.
              </div>
            </div>

            <button
              onClick={handleDownloadLauncher}
              className="px-4 py-2 rounded-lg border font-bold text-white hover:bg-white/10 transition-colors shrink-0 text-xs cursor-pointer"
              style={{ borderColor: currentTheme.surfaceBorder }}
            >
              Download .bat
            </button>
          </div>

          {/* Option 3: Standalone Android Web APK */}
          <div
            className="p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-black/30"
            style={{ borderColor: currentTheme.surfaceBorder }}
          >
            <div className="space-y-1">
              <div className="font-bold text-white flex items-center gap-2">
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Android Web APK (web.apk)</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Direct installable Android application package wrapping the complete SentinelOps web console.
              </div>
            </div>

            <a
              href="/downloads/web.apk"
              download="web.apk"
              className="px-4 py-2 rounded-lg border font-bold text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/10 transition-colors shrink-0 text-xs inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download APK</span>
            </a>
          </div>
        </div>

        <div className="pt-2 border-t flex items-center justify-between text-[11px] font-mono text-slate-400" style={{ borderColor: currentTheme.surfaceBorder }}>
          <span>Zero Electron Bloat • Sub-10ms Startup</span>
          <button onClick={() => setIsOpen(false)} className="text-white hover:underline cursor-pointer">
            Close
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all duration-200 hover:opacity-90 cursor-pointer"
        style={{
          borderColor: currentTheme.surfaceBorder,
          backgroundColor: currentTheme.surface,
          color: currentTheme.accent,
        }}
        title="Download / Install Desktop Web App"
      >
        <Monitor className="w-3.5 h-3.5" style={{ color: currentTheme.primary }} />
        <span className="hidden sm:inline font-semibold">
          {isInstalled ? 'Desktop App' : 'Get Desktop App'}
        </span>
      </button>

      {mounted && typeof document !== 'undefined' && createPortal(modalContent, document.body)}
    </>
  );
}
