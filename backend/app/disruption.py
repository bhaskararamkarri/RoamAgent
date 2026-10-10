from copy import deepcopy
from datetime import datetime, timedelta, timezone
from typing import List, Optional, Tuple, Dict, Any
from app.models import Leg, DisruptionEvent, TripRequest, Itinerary, AlternativeOption
from app.planner import get_options
from app.data import generate_base_legs


def apply_disruptions(base_legs: List[Leg], events: List[DisruptionEvent]) -> List[Leg]:
    """
    Pure function: returns a NEW list of legs with all disruption events applied.
    - DELAY: shifts dep and arr forward by event.minutes.
    - CANCEL: marks leg status as 'cancelled'.
    - MISSED_CONNECTION: marks leg as 'unavailable'.
    - LOCAL_UNAVAILABLE: marks leg as 'unavailable'.
    """
    mutated_legs = [leg.model_copy() for leg in base_legs]
    leg_map = {l.id: l for l in mutated_legs}

    for ev in events:
        target = leg_map.get(ev.leg_id)
        if not target:
            continue

        if ev.type == "DELAY":
            mins = ev.minutes if ev.minutes is not None else 30
            dep_dt = datetime.fromisoformat(target.dep) + timedelta(minutes=mins)
            arr_dt = datetime.fromisoformat(target.arr) + timedelta(minutes=mins)
            target.dep = dep_dt.strftime("%Y-%m-%dT%H:%M:%S")
            target.arr = arr_dt.strftime("%Y-%m-%dT%H:%M:%S")
            target.status = "delayed"

        elif ev.type == "CANCEL":
            target.status = "cancelled"

        elif ev.type in ("MISSED_CONNECTION", "LOCAL_UNAVAILABLE"):
            target.status = "unavailable"

    return mutated_legs


def find_booked_itinerary(
    request: TripRequest,
    events_before: List[DisruptionEvent],
    booked_itinerary_id: str
) -> Optional[Itinerary]:
    """Rebuild base state before new event to find booked itinerary attributes."""
    base_legs = generate_base_legs(request.travel_date)
    state = apply_disruptions(base_legs, events_before)
    feasible, rejected = get_options(request, state)
    all_itins = feasible + [r.itinerary for r in rejected]
    for it in all_itins:
        if it.id == booked_itinerary_id:
            return it
    return None


def calculate_diff(alt: Itinerary, booked: Optional[Itinerary]) -> Dict[str, Any]:
    """Calculate cost, time, and risk differences between alternative and booked itinerary."""
    if not booked:
        return {
            "cost_delta": 0.0,
            "arrival_delta_min": 0,
            "risk_change": f"New: {alt.risk_label}"
        }

    cost_delta = round(alt.total_cost - booked.total_cost, 2)

    try:
        alt_hh, alt_mm = map(int, alt.arrival.split(":"))
        bk_hh, bk_mm = map(int, booked.arrival.split(":"))
        arr_delta = (alt_hh * 60 + alt_mm) - (bk_hh * 60 + bk_mm)
    except Exception:
        arr_delta = 0

    risk_change = f"{booked.risk_label} -> {alt.risk_label}"
    return {
        "cost_delta": cost_delta,
        "arrival_delta_min": arr_delta,
        "risk_change": risk_change
    }


def handle_disruption(
    request: TripRequest,
    existing_events: List[DisruptionEvent],
    new_event: DisruptionEvent,
    booked_itinerary_id: str,
    now: Optional[str] = None
) -> Tuple[List[DisruptionEvent], Dict[str, str], List[AlternativeOption], Optional[Dict[str, Any]]]:
    """
    Process disruption event, compute updated state, replan, and generate diffs and alternatives.
    """
    updated_events = list(existing_events) + [new_event]
    base_legs = generate_base_legs(request.travel_date)

    # Disruption notification text
    leg_lookup = {l.id: l for l in base_legs}
    affected_leg = leg_lookup.get(new_event.leg_id)
    op_name = affected_leg.operator if affected_leg else new_event.leg_id

    if new_event.type == "DELAY":
        notif_msg = f"Disruption Alert: {op_name} is delayed by {new_event.minutes or 30} minutes."
    elif new_event.type == "CANCEL":
        notif_msg = f"Urgent Alert: {op_name} service has been CANCELLED."
    elif new_event.type == "MISSED_CONNECTION":
        notif_msg = f"Disruption Alert: Connection missed for {op_name}."
    else:
        notif_msg = f"Notice: Local ride for {op_name} is unavailable."

    notif = {
        "ts": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "message": notif_msg
    }

    # Booked itinerary for comparison
    booked = find_booked_itinerary(request, existing_events, booked_itinerary_id)

    # Replan with new state
    new_state = apply_disruptions(base_legs, updated_events)
    feasible_options, rejected_options = get_options(request, new_state, now=now)

    # Exclude the disrupted booked itinerary from alternatives
    valid_alts = [it for it in feasible_options if it.id != booked_itinerary_id]

    alternatives: List[AlternativeOption] = []
    for it in valid_alts:
        diff = calculate_diff(it, booked)
        why = (
            f"Arrival at {it.arrival} satisfies your {request.arrival_deadline} deadline with "
            f"{it.risk_label.lower()} risk."
        )
        alternatives.append(AlternativeOption(
            itinerary=it,
            why_feasible=why,
            diff_vs_booked=diff
        ))

    no_alt_info = None
    if not alternatives:
        # Near-miss analysis
        near_miss = None
        violation_reason = "No candidate met arrival or budget constraints."
        suggestions = ["Extend your arrival deadline by 60-90 minutes", "Increase your budget ceiling"]

        if rejected_options:
            # Pick first rejected candidate as near-miss
            near_miss = rejected_options[0].itinerary
            violation_reason = rejected_options[0].reasons[0] if rejected_options[0].reasons else violation_reason

        no_alt_info = {
            "message": "No feasible alternatives found under your current trip constraints.",
            "nearest_near_miss": near_miss.model_dump() if near_miss else None,
            "violated_constraint": violation_reason,
            "suggestions": suggestions,
            "disclaimer": "Rebooking/compensation depends on operator and payment partners and is not offered by this prototype."
        }

    return updated_events, notif, alternatives, no_alt_info
