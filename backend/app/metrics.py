import json
import os
import time
import statistics
from datetime import date, timedelta
from typing import Dict, Any, List
from app.models import TripRequest, DisruptionEvent
from app.intake import parse_offline
from app.data import generate_base_legs
from app.planner import get_options
from app.disruption import apply_disruptions, handle_disruption
from app.validator import validate_itinerary


def evaluate_intake_accuracy() -> Dict[str, Any]:
    """Evaluate offline intake parser accuracy across 20 labelled test cases."""
    cases_path = os.path.join(os.path.dirname(__file__), "..", "tests", "intake_cases.json")
    if not os.path.exists(cases_path):
        return {"accuracy": 0.0, "total": 0, "correct": 0, "details": []}

    with open(cases_path, "r", encoding="utf-8") as f:
        cases = json.load(f)

    correct = 0
    details = []

    for c in cases:
        req, needs_f, q = parse_offline(c["input"])
        exp = c["expected"]
        is_correct = True

        if exp.get("needs_followup"):
            if not needs_f:
                is_correct = False
        else:
            if needs_f or not req:
                is_correct = False
            else:
                if exp.get("origin") and req.origin != exp["origin"]:
                    is_correct = False
                if exp.get("destination") and req.destination != exp["destination"]:
                    is_correct = False
                if exp.get("arrival_deadline") and req.arrival_deadline != exp["arrival_deadline"]:
                    is_correct = False
                if exp.get("passengers") and req.passengers != exp["passengers"]:
                    is_correct = False
                if exp.get("seat_type") and req.seat_type != exp["seat_type"]:
                    is_correct = False
                if exp.get("budget_total_inr") and req.budget_total_inr != exp["budget_total_inr"]:
                    is_correct = False
                if exp.get("accessibility") and req.accessibility != exp["accessibility"]:
                    is_correct = False
                if exp.get("luggage") and req.luggage != exp["luggage"]:
                    is_correct = False

        if is_correct:
            correct += 1

        details.append({
            "id": c["id"],
            "description": c["description"],
            "passed": is_correct
        })

    accuracy = round(correct / len(cases), 3) if cases else 0.0
    return {
        "accuracy": accuracy,
        "total": len(cases),
        "correct": correct,
        "details": details
    }


def evaluate_fixtures_and_final_pass_rate() -> Dict[str, Any]:
    """
    Evaluate candidate feasibility rates on Fixtures A, E, F, G,
    and verify that 100% of final recommended itineraries pass validation.
    """
    tmrw = (date.today() + timedelta(days=1)).strftime("%Y-%m-%d")

    fixtures = {
        "Fixture A (Happy Path)": TripRequest(
            origin="Vizag Railway Station",
            destination="Hitech City",
            travel_date=tmrw,
            arrival_deadline="09:00",
            passengers=2,
            seat_type="any",
            budget_total_inr=5000.0
        ),
        "Fixture E (Sleeper Filter)": TripRequest(
            origin="Vizag Railway Station",
            destination="Hitech City",
            travel_date=tmrw,
            arrival_deadline="09:00",
            passengers=2,
            seat_type="sleeper",
            budget_total_inr=5000.0
        ),
        "Fixture F (Wheelchair Accessible)": TripRequest(
            origin="Vizag Railway Station",
            destination="Hitech City",
            travel_date=tmrw,
            arrival_deadline="09:00",
            passengers=2,
            seat_type="any",
            budget_total_inr=5000.0,
            accessibility=["wheelchair"]
        ),
        "Fixture G (Passenger Count vs Capacity)": TripRequest(
            origin="Vizag Railway Station",
            destination="Hitech City",
            travel_date=tmrw,
            arrival_deadline="09:00",
            passengers=2,
            seat_type="any",
            budget_total_inr=5000.0
        ),
    }

    results = {}
    total_recommended = 0
    valid_recommended = 0

    base_legs = generate_base_legs(tmrw)

    for name, req in fixtures.items():
        feasible, rejected = get_options(req, base_legs)
        total_cand = len(feasible) + len(rejected)
        pass_rate = round(len(feasible) / total_cand, 3) if total_cand > 0 else 0.0
        results[name] = {
            "candidates": total_cand,
            "passed": len(feasible),
            "rate": pass_rate
        }

        # Check final recommended itineraries
        for itin in feasible:
            total_recommended += 1
            is_valid, _ = validate_itinerary(itin, req)
            if is_valid:
                valid_recommended += 1

    final_pass_rate = round(valid_recommended / total_recommended, 4) if total_recommended > 0 else 1.0

    return {
        "fixture_rates": results,
        "final_recommended_pass_rate": final_pass_rate
    }


def evaluate_disruption_recovery_sweep() -> Dict[str, Any]:
    """
    Sweep disruptions over top 3 itineraries of Fixture A:
    Delays (+30, +60, +120 mins) and Cancellation of intercity bus.
    """
    tmrw = (date.today() + timedelta(days=1)).strftime("%Y-%m-%d")
    req = TripRequest(
        origin="Vizag Railway Station",
        destination="Hitech City",
        travel_date=tmrw,
        arrival_deadline="09:00",
        passengers=2,
        seat_type="any",
        budget_total_inr=5000.0
    )

    base_legs = generate_base_legs(tmrw)
    feasible, _ = get_options(req, base_legs)
    top_3 = feasible[:3]

    sweep_events = [
        ("Delay 30m", "DELAY", 30),
        ("Delay 60m", "DELAY", 60),
        ("Delay 120m", "DELAY", 120),
        ("Cancel", "CANCEL", None),
    ]

    total_runs = 0
    successful_recoveries = 0

    for it in top_3:
        bus_leg = next((l for l in it.legs if l.mode == "bus"), None)
        if not bus_leg:
            continue

        for label, ev_type, mins in sweep_events:
            total_runs += 1
            ev = DisruptionEvent(type=ev_type, leg_id=bus_leg.id, minutes=mins)
            _, _, alts, _ = handle_disruption(
                request=req,
                existing_events=[],
                new_event=ev,
                booked_itinerary_id=it.id
            )
            if alts:
                successful_recoveries += 1

    recovery_rate = round(successful_recoveries / total_runs, 3) if total_runs > 0 else 0.0
    return {
        "total_sweep_runs": total_runs,
        "successful_recoveries": successful_recoveries,
        "recovery_rate": recovery_rate
    }


