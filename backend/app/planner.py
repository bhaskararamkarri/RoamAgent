import hashlib
import math
from datetime import datetime
from typing import List, Tuple, Optional, Dict
from app.models import Leg, Itinerary, TripRequest, RejectedCandidate
from app.validator import validate_itinerary
from app.ranker import compute_risk, rank_itineraries
from app.data import SIMULATED_TIMESTAMP


def build_itinerary_id(legs: List[Leg]) -> str:
    """Generate deterministic hash id from ordered leg ids."""
    key = ":".join(l.id for l in legs)
    digest = hashlib.sha256(key.encode("utf-8")).hexdigest()[:12]
    return f"itin-{digest}"


def calculate_buffers(legs: List[Leg]) -> List[int]:
    """Calculate buffer minutes between consecutive legs."""
    buffers: List[int] = []
    for i in range(len(legs) - 1):
        dep_next = datetime.fromisoformat(legs[i + 1].dep)
        arr_curr = datetime.fromisoformat(legs[i].arr)
        diff_min = int((dep_next - arr_curr).total_seconds() / 60)
        buffers.append(diff_min)
    return buffers


def create_itinerary(legs: List[Leg], request: TripRequest) -> Itinerary:
    """Construct an Itinerary object with computed cost, duration, buffers, and risk."""
    buffers = calculate_buffers(legs)
    itin_id = build_itinerary_id(legs)

    # Cost calculation: per-person fares * pax + per-vehicle fares * ceil(pax / 4)
    per_person_sum = sum(l.fare for l in legs if not l.per_vehicle)
    per_vehicle_sum = sum(l.fare for l in legs if l.per_vehicle)
    vehicles_needed = math.ceil(request.passengers / 4.0)
    total_cost = (per_person_sum * request.passengers) + (per_vehicle_sum * vehicles_needed)

    # Duration calculation
    start_dt = datetime.fromisoformat(legs[0].dep)
    end_dt = datetime.fromisoformat(legs[-1].arr)
    total_duration_min = int((end_dt - start_dt).total_seconds() / 60)
    arrival_str = end_dt.strftime("%Y-%m-%dT%H:%M:%S")

    # Risk evaluation
    risk_val, risk_lbl = compute_risk(legs, buffers, request)

    assumptions = [
        f"Per-person fares ({request.passengers} pax) + vehicle fares ({vehicles_needed} vehicle(s))",
        "Transfer buffer rule: minimum 15 min bus, 10 min local",
        "Risk formula: buffer / incoming leg typical delay (Low >= 2.0, Med 1.0-2.0, High < 1.0)",
        "Balanced mode weights: 0.4*cost + 0.3*duration + 0.3*risk",
        "Source: SIMULATED data for hackathon prototype"
    ]

    return Itinerary(
        id=itin_id,
        legs=legs,
        total_cost=round(total_cost, 2),
        total_duration_min=total_duration_min,
        arrival=arrival_str,
        buffers=buffers,
        risk_label=risk_lbl,
        risk_value=risk_val,
        assumptions=assumptions,
        data_freshness=SIMULATED_TIMESTAMP
    )


NODE_ALIASES: Dict[str, List[str]] = {
    "visakhapatnam": ["vizag railway station", "vizag rtc complex (dwaraka)", "vizag", "vskp", "mvp colony", "gajuwaka"],
    "vizag": ["vizag railway station", "vizag rtc complex (dwaraka)", "visakhapatnam", "vskp", "mvp colony", "gajuwaka"],
    "hyderabad": ["hitech city", "secunderabad", "gachibowli", "ameerpet", "miyapur", "mgbs", "kukatpally", "lb nagar", "hyd"],
    "new delhi": ["new delhi railway station (ndls)", "delhi", "anand vihar isbt & terminal", "hazrat nizamuddin railway station (nzm)", "kashmere gate isbt", "indira gandhi international airport (del)"],
    "delhi": ["new delhi", "new delhi railway station (ndls)", "anand vihar isbt & terminal", "hazrat nizamuddin railway station (nzm)", "kashmere gate isbt", "indira gandhi international airport (del)"],
    "mumbai": ["chhatrapati shivaji maharaj terminus (csmt)", "mumbai central railway station", "dadar terminus", "bandra terminus (bdts)", "chhatrapati shivaji maharaj international airport (bom)", "bombay"],
    "bengaluru": ["ksr bengaluru city (majestic sbc)", "yesvantpur junction (ypr)", "kempegowda international airport (blr)", "bangalore"],
    "bangalore": ["ksr bengaluru city (majestic sbc)", "yesvantpur junction (ypr)", "kempegowda international airport (blr)", "bengaluru"],
    "chennai": ["puratchi thalaivar dr. m.g.r. central (mas)", "chennai central", "chennai egmore (ms)", "chennai mofussil bus terminus (cmbt)", "madras"],
    "kolkata": ["howrah junction (hwh)", "sealdah railway station (sdah)", "calcutta"],
    "bhubaneswar": ["bhubaneswar railway station", "puri", "bbs"],
    "jaipur": ["jaipur junction", "pink city"],
    "pune": ["pune junction", "swargate bus stand"],
    "ahmedabad": ["ahmedabad junction (kalupur)", "sabarmati junction"],
    "chandigarh": ["chandigarh railway station", "isbt sector 43"],
    "shimla": ["shimla railway station", "isbt tutikandi", "mall road shimla"],
}


def nodes_match(a: str, b: str) -> bool:
    """Check if two location strings match exactly or via known city/hub aliases. No substring matching."""
    if not a or not b:
        return False
    a_l = a.strip().lower()
    b_l = b.strip().lower()
    if a_l == b_l:
        return True
    if a_l in NODE_ALIASES and b_l in NODE_ALIASES[a_l]:
        return True
    if b_l in NODE_ALIASES and a_l in NODE_ALIASES[b_l]:
        return True
    return False


