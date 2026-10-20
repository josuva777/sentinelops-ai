import { Agent, Policy, ApprovalRequest, AuditEvent, SecurityAlert, DecisionType } from './types';

export const INITIAL_AGENTS: Agent[] = [
  {
    id: 'agent_fin_01',
    name: 'FinReconcileBot',
    description: 'Autonomous financial ledger reconciliation and wire verification agent',
    status: 'healthy',
    environment: 'production',
    tools: ['query_ledger', 'verify_swift_code', 'initiate_settlement', 'export_csv'],
    activePolicyId: 'pol_fin_strict',
    tokenFingerprint: 'sn_live_9f8a...3b21',
    lastSeen: '12 seconds ago',
    evaluatedActions: 1842,
  },
  {
    id: 'agent_support_02',
    name: 'CustomerSupportCopilot',
    description: 'Tier-1 customer support agent with synthetic CRM lookup and ticket updating',
    status: 'healthy',
    environment: 'production',
    tools: ['lookup_customer', 'update_ticket_status', 'send_user_email', 'reset_session'],
    activePolicyId: 'pol_support_standard',
    tokenFingerprint: 'sn_live_4a1c...e89d',
    lastSeen: '45 seconds ago',
    evaluatedActions: 4920,
  },
  {
    id: 'agent_devops_03',
    name: 'DevOpsInfraWorker',
    description: 'Kubernetes node auto-scaler and deployment orchestration agent',
    status: 'degraded',
    environment: 'staging',
    tools: ['kubectl_apply', 'scale_deployment', 'restart_pod', 'drop_database_table'],
    activePolicyId: 'pol_infra_hardened',
    tokenFingerprint: 'sn_stag_77e1...99bc',
    lastSeen: '4 minutes ago',
    evaluatedActions: 615,
  },
  {
    id: 'agent_research_04',
    name: 'ResearchScraper',
    description: 'Market intelligence web retrieval and document embedding agent',
    status: 'disconnected',
    environment: 'development',
    tools: ['web_fetch', 'extract_text', 'store_vector'],
    activePolicyId: 'pol_dev_default',
    tokenFingerprint: 'sn_dev_11b3...55aa',
    lastSeen: '2 hours ago',
    evaluatedActions: 120,
  },
];

export const INITIAL_POLICIES: Policy[] = [
  {
    id: 'pol_fin_strict',
    name: 'Financial Safeguard Policy (Strict)',
    description: 'Deterministic controls on payment thresholds, foreign wire transfers, and raw ledger mutations',
    version: 3,
    mode: 'ENFORCE',
    targetAgents: ['agent_fin_01'],
    updatedAt: '2026-10-19 14:30 UTC',
    author: 'Elena Rostova (SecOps)',
    rules: [
      {
        id: 'r_fin_01',
        name: 'Block Unsanitized SQL / Schema Changes',
        toolPattern: 'query_ledger',
        paramConstraint: "query NOT CONTAINS ('DROP', 'ALTER', 'TRUNCATE', 'DELETE')",
        action: 'DENY',
        severity: 'critical',
        description: 'Blocks all destructive database schema alterations or deletions by the agent.',
      },
      {
        id: 'r_fin_02',
        name: 'Require Human Approval on Large Settlements',
        toolPattern: 'initiate_settlement',
        paramConstraint: 'amount > 5000',
        action: 'REQUIRE_APPROVAL',
        severity: 'high',
        description: 'Wires or settlements over $5,000 require explicit authorization by a Finance Approver.',
      },
      {
        id: 'r_fin_03',
        name: 'Permit Routine Verification Checks',
        toolPattern: 'verify_swift_code',
        action: 'ALLOW',
        severity: 'low',
        description: 'Read-only SWIFT code routing verification is permitted with normal rate limits.',
      },
    ],
  },
  {
    id: 'pol_support_standard',
    name: 'CRM Data Minimization Policy',
    description: 'Prevents bulk customer data exports and unauthorized session termination',
    version: 2,
    mode: 'ENFORCE',
    targetAgents: ['agent_support_02'],
    updatedAt: '2026-10-18 09:15 UTC',
    author: 'Marcus Vance (AppSec)',
    rules: [
      {
        id: 'r_sup_01',
        name: 'Block External Mass Email Broadcasts',
        toolPattern: 'send_user_email',
        paramConstraint: 'recipient_count > 1',
        action: 'DENY',
        severity: 'high',
        description: 'Support copilot is restricted to 1:1 email replies and prohibited from mass marketing sends.',
      },
      {
        id: 'r_sup_02',
        name: 'Require Approval for VIP Account Modifications',
        toolPattern: 'update_ticket_status',
        paramConstraint: "tier == 'Enterprise VIP'",
        action: 'REQUIRE_APPROVAL',
        severity: 'medium',
        description: 'Escalations and status overrides on VIP tiers require supervisor authorization.',
      },
    ],
  },
  {
    id: 'pol_infra_hardened',
    name: 'Infrastructure Zero-Destruction Guardrail',
    description: 'Strict fail-closed enforcement preventing cluster corruption and unauthorized resource deletion',
    version: 4,
    mode: 'ENFORCE',
    targetAgents: ['agent_devops_03'],
    updatedAt: '2026-10-20 11:00 UTC',
    author: 'Elena Rostova (SecOps)',
    rules: [
      {
        id: 'r_inf_01',
        name: 'Unconditional Block on Drop Database',
        toolPattern: 'drop_database_table',
        action: 'DENY',
        severity: 'critical',
        description: 'Complete block on automated drop table operations by autonomous cluster agents.',
      },
      {
        id: 'r_inf_02',
        name: 'Require Approval on Production Pod Deletions',
        toolPattern: 'restart_pod',
        paramConstraint: "namespace == 'production'",
        action: 'REQUIRE_APPROVAL',
        severity: 'high',
        description: 'Restarting or terminating production pods requires on-call engineer approval.',
      },
    ],
  },
];

