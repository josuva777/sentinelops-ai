'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeId = 'emerald' | 'titanium' | 'amber' | 'cobalt' | 'crimson';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  tagline: string;
  primary: string;
  accent: string;
  background: string;
  surface: string;
  surfaceBorder: string;
  glow: string;
  badgeBg: string;
  badgeText: string;
  gradientText: string;
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  emerald: {
    id: 'emerald',
    name: 'Cyberpunk Matrix',
    tagline: 'Deep Obsidian & Phosphor Emerald',
    primary: '#10b981',
    accent: '#34d399',
    background: '#060a08',
    surface: '#0d1511',
    surfaceBorder: '#16281e',
    glow: 'rgba(16, 185, 129, 0.25)',
    badgeBg: 'rgba(16, 185, 129, 0.1)',
    badgeText: '#34d399',
    gradientText: 'from-emerald-400 via-teal-300 to-green-200',
  },
  titanium: {
    id: 'titanium',
    name: 'Swiss Bauhaus Monolith',
    tagline: 'Minimalist Stark Monochrome & Cold Silver',
    primary: '#f8fafc',
    accent: '#94a3b8',
    background: '#09090b',
    surface: '#121215',
    surfaceBorder: '#27272a',
    glow: 'rgba(248, 250, 252, 0.15)',
    badgeBg: 'rgba(255, 255, 255, 0.08)',
    badgeText: '#f8fafc',
    gradientText: 'from-white via-slate-200 to-zinc-400',
  },
  amber: {
    id: 'amber',
    name: 'Avionics Radar Amber',
    tagline: 'Cockpit Telemetry & Industrial Safety Amber',
    primary: '#f59e0b',
    accent: '#fbbf24',
    background: '#090704',
    surface: '#140f07',
    surfaceBorder: '#291d0e',
    glow: 'rgba(245, 158, 11, 0.25)',
    badgeBg: 'rgba(245, 158, 11, 0.1)',
    badgeText: '#fbbf24',
    gradientText: 'from-amber-400 via-yellow-300 to-orange-400',
  },
  cobalt: {
    id: 'cobalt',
    name: 'Deep Oceanic Cobalt',
    tagline: 'Deep Trench Indigo & Arctic Ice Cyan',
    primary: '#06b6d4',
    accent: '#38bdf8',
    background: '#040914',
    surface: '#0a1224',
    surfaceBorder: '#152445',
    glow: 'rgba(6, 182, 212, 0.25)',
    badgeBg: 'rgba(6, 182, 212, 0.1)',
    badgeText: '#38bdf8',
    gradientText: 'from-cyan-400 via-sky-300 to-blue-400',
  },
  crimson: {
    id: 'crimson',
    name: 'Lockdown Redacted Crimson',
    tagline: 'Critical Threat Interception & Carbon Ruby',
    primary: '#e11d48',
    accent: '#f43f5e',
    background: '#0a0406',
    surface: '#15080c',
    surfaceBorder: '#2d1119',
    glow: 'rgba(225, 29, 72, 0.25)',
    badgeBg: 'rgba(225, 29, 72, 0.1)',
    badgeText: '#f43f5e',
    gradientText: 'from-rose-400 via-red-300 to-amber-400',
  },
};

interface ThemeContextType {
  currentTheme: ThemeConfig;
  setThemeId: (id: ThemeId) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  currentTheme: THEMES.emerald,
  setThemeId: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeId, setThemeId] = useState<ThemeId>('emerald');

  useEffect(() => {
    const saved = localStorage.getItem('sentinelops_theme') as ThemeId;
    if (saved && THEMES[saved]) {
      setThemeId(saved);
    }
  }, []);

  const handleSetTheme = (id: ThemeId) => {
    setThemeId(id);
    localStorage.setItem('sentinelops_theme', id);
  };

  const theme = THEMES[themeId] || THEMES.emerald;

  return (
    <ThemeContext.Provider value={{ currentTheme: theme, setThemeId: handleSetTheme }}>
      <div
        style={{
          ['--theme-primary' as any]: theme.primary,
          ['--theme-accent' as any]: theme.accent,
          ['--theme-bg' as any]: theme.background,
          ['--theme-surface' as any]: theme.surface,
          ['--theme-border' as any]: theme.surfaceBorder,
          ['--theme-glow' as any]: theme.glow,
          backgroundColor: theme.background,
          color: '#ffffff',
          minHeight: '100vh',
          transition: 'background-color 0.4s ease, border-color 0.4s ease',
        }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
