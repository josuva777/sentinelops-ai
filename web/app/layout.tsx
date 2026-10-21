import React from 'react';
import './globals.css';
import { ThemeProvider } from '../lib/themeContext';
import { OperationsProvider } from '../lib/operationsContext';
import { AuthProvider } from '../lib/authContext';

export const metadata = {
  title: 'SentinelOps AI — Deterministic In-Line Guardrails for AI Agents',
  description: 'In-line tool execution interception, deterministic policy enforcement, cryptographic human approval queues, and tamper-evident SHA-256 audit ledgers.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen">
        <ThemeProvider>
          <AuthProvider>
            <OperationsProvider>
              {children}
            </OperationsProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
