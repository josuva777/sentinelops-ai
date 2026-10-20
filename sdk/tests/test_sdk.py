import pytest
from unittest.mock import MagicMock
from sentinelops.client import SentinelOpsClient
from sentinelops.middleware import protect_tool
from sentinelops.exceptions import SentinelOpsSecurityViolation

def test_sdk_allows_permitted_tool_execution():
    client = SentinelOpsClient(agent_id="test_agent", api_key="test_key")
    client.evaluate_tool = MagicMock(return_value={"decision": "ALLOW", "reason": "Permitted"})

    execution_flag = False

    @protect_tool(client=client, tool_name="safe_reader")
    def read_data(doc_id: str):
        nonlocal execution_flag
        execution_flag = True
        return f"Content of {doc_id}"

    res = read_data("doc_123")
    assert res == "Content of doc_123"
    assert execution_flag is True
    client.evaluate_tool.assert_called_once_with(tool_name="safe_reader", arguments={"doc_id": "doc_123"})

def test_sdk_halts_execution_before_function_body_runs_on_deny():
    client = SentinelOpsClient(agent_id="test_agent", api_key="test_key")
    client.evaluate_tool = MagicMock(return_value={
        "decision": "DENY",
        "rule_matched": "r_zero_destruct",
        "reason": "Destructive table operations prohibited.",
    })

    execution_flag = False

    @protect_tool(client=client, tool_name="drop_database_table")
    def dangerous_function(table_name: str):
        nonlocal execution_flag
        execution_flag = True
        return "TABLE_DROPPED"

    with pytest.raises(SentinelOpsSecurityViolation) as exc_info:
        dangerous_function("production_users")

    # PROOF: Function body was NEVER executed!
    assert execution_flag is False
    assert "r_zero_destruct" in str(exc_info.value)
    assert "Destructive table operations prohibited" in str(exc_info.value)

def test_sdk_halts_on_unapproved_sensitive_action():
    client = SentinelOpsClient(agent_id="test_agent", api_key="test_key")
    client.evaluate_tool = MagicMock(return_value={
        "decision": "REQUIRE_APPROVAL",
        "approval_id": "appr_9981",
        "rule_matched": "r_large_wire",
        "reason": "Amount > $5,000 threshold.",
    })

    executed = False

    @protect_tool(client=client, tool_name="wire_transfer")
    def send_wire(amount: float):
        nonlocal executed
        executed = True
        return "WIRED"

    # Default without wait_for_human_approval raises violation to halt autonomous loop
    with pytest.raises(SentinelOpsSecurityViolation) as exc_info:
        send_wire(10000.0)

    assert executed is False
    assert "Requires human approval" in str(exc_info.value)
