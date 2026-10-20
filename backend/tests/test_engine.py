import pytest
import time
from app.engine import SecurityEngine, GENESIS_HASH
from app.models import EventEvaluationRequest

def test_engine_initializes_with_genesis_hash():
    engine = SecurityEngine()
    assert engine.latest_hash == GENESIS_HASH
    assert len(engine.audit_ledger) == 0

def test_engine_allows_routine_safe_tool():
    engine = SecurityEngine()
    req = EventEvaluationRequest(
        agent_id="support_bot",
        tool_name="lookup_customer",
        arguments={"account_id": "ACCT-101"},
    )
    res = engine.evaluate(req)
    assert res.decision == "ALLOW"
    assert len(engine.audit_ledger) == 1
    assert engine.audit_ledger[0].prev_hash == GENESIS_HASH

def test_engine_blocks_destructive_database_tool():
    engine = SecurityEngine()
    req = EventEvaluationRequest(
        agent_id="devops_agent",
        tool_name="drop_database_table",
        arguments={"table": "users_prod"},
    )
    res = engine.evaluate(req)
    assert res.decision == "DENY"
    assert res.severity == "critical"
    assert "r_zero_destruct" in res.rule_matched

def test_engine_blocks_sql_injection_in_query_parameter():
    engine = SecurityEngine()
    req = EventEvaluationRequest(
        agent_id="analytics_agent",
        tool_name="run_analytics_query",
        arguments={"query": "SELECT * FROM sales; DROP TABLE audit_log;"},
    )
    res = engine.evaluate(req)
    assert res.decision == "DENY"
    assert res.severity == "critical"

def test_engine_routes_large_settlement_to_approval_queue():
    engine = SecurityEngine()
    req = EventEvaluationRequest(
        agent_id="fin_agent",
        tool_name="initiate_settlement",
        arguments={"amount": 12500, "currency": "USD"},
    )
    res = engine.evaluate(req)
    assert res.decision == "REQUIRE_APPROVAL"
    assert res.approval_token is not None
    assert res.approval_id is not None
    assert res.approval_id in engine.approvals

    # Verify pending state
    approval = engine.approvals[res.approval_id]
    assert approval.status == "PENDING"
    assert approval.expires_at > time.time()

def test_engine_approval_decision_idempotency_and_state_lock():
    engine = SecurityEngine()
    req = EventEvaluationRequest(
        agent_id="fin_agent",
        tool_name="initiate_settlement",
        arguments={"amount": 8000},
    )
    res = engine.evaluate(req)
    approval_id = res.approval_id

    # 1. First approval succeeds
    decided = engine.decide_approval(
        approval_id=approval_id,
        decision="APPROVED",
        decided_by="Elena (SecOps)",
        note="Verified ERP invoice",
    )
    assert decided.status == "APPROVED"
    assert decided.decided_by == "Elena (SecOps)"

    # 2. Second attempt fails with ValueError (preventing replay attacks)
    with pytest.raises(ValueError, match="already been finalized"):
        engine.decide_approval(
            approval_id=approval_id,
            decision="REJECTED",
            decided_by="Another User",
        )

def test_engine_verifies_unbroken_sha256_hash_chain():
    engine = SecurityEngine()
    
    # Run 5 diverse actions
    for i in range(5):
        engine.evaluate(EventEvaluationRequest(
            agent_id=f"agent_{i}",
            tool_name=f"tool_step_{i}",
            arguments={"step": i},
        ))

    valid, count, message = engine.verify_ledger_integrity()
    assert valid is True
    assert count == 5
    assert "verified unbroken" in message
