'use client';

import React, { useState } from 'react';
import { useOperations } from '../../../lib/operationsContext';
import { useTheme } from '../../../lib/themeContext';
import { SecurityAlert, AlertStatus } from '../../../lib/types';
import { AlertTriangle, Shield, CheckCircle2, Sparkles, Check, CheckCheck } from 'lucide-react';

export default function AlertsPage() {
  const { alerts, updateAlertStatus, clearAllAlerts } = useOperations();
  const { currentTheme } = useTheme();
  const [selectedAlertId, setSelectedAlertId] = useState<string>(alerts[0]?.id || '');
  const [generatedReport, setGeneratedReport] = useState<string | null>(null);

  const selectedAlert = alerts.find((a) => a.id === selectedAlertId) || alerts[0];

  const handleUpdateStatus = (alertId: string, newStatus: AlertStatus) => {
    updateAlertStatus(alertId, newStatus);
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
      `- Agent trajectory analysis indicates prompt injection or unconstrained tool recursion.\n\n` +
      `3. Recommended Engineering Remediation:\n` +
      `- ${selectedAlert.remediation}\n` +
      `- Apply AST token whitelist rule in Policy Centre for agent ${selectedAlert.agentId}.`
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b" style={{ borderColor: currentTheme.surfaceBorder }}>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Security Alerts & Incidents</h1>
          <p className="text-xs text-slate-400 mt-1">
            Investigate intercepted violations, examine tool parameters, and generate evidence-based incident reports.
          </p>
        </div>

        <button
          onClick={clearAllAlerts}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-mono font-semibold transition-all hover:opacity-90 self-start sm:self-center"
          style={{
            backgroundColor: currentTheme.badgeBg,
            borderColor: currentTheme.surfaceBorder,
            color: currentTheme.badgeText,
          }}
        >
          <CheckCheck className="w-4 h-4" style={{ color: currentTheme.primary }} />
          <span>Resolve All Incidents</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Alert List */}
        <div className="space-y-3">
          {alerts.map((alert) => {
            const isSelected = selectedAlert?.id === alert.id;
            return (
              <div
                key={alert.id}
                onClick={() => {
                  setSelectedAlertId(alert.id);
                  setGeneratedReport(null);
                }}
                className="p-4 rounded-xl border transition-all cursor-pointer"
                style={{
                  backgroundColor: currentTheme.surface,
                  borderColor: isSelected ? currentTheme.primary : currentTheme.surfaceBorder,
                  boxShadow: isSelected ? `0 0 20px -5px ${currentTheme.glow}` : 'none',
                }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono border ${
                    alert.severity === 'critical'
                      ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                      : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                  }`}>
                    {alert.severity}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{alert.timestamp}</span>
                </div>

                <h3 className="text-xs font-bold text-white mt-2 leading-snug">{alert.title}</h3>
                <div className="mt-2 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                  <span>Agent: {alert.agentName}</span>
                  <span className={`font-semibold ${
                    alert.status === 'RESOLVED' ? 'text-emerald-400' : alert.status === 'CONTAINED' ? 'text-amber-400' : 'text-rose-400'
                  }`}>
                    {alert.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column (2 Cols): Detail & Investigation Workspace */}
        {selectedAlert && (
          <div
            className="lg:col-span-2 rounded-2xl border p-6 space-y-6 shadow-xl"
            style={{
              backgroundColor: currentTheme.surface,
              borderColor: currentTheme.surfaceBorder,
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4" style={{ borderColor: currentTheme.surfaceBorder }}>
              <div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono border ${
                    selectedAlert.severity === 'critical' ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
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
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors border ${
                      selectedAlert.status === st
                        ? 'font-bold text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    style={{
                      backgroundColor: selectedAlert.status === st ? currentTheme.primary : 'transparent',
                      borderColor: selectedAlert.status === st ? currentTheme.primary : currentTheme.surfaceBorder,
                    }}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Evidence & Remediation */}
            <div className="space-y-4 text-xs">
              <div>
                <label className="text-slate-400 font-semibold block mb-1 uppercase tracking-wider text-[11px] font-mono">
                  Observed Evidence
                </label>
                <div
                  className="p-3.5 rounded-xl border text-slate-300 leading-relaxed font-mono"
                  style={{
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    borderColor: currentTheme.surfaceBorder,
                  }}
                >
                  {selectedAlert.evidence}
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1 uppercase tracking-wider text-[11px] font-mono">
                  Recommended Engineering Remediation
                </label>
                <div
                  className="p-3.5 rounded-xl border leading-relaxed font-mono"
                  style={{
                    backgroundColor: currentTheme.badgeBg,
                    borderColor: currentTheme.surfaceBorder,
                    color: currentTheme.badgeText,
                  }}
                >
                  {selectedAlert.remediation}
                </div>
              </div>
            </div>

            {/* AI Incident Post-Mortem Generator */}
            <div className="pt-4 border-t space-y-4" style={{ borderColor: currentTheme.surfaceBorder }}>
              <button
                onClick={handleGenerateAIMortem}
                className="flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold transition-all hover:opacity-90 shadow-lg"
                style={{
                  backgroundColor: currentTheme.badgeBg,
                  borderColor: currentTheme.surfaceBorder,
                  color: currentTheme.badgeText,
                }}
              >
                <Sparkles className="h-4 w-4" style={{ color: currentTheme.primary }} />
                <span>Draft AI Incident Post-Mortem</span>
              </button>

              {generatedReport && (
                <div
                  className="p-4 rounded-xl border font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed shadow-inner"
                  style={{
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    borderColor: currentTheme.surfaceBorder,
                  }}
                >
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