export const INITIAL_APPROVALS: ApprovalRequest[] = [
  {
    id: 'appr_8821a',
    token: 'tok_appr_9a12c8e3',
    agentId: 'agent_fin_01',
    agentName: 'FinReconcileBot',
    toolName: 'initiate_settlement',
    payload: {
      beneficiary: 'Apex Cloud Services Inc.',
      amount: 14850.0,
      currency: 'USD',
      invoice_ref: 'INV-2026-9812',
      destination_bank: 'JPMorgan Chase (Wire)',
    },
    matchedPolicyRule: 'r_fin_02: Require Human Approval on Large Settlements',
    reason: 'Settlement amount ($14,850.00) exceeds autonomous spending threshold of $5,000.00.',
    severity: 'high',
    status: 'PENDING',
    createdAt: '3 minutes ago',
    expiresAt: '12 minutes remaining (TTL: 15m)',
  },
  {
    id: 'appr_7714b',
    token: 'tok_appr_4f29a071',
    agentId: 'agent_devops_03',
    agentName: 'DevOpsInfraWorker',
    toolName: 'restart_pod',
    payload: {
      pod_name: 'payment-gateway-worker-7c98f964',
      namespace: 'production',
      reason: 'Memory saturation exceeded 88% watermark',
    },
    matchedPolicyRule: 'r_inf_02: Require Approval on Production Pod Deletions',
    reason: 'Target is a core production transaction service pod. Human sign-off required.',
    severity: 'high',
    status: 'PENDING',
    createdAt: '6 minutes ago',
    expiresAt: '9 minutes remaining (TTL: 15m)',
  },
  {
    id: 'appr_5532c',
    token: 'tok_appr_11c998de',
    agentId: 'agent_support_02',
    agentName: 'CustomerSupportCopilot',
    toolName: 'update_ticket_status',
    payload: {
      ticket_id: 'TCK-8092',
      client_name: 'Stripe Global Enterprise',
      tier: 'Enterprise VIP',
      requested_status: 'FORCE_REFUND_APPROVED',
      amount: 1200.0,
    },
    matchedPolicyRule: 'r_sup_02: Require Approval for VIP Account Modifications',
    reason: 'Customer account tier is Enterprise VIP. Automatic refund exceeds copilot allowance.',
    severity: 'medium',
    status: 'PENDING',
    createdAt: '11 minutes ago',
    expiresAt: '4 minutes remaining (TTL: 15m)',
  },
];

