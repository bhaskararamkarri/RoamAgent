import pytest
from app.metrics import evaluate_intake_accuracy


def test_offline_intake_accuracy_benchmark():
    """Assert that the offline intake parser achieves at least 85% accuracy on intake_cases.json."""
    res = evaluate_intake_accuracy()
    acc = res["accuracy"]
    correct = res["correct"]
    total = res["total"]

    # Provide helpful debug report if any fail
    failed = [d for d in res["details"] if not d["passed"]]
    msg = f"Intake accuracy {acc:.2f} ({correct}/{total}) is below 0.85 threshold. Failed cases: {failed}"
    assert acc >= 0.85, msg
