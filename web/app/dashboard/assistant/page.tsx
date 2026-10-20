'use client';

import React, { useState } from 'react';
import { Sparkles, Send, Shield, AlertTriangle, Terminal, Bot } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  evidenceLinks?: string[];
  isError?: boolean;
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'assistant',
      text: 'Hello, Elena. I am your SentinelOps AI Security Copilot. I analyze intercepted telemetry, explain blocked events, draft post-mortems, and recommend policy refinements based on verifiable ledger data.',
      evidenceLinks: ['Verified Session: Elena Rostova', 'Workspace: Apex Global Inc.'],
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const query = inputText.trim();
    if (!query || isAnalyzing) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsAnalyzing(true);

    setTimeout(() => {
      let replyText = '';
      let links: string[] = [];

      const lower = query.toLowerCase();
      if (lower.includes('why') && (lower.includes('block') || lower.includes('drop'))) {
        replyText =
          'DevOpsInfraWorker was blocked by policy rule r_inf_01 ("Zero-Destruction Guardrail").\n\n' +
          'Evidence:\n' +
          '- Tool: drop_database_table\n' +
          '- Parameter: table="customers_archive", cascade=true\n' +
          '- Decision: DENY (Halted in <9ms before socket transmission)\n\n' +
          'Zero data was corrupted. The agent runtime received a SentinelOpsSecurityViolation exception.';
        links = ['Event: evt_1001', 'Rule: r_inf_01', 'Trace: tr_devops_9812_001'];
      } else if (lower.includes('wire') || lower.includes('settle') || lower.includes('approval')) {
        replyText =
          'FinReconcileBot initiated a transfer of $14,850.00 to Apex Cloud Services Inc.\n\n' +
          'Under policy rule r_fin_02, all settlements exceeding $5,000.00 require human authorization. The action was paused, and single-use token tok_appr_9a12c8e3 was generated with a 15-minute TTL.\n\n' +
          'Status: PENDING in the Approval Queue.';
        links = ['Approval: appr_8821a', 'Token: tok_appr_9a12c8e3', 'Rule: r_fin_02'];
      } else if (lower.includes('summary') || lower.includes('health') || lower.includes('report')) {
        replyText =
          '24-Hour Fleet Telemetry Summary:\n' +
          '- 7,497 total tool actions evaluated.\n' +
          '- 47 dangerous or out-of-bounds tool calls intercepted and halted.\n' +
          '- 3 actions currently paused in the Human Approval Queue.\n' +
          '- 3 agents healthy, 1 degraded (ResearchScraper keep-alive missing for 2 hours).\n\n' +
          'All SHA-256 block ledger proofs verified unbroken.';
        links = ['Ledger Checksum: Valid', 'Monitored Agents: 4', 'Avg Latency: 7.8ms'];
      } else {
        replyText =
          `Analysis of query "${query}":\n\n` +
          'Based on active audit records for Apex Global Inc., no security violations match this criteria outside the standard 47 intercepted actions. Ensure all autonomous tool callers are decorated with @protect_tool to enforce pre-execution guardrails.';
        links = ['Tenant: Apex Global', 'Coverage: 100% Fail-Closed'];
      }

      const aiReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: replyText,
        evidenceLinks: links,
      };

      setMessages((prev) => [...prev, aiReply]);
      setIsAnalyzing(false);
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto flex flex-col h-[calc(100vh-140px)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-surface-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-brand-cyan" />
            <h1 className="text-xl font-bold text-white tracking-tight">AI Security Assistant</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Bounded, context-restricted assistant. Operates strictly on verified event telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-surface px-3 py-1 rounded-lg border border-surface-border">
          <Shield className="h-3.5 w-3.5 text-brand-cyan" />
          <span>Prompt Injection Guard: Active</span>
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 text-xs leading-relaxed ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender === 'assistant' && (
              <div className="h-7 w-7 rounded-lg bg-brand-cyan/20 border border-brand-cyan/40 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="h-3.5 w-3.5 text-brand-cyan" />
              </div>
            )}

            <div
              className={`p-4 rounded-xl max-w-2xl space-y-2.5 ${
                msg.sender === 'user'
                  ? 'bg-brand-cyan text-slate-950 font-medium'
                  : 'bg-surface border border-surface-border text-slate-200'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>

              {msg.evidenceLinks && msg.evidenceLinks.length > 0 && (
                <div className="pt-2 border-t border-surface-border/60 flex flex-wrap gap-1.5 font-mono text-[10px] text-brand-cyan">
                  {msg.evidenceLinks.map((link) => (
                    <span key={link} className="px-2 py-0.5 rounded bg-surface-subtle border border-surface-border">
                      {link}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isAnalyzing && (
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 p-3">
            <div className="h-2 w-2 rounded-full bg-brand-cyan animate-ping" />
            <span>Consulting verified telemetry ledger...</span>
          </div>
        )}
      </div>

      {/* Chat Input Bar */}
      <form onSubmit={handleSend} className="pt-2">
        <div className="flex items-center gap-2 rounded-xl border border-surface-border bg-surface p-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask about a blocked event, policy rule, or request an incident summary..."
            className="flex-1 bg-transparent px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isAnalyzing}
            className="p-2 rounded-lg bg-brand-cyan text-slate-950 hover:bg-cyan-400 transition-colors disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 font-mono">
          <span>Trained strictly on deterministic audit schemas. Zero shell access.</span>
          <span>Latency &lt; 200ms</span>
        </div>
      </form>
    </div>
  );
}
