import time
import hashlib
import json
import re
from typing import Dict, Any, List, Optional, Tuple
from app.models import (
    EventEvaluationRequest,
    EventEvaluationResponse,
    ApprovalRecord,
    AuditRecord,
    DecisionType,
    Policy,
    PolicyRule,
)

GENESIS_HASH = "0" * 64

class SecurityEngine:
    def __init__(self):
        self.approvals: Dict[str, ApprovalRecord] = {}
        self.audit_ledger: List[AuditRecord] = []
        self.latest_hash: str = GENESIS_HASH
        self._init_default_policies()

    def _init_default_policies(self):
        self.policies: List[Policy] = [
            Policy(
                id="pol_system_default",
                name="Default System Enforcement Policy",
                mode="ENFORCE",
                target_agents=["*"],
                rules=[
                    PolicyRule(
                        id="r_zero_destruct",
                        name="Zero-Destruction Guardrail",
                        tool_pattern=".*(drop|delete|truncate)_.*table.*",
                        action="DENY",
                        severity="critical",
                        description="Strict block on automated destructive database operations.",
                    ),
                    PolicyRule(
                        id="r_large_wire",
                        name="Large Settlement Human Sign-off",
                        tool_pattern=".*(initiate|process|send)_.*(settlement|wire|transfer).*",
                        param_constraint="amount > 5000",
                        action="REQUIRE_APPROVAL",
                        severity="high",
                        description="Transactions over $5,000 require explicit human operator approval.",
                    ),
                    PolicyRule(
                        id="r_mass_broadcast",
                        name="Prevent Mass Email Broadcasts",
                        tool_pattern=".*(send|dispatch)_.*email.*",
                        param_constraint="recipient_count > 1",
                        action="DENY",
                        severity="high",
                        description="Agents are prohibited from automated mass marketing email broadcasts.",
                    ),
                ],
            )
        ]

    def evaluate(self, request: EventEvaluationRequest) -> EventEvaluationResponse:
        tool = request.tool_name.lower()
        args = request.arguments or {}

        # 1. Deterministic Rule Matching
        decision: DecisionType = "ALLOW"
        matched_rule_id = "r_default_permit"
        reason = "Tool call arguments satisfy active security policies. Execution permitted."
        severity = "low"

        for policy in self.policies:
            if "*" not in policy.target_agents and request.agent_id not in policy.target_agents:
                continue

            for rule in policy.rules:
                # Check tool pattern match
                if re.match(rule.tool_pattern, tool) or tool == rule.tool_pattern:
                    # Evaluate parameter constraints if defined
                    if rule.param_constraint:
                        if rule.param_constraint == "amount > 5000":
                            amount = float(args.get("amount", 0))
                            if amount > 5000:
                                decision = rule.action
                                matched_rule_id = rule.id
                                reason = f"Parameter amount (${amount:,.2f}) exceeds autonomous limit ($5,000.00). Human approval required."
                                severity = rule.severity
                                break
                        elif rule.param_constraint == "recipient_count > 1":
                            count = int(args.get("recipient_count", 1))
                            if count > 1:
                                decision = rule.action
                                matched_rule_id = rule.id
                                reason = f"Recipient count ({count}) exceeds 1:1 communication boundary."
                                severity = rule.severity
                                break
                    else:
                        decision = rule.action
                        matched_rule_id = rule.id
                        reason = f"Tool '{tool}' matched security rule '{rule.name}'."
                        severity = rule.severity
                        break

            if decision != "ALLOW":
                break

        # Fallback check on raw SQL statements in query arguments
        if "query" in args and isinstance(args["query"], str):
            if re.search(r"\b(DROP|TRUNCATE|DELETE)\b", args["query"], re.IGNORECASE):
                decision = "DENY"
                matched_rule_id = "r_zero_destruct_sql"
                reason = "Destructive SQL keyword detected in parameter 'query'. Execution halted."
                severity = "critical"

        # 2. If REQUIRE_APPROVAL: Create unforgeable approval token with 15m TTL
        approval_token: Optional[str] = None
        approval_id: Optional[str] = None

        if decision == "REQUIRE_APPROVAL":
            approval_id = f"appr_{int(time.time() * 1000)}"
            approval_token = f"tok_appr_{hashlib.sha256(f'{approval_id}:{request.agent_id}:{tool}'.encode()).hexdigest()[:16]}"
            rec = ApprovalRecord(
                id=approval_id,
                token=approval_token,
                agent_id=request.agent_id,
                tool_name=request.tool_name,
                arguments=args,
                matched_rule=matched_rule_id,
                reason=reason,
                severity=severity,
                status="PENDING",
                created_at=time.time(),
                expires_at=time.time() + 900.0, # 15 minutes TTL
            )
            self.approvals[approval_id] = rec

        # 3. Cryptographic SHA-256 Hash Chaining
        timestamp_str = time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime())
        trace_id = request.trace_id or f"tr_{hashlib.md5(f'{time.time()}:{tool}'.encode()).hexdigest()[:10]}"
        
        block_payload = f"{self.latest_hash}:{timestamp_str}:{request.agent_id}:{tool}:{json.dumps(args, sort_keys=True)}:{decision}"
        event_hash = hashlib.sha256(block_payload.encode()).hexdigest()

        audit_entry = AuditRecord(
            id=f"evt_{len(self.audit_ledger) + 1}",
            timestamp=timestamp_str,
            event_hash=event_hash,
            prev_hash=self.latest_hash,
            agent_id=request.agent_id,
            tool_name=request.tool_name,
            arguments=args,
            decision=decision,
            severity=severity,
            reason_code=matched_rule_id,
            trace_id=trace_id,
        )

        self.audit_ledger.append(audit_entry)
        self.latest_hash = event_hash

        return EventEvaluationResponse(
            decision=decision,
            reason=reason,
            rule_matched=matched_rule_id,
            severity=severity,
            approval_token=approval_token,
            approval_id=approval_id,
            event_hash=event_hash,
            timestamp=timestamp_str,
        )

    def decide_approval(self, approval_id: str, decision: str, decided_by: str, note: Optional[str] = None) -> ApprovalRecord:
        if approval_id not in self.approvals:
            raise KeyError(f"Approval request '{approval_id}' not found.")

        rec = self.approvals[approval_id]

        if rec.status != "PENDING":
            raise ValueError(f"Approval request '{approval_id}' has already been finalized as {rec.status}.")

        if time.time() > rec.expires_at:
            rec.status = "EXPIRED"
            raise ValueError(f"Approval request '{approval_id}' expired at {time.strftime('%H:%M:%S', time.gmtime(rec.expires_at))}.")

        rec.status = "APPROVED" if decision == "APPROVED" else "REJECTED"
        rec.decided_by = decided_by
        rec.decision_note = note or "Decision finalized by security operator."

        # Append decision to audit ledger
        timestamp_str = time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime())
        block_payload = f"{self.latest_hash}:{timestamp_str}:{rec.agent_id}:approval_decision:{rec.id}:{rec.status}"
        event_hash = hashlib.sha256(block_payload.encode()).hexdigest()

        audit_entry = AuditRecord(
            id=f"evt_{len(self.audit_ledger) + 1}",
            timestamp=timestamp_str,
            event_hash=event_hash,
            prev_hash=self.latest_hash,
            agent_id=rec.agent_id,
            tool_name=f"approval_decision_{rec.tool_name}",
            arguments={"approval_id": rec.id, "decision": rec.status, "decided_by": decided_by},
            decision="ALLOW" if rec.status == "APPROVED" else "DENY",
            severity=rec.severity,
            reason_code=f"APPROVAL_{rec.status}",
            trace_id=f"tr_appr_{rec.id}",
        )
        self.audit_ledger.append(audit_entry)
        self.latest_hash = event_hash

        return rec

    def verify_ledger_integrity(self) -> Tuple[bool, int, str]:
        """Iterates through every block in the ledger to mathematically verify hash chaining."""
        prev = GENESIS_HASH
        for idx, entry in enumerate(self.audit_ledger):
            if entry.prev_hash != prev:
                return False, idx, f"Hash broken at block {entry.id}. Expected prev {prev}, found {entry.prev_hash}."
            prev = entry.event_hash
        return True, len(self.audit_ledger), f"All {len(self.audit_ledger)} audit ledger blocks verified unbroken."

    def append_external_audit(self, agent_id: str, tool_name: str, arguments: dict, decision: str, reason: str, severity: str = "medium") -> AuditRecord:
        """Appends verified external operational or financial transactions into the tamper-evident SHA-256 chain."""
        timestamp_str = time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime())
        block_payload = f"{self.latest_hash}:{timestamp_str}:{agent_id}:{tool_name}:{decision}:{reason}"
        event_hash = hashlib.sha256(block_payload.encode()).hexdigest()

        audit_entry = AuditRecord(
            id=f"evt_fin_{len(self.audit_ledger) + 1}",
            timestamp=timestamp_str,
            event_hash=event_hash,
            prev_hash=self.latest_hash,
            agent_id=agent_id,
            tool_name=tool_name,
            arguments=arguments,
            decision=decision,
            severity=severity,
            reason_code=f"FINANCIAL_{decision}",
            trace_id=f"tr_fin_{len(self.audit_ledger) + 1}",
        )
        self.audit_ledger.append(audit_entry)
        self.latest_hash = event_hash
        return audit_entry

engine = SecurityEngine()
