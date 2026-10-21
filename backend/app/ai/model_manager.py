import os
import sys
import json
from typing import Dict, Any, Optional
from huggingface_hub import hf_hub_download, snapshot_download

class ModelManager:
    """
    Manages local open-source security models, downloading open-weights from
    HuggingFace, and serving local inference without external API reliance.
    """
    def __init__(self, models_dir: str = None):
        if models_dir is None:
            base_dir = os.path.dirname(os.path.abspath(__file__))
            models_dir = os.path.join(base_dir, "models")
        self.models_dir = models_dir
        os.makedirs(self.models_dir, exist_ok=True)

    def download_model(self, repo_id: str = "HuggingFaceTB/SmolLM2-135M-Instruct", filename: Optional[str] = "config.json") -> Dict[str, Any]:
        """
        Downloads model artifacts or config directly from HuggingFace Hub to local models directory.
        """
        print(f"[ModelManager] Initiating verified download from HuggingFace: {repo_id}...")
        try:
            if filename:
                downloaded_path = hf_hub_download(
                    repo_id=repo_id,
                    filename=filename,
                    local_dir=os.path.join(self.models_dir, repo_id.replace("/", "_")),
                )
            else:
                downloaded_path = snapshot_download(
                    repo_id=repo_id,
                    local_dir=os.path.join(self.models_dir, repo_id.replace("/", "_")),
                    max_workers=4,
                )
            print(f"[ModelManager] Download complete! Saved to: {downloaded_path}")
            return {
                "status": "success",
                "repo_id": repo_id,
                "saved_path": downloaded_path,
                "size_bytes": os.path.getsize(downloaded_path) if os.path.isfile(downloaded_path) else 0,
            }
        except Exception as e:
            print(f"[ModelManager] Download encountered error: {e}")
            return {
                "status": "error",
                "repo_id": repo_id,
                "error": str(e),
            }

    def list_local_models(self) -> Dict[str, Any]:
        """
        Scans local models directory for installed weights and configs.
        """
        models = []
        if os.path.exists(self.models_dir):
            for entry in os.listdir(self.models_dir):
                full_path = os.path.join(self.models_dir, entry)
                if os.path.isdir(full_path):
                    files = os.listdir(full_path)
                    models.append({
                        "name": entry,
                        "path": full_path,
                        "file_count": len(files),
                        "files": files[:5],
                    })
        return {
            "models_directory": self.models_dir,
            "installed_count": len(models),
            "models": models,
        }

model_manager = ModelManager()

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="SentinelOps Local Model Downloader")
    parser.add_argument("--repo", default="HuggingFaceTB/SmolLM2-135M-Instruct", help="HuggingFace repo ID")
    parser.add_argument("--file", default="config.json", help="Specific file to download or leave empty for snapshot")
    args = parser.parse_args()

    result = model_manager.download_model(repo_id=args.repo, filename=args.file)
    print(json.dumps(result, indent=2))

