export type AgentStatus = 'healthy' | 'degraded' | 'disconnected' | 'disabled';
export type DecisionType = 'ALLOW' | 'DENY' | 'REQUIRE_APPROVAL';
export type SeverityType = 'low' | 'medium' | 'high' | 'critical';
export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';
export type AlertStatus = 'INVESTIGATING' | 'CONTAINED' | 'RESOLVED';

export interface Agent {
  id: string;
  name: string;
  description: string;
  status: AgentStatus;
  environment: 'production' | 'staging' | 'development';
  tools: string[];
  activePolicyId: string;
  tokenFingerprint: string;
  lastSeen: string;
  evaluatedActions: number;
}

export interface PolicyRule {
  id: string;
  name: string;
  toolPattern: string; // e.g. "db_*", "payment_execute", "*"
  paramConstraint?: string; // e.g. "amount <= 5000", "table != 'users'"
  action: DecisionType;
  severity: SeverityType;
  description: string;
}

export interface Policy {
  id: string;
  name: string;
  description: string;
  version: number;
  mode: 'ENFORCE' | 'SIMULATE';
  targetAgents: string[]; // Agent IDs or "*"
  rules: PolicyRule[];
  updatedAt: string;
  author: string;
}

export interface ApprovalRequest {
  id: string;
  token: string;
  agentId: string;
  agentName: string;
  toolName: string;
  payload: Record<string, any>;
  matchedPolicyRule: string;
  reason: string;
  severity: SeverityType;
  status: ApprovalStatus;
  createdAt: string;
  expiresAt: string;
  decidedBy?: string;
  decisionNote?: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  eventHash: string;
  prevHash: string;
  agentId: string;
  agentName: string;
  toolName: string;
  payloadSummary: string;
  decision: DecisionType;
  severity: SeverityType;
  reasonCode: string;
  traceId: string;
  signatureVerified: boolean;
}

export interface SecurityAlert {
  id: string;
  title: string;
  severity: SeverityType;
  confidence: number;
  agentId: string;
  agentName: string;
  timestamp: string;
  status: AlertStatus;
  evidence: string;
  remediation: string;
}
