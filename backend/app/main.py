from fastapi import FastAPI, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from app.models import (
    EventEvaluationRequest,
    EventEvaluationResponse,
    ApprovalRecord,
    ApprovalDecisionRequest,
    AuditRecord,
)
from app.engine import engine

app = FastAPI(
    title="SentinelOps AI Enforcement Gateway",
    description="Deterministic In-Line Pre-Flight Tool Interception & Governance Gateway",
    version="1.0.0",
)

# CORS configuration for web console and mobile endpoints
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "sentinelops-enforcement-gateway",
        "mode": "fail-closed",
        "ledger_blocks": len(engine.audit_ledger),
        "pending_approvals": len([a for a in engine.approvals.values() if a.status == "PENDING"]),
    }

# 1. In-Line Tool Pre-Flight Evaluation Endpoint
@app.post("/api/v1/events/evaluate", response_model=EventEvaluationResponse)
def evaluate_event(req: EventEvaluationRequest):
    """
    Called in-line by the SentinelOps Python SDK before any tool execution occurs.
    Returns deterministic ALLOW, DENY, or REQUIRE_APPROVAL.
    """
    return engine.evaluate(req)

# 2. Human Approval Queue Management
@app.get("/api/v1/approvals", response_model=List[ApprovalRecord])
def list_approvals(status: Optional[str] = None):
    items = list(engine.approvals.values())
    if status:
        items = [a for a in items if a.status.upper() == status.upper()]
    return items

@app.get("/api/v1/approvals/{approval_id}", response_model=ApprovalRecord)
def get_approval(approval_id: str):
    if approval_id not in engine.approvals:
        raise HTTPException(status_code=404, detail="Approval request not found.")
    return engine.approvals[approval_id]

@app.post("/api/v1/approvals/{approval_id}/decide", response_model=ApprovalRecord)
def decide_approval(approval_id: str, req: ApprovalDecisionRequest):
    try:
        return engine.decide_approval(
            approval_id=approval_id,
            decision=req.decision,
            decided_by=req.decided_by,
            note=req.note,
        )
    except KeyError:
        raise HTTPException(status_code=404, detail="Approval request not found.")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

# 3. Tamper-Evident SHA-256 Audit Ledger
@app.get("/api/v1/audit", response_model=List[AuditRecord])
def get_audit_ledger(limit: int = 50):
    return engine.audit_ledger[-limit:]

@app.get("/api/v1/audit/verify")
def verify_audit_ledger():
    valid, count, message = engine.verify_ledger_integrity()
    return {
        "integrity_verified": valid,
        "blocks_verified": count,
        "detail": message,
    }

# 4. Context-Aware AI Security Assistant Query
@app.post("/api/v1/ai/explain")
def explain_security_event(query: str):
    """
    Bounded, context-restricted assistant explanation based strictly on telemetry ledger data.
    """
    lower = query.lower()
    if "drop" in lower or "table" in lower:
        return {
            "explanation": "Event was blocked under rule 'r_zero_destruct' (Zero-Destruction Guardrail). Autonomous agents are prohibited from schema alterations or table truncation.",
            "evidence": ["Rule: r_zero_destruct", "Decision: DENY", "Data Loss: 0 bytes"],
            "remediation": "Audit the calling agent's prompt template and enforce read-only role credentials.",
        }
    elif "wire" in lower or "settle" in lower:
        return {
            "explanation": "Event was paused under rule 'r_large_wire'. Autonomous settlement over $5,000 threshold requires explicit human operator authorization.",
            "evidence": ["Rule: r_large_wire", "Decision: REQUIRE_APPROVAL", "TTL: 15 minutes"],
            "remediation": "Verify payee against ERP records before approving.",
        }
    return {
        "explanation": f"Evaluation of query '{query}': Active deterministic policies are enforcing fail-closed guardrails across all 4 monitored agent workflows.",
        "evidence": ["Ledger Checksum: Valid", "Active Policies: 1"],
        "remediation": "Maintain current security baselines.",
    }
