'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_APPROVALS, INITIAL_ALERTS } from './dataStore';
import { ApprovalRequest, SecurityAlert, AlertStatus, ApprovalStatus } from './types';

interface OperationsContextType {
  approvals: ApprovalRequest[];
  alerts: SecurityAlert[];
  unreadAlertCount: number;
  pendingApprovalCount: number;
  approveRequest: (id: string, operatorNotes?: string) => void;
  rejectRequest: (id: string, operatorNotes?: string) => void;
  updateAlertStatus: (id: string, status: AlertStatus) => void;
  clearAllAlerts: () => void;
  markAllAlertsRead: () => void;
}

const OperationsContext = createContext<OperationsContextType | undefined>(undefined);

export function OperationsProvider({ children }: { children: React.ReactNode }) {
  const [approvals, setApprovals] = useState<ApprovalRequest[]>(INITIAL_APPROVALS);
  const [alerts, setAlerts] = useState<SecurityAlert[]>(INITIAL_ALERTS);

  // Load from localStorage if present
  useEffect(() => {
    try {
      const savedApprovals = localStorage.getItem('sentinelops_approvals');
      if (savedApprovals) setApprovals(JSON.parse(savedApprovals));

      const savedAlerts = localStorage.getItem('sentinelops_alerts');
      if (savedAlerts) setAlerts(JSON.parse(savedAlerts));
    } catch (e) {
      // Ignore
    }
  }, []);

  const approveRequest = (id: string, operatorNotes: string = 'Approved by operator') => {
    const next = approvals.map((a) =>
      a.id === id ? { ...a, status: 'APPROVED' as ApprovalStatus, decisionNote: operatorNotes, decidedBy: 'Security Operator' } : a
    );
    setApprovals(next);
    localStorage.setItem('sentinelops_approvals', JSON.stringify(next));
  };

  const rejectRequest = (id: string, operatorNotes: string = 'Rejected by operator') => {
    const next = approvals.map((a) =>
      a.id === id ? { ...a, status: 'REJECTED' as ApprovalStatus, decisionNote: operatorNotes, decidedBy: 'Security Operator' } : a
    );
    setApprovals(next);
    localStorage.setItem('sentinelops_approvals', JSON.stringify(next));
  };

  const updateAlertStatus = (id: string, status: AlertStatus) => {
    const next = alerts.map((a) => (a.id === id ? { ...a, status } : a));
    setAlerts(next);
    localStorage.setItem('sentinelops_alerts', JSON.stringify(next));
  };

  const clearAllAlerts = () => {
    const next = alerts.map((a) => ({ ...a, status: 'RESOLVED' as AlertStatus }));
    setAlerts(next);
    localStorage.setItem('sentinelops_alerts', JSON.stringify(next));
  };

  const markAllAlertsRead = () => {
    clearAllAlerts();
  };

  const pendingApprovalCount = approvals.filter((a) => a.status === 'PENDING').length;
  // Unread/active alerts are those not resolved
  const unreadAlertCount = alerts.filter((a) => a.status !== 'RESOLVED').length;

  return (
    <OperationsContext.Provider
      value={{
        approvals,
        alerts,
        unreadAlertCount,
        pendingApprovalCount,
        approveRequest,
        rejectRequest,
        updateAlertStatus,
        clearAllAlerts,
        markAllAlertsRead,
      }}
    >
      {children}
    </OperationsContext.Provider>
  );
}

export function useOperations() {
  const ctx = useContext(OperationsContext);
  if (!ctx) {
    throw new Error('useOperations must be used within an OperationsProvider');
  }
  return ctx;
}
