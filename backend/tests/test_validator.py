import pytest
from app.models import TripRequest
from app.data import generate_base_legs
from app.planner import get_options, enumerate_candidates
from app.validator import validate_itinerary


def test_fixture_a_happy_path():
    """Fixture A: Vizag Railway Station -> Hitech City, deadline 09:00, 2 pax, budget 5000 => >= 3 feasible."""
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

    feasible, rejected = get_options(req, base_legs)
    assert len(feasible) >= 3, f"Expected >= 3 feasible itineraries, got {len(feasible)}"


def test_fixture_b_trap_rejection():
    """
    Fixture B Trap: SuperSaver bus arriving 09:40 at Miyapur is generated as candidate
    and REJECTED by validator with a reason explicitly mentioning the arrival time.
    """
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

    feasible, rejected = get_options(req, base_legs)

    # Find the trap candidate
    trap_rejected = None
    for r in rejected:
        if any("trap" in leg.id.lower() or "supersaver" in leg.operator.lower() for leg in r.itinerary.legs):
            trap_rejected = r
            break

    assert trap_rejected is not None, "Trap bus should be generated as a candidate and rejected"
    # Check rejection reasons mention arrival time / minutes
    reasons_text = " ".join(trap_rejected.reasons).lower()
    assert "arrives at" in reasons_text or "past the" in reasons_text or "deadline" in reasons_text, (
        f"Rejection reason must mention arrival time: {trap_rejected.reasons}"
    )


def test_fixture_d_infeasible_request():
    """Fixture D: deadline 05:30 at Hitech City returns empty feasible list."""
    travel_date = "2026-10-15"
    base_legs = generate_base_legs(travel_date)
    req = TripRequest(
        origin="Vizag Railway Station",
        destination="Hitech City",
        travel_date=travel_date,
        arrival_deadline="05:30",
        passengers=2,
        seat_type="any",
        budget_total_inr=5000.0
    )

    feasible, rejected = get_options(req, base_legs)
    assert len(feasible) == 0, "No buses can reach Hitech City before 05:30 AM"
    assert len(rejected) > 0, "Rejected candidates should be present"


def test_fixture_e_sleeper_filter():
    """Fixture E: sleeper filter excludes all seaters."""
    travel_date = "2026-10-15"
    base_legs = generate_base_legs(travel_date)
    req = TripRequest(
        origin="Vizag Railway Station",
        destination="Hitech City",
        travel_date=travel_date,
        arrival_deadline="09:00",
        passengers=2,
        seat_type="sleeper",
        budget_total_inr=5000.0
    )

    feasible, rejected = get_options(req, base_legs)
    assert len(feasible) >= 1
    for it in feasible:
        for leg in it.legs:
            if leg.mode == "bus":
                assert leg.seat_type == "sleeper", f"Bus {leg.operator} has seat type {leg.seat_type}, not sleeper"


def test_fixture_f_wheelchair_accessibility():
    """Fixture F: wheelchair filter excludes any chain containing a non-accessible leg."""
    travel_date = "2026-10-15"
    base_legs = generate_base_legs(travel_date)
    req = TripRequest(
        origin="Vizag Railway Station",
        destination="Hitech City",
        travel_date=travel_date,
        arrival_deadline="09:00",
        passengers=2,
        seat_type="any",
        budget_total_inr=5000.0,
        accessibility=["wheelchair"]
    )

    feasible, rejected = get_options(req, base_legs)
    assert len(feasible) >= 1
    for it in feasible:
        for leg in it.legs:
            assert leg.accessible is True, f"Leg {leg.id} must be wheelchair accessible"


def test_fixture_g_capacity_check():
    """Fixture G: passengers > seats_left excludes that bus."""
    travel_date = "2026-10-15"
    base_legs = generate_base_legs(travel_date)

    # Bus 'bus-morningstar-105' has seats_left=1
    req_2_pax = TripRequest(
        origin="Vizag Railway Station",
        destination="Hitech City",
        travel_date=travel_date,
        arrival_deadline="09:00",
        passengers=2,
        seat_type="any",
        budget_total_inr=5000.0
    )

    feasible, rejected = get_options(req_2_pax, base_legs)
    for it in feasible:
        for leg in it.legs:
            if leg.id == "bus-morningstar-105":
                pytest.fail("Bus with 1 seat should not be feasible for 2 passengers")


def test_recommended_itineraries_always_pass_validator():
    """Property test: every itinerary in feasible_ranked MUST strictly pass validate_itinerary."""
    travel_date = "2026-10-15"
    base_legs = generate_base_legs(travel_date)

    for deadl in ["07:30", "08:00", "08:30", "09:00", "09:30"]:
        for pax in [1, 2, 3]:
            req = TripRequest(
                origin="Vizag Railway Station",
                destination="Hitech City",
                travel_date=travel_date,
                arrival_deadline=deadl,
                passengers=pax,
                budget_total_inr=6000.0
            )
            feasible, _ = get_options(req, base_legs)
            for it in feasible:
                passed, reasons = validate_itinerary(it, req)
                assert passed is True, f"Feasible itinerary failed independent validation: {reasons}"
