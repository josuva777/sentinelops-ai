import time
from typing import Dict, Any, Optional
import httpx
from .exceptions import SentinelOpsSecurityViolation, ApprovalTimeoutError

class SentinelOpsClient:
    def __init__(
        self,
        agent_id: str,
        api_key: str,
        gateway_url: str = "http://localhost:8000",
        fail_closed: bool = True,
        timeout: float = 5.0,
    ):
        self.agent_id = agent_id
        self.api_key = api_key
        self.gateway_url = gateway_url.rstrip("/")
        self.fail_closed = fail_closed
        self.timeout = timeout

    def evaluate_tool(self, tool_name: str, arguments: Dict[str, Any]) -> Dict[str, Any]:
        """
        Sends an in-line evaluation request to the SentinelOps gateway.
        If the gateway is unreachable and fail_closed=True, raises SentinelOpsSecurityViolation.
        """
        url = f"{self.gateway_url}/api/v1/events/evaluate"
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }
        payload = {
            "agent_id": self.agent_id,
            "tool_name": tool_name,
            "arguments": arguments,
        }

        try:
            with httpx.Client(timeout=self.timeout) as client:
                res = client.post(url, json=payload, headers=headers)
                if res.status_code == 200:
                    return res.json()
                elif res.status_code == 403 or res.status_code == 400:
                    raise SentinelOpsSecurityViolation(
                        tool_name=tool_name,
                        rule="GATEWAY_REJECT",
                        reason=res.text,
                    )
                else:
                    if self.fail_closed:
                        raise SentinelOpsSecurityViolation(
                            tool_name=tool_name,
                            rule="FAIL_CLOSED_GATEWAY_ERROR",
                            reason=f"Gateway responded with HTTP {res.status_code}. Halting fail-closed.",
                        )
                    return {"decision": "ALLOW", "reason": "Fail-open fallback active."}
        except httpx.RequestError as e:
            if self.fail_closed:
                raise SentinelOpsSecurityViolation(
                    tool_name=tool_name,
                    rule="FAIL_CLOSED_NETWORK_ERROR",
                    reason=f"Cannot reach SentinelOps gateway ({e}). Halting fail-closed to protect resources.",
                )
            return {"decision": "ALLOW", "reason": "Fail-open fallback active."}

    def wait_for_approval(self, approval_id: str, poll_interval: float = 1.0, max_wait: float = 30.0) -> bool:
        """Polls the approval endpoint until human approval is finalized or timeout occurs."""
        url = f"{self.gateway_url}/api/v1/approvals/{approval_id}"
        start = time.time()

        with httpx.Client(timeout=self.timeout) as client:
            while time.time() - start < max_wait:
                try:
                    res = client.get(url)
                    if res.status_code == 200:
                        data = res.json()
                        if data.get("status") == "APPROVED":
                            return True
                        elif data.get("status") == "REJECTED":
                            raise SentinelOpsSecurityViolation(
                                tool_name=data.get("tool_name", "unknown"),
                                rule=data.get("matched_rule", "HUMAN_REJECTION"),
                                reason="Human approver rejected this operation.",
                            )
                except httpx.RequestError:
                    pass
                time.sleep(poll_interval)

        raise ApprovalTimeoutError(f"Approval request '{approval_id}' timed out after {max_wait}s.")
