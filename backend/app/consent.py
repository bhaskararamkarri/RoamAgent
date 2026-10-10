import secrets
from typing import Literal, Tuple
from fastapi import HTTPException
from app.models import TripRequest, DisruptionEvent, Itinerary
from app.data import generate_base_legs
from app.disruption import apply_disruptions
from app.planner import get_options


def classify_action(action: str) -> Literal["auto", "needs_approval"]:
    """
    Classify whether an agent action is safe for autonomous execution
    or strictly requires explicit user approval.
    """
    autonomous_actions = {"search", "compare", "recommend", "notify", "explain"}
    approval_actions = {"book", "pay", "cancel", "rebook"}

    if action in autonomous_actions:
        return "auto"
    if action in approval_actions:
        return "needs_approval"
    return "needs_approval"


def generate_sandbox_payment_id() -> str:
    """Generate a realistic sandbox payment identifier: SBX-<8 hex>."""
    return f"SBX-{secrets.token_hex(4)}"


def generate_booking_id() -> str:
    """Generate a unique booking identifier."""
    return f"BKG-{secrets.token_hex(4).upper()}"


def verify_and_book(
    request: TripRequest,
    events: list[DisruptionEvent],
    itinerary_id: str,
    approved: bool
) -> Tuple[str, str, float, Itinerary]:
    """
    Gate booking behind explicit user approval.
    Recomputes the itinerary server-side to prevent client price tampering.
    Returns: (booking_id, payment_id, amount, itinerary).
    Raises HTTPException 403 if not approved.
    Raises HTTPException 404 if itinerary not found.
    """
    if not approved:
        raise HTTPException(
            status_code=403,
            detail="Explicit user approval required to book and pay"
        )

    # Recompute state deterministically
    base_legs = generate_base_legs(request.travel_date)
    state = apply_disruptions(base_legs, events)
    feasible, rejected = get_options(request, state)

    # Search among feasible and rejected (in case user explicitly booked an option)
    all_itineraries = feasible + [r.itinerary for r in rejected]
    matched_itin = None
    for it in all_itineraries:
        if it.id == itinerary_id:
            matched_itin = it
            break

    if not matched_itin:
        raise HTTPException(
            status_code=404,
            detail=f"Itinerary {itinerary_id} not found in recomputed travel options"
        )

    # Server-enforced amount
    server_amount = matched_itin.total_cost
    booking_id = generate_booking_id()
    payment_id = generate_sandbox_payment_id()

    return booking_id, payment_id, server_amount, matched_itin


def verify_and_cancel(booking_id: str, approved: bool) -> Tuple[str, str, float, str]:
    """
    Gate cancellation behind explicit user approval.
    Raises HTTPException 403 if not approved.
    """
    if not approved:
        raise HTTPException(
            status_code=403,
            detail="Explicit user approval required to cancel"
        )

    refund_amount = 0.0  # Simulated illustrative refund
    message = "Simulated policy - illustrative, not a real refund policy"
    return booking_id, "CANCELLED", refund_amount, message
