import os
import json
import math
import re
from typing import Dict, Any, List, Tuple
from collections import Counter, defaultdict

class PurePythonSecurityClassifier:
    """
    Pure Python Supervised Classifier for Agent Security Traces.
    Trained with Multinomial Naive Bayes and Laplace Smoothing over n-gram features.
    Guaranteed zero-DLL dependencies, running seamlessly across any OS.
    """
    def __init__(self, data_path: str = None, checkpoint_dir: str = None):
        base_dir = os.path.dirname(os.path.abspath(__file__))
        if data_path is None:
            data_path = os.path.join(base_dir, "dataset", "security_events.json")
        if checkpoint_dir is None:
            checkpoint_dir = os.path.join(base_dir, "checkpoints")

        self.data_path = data_path
        self.checkpoint_dir = checkpoint_dir
        os.makedirs(self.checkpoint_dir, exist_ok=True)

        self.classes: List[str] = ["ALLOW", "DENY", "REQUIRE_APPROVAL"]
        self.class_counts: Dict[str, int] = Counter()
        self.feature_counts: Dict[str, Dict[str, int]] = defaultdict(Counter)
        self.total_tokens_per_class: Dict[str, int] = Counter()
        self.vocabulary: set = set()
        self.is_trained: bool = False

    def _tokenize(self, text: str) -> List[str]:
        words = re.findall(r"\b[a-z0-9_-]{2,}\b", text.lower())
        # Add bigrams for richer context
        bigrams = [f"{words[i]}_{words[i+1]}" for i in range(len(words)-1)]
        return words + bigrams

    def train(self) -> Dict[str, Any]:
        """
        Executes supervised model training across agent security traces.
        """
        if not os.path.exists(self.data_path):
            raise FileNotFoundError(f"Dataset not found at {self.data_path}")

        with open(self.data_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        self.class_counts.clear()
        self.feature_counts.clear()
        self.total_tokens_per_class.clear()
        self.vocabulary.clear()

        total_samples = len(data)
        for item in data:
            label = item.get("label", "ALLOW")
            self.class_counts[label] += 1
            args_str = json.dumps(item.get("arguments", {}))
            text = f"prompt:{item.get('prompt', '')} tool:{item.get('tool', '')} args:{args_str}"
            tokens = self._tokenize(text)

            for token in tokens:
                self.feature_counts[label][token] += 1
                self.total_tokens_per_class[label] += 1
                self.vocabulary.add(token)

        self.is_trained = True

        # Save checkpoint as clean JSON
        checkpoint_path = os.path.join(self.checkpoint_dir, "sentinelops_model_v1.json")
        checkpoint_data = {
            "classes": self.classes,
            "class_counts": dict(self.class_counts),
            "total_tokens_per_class": dict(self.total_tokens_per_class),
            "vocabulary_size": len(self.vocabulary),
            "sample_count": total_samples,
            "feature_counts": {c: dict(self.feature_counts[c]) for c in self.classes},
        }
        with open(checkpoint_path, "w", encoding="utf-8") as f:
            json.dump(checkpoint_data, f, indent=2)

        return {
            "status": "success",
            "samples_trained": total_samples,
            "classes": self.classes,
            "vocabulary_size": len(self.vocabulary),
            "checkpoint_path": checkpoint_path,
        }

    def predict(self, prompt: str, tool: str, arguments: Dict[str, Any]) -> Dict[str, Any]:
        """
        Calculates log-posterior probabilities with Laplace smoothing:
        P(Class | Features) ∝ P(Class) * ∏ P(w | Class)
        """
        if not self.is_trained:
            checkpoint_path = os.path.join(self.checkpoint_dir, "sentinelops_model_v1.json")
            if os.path.exists(checkpoint_path):
                with open(checkpoint_path, "r", encoding="utf-8") as f:
                    ckpt = json.load(f)
                    self.classes = ckpt["classes"]
                    self.class_counts = Counter(ckpt["class_counts"])
                    self.total_tokens_per_class = Counter(ckpt["total_tokens_per_class"])
                    self.vocabulary = set()
                    self.feature_counts = defaultdict(Counter)
                    for c, counts in ckpt["feature_counts"].items():
                        self.feature_counts[c] = Counter(counts)
                        self.vocabulary.update(counts.keys())
                    self.is_trained = True
            else:
                self.train()

        args_str = json.dumps(arguments or {})
        text = f"prompt:{prompt} tool:{tool} args:{args_str}"
        tokens = self._tokenize(text)

        total_samples = sum(self.class_counts.values()) or 1
        vocab_size = len(self.vocabulary) or 1

        log_scores = {}
        for c in self.classes:
            # Prior log P(Class)
            prior = math.log((self.class_counts[c] + 1) / (total_samples + len(self.classes)))
            log_prob = prior
            denom = self.total_tokens_per_class[c] + vocab_size

            for token in tokens:
                count = self.feature_counts[c].get(token, 0)
                # Laplace smoothed likelihood
                log_prob += math.log((count + 1) / denom)

            log_scores[c] = log_prob

        # Softmax normalization over log-scores for calibrated probabilities
        max_log = max(log_scores.values())
        exp_scores = {c: math.exp(score - max_log) for c, score in log_scores.items()}
        sum_exp = sum(exp_scores.values()) or 1.0
        probabilities = {c: round(exp_scores[c] / sum_exp, 4) for c in self.classes}

        best_class = max(probabilities.items(), key=lambda x: x[1])[0]

        return {
            "predicted_decision": best_class,
            "confidence": probabilities[best_class],
            "probabilities": probabilities,
        }

trainer = PurePythonSecurityClassifier()
SecurityModelTrainer = PurePythonSecurityClassifier

if __name__ == "__main__":
    res = trainer.train()
    print("Training result:", res)
    test_eval = trainer.predict("DROP TABLE customers", "drop_database_table", {"table": "customers"})
    print("Test prediction for drop table:", test_eval)
