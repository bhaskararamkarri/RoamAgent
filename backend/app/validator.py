from datetime import datetime
from typing import Tuple, List
from app.models import TripRequest, Itinerary


def parse_iso_or_time(time_str: str) -> datetime:
    """Parse ISO string or HH:MM string into datetime for comparison."""
    if "T" in time_str:
        return datetime.fromisoformat(time_str)
    # If HH:MM
    hh, mm = map(int, time_str.split(":"))
    return datetime(2000, 1, 1, hh, mm)


def validate_itinerary(itinerary: Itinerary, request: TripRequest) -> Tuple[bool, List[str]]:
    """
    Independent validator for travel itineraries against a TripRequest.
    Does NOT import or rely on planner internals.
    Checks:
    1. Arrival deadline: arrival <= request.arrival_deadline
    2. Budget: total_cost <= request.budget_total_inr
    3. Buffers >= minimum physical connection times
    4. Seat match: if request requires 'sleeper', intercity bus must be sleeper
    5. Seats availability: bus seats_left >= request.passengers
    6. All legs ok: no leg is 'cancelled' or 'unavailable'
    7. Accessibility: if 'wheelchair' requested, all legs in chain must be accessible
    8. Node and time chaining: next.from_node == prev.to_node and next.dep >= prev.arr
    """
    reasons: List[str] = []

    if not itinerary.legs:
        return False, ["Itinerary has no travel legs"]

    # 1. Arrival deadline check
    # Parse itinerary arrival (HH:MM or ISO) and request arrival_deadline (HH:MM)
    try:
        req_hh, req_mm = map(int, request.arrival_deadline.split(":"))
        if "T" in itinerary.arrival:
            arr_dt = datetime.fromisoformat(itinerary.arrival)
            itin_hh, itin_mm = arr_dt.hour, arr_dt.minute
        else:
            itin_hh, itin_mm = map(int, itinerary.arrival.split(":"))

        itin_minutes = itin_hh * 60 + itin_mm
        req_minutes = req_hh * 60 + req_mm

        if itin_minutes > req_minutes:
            diff = itin_minutes - req_minutes
            reasons.append(
                f"Arrives at {itin_hh:02d}:{itin_mm:02d}, which is {diff} minutes past the {request.arrival_deadline} deadline."
            )
    except Exception as e:
        reasons.append(f"Invalid arrival time comparison: {str(e)}")

    # 2. Budget check
    if request.budget_total_inr is not None:
        if itinerary.total_cost > request.budget_total_inr:
            excess = itinerary.total_cost - request.budget_total_inr
            reasons.append(
                f"Total fare ₹{itinerary.total_cost:.0f} exceeds budget of ₹{request.budget_total_inr:.0f} by ₹{excess:.0f}."
            )

    # 3. Leg status check
    for leg in itinerary.legs:
        if leg.status in ("cancelled", "unavailable"):
            reasons.append(
                f"Leg {leg.operator} ({leg.from_node} -> {leg.to_node}) is {leg.status}."
            )

    # 4. Seat capacity check (bus seats_left >= passengers)
    for leg in itinerary.legs:
        if leg.mode == "bus":
            if leg.seats_left < request.passengers:
                reasons.append(
                    f"Bus {leg.operator} has only {leg.seats_left} seat(s) available for {request.passengers} passengers."
                )

    # 5. Seat type match (sleeper requirement)
    if request.seat_type == "sleeper":
        for leg in itinerary.legs:
            if leg.mode == "bus" and leg.seat_type != "sleeper":
                reasons.append(
                    f"Bus {leg.operator} has '{leg.seat_type}' seating, but 'sleeper' was requested."
                )

    # 6. Accessibility check
    if "wheelchair" in request.accessibility:
        for leg in itinerary.legs:
            if not leg.accessible:
                reasons.append(
                    f"Leg {leg.operator} ({leg.mode} from {leg.from_node} to {leg.to_node}) is not wheelchair-accessible."
                )

    # 7. Node chaining and time chaining & buffers
    for i in range(len(itinerary.legs) - 1):
        curr_leg = itinerary.legs[i]
        next_leg = itinerary.legs[i + 1]

        # Node continuity
        if curr_leg.to_node != next_leg.from_node:
            reasons.append(
                f"Transfer break between {curr_leg.to_node} and {next_leg.from_node}."
            )

        # Time continuity and buffer
        curr_arr = datetime.fromisoformat(curr_leg.arr)
        next_dep = datetime.fromisoformat(next_leg.dep)
        buffer_min = int((next_dep - curr_arr).total_seconds() / 60)

        # Min buffer rules: 15 min if bus involved, 10 min local-to-local
        min_required = 15 if (curr_leg.mode == "bus" or next_leg.mode == "bus") else 10
        if buffer_min < min_required:
            reasons.append(
                f"Connection buffer at {curr_leg.to_node} is {buffer_min} mins, below safe minimum of {min_required} mins."
            )

    passed = len(reasons) == 0
    return passed, reasons
