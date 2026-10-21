import pytest
from app.ai import rag_engine, trainer, model_manager

def test_rag_semantic_retrieval_and_citations():
    result = rag_engine.explain_event("Agent attempted to drop database table", "drop_table", "DENY")
    assert "explanation" in result
    assert "evidence" in result
    assert len(result["citations"]) > 0
    assert result["similarity_score"] > 0
    assert "ASI-02" in result["citations"][0] or "Database" in result["citations"][0]

def test_fine_tuned_security_classifier():
    eval_res = trainer.predict("DROP TABLE accounts CASCADE", "drop_table", {"table": "accounts"})
    assert eval_res["predicted_decision"] == "DENY"
    assert eval_res["confidence"] > 0.6
    assert "probabilities" in eval_res

def test_model_manager_inventory():
    inventory = model_manager.list_local_models()
    assert "models_directory" in inventory
    assert "installed_count" in inventory

