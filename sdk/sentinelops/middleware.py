import functools
import inspect
from typing import Callable, Any, Optional
from .client import SentinelOpsClient
from .exceptions import SentinelOpsSecurityViolation

def protect_tool(
    client: SentinelOpsClient,
    tool_name: Optional[str] = None,
    wait_for_human_approval: bool = False,
):
    """
    Decorator for autonomous agent tool functions.
    Intercepts invocation arguments in-line and halts execution if policy dictates DENY.
    """
    def decorator(func: Callable[..., Any]) -> Callable[..., Any]:
        actual_tool_name = tool_name or func.__name__

        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            # Extract arguments by inspection
            sig = inspect.signature(func)
            bound = sig.bind(*args, **kwargs)
            bound.apply_defaults()
            payload = dict(bound.arguments)

            # In-line Pre-Flight Interception
            eval_result = client.evaluate_tool(tool_name=actual_tool_name, arguments=payload)
            decision = eval_result.get("decision", "DENY")

            if decision == "DENY":
                raise SentinelOpsSecurityViolation(
                    tool_name=actual_tool_name,
                    rule=eval_result.get("rule_matched", "UNKNOWN"),
                    reason=eval_result.get("reason", "Action blocked by organization policy."),
                )
            elif decision == "REQUIRE_APPROVAL":
                approval_id = eval_result.get("approval_id")
                if not wait_for_human_approval or not approval_id:
                    raise SentinelOpsSecurityViolation(
                        tool_name=actual_tool_name,
                        rule=eval_result.get("rule_matched", "HUMAN_APPROVAL_REQUIRED"),
                        reason=f"Action paused. Requires human approval in SentinelOps Console (ID: {approval_id}).",
                    )
                # If enabled, wait for human operator to approve
                client.wait_for_approval(approval_id)

            # If permitted, proceed with normal execution
            return func(*args, **kwargs)

        return wrapper

    return decorator
