class SentinelOpsException(Exception):
    """Base exception for all SentinelOps AI security errors."""
    pass

class SentinelOpsSecurityViolation(SentinelOpsException):
    """Raised when an autonomous agent tool action is blocked in-line by policy (DENY)."""
    def __init__(self, tool_name: str, rule: str, reason: str):
        self.tool_name = tool_name
        self.rule = rule
        self.reason = reason
        super().__init__(
            f"[SentinelOps Pre-Flight Interception] Action blocked on tool '{tool_name}' "
            f"under rule '{rule}': {reason}"
        )

class ApprovalTimeoutError(SentinelOpsException):
    """Raised when an approval-required tool action times out or is rejected by human operator."""
    pass
