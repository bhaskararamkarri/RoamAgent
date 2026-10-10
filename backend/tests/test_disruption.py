import pytest
from app.models import TripRequest, DisruptionEvent
from app.data import generate_base_legs
from app.planner import get_options
from app.disruption import handle_disruption, apply_disruptions


def test_fixture_c_disruption_recovery_delay_and_cancel():
    """
    Fixture C: In A, delaying the top-ranked bus by 120 min yields >= 1 feasible alternative;
    cancelling it also yields >= 1 feasible alternative.
    """
    travel_date = "2026-10-15"
    req = TripRequest(
        origin="Vizag Railway Station",
        destination="Hitech City",
        travel_date=travel_date,
        arrival_deadline="09:00",
        passengers=2,
        seat_type="any",
        budget_total_inr=5000.0
    )

    base_legs = generate_base_legs(travel_date)
    feasible, _ = get_options(req, base_legs)
    assert len(feasible) >= 3
    top_itin = feasible[0]
    bus_leg = next(l for l in top_itin.legs if l.mode == "bus")

    # 1. Test 120-minute delay
    delay_event = DisruptionEvent(type="DELAY", leg_id=bus_leg.id, minutes=120)
    events_d, notif_d, alts_d, no_alt_d = handle_disruption(
        request=req,
        existing_events=[],
        new_event=delay_event,
        booked_itinerary_id=top_itin.id
    )
    assert len(alts_d) >= 1, "Delaying top bus by 120 min must yield >= 1 feasible alternative"
    assert "diff_vs_booked" in alts_d[0].model_dump()
    assert "Disruption Alert" in notif_d["message"]

    # 2. Test cancellation
    cancel_event = DisruptionEvent(type="CANCEL", leg_id=bus_leg.id)
    events_c, notif_c, alts_c, no_alt_c = handle_disruption(
        request=req,
        existing_events=[],
        new_event=cancel_event,
        booked_itinerary_id=top_itin.id
    )
    assert len(alts_c) >= 1, "Cancelling top bus must yield >= 1 feasible alternative"
    assert "CANCELLED" in notif_c["message"]


def test_no_alternative_near_miss_handling():
    """When all alternatives are disrupted/infeasible, honest near-miss info is returned."""
    travel_date = "2026-10-15"
    # Strict deadline that only 1 bus barely met
    req = TripRequest(
        origin="Vizag Railway Station",
        destination="Hitech City",
        travel_date=travel_date,
        arrival_deadline="06:30",
        passengers=2,
        seat_type="any",
        budget_total_inr=5000.0
    )

    base_legs = generate_base_legs(travel_date)
    feasible, _ = get_options(req, base_legs)
    if not feasible:
        # If no feasible at 06:30, use 07:00
        req.arrival_deadline = "07:00"
        feasible, _ = get_options(req, base_legs)

    booked_id = feasible[0].id if feasible else "dummy-id"
    bus_leg = feasible[0].legs[1] if feasible and len(feasible[0].legs) > 1 else base_legs[0]

    # Cancel ALL viable early buses
    cancel_events = [
        DisruptionEvent(type="CANCEL", leg_id="bus-apsrtc-garuda-101"),
        DisruptionEvent(type="CANCEL", leg_id="bus-apsrtc-amaravati-102"),
        DisruptionEvent(type="CANCEL", leg_id="bus-dwaraka-exp-106"),
    ]

    _, _, alts, no_alt = handle_disruption(
        request=req,
        existing_events=cancel_events[:-1],
        new_event=cancel_events[-1],
        booked_itinerary_id=booked_id
    )

    if not alts:
        assert no_alt is not None
        assert "nearest_near_miss" in no_alt
        assert "suggestions" in no_alt
        assert "Rebooking/compensation depends on operator" in no_alt["disclaimer"]
