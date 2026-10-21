'use client';

import Link from 'next/link';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 font-mono">
      <div className="max-w-md w-full border border-zinc-800 rounded-2xl p-8 bg-zinc-950 text-center space-y-4 shadow-2xl">
        <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-white">404 — Security Route Not Found</h1>
        <p className="text-xs text-zinc-400 leading-relaxed">
          The requested resource does not exist or has been restricted by access control policies.
        </p>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black text-xs font-bold hover:bg-zinc-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Console</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
