from datetime import datetime
from typing import List, Literal, Tuple
from app.models import Itinerary, Leg, TripRequest


def compute_risk(legs: List[Leg], buffers: List[int], request: TripRequest) -> Tuple[float, Literal["Low", "Medium", "High"]]:
    """
    Compute risk value and label:
    ratio = buffer / typical_delay_min of incoming leg.
    risk_value = min ratio over transfers (bus-only: (deadline - arrival) / typical_delay of bus).
    Risk Label:
      >= 2.0: Low risk (ample buffer)
      1.0 - 2.0: Medium risk (tight buffer)
      < 1.0: High risk (buffer is smaller than typical delay)
    """
    if len(legs) == 1:
        # Bus-only or single leg
        try:
            req_hh, req_mm = map(int, request.arrival_deadline.split(":"))
            travel_dt = datetime.strptime(request.travel_date, "%Y-%m-%d")
            deadline_dt = datetime(travel_dt.year, travel_dt.month, travel_dt.day, req_hh, req_mm)
            arr_dt = datetime.fromisoformat(legs[0].arr)
            slack_min = int((deadline_dt - arr_dt).total_seconds() / 60)
            slack_min = max(0, slack_min)
            risk_val = round(slack_min / max(1, legs[0].typical_delay_min), 2)
        except Exception:
            risk_val = 1.0
    else:
        ratios = []
        for i, buf in enumerate(buffers):
            incoming = legs[i]
            r = buf / max(1, incoming.typical_delay_min)
            ratios.append(r)
        risk_val = round(min(ratios), 2) if ratios else 2.0

    if risk_val >= 2.0:
        label: Literal["Low", "Medium", "High"] = "Low"
    elif risk_val >= 1.0:
        label = "Medium"
    else:
        label = "High"

    return risk_val, label


def rank_itineraries(
    itineraries: List[Itinerary],
    rank_mode: Literal["balanced", "cheapest", "fastest", "safest"] = "balanced"
) -> List[Itinerary]:
    """
    Rank feasible itineraries deterministically according to chosen rank_mode.
    Exposes formula and weights in assumptions.
    Tie-break deterministically by itinerary.id.
    """
    if not itineraries:
        return []

    if rank_mode == "cheapest":
        return sorted(itineraries, key=lambda x: (x.total_cost, x.total_duration_min, -x.risk_value, x.id))

    if rank_mode == "fastest":
        return sorted(itineraries, key=lambda x: (x.total_duration_min, x.total_cost, -x.risk_value, x.id))

    if rank_mode == "safest":
        # Safest = highest risk_value (buffer ratio), then fastest
        return sorted(itineraries, key=lambda x: (-x.risk_value, x.total_duration_min, x.total_cost, x.id))

    # Balanced mode: 0.4*norm(cost) + 0.3*norm(duration) + 0.3*norm(risk) (lower is better)
    costs = [it.total_cost for it in itineraries]
    durations = [it.total_duration_min for it in itineraries]
    risk_vals = [it.risk_value for it in itineraries]

    min_c, max_c = min(costs), max(costs)
    min_d, max_d = min(durations), max(durations)
    min_r, max_r = min(risk_vals), max(risk_vals)

    def score(it: Itinerary) -> float:
        norm_c = (it.total_cost - min_c) / (max_c - min_c) if max_c > min_c else 0.0
        norm_d = (it.total_duration_min - min_d) / (max_d - min_d) if max_d > min_d else 0.0
        # Invert risk so that high risk_value (safe) maps to 0.0 (good)
        norm_r = (max_r - it.risk_value) / (max_r - min_r) if max_r > min_r else 0.0
        return 0.4 * norm_c + 0.3 * norm_d + 0.3 * norm_r

    return sorted(itineraries, key=lambda x: (score(x), x.total_cost, x.id))
