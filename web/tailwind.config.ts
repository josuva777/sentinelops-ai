import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#080b11',
        surface: {
          DEFAULT: '#0e131f',
          subtle: '#121826',
          hover: '#161e31',
          border: '#1e293b',
          active: '#1e2842',
        },
        brand: {
          cyan: '#06b6d4',
          cyanGlow: 'rgba(6, 182, 212, 0.25)',
          violet: '#8b5cf6',
          violetGlow: 'rgba(139, 92, 246, 0.25)',
        },
        status: {
          success: '#10b981',
          warning: '#f59e0b',
          critical: '#f43f5e',
          info: '#38bdf8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
