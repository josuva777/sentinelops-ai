'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTheme, THEMES, ThemeId } from '../lib/themeContext';
import { Palette, Check, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function ThemeSelector() {
  const { currentTheme, setThemeId } = useTheme();
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

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all duration-300"
        style={{
          borderColor: currentTheme.surfaceBorder,
          backgroundColor: currentTheme.surface,
          color: currentTheme.accent,
          boxShadow: `0 0 15px -3px ${currentTheme.glow}`,
        }}
      >
        <span
          className="w-2.5 h-2.5 rounded-full animate-pulse"
          style={{ backgroundColor: currentTheme.primary }}
        />
        <Palette className="w-3.5 h-3.5" />
        <span className="hidden sm:inline font-semibold">{currentTheme.name}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute right-0 mt-2 w-72 rounded-xl p-2 z-50 border shadow-2xl backdrop-blur-xl"
            style={{
              backgroundColor: `${currentTheme.surface}f0`,
              borderColor: currentTheme.surfaceBorder,
              boxShadow: `0 20px 40px -15px rgba(0,0,0,0.8), 0 0 25px -5px ${currentTheme.glow}`,
            }}
          >
            <div className="px-2 py-1.5 border-b mb-1 flex items-center justify-between" style={{ borderColor: currentTheme.surfaceBorder }}>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Select Color Engine
              </span>
              <span className="text-[10px] font-mono text-slate-500">5 Palettes</span>
            </div>

            <div className="space-y-1">
              {(Object.keys(THEMES) as ThemeId[]).map((id) => {
                const t = THEMES[id];
                const isSelected = currentTheme.id === id;
                return (
                  <button
                    key={id}
                    onClick={() => {
                      setThemeId(id);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center justify-between transition-colors ${
                      isSelected ? 'bg-white/10' : 'hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex -space-x-1">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/40 shadow-sm"
                          style={{ backgroundColor: t.primary }}
                        />
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/40 shadow-sm"
                          style={{ backgroundColor: t.accent }}
                        />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white leading-none">{t.name}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{t.tagline}</div>
                      </div>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5" style={{ color: t.primary }} />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
