import pytest
from app.models import TripRequest
from app.data import generate_base_legs
from app.planner import get_options, enumerate_candidates, calculate_buffers, create_itinerary


def test_planner_chaining_and_buffers():
    """Verify multi-leg chaining preserves transfer continuity and minimum buffers."""
    travel_date = "2026-10-15"
    base_legs = generate_base_legs(travel_date)

    req = TripRequest(
        origin="Vizag Railway Station",
        destination="Hitech City",
        travel_date=travel_date,
        arrival_deadline="09:00",
        passengers=2,
        seat_type="any",
        budget_total_inr=5000.0
    )

    candidates = enumerate_candidates(req, base_legs)
    assert len(candidates) > 0, "Planner should produce multi-leg candidates"

    for itin in candidates:
        assert len(itin.legs) >= 1
        # Check continuity
        for i in range(len(itin.legs) - 1):
            assert itin.legs[i].to_node == itin.legs[i + 1].from_node
            assert itin.buffers[i] >= 10, "Buffer between legs must be at least 10 mins"


def test_cost_calculation_math():
    """Verify fare math: per-person * pax + per-vehicle * ceil(pax / 4)."""
    travel_date = "2026-10-15"
    base_legs = generate_base_legs(travel_date)

    # 1 passenger
    req_1 = TripRequest(
        origin="Vizag Railway Station",
        destination="Hitech City",
        travel_date=travel_date,
        arrival_deadline="09:00",
        passengers=1
    )
    cands_1 = enumerate_candidates(req_1, base_legs)
    itin_1 = cands_1[0]

    # 5 passengers (should require 2 vehicles for auto/cab)
    req_5 = TripRequest(
        origin="Vizag Railway Station",
        destination="Hitech City",
        travel_date=travel_date,
        arrival_deadline="09:00",
        passengers=5
    )
    itin_5 = create_itinerary(itin_1.legs, req_5)

    per_person = sum(l.fare for l in itin_1.legs if not l.per_vehicle)
    per_vehicle = sum(l.fare for l in itin_1.legs if l.per_vehicle)

    expected_cost_5 = (per_person * 5) + (per_vehicle * 2)
    assert itin_5.total_cost == round(expected_cost_5, 2)


def test_deterministic_itinerary_id():
    """Verify itinerary id is deterministic across separate runs."""
    travel_date = "2026-10-15"
    legs_a = generate_base_legs(travel_date)
    legs_b = generate_base_legs(travel_date)

    req = TripRequest(
        origin="Vizag Railway Station",
        destination="Hitech City",
        travel_date=travel_date,
        arrival_deadline="09:00",
        passengers=2
    )

    cands_a = enumerate_candidates(req, legs_a)
    cands_b = enumerate_candidates(req, legs_b)

    ids_a = [c.id for c in cands_a]
    ids_b = [c.id for c in cands_b]

    assert ids_a == ids_b, "Candidate IDs must be 100% deterministic"
