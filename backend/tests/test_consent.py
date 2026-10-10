import pytest
from fastapi import HTTPException
from app.models import TripRequest
from app.data import generate_base_legs
from app.planner import get_options
from app.consent import classify_action, verify_and_book, verify_and_cancel


def test_consent_classification():
    """Verify classification of agent actions."""
    assert classify_action("search") == "auto"
    assert classify_action("compare") == "auto"
    assert classify_action("recommend") == "auto"
    assert classify_action("notify") == "auto"
    assert classify_action("explain") == "auto"

    assert classify_action("book") == "needs_approval"
    assert classify_action("pay") == "needs_approval"
    assert classify_action("cancel") == "needs_approval"
    assert classify_action("rebook") == "needs_approval"


def test_booking_gate_unapproved():
    """Unapproved booking must raise HTTP 403."""
    travel_date = "2026-10-15"
    req = TripRequest(
        origin="Vizag Railway Station",
        destination="Hitech City",
        travel_date=travel_date,
        arrival_deadline="09:00",
        passengers=2
    )
    with pytest.raises(HTTPException) as exc_info:
        verify_and_book(
            request=req,
            events=[],
            itinerary_id="any-id",
            approved=False
        )
    assert exc_info.value.status_code == 403
    assert "Explicit user approval required" in exc_info.value.detail


def test_booking_gate_approved_and_sandbox_payment():
    """Approved booking returns booking ID, sandbox payment ID, and server recomputed price."""
    travel_date = "2026-10-15"
    req = TripRequest(
        origin="Vizag Railway Station",
        destination="Hitech City",
        travel_date=travel_date,
        arrival_deadline="09:00",
        passengers=2
    )
    base_legs = generate_base_legs(travel_date)
    feasible, _ = get_options(req, base_legs)
    target_itin = feasible[0]

    bkg_id, pmt_id, amount, booked_itin = verify_and_book(
        request=req,
        events=[],
        itinerary_id=target_itin.id,
        approved=True
    )

    assert bkg_id.startswith("BKG-")
    assert pmt_id.startswith("SBX-")
    assert len(pmt_id) == 12  # SBX- + 8 hex chars
    assert amount == target_itin.total_cost, "Amount must equal server-recomputed price"
    assert booked_itin.id == target_itin.id


def test_cancellation_gate():
    """Cancellation gate: 403 when unapproved, simulated refund terms when approved."""
    with pytest.raises(HTTPException) as exc_info:
        verify_and_cancel(booking_id="BKG-1234", approved=False)
    assert exc_info.value.status_code == 403

    bkg_id, status_str, refund, msg = verify_and_cancel(booking_id="BKG-1234", approved=True)
    assert status_str == "CANCELLED"
    assert "Simulated policy - illustrative, not a real refund policy" in msg
