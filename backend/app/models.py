from typing import Dict, Any, List, Optional, Literal
from pydantic import BaseModel, Field

DecisionType = Literal["ALLOW", "DENY", "REQUIRE_APPROVAL"]
SeverityType = Literal["low", "medium", "high", "critical"]
ApprovalStatus = Literal["PENDING", "APPROVED", "REJECTED", "EXPIRED"]

class EventEvaluationRequest(BaseModel):
    agent_id: str = Field(description="Unique identifier of requesting agent")
    tool_name: str = Field(description="Name of the tool being called")
    arguments: Dict[str, Any] = Field(default_factory=dict, description="Sanitized invocation parameters")
    trace_id: Optional[str] = Field(default=None, description="Distributed correlation trace ID")

class EventEvaluationResponse(BaseModel):
    decision: DecisionType
    reason: str
    rule_matched: str
    severity: SeverityType
    approval_token: Optional[str] = None
    approval_id: Optional[str] = None
    event_hash: str
    timestamp: str

class ApprovalDecisionRequest(BaseModel):
    decision: Literal["APPROVED", "REJECTED"]
    decided_by: str
    note: Optional[str] = None

class ApprovalRecord(BaseModel):
    id: str
    token: str
    agent_id: str
    tool_name: str
    arguments: Dict[str, Any]
    matched_rule: str
    reason: str
    severity: SeverityType
    status: ApprovalStatus
    created_at: float
    expires_at: float
    decided_by: Optional[str] = None
    decision_note: Optional[str] = None

class AuditRecord(BaseModel):
    id: str
    timestamp: str
    event_hash: str
    prev_hash: str
    agent_id: str
    tool_name: str
    arguments: Dict[str, Any]
    decision: DecisionType
    severity: SeverityType
    reason_code: str
    trace_id: str

class PolicyRule(BaseModel):
    id: str
    name: str
    tool_pattern: str
    param_constraint: Optional[str] = None
    action: DecisionType
    severity: SeverityType
    description: str

class Policy(BaseModel):
    id: str
    name: str
    mode: Literal["ENFORCE", "SIMULATE"] = "ENFORCE"
    target_agents: List[str] = ["*"]
    rules: List[PolicyRule]

class AIChatRequest(BaseModel):
    query: str
    api_key: Optional[str] = None
    agent_id: Optional[str] = None

class AIChatResponse(BaseModel):
    status: Literal["ALLOWED", "BLOCKED_BY_GUARDRAIL"]
    reply: str
    evidence: List[str] = Field(default_factory=list)
    citations: List[str] = Field(default_factory=list)
    violation_type: Optional[str] = None
    is_grounded: bool = True


class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    company: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    company: str
    role: str
    tier: str
    tool_calls_used: int
    tool_calls_limit: int
    is_suspended: bool
    is_master_admin: bool
    ip_address: Optional[str] = None
    device: Optional[str] = None
    last_active: Optional[str] = None

class LoginResponse(BaseModel):
    success: bool
    token: Optional[str] = None
    user: Optional[UserResponse] = None
    error: Optional[str] = None

class RoleUpdateRequest(BaseModel):
    role: str