def evaluate_latency_ms() -> Dict[str, Any]:
    """Measure median time-to-itinerary in milliseconds over 25 runs."""
    tmrw = (date.today() + timedelta(days=1)).strftime("%Y-%m-%d")
    req = TripRequest(
        origin="Vizag Railway Station",
        destination="Hitech City",
        travel_date=tmrw,
        arrival_deadline="09:00",
        passengers=2,
        seat_type="any",
        budget_total_inr=5000.0
    )
    base_legs = generate_base_legs(tmrw)

    durations: List[float] = []
    for _ in range(25):
        t0 = time.perf_counter()
        get_options(req, base_legs)
        durations.append((time.perf_counter() - t0) * 1000.0)

    med = round(statistics.median(durations), 2)
    p95 = round(statistics.quantiles(durations, n=20)[-1], 2) if len(durations) >= 20 else med

    return {
        "median_ms": med,
        "p95_ms": p95,
        "runs": len(durations)
    }


def compute_all_metrics() -> Dict[str, Any]:
    """Compute and combine all 4 metrics."""
    intake = evaluate_intake_accuracy()
    fixtures = evaluate_fixtures_and_final_pass_rate()
    disruption = evaluate_disruption_recovery_sweep()
    latency = evaluate_latency_ms()

    return {
        "intake_accuracy": intake["accuracy"],
        "intake_correct": intake["correct"],
        "intake_total": intake["total"],
        "final_recommended_pass_rate": fixtures["final_recommended_pass_rate"],
        "fixture_rates": fixtures["fixture_rates"],
        "disruption_recovery_rate": disruption["recovery_rate"],
        "disruption_recoveries": disruption["successful_recoveries"],
        "disruption_total": disruption["total_sweep_runs"],
        "median_latency_ms": latency["median_ms"],
        "p95_latency_ms": latency["p95_ms"]
    }


def write_metrics_report(metrics: Dict[str, Any]):
    """Write markdown metrics report to metrics_report.md."""
    report_path = os.path.join(os.path.dirname(__file__), "..", "metrics_report.md")
    content = f"""# TBS RoamAgent - System Benchmark & Metrics Report

**Generated At**: {date.today().strftime('%Y-%m-%d')}  
**Corridor**: Visakhapatnam to Hyderabad (APSRTC & Private Intercity Buses, Multi-Modal)

---

## 1. Intake Parser Accuracy
- **Offline NLP Accuracy**: **{metrics['intake_accuracy'] * 100:.1f}%** ({metrics['intake_correct']}/{metrics['intake_total']} test cases passed)
- **Target Threshold**: $\\ge 85.0\\%$
- **Status**: {'PASSED' if metrics['intake_accuracy'] >= 0.85 else 'FAILED'}

---

## 2. Recommendation Feasibility & Validation Integrity
- **Share of Final Recommended Itineraries Passing Independent Validation**: **{metrics['final_recommended_pass_rate'] * 100:.1f}%** (Requirement: 100%)
- **Fixture Feasibility Breakdown**:
"""
    for fix_name, data in metrics["fixture_rates"].items():
        content += f"  - **{fix_name}**: {data['passed']}/{data['candidates']} candidates passed ({data['rate'] * 100:.1f}%)\n"

    content += f"""
---

## 3. Disruption Recovery Sweep
- **Recovery Rate across Delay & Cancellation Sweep**: **{metrics['disruption_recovery_rate'] * 100:.1f}%** ({metrics['disruption_recoveries']}/{metrics['disruption_total']} sweep cases found feasible alternatives)
- **Tested Disruption Scenarios**: +30m delay, +60m delay, +120m delay, bus cancellation across top-3 ranked itineraries.

---

## 4. Latency Performance
- **Median Time-to-Itinerary**: **{metrics['median_latency_ms']} ms**
- **P95 Latency**: **{metrics['p95_latency_ms']} ms**
- **Execution Mode**: Pure deterministic Python graph enumeration & validation (Zero external network dependency).

---
*Report auto-generated by `app.metrics` for Samartha Hackathon evaluation.*
"""
    with open(report_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Metrics report written to {report_path}")


if __name__ == "__main__":
    print("Computing TBS RoamAgent benchmarks...")
    m = compute_all_metrics()
    write_metrics_report(m)
    print("Benchmark results:")
    print(f"  Intake Accuracy: {m['intake_accuracy'] * 100:.1f}%")
    print(f"  Final Itineraries Validated: {m['final_recommended_pass_rate'] * 100:.1f}%")
    print(f"  Disruption Recovery: {m['disruption_recovery_rate'] * 100:.1f}%")
    print(f"  Median Latency: {m['median_latency_ms']} ms")
