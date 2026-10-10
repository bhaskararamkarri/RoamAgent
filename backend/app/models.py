from typing import Literal, Optional, List, Dict, Any
from pydantic import BaseModel, Field


class TripRequest(BaseModel):
    origin: str
    destination: str
    travel_date: str  # YYYY-MM-DD
    arrival_deadline: str  # HH:MM
    passengers: int = Field(default=1, ge=1)
    seat_type: Literal["sleeper", "seater", "any"] = "any"
    budget_total_inr: Optional[float] = None
    accessibility: List[str] = Field(default_factory=list)
    luggage: Optional[Literal["light", "heavy"]] = None


class Leg(BaseModel):
    id: str
    mode: Literal["bus", "auto", "cab", "metro", "train", "flight"]
    from_node: str
    to_node: str
    dep: str  # ISO 8601 string (e.g. 2026-10-10T20:30:00)
    arr: str  # ISO 8601 string (e.g. 2026-10-11T06:30:00)
    fare: float
    per_vehicle: bool = False
    seat_type: Literal["sleeper", "seater", "any", "na"] = "na"
    seats_left: int = 40
    operator: str
    accessible: bool = False
    delay_prob: float = 0.1
    typical_delay_min: int = 15
    updated_at: str
    source: Literal["SIMULATED"] = "SIMULATED"
    status: Literal["ok", "delayed", "cancelled", "unavailable"] = "ok"


class Itinerary(BaseModel):
    id: str
    legs: List[Leg]
    total_cost: float
    total_duration_min: int
    arrival: str  # Arrival time string (HH:MM or ISO)
    buffers: List[int]
    risk_label: Literal["Low", "Medium", "High"]
    risk_value: float
    assumptions: List[str]
    data_freshness: str


class DisruptionEvent(BaseModel):
    type: Literal["DELAY", "CANCEL", "MISSED_CONNECTION", "LOCAL_UNAVAILABLE"]
    leg_id: str
    minutes: Optional[int] = None


class HealthResponse(BaseModel):
    status: str = "ok"
    llm_available: bool = False


class ParseRequest(BaseModel):
    text: str
    llm: bool = True


class ParseResponse(BaseModel):
    request: Optional[TripRequest] = None
    needs_followup: bool = False
    question: Optional[str] = None
    mode: Literal["llm", "offline"] = "offline"


class PlanRequest(BaseModel):
    request: TripRequest
    events: List[DisruptionEvent] = Field(default_factory=list)
    rank_mode: Literal["balanced", "cheapest", "fastest", "safest"] = "balanced"
    now: Optional[str] = None


class RejectedCandidate(BaseModel):
    itinerary: Itinerary
    reasons: List[str]


class PlanStats(BaseModel):
    candidates: int
    passed: int
    feasibility_rate: float


class PlanResponse(BaseModel):
    feasible: List[Itinerary]
    rejected: List[RejectedCandidate]
    stats: PlanStats
    notes: List[str] = Field(default_factory=list)


class ExplainRequest(BaseModel):
    itinerary_id: str
    request: TripRequest
    events: List[DisruptionEvent] = Field(default_factory=list)
    original_itinerary_id: Optional[str] = None
    lang: Literal["en", "te"] = "en"


class ExplainResponse(BaseModel):
    text: str
    mode: Literal["llm", "offline"] = "offline"


class DisruptRequest(BaseModel):
    request: TripRequest
    events: List[DisruptionEvent] = Field(default_factory=list)
    new_event: DisruptionEvent
    booked_itinerary_id: str
    now: Optional[str] = None


class AlternativeOption(BaseModel):
    itinerary: Itinerary
    why_feasible: str
    diff_vs_booked: Dict[str, Any]


class DisruptResponse(BaseModel):
    events: List[DisruptionEvent]
    notification: Dict[str, str]
    alternatives: List[AlternativeOption]
    no_alternative_info: Optional[Dict[str, Any]] = None


class BookRequest(BaseModel):
    request: TripRequest
    events: List[DisruptionEvent] = Field(default_factory=list)
    itinerary_id: str
    approved: bool = False
    session_id: Optional[str] = None


class SandboxPayment(BaseModel):
    payment_id: str
    amount: float
    status: str = "SANDBOX_SUCCESS"


class BookResponse(BaseModel):
    booking_id: str
    payment: SandboxPayment
    itinerary: Itinerary


class CancelRequest(BaseModel):
    booking_id: str
    approved: bool = False


class CancelResponse(BaseModel):
    booking_id: str
    status: str = "CANCELLED"
    refund_amount: float
    message: str = "Simulated policy - illustrative, not a real refund policy"


class ScenarioItem(BaseModel):
    id: str
    title: str
    description: str
    text: str
    category: str
