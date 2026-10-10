"""API smoke test script hitting live running server on port 8000."""
import httpx
import sys

BASE_URL = "http://127.0.0.1:8000"

def run_smoke_test():
    print(f"Connecting to {BASE_URL}...")
    with httpx.Client(base_url=BASE_URL, timeout=10.0) as client:
        # 1. Health
        h = client.get("/health")
        assert h.status_code == 200, f"/health failed: {h.status_code}"
        print("[OK] GET /health:", h.json())

        # 2. Parse
        p = client.post("/parse", json={"text": "Vizag to Hitech City tomorrow by 9 AM for 2 people", "llm": False})
        assert p.status_code == 200, f"/parse failed: {p.status_code}"
        parsed = p.json()
        assert parsed["needs_followup"] is False
        print("[OK] POST /parse:", parsed["request"]["origin"], "->", parsed["request"]["destination"])

        # 3. Plan
        plan_req = {
            "request": parsed["request"],
            "events": [],
            "rank_mode": "balanced"
        }
        pl = client.post("/plan", json=plan_req)
        assert pl.status_code == 200, f"/plan failed: {pl.status_code}"
        plan_data = pl.json()
        assert len(plan_data["feasible"]) >= 3
        top_itin = plan_data["feasible"][0]
        print(f"[OK] POST /plan: {len(plan_data['feasible'])} feasible itineraries found, top cost Rs {top_itin['total_cost']}")

        # 4. Disrupt
        bus_leg = next(l for l in top_itin["legs"] if l["mode"] == "bus")
        dis_req = {
            "request": parsed["request"],
            "events": [],
            "new_event": {"type": "DELAY", "leg_id": bus_leg["id"], "minutes": 60},
            "booked_itinerary_id": top_itin["id"]
        }
        dis = client.post("/disrupt", json=dis_req)
        assert dis.status_code == 200, f"/disrupt failed: {dis.status_code}"
        dis_data = dis.json()
        assert len(dis_data["alternatives"]) >= 1
        print(f"[OK] POST /disrupt: 60m delay applied to {bus_leg['operator']}, {len(dis_data['alternatives'])} alternatives found")

        # 5. Book unapproved (403 expected)
        b_unapproved = client.post("/book", json={
            "request": parsed["request"],
            "events": [],
            "itinerary_id": top_itin["id"],
            "approved": False
        })
        assert b_unapproved.status_code == 403, f"Expected 403, got {b_unapproved.status_code}"
        print("[OK] POST /book (unapproved): HTTP 403 Forbidden confirmed")

        # 6. Book approved (200 expected)
        b_approved = client.post("/book", json={
            "request": parsed["request"],
            "events": [],
            "itinerary_id": top_itin["id"],
            "approved": True
        })
        assert b_approved.status_code == 200, f"Expected 200, got {b_approved.status_code}"
        b_data = b_approved.json()
        assert b_data["payment"]["payment_id"].startswith("SBX-")
        print(f"[OK] POST /book (approved): Booking ID {b_data['booking_id']}, Sandbox Payment ID {b_data['payment']['payment_id']}")

        # 7. Cancel unapproved (403 expected) and approved (200 expected)
        c_unapproved = client.post("/cancel", json={"booking_id": b_data["booking_id"], "approved": False})
        assert c_unapproved.status_code == 403
        c_approved = client.post("/cancel", json={"booking_id": b_data["booking_id"], "approved": True})
        assert c_approved.status_code == 200
        print("[OK] POST /cancel (approved):", c_approved.json()["message"])

        # 8. Scenarios
        sc = client.get("/scenarios")
        assert sc.status_code == 200 and len(sc.json()) >= 5
        print(f"[OK] GET /scenarios: {len(sc.json())} preset scenarios loaded")

        # 9. Metrics
        mt = client.get("/metrics")
        assert mt.status_code == 200
        print(f"[OK] GET /metrics: Final Pass Rate {mt.json()['final_recommended_pass_rate'] * 100}%")

    print("\nALL API SMOKE TESTS PASSED SUCCESSFULLY! [PASS]")

if __name__ == "__main__":
    try:
        run_smoke_test()
    except Exception as e:
        print(f"Smoke test failed: {e}")
        sys.exit(1)
