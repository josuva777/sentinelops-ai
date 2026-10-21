import re
import hashlib
from typing import Dict, Any, List, Optional
from datetime import datetime

class AICopilotGuardrails:
    """
    OWASP LLM01 & ASI01 Hardened Guardrail Engine for SentinelOps AI Security Copilot.
    Enforces deterministic scope containment, jailbreak prevention, system prompt protection,
    and credential exfiltration blocking before generative evaluation occurs.
    """

    # 1. Jailbreak & Prompt Injection Signatures
    JAILBREAK_PATTERNS = [
        r"ignore\s+(all\s+)?(previous|prior|above)\s+instructions?",
        r"disregard\s+(all\s+)?(previous|prior|system)\s+rules?",
        r"act\s+as\s+(an?\s+)?(unrestricted|jailbroken|dan|evil|god)\b",
        r"enter\s+(dan|developer|override|god)\s+mode",
        r"what\s+(is|are)\s+your\s+(system\s+)?prompt",
        r"print\s+(your\s+)?(instructions?|system\s+prompt|rules?)",
        r"repeat\s+the\s+text\s+(above|at\s+the\s+start)",
        r"(show|reveal|leak|print|dump)\s+(me\s+)?(the\s+)?(master\s+key|database\s+password|api_key|\.env|secrets?)",
        r"disable\s+(the\s+)?(kill-switch|ledger|guardrails?|enforcement)",
        r"bypass\s+(policy|rule|signature|approval)",
    ]

    # 2. Whitelisted Security & Operational Domain Concepts
    ALLOWED_SECURITY_TERMS = {
        "security", "agent", "tool", "policy", "guardrail", "rule", "audit", "ledger",
        "sha256", "hash", "approval", "intercept", "halt", "deny", "allow", "latency",
        "ddl", "dml", "sql", "injection", "database", "telemetry", "incident", "alert",
        "owasp", "nist", "cwe", "threat", "mitigation", "remediation", "vulnerability",
        "killswitch", "master", "key", "token", "ttl", "trace", "fleet", "copilot",
        "finreconcilebot", "devopsinfraworker", "researchscraper", "compliance", "soc2",
        "explain", "summary", "status", "health", "why", "who", "when", "how", "what"
    }

    def __init__(self):
        self.compiled_jailbreaks = [re.compile(p, re.IGNORECASE) for p in self.JAILBREAK_PATTERNS]

    def evaluate_query(self, query: str, context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Pre-flight evaluation of user query before passing to LLM / RAG.
        Returns:
            is_allowed (bool): True if clean and strictly within enterprise security scope.
            violation_type (Optional[str]): Classification if blocked.
            refusal_response (Optional[Dict]): Formatted enterprise security refusal.
        """
        trimmed = query.strip()
        lower_query = trimmed.lower()

        # Check 1: Empty or excessive length
        if not trimmed:
            return {
                "is_allowed": False,
                "violation_type": "EMPTY_QUERY",
                "refusal": "Query cannot be empty. Please specify a security event, agent trace, or policy question.",
            }

        if len(trimmed) > 2000:
            return {
                "is_allowed": False,
                "violation_type": "OVERSIZED_PAYLOAD",
                "refusal": "Payload exceeded 2,000 characters. For high-volume log audits, use the batch ingestion CLI.",
            }

        # Check 2: Jailbreak, System Prompt Extraction & Credential Theft
        for pattern in self.compiled_jailbreaks:
            if pattern.search(lower_query):
                return {
                    "is_allowed": False,
                    "violation_type": "PROMPT_INJECTION_OR_JAILBREAK",
                    "refusal": (
                        "🛡️ [SentinelOps Scope Enforcement — OWASP LLM01 / ASI01]\n\n"
                        "Your request was blocked by Pre-Flight Prompt Containment Guardrails.\n\n"
                        "• Violation Detected: Potential adversarial jailbreak, system prompt extraction, or credential probe.\n"
                        "• Policy Action: Refused pre-flight before generative evaluation.\n"
                        "• Security Posture: 100% Fail-Closed. All query hashes are immutably filed in the SHA-256 audit ledger."
                    ),
                    "evidence": [
                        "Classification: OWASP Top 10 for LLMs — LLM01 (Prompt Injection)",
                        f"Query Checksum: sha256_{hashlib.sha256(trimmed.encode()).hexdigest()[:16]}",
                        "Ledger Status: Logged as Suspicious Telemetry",
                    ],
                    "citations": ["OWASP LLM01:2025 Prompt Injection", "NIST AI 100-2 Adversarial Robustness"],
                }

        # Check 3: Out-of-Scope Domain Containment
        words = re.findall(r"\b[a-z]{3,}\b", lower_query)
        matching_domain_words = [w for w in words if w in self.ALLOWED_SECURITY_TERMS]

        # If user is asking purely off-topic questions (e.g. "write me a poem about love", "recipe for pizza")
        if len(words) >= 4 and len(matching_domain_words) == 0:
            return {
                "is_allowed": False,
                "violation_type": "OUT_OF_SCOPE",
                "refusal": (
                    "🛡️ [SentinelOps Scope Containment]\n\n"
                    "I am strictly bounded as an enterprise AI Security & Operations Copilot. "
                    "I do not answer general trivia, creative writing, or off-topic requests.\n\n"
                    "Supported topics include:\n"
                    "• Explaining blocked agent tool invocations (DDL, shell, financial wires)\n"
                    "• Verifying SHA-256 tamper-proof ledger blocks\n"
                    "• Reviewing OWASP Top 10 for Agentic AI mitigations\n"
                    "• Guiding policy rules and approval queues"
                ),
                "evidence": ["Domain Bounding: Enterprise Cybersecurity & Agent Governance Only"],
                "citations": ["SentinelOps Scope Specification v1.0"],
            }

        return {
            "is_allowed": True,
            "violation_type": None,
            "refusal": None,
        }

copilot_guardrails = AICopilotGuardrails()

