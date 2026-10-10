import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.explain import verify_text_against_facts, extract_allowed_numbers

client = TestClient(app)


def test_api_health():
    """Test /health endpoint."""
    res = client.get("/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "ok"
    assert "llm_available" in data


def test_api_parse():
    """Test /parse endpoint."""
    res = client.post("/parse", json={"text": "Vizag to Hitech City tomorrow by 9 AM for 2 people", "llm": False})
    assert res.status_code == 200
    data = res.json()
    assert data["needs_followup"] is False
    assert data["request"]["origin"] == "Vizag Railway Station"
    assert data["request"]["destination"] == "Hitech City"
    assert data["request"]["arrival_deadline"] == "09:00"
    assert data["request"]["passengers"] == 2


def test_api_plan():
    """Test /plan endpoint."""
    payload = {
        "request": {
            "origin": "Vizag Railway Station",
            "destination": "Hitech City",
            "travel_date": "2026-10-15",
            "arrival_deadline": "09:00",
            "passengers": 2,
            "seat_type": "any",
            "budget_total_inr": 5000.0,
            "accessibility": [],
            "luggage": None
        },
        "events": [],
        "rank_mode": "balanced"
    }
    res = client.post("/plan", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert len(data["feasible"]) >= 3
    assert data["stats"]["candidates"] > 0
    assert data["stats"]["passed"] == len(data["feasible"])


def test_api_explain_and_fact_checking():
    """Test /explain endpoint and fact verification discard logic."""
    # First plan to get an itinerary_id
    plan_payload = {
        "request": {
            "origin": "Vizag Railway Station",
            "destination": "Hitech City",
            "travel_date": "2026-10-15",
            "arrival_deadline": "09:00",
            "passengers": 2
        },
        "events": []
    }
    plan_res = client.post("/plan", json=plan_payload)
    first_itin = plan_res.json()["feasible"][0]

    # English explanation
    exp_res = client.post("/explain", json={
        "itinerary_id": first_itin["id"],
        "request": plan_payload["request"],
        "events": [],
        "lang": "en"
    })
    assert exp_res.status_code == 200
    assert len(exp_res.json()["text"]) > 10

    # Telugu explanation
    exp_te = client.post("/explain", json={
        "itinerary_id": first_itin["id"],
        "request": plan_payload["request"],
        "events": [],
        "lang": "te"
    })
    assert exp_te.status_code == 200
    assert "ప్రయాణం" in exp_te.json()["text"] or "Telugu output is experimental" in exp_te.json()["text"]

    # Verify fact-check logic: invented number is rejected
    facts = {"arrival": "08:00", "total_cost": 1500, "buffers": [30]}
    allowed = extract_allowed_numbers(facts)
    # Text with valid facts
    assert verify_text_against_facts("Arrives at 08:00 costing 1500 with 30 min buffer", allowed) is True
    # Text with invented number (e.g. 9999 or 45 mins)
    assert verify_text_against_facts("Arrives at 08:00 with 9999 rupees and 45 min buffer", allowed) is False


def test_api_disrupt():
    """Test /disrupt endpoint."""
    plan_payload = {
        "request": {
            "origin": "Vizag Railway Station",
            "destination": "Hitech City",
            "travel_date": "2026-10-15",
            "arrival_deadline": "09:00",
            "passengers": 2,
            "budget_total_inr": 5000.0
        },
        "events": []
    }
    plan_res = client.post("/plan", json=plan_payload)
    top_itin = plan_res.json()["feasible"][0]
    bus_leg = next(l for l in top_itin["legs"] if l["mode"] == "bus")

    disrupt_payload = {
        "request": plan_payload["request"],
        "events": [],
        "new_event": {
            "type": "DELAY",
            "leg_id": bus_leg["id"],
            "minutes": 60
        },
        "booked_itinerary_id": top_itin["id"]
    }
    res = client.post("/disrupt", json=disrupt_payload)
    assert res.status_code == 200
    data = res.json()
    assert len(data["events"]) == 1
    assert "notification" in data
    assert len(data["alternatives"]) >= 1


def test_api_book_gate():
    """Test /book requires approval and ignores client-tampered price."""
    plan_payload = {
        "request": {
            "origin": "Vizag Railway Station",
            "destination": "Hitech City",
            "travel_date": "2026-10-15",
            "arrival_deadline": "09:00",
            "passengers": 2
        },
        "events": []
    }
    plan_res = client.post("/plan", json=plan_payload)
    itin = plan_res.json()["feasible"][0]

    # 1. Unapproved -> 403
    res_unapproved = client.post("/book", json={
        "request": plan_payload["request"],
        "events": [],
        "itinerary_id": itin["id"],
        "approved": False
    })
    assert res_unapproved.status_code == 403

    # 2. Approved -> 200
    res_approved = client.post("/book", json={
        "request": plan_payload["request"],
        "events": [],
        "itinerary_id": itin["id"],
        "approved": True
    })
    assert res_approved.status_code == 200
    data = res_approved.json()
    assert data["booking_id"].startswith("BKG-")
    assert data["payment"]["payment_id"].startswith("SBX-")
    assert data["payment"]["amount"] == itin["total_cost"]


def test_api_cancel_gate():
    """Test /cancel endpoint."""
    res_unapproved = client.post("/cancel", json={"booking_id": "BKG-1234", "approved": False})
    assert res_unapproved.status_code == 403

    res_approved = client.post("/cancel", json={"booking_id": "BKG-1234", "approved": True})
    assert res_approved.status_code == 200
    assert res_approved.json()["status"] == "CANCELLED"
    assert "Simulated policy" in res_approved.json()["message"]


def test_api_scenarios_and_metrics():
    """Test /scenarios and /metrics endpoints."""
    scenarios_res = client.get("/scenarios")
    assert scenarios_res.status_code == 200
    scenarios = scenarios_res.json()
    assert len(scenarios) >= 5
    ids = [s["id"] for s in scenarios]
    assert "scenario-a" in ids
    assert "scenario-b" in ids
    assert "scenario-d" in ids

    metrics_res = client.get("/metrics")
    assert metrics_res.status_code == 200
    metrics_data = metrics_res.json()
    assert "intake_accuracy" in metrics_data
    assert "final_recommended_pass_rate" in metrics_data
    assert metrics_data["final_recommended_pass_rate"] == 1.0