export const INITIAL_AUDIT_EVENTS: AuditEvent[] = [
  {
    id: 'evt_1001',
    timestamp: '2026-10-20 16:32:01 UTC',
    eventHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    prevHash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
    agentId: 'agent_devops_03',
    agentName: 'DevOpsInfraWorker',
    toolName: 'drop_database_table',
    payloadSummary: 'table="customers_archive", cascade=true',
    decision: 'DENY',
    severity: 'critical',
    reasonCode: 'POL_INF_01_BLOCKED',
    traceId: 'tr_devops_9812_001',
    signatureVerified: true,
  },
  {
    id: 'evt_1002',
    timestamp: '2026-10-20 16:31:14 UTC',
    eventHash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
    prevHash: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
    agentId: 'agent_fin_01',
    agentName: 'FinReconcileBot',
    toolName: 'initiate_settlement',
    payloadSummary: 'amount=14850.0, currency="USD", beneficiary="Apex Cloud"',
    decision: 'REQUIRE_APPROVAL',
    severity: 'high',
    reasonCode: 'POL_FIN_02_PENDING_APPROVAL',
    traceId: 'tr_wire_7718_092',
    signatureVerified: true,
  },
  {
    id: 'evt_1003',
    timestamp: '2026-10-20 16:30:45 UTC',
    eventHash: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
    prevHash: 'd4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35',
    agentId: 'agent_fin_01',
    agentName: 'FinReconcileBot',
    toolName: 'verify_swift_code',
    payloadSummary: 'swift_code="CHASUS33XXX", institution="JPMorgan"',
    decision: 'ALLOW',
    severity: 'low',
    reasonCode: 'POL_FIN_03_PERMITTED',
    traceId: 'tr_wire_7718_091',
    signatureVerified: true,
  },
  {
    id: 'evt_1004',
    timestamp: '2026-10-20 16:28:10 UTC',
    eventHash: 'd4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35',
    prevHash: '4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce',
    agentId: 'agent_support_02',
    agentName: 'CustomerSupportCopilot',
    toolName: 'lookup_customer',
    payloadSummary: 'account_id="ACCT-1002", fields=["name", "tier"]',
    decision: 'ALLOW',
    severity: 'low',
    reasonCode: 'POL_SUP_00_PERMITTED',
    traceId: 'tr_sup_3319_404',
    signatureVerified: true,
  },
];

export const INITIAL_ALERTS: SecurityAlert[] = [
  {
    id: 'alt_01',
    title: 'High-Risk Table Drop Intercepted & Blocked',
    severity: 'critical',
    confidence: 0.99,
    agentId: 'agent_devops_03',
    agentName: 'DevOpsInfraWorker',
    timestamp: '16 minutes ago',
    status: 'CONTAINED',
    evidence: 'Agent invoked tool drop_database_table with target "customers_archive". Halted in-line before execution.',
    remediation: 'Inspect prompt trajectory for prompt injection. Verify cluster credentials remain uncompromised.',
  },
  {
    id: 'alt_02',
    title: 'High-Value Settlement Routed to Approval Queue',
    severity: 'high',
    confidence: 0.95,
    agentId: 'agent_fin_01',
    agentName: 'FinReconcileBot',
    timestamp: '25 minutes ago',
    status: 'INVESTIGATING',
    evidence: 'Settlement amount $14,850.00 triggered rule r_fin_02. Token tok_appr_9a12c8e3 generated with 15m expiry.',
    remediation: 'Review invoice reference INV-2026-9812 against ERP before issuing one-time approval.',
  },
  {
    id: 'alt_03',
    title: 'Agent Disconnected from Heartbeat Keep-Alive',
    severity: 'medium',
    confidence: 0.88,
    agentId: 'agent_research_04',
    agentName: 'ResearchScraper',
    timestamp: '2 hours ago',
    status: 'INVESTIGATING',
    evidence: 'Heartbeat signal lost for > 60 minutes. Integration token status set to degraded.',
    remediation: 'Verify pod health in development namespace. Cycle API token if node was ungracefully terminated.',
  },
];

// In-Memory Reactive State Helper
export function simulatePolicyEvaluation(toolName: string, paramPayload: Record<string, any>): {
  decision: DecisionType;
  ruleMatched: string;
  reason: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
} {
  // Check against known deterministic threat patterns
  if (toolName === 'drop_database_table' || (paramPayload.query && /DROP|DELETE|TRUNCATE/i.test(paramPayload.query))) {
    return {
      decision: 'DENY',
      ruleMatched: 'r_inf_01: Zero-Destruction Guardrail',
      reason: 'Critical destructive database modification intercepted in-line. Action halted.',
      severity: 'critical',
    };
  }

  if (toolName === 'initiate_settlement' && Number(paramPayload.amount) > 5000) {
    return {
      decision: 'REQUIRE_APPROVAL',
      ruleMatched: 'r_fin_02: Large Settlement Human Verification',
      reason: `Amount ($${Number(paramPayload.amount).toLocaleString()}) exceeds the autonomous threshold of $5,000. Paused for human approval.`,
      severity: 'high',
    };
  }

  if (toolName === 'send_user_email' && Number(paramPayload.recipient_count) > 1) {
    return {
      decision: 'DENY',
      ruleMatched: 'r_sup_01: Mass Email Block',
      reason: 'Autonomous agents are prohibited from mass marketing broadcasting.',
      severity: 'high',
    };
  }

  return {
    decision: 'ALLOW',
    ruleMatched: 'r_default: Permitted Autonomous Action',
    reason: 'Parameters satisfy active organization constraints. Pre-flight approved.',
    severity: 'low',
  };
}
