'use client';

import React, { useState } from 'react';
import { INITIAL_ALERTS } from '../../../lib/dataStore';
import { SecurityAlert, AlertStatus } from '../../../lib/types';
import { AlertTriangle, Shield, CheckCircle2, Search, ArrowRight, Sparkles, FileText } from 'lucide-react';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<SecurityAlert[]>(INITIAL_ALERTS);
  const [selectedAlert, setSelectedAlert] = useState<SecurityAlert | null>(INITIAL_ALERTS[0]);
  const [generatedReport, setGeneratedReport] = useState<string | null>(null);

  const handleUpdateStatus = (alertId: string, newStatus: AlertStatus) => {
    setAlerts(
      alerts.map((a) => (a.id === alertId ? { ...a, status: newStatus } : a))
    );
    if (selectedAlert?.id === alertId) {
      setSelectedAlert({ ...selectedAlert, status: newStatus });
    }
  };

  const handleGenerateAIMortem = () => {
    if (!selectedAlert) return;
    setGeneratedReport(
      `INCIDENT SUMMARY REPORT — ${selectedAlert.title}\n` +
      `Incident ID: ${selectedAlert.id} | Severity: ${selectedAlert.severity.toUpperCase()}\n` +
      `Affected Agent: ${selectedAlert.agentName} | Evaluation Confidence: ${(selectedAlert.confidence * 100).toFixed(0)}%\n\n` +
      `1. Observed Telemetry:\n` +
      `- Event intercepted before socket transport: ${selectedAlert.evidence}\n` +
      `- Deterministic policy status: In-line halt executed. Zero database corruption occurred.\n\n` +
      `2. Root Cause Hypothesis:\n` +
      `- Agent trajectory analysis indicates potential prompt injection or unconstrained recursive tool loop.\n\n` +
      `3. Recommended Engineering Remediation:\n` +
      `- ${selectedAlert.remediation}\n` +
      `- Apply AST token whitelist rule in Policy Centre for agent ${selectedAlert.agentId}.`
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Security Alerts & Incidents</h1>
        <p className="text-xs text-slate-400 mt-1">
          Investigate intercepted violations, examine tool parameters, and generate evidence-based incident reports.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Alert List */}
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              onClick={() => {
                setSelectedAlert(alert);
                setGeneratedReport(null);
              }}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                selectedAlert?.id === alert.id
                  ? 'border-brand-cyan bg-surface-subtle glow-cyan'
                  : 'border-surface-border bg-surface hover:border-slate-500'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  alert.severity === 'critical'
                    ? 'bg-status-critical/20 text-status-critical'
                    : 'bg-status-warning/20 text-status-warning'
                }`}>
                  {alert.severity}
                </span>
                <span className="text-[10px] font-mono text-slate-400">{alert.timestamp}</span>
              </div>

              <h3 className="text-xs font-bold text-white mt-2 leading-snug">{alert.title}</h3>
              <div className="mt-2 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                <span>Agent: {alert.agentName}</span>
                <span className={`font-semibold ${
                  alert.status === 'CONTAINED' ? 'text-status-success' : 'text-status-warning'
                }`}>
                  {alert.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column (2 Cols): Detail & Investigation Workspace */}
        {selectedAlert && (
          <div className="lg:col-span-2 rounded-xl border border-surface-border bg-surface p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                    selectedAlert.severity === 'critical' ? 'bg-status-critical/20 text-status-critical' : 'bg-status-warning/20 text-status-warning'
                  }`}>
                    {selectedAlert.severity}
                  </span>
                  <h2 className="text-base font-bold text-white">{selectedAlert.title}</h2>
                </div>
                <div className="text-xs font-mono text-slate-400 mt-1">
                  Alert ID: {selectedAlert.id} | Confidence: {(selectedAlert.confidence * 100).toFixed(0)}%
                </div>
              </div>

              <div className="flex items-center gap-2">
                {(['INVESTIGATING', 'CONTAINED', 'RESOLVED'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleUpdateStatus(selectedAlert.id, st)}
                    className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                      selectedAlert.status === st
                        ? 'bg-brand-cyan text-slate-950 font-bold'
                        : 'border border-surface-border text-slate-400 hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Evidence & Remediation */}
            <div className="space-y-4 text-xs">
              <div>
                <label className="text-slate-400 font-semibold block mb-1 uppercase tracking-wider text-[11px]">
                  Observed Evidence
                </label>
                <div className="p-3.5 rounded-lg bg-surface-subtle border border-surface-border text-slate-300 leading-relaxed font-mono">
                  {selectedAlert.evidence}
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1 uppercase tracking-wider text-[11px]">
                  Recommended Engineering Remediation
                </label>
                <div className="p-3.5 rounded-lg bg-surface-subtle border border-surface-border text-brand-cyan leading-relaxed">
                  {selectedAlert.remediation}
                </div>
              </div>
            </div>

            {/* AI Incident Post-Mortem Generator */}
            <div className="pt-4 border-t border-surface-border space-y-4">
              <button
                onClick={handleGenerateAIMortem}
                className="flex items-center gap-2 rounded-lg bg-brand-violet/20 border border-brand-violet/40 px-4 py-2 text-xs font-semibold text-brand-violet hover:bg-brand-violet/30 transition-colors"
              >
                <Sparkles className="h-4 w-4" />
                <span>Draft AI Incident Post-Mortem</span>
              </button>

              {generatedReport && (
                <div className="p-4 rounded-xl border border-brand-violet/40 bg-surface-subtle font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {generatedReport}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