def is_valid_connection(prev_leg: Leg, next_leg: Leg) -> bool:
    """Check physical buffer requirement between consecutive legs."""
    if prev_leg.to_node != next_leg.from_node:
        return False
    arr_prev = datetime.fromisoformat(prev_leg.arr)
    dep_next = datetime.fromisoformat(next_leg.dep)
    buf = int((dep_next - arr_prev).total_seconds() / 60)
    min_buf = 15 if (prev_leg.mode in ("bus", "train", "flight") or next_leg.mode in ("bus", "train", "flight")) else 10
    # Must have at least min_buf and not exceed 180 min to keep connections sensible
    return min_buf <= buf <= 180


def enumerate_candidates(
    request: TripRequest,
    state: List[Leg],
    now: Optional[str] = None
) -> List[Itinerary]:
    """
    Enumerate multi-leg candidate itineraries matching origin and destination.
    Patterns:
    - [intercity] (train, flight, bus)
    - [first -> intercity]
    - [intercity -> last]
    - [first -> intercity -> last]
    Does NOT filter by deadline or budget (validator does that).
    """
    now_dt = datetime.fromisoformat(now) if now else None

    # Filter out cancelled / unavailable legs or past legs
    valid_legs: List[Leg] = []
    for leg in state:
        if leg.status in ("cancelled", "unavailable"):
            continue
        if now_dt and datetime.fromisoformat(leg.dep) < now_dt:
            continue
        valid_legs.append(leg)

    first_mile_legs = [
        l for l in valid_legs 
        if l.mode in ("auto", "cab") and (l.from_node == request.origin or nodes_match(l.from_node, request.origin))
    ]
    intercity_legs = [
        l for l in valid_legs 
        if l.mode in ("bus", "train", "flight")
    ]
    last_mile_legs = [
        l for l in valid_legs 
        if l.mode in ("metro", "cab", "auto") and (l.to_node == request.destination or nodes_match(l.to_node, request.destination))
    ]

    candidates: List[Itinerary] = []
    seen_ids = set()

    # 1. Direct intercity [intercity] (bus, train, flight)
    for b in intercity_legs:
        if (b.from_node == request.origin or nodes_match(b.from_node, request.origin)) and (b.to_node == request.destination or nodes_match(b.to_node, request.destination)):
            itin = create_itinerary([b], request)
            if itin.id not in seen_ids:
                seen_ids.add(itin.id)
                candidates.append(itin)

    # 2. [intercity -> last]
    for b in intercity_legs:
        if b.from_node == request.origin or nodes_match(b.from_node, request.origin):
            matching_last = [l for l in last_mile_legs if is_valid_connection(b, l)]
            # Take earliest viable for each mode to avoid explosion
            by_mode: Dict[str, Leg] = {}
            for l in sorted(matching_last, key=lambda x: x.dep):
                if l.mode not in by_mode:
                    by_mode[l.mode] = l
            for l in by_mode.values():
                itin = create_itinerary([b, l], request)
                if itin.id not in seen_ids:
                    seen_ids.add(itin.id)
                    candidates.append(itin)

    # 3. [first -> intercity]
    for b in intercity_legs:
        if b.to_node == request.destination or nodes_match(b.to_node, request.destination):
            matching_first = [f for f in first_mile_legs if is_valid_connection(f, b)]
            # Take closest first-mile connection (latest departure that satisfies buffer)
            by_mode: Dict[str, Leg] = {}
            for f in sorted(matching_first, key=lambda x: x.dep, reverse=True):
                if f.mode not in by_mode:
                    by_mode[f.mode] = f
            for f in by_mode.values():
                itin = create_itinerary([f, b], request)
                if itin.id not in seen_ids:
                    seen_ids.add(itin.id)
                    candidates.append(itin)

    # 4. [first -> intercity -> last]
    for b in intercity_legs:
        matching_first = [f for f in first_mile_legs if is_valid_connection(f, b)]
        matching_last = [l for l in last_mile_legs if is_valid_connection(b, l)]

        if not matching_first or not matching_last:
            continue

        # For first-mile, select latest sensible departure for auto & cab
        best_first: Dict[str, Leg] = {}
        for f in sorted(matching_first, key=lambda x: x.dep, reverse=True):
            if f.mode not in best_first:
                best_first[f.mode] = f

        # For last-mile, select earliest departure for metro & cab/auto
        best_last: Dict[str, Leg] = {}
        for l in sorted(matching_last, key=lambda x: x.dep):
            if l.mode not in best_last:
                best_last[l.mode] = l

        for f in best_first.values():
            for l in best_last.values():
                itin = create_itinerary([f, b, l], request)
                if itin.id not in seen_ids:
                    seen_ids.add(itin.id)
                    candidates.append(itin)

    return candidates


def get_options(
    request: TripRequest,
    state: List[Leg],
    now: Optional[str] = None,
    rank_mode: str = "balanced"
) -> Tuple[List[Itinerary], List[RejectedCandidate]]:
    """
    Generate all candidates, validate them, and rank the feasible options.
    Returns: (feasible_ranked, rejected_candidates).
    """
    candidates = enumerate_candidates(request, state, now)
    feasible: List[Itinerary] = []
    rejected: List[RejectedCandidate] = []

    for c in candidates:
        passed, reasons = validate_itinerary(c, request)
        if passed:
            feasible.append(c)
        else:
            rejected.append(RejectedCandidate(itinerary=c, reasons=reasons))

    feasible_ranked = rank_itineraries(feasible, rank_mode=rank_mode)
    return feasible_ranked, rejected
