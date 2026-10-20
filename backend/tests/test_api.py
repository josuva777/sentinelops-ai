import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_api_health_check():
    res = client.get("/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert data["mode"] == "fail-closed"

def test_api_evaluate_permitted_event():
    res = client.post(
        "/api/v1/events/evaluate",
        json={
            "agent_id": "test_bot",
            "tool_name": "fetch_profile",
            "arguments": {"id": 101},
        },
    )
    assert res.status_code == 200
    data = res.json()
    assert data["decision"] == "ALLOW"
    assert len(data["event_hash"]) == 64

def test_api_evaluate_destructive_action_blocked():
    res = client.post(
        "/api/v1/events/evaluate",
        json={
            "agent_id": "malicious_bot",
            "tool_name": "drop_database_table",
            "arguments": {"table": "payments"},
        },
    )
    assert res.status_code == 200
    data = res.json()
    assert data["decision"] == "DENY"
    assert data["severity"] == "critical"

def test_api_approval_lifecycle_via_rest():
    # 1. Trigger approval required
    res = client.post(
        "/api/v1/events/evaluate",
        json={
            "agent_id": "wire_bot",
            "tool_name": "initiate_settlement",
            "arguments": {"amount": 25000},
        },
    )
    assert res.status_code == 200
    approval_id = res.json()["approval_id"]

    # 2. Inspect pending approval
    res_get = client.get(f"/api/v1/approvals/{approval_id}")
    assert res_get.status_code == 200
    assert res_get.json()["status"] == "PENDING"

    # 3. Submit decision
    res_dec = client.post(
        f"/api/v1/approvals/{approval_id}/decide",
        json={"decision": "APPROVED", "decided_by": "Ops Manager", "note": "OK"},
    )
    assert res_dec.status_code == 200
    assert res_dec.json()["status"] == "APPROVED"

def test_api_verify_audit_ledger_integrity():
    res = client.get("/api/v1/audit/verify")
    assert res.status_code == 200
    data = res.json()
    assert data["integrity_verified"] is True
    assert data["blocks_verified"] >= 1
