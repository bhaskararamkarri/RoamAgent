import os
from typing import List, Optional
from fastapi import FastAPI, HTTPException, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import json

from app.models import (
    HealthResponse,
    ParseRequest,
    ParseResponse,
    PlanRequest,
    PlanResponse,
    PlanStats,
    ExplainRequest,
    ExplainResponse,
    DisruptRequest,
    DisruptResponse,
    BookRequest,
    BookResponse,
    SandboxPayment,
    CancelRequest,
    CancelResponse,
    ScenarioItem
)
from app.intake import parse_intake, ANTHROPIC_API_KEY
from app.data import generate_base_legs
from app.disruption import apply_disruptions, handle_disruption
from app.planner import get_options
from app.consent import verify_and_book, verify_and_cancel
from app.explain import explain_itinerary
from app.database import get_db, BookingModel

app = FastAPI(
    title="TBS RoamAgent API",
    description="Deterministic travel concierge for Vizag-Hyderabad multi-leg bus journeys with safety consent gates.",
    version="1.0.0"
)

# CORS configuration allowing localhost, 127.0.0.1, and LAN IPs for mobile testing
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", response_model=HealthResponse)
def health_check():
    """Service health and LLM availability check."""
    return HealthResponse(
        status="ok",
        llm_available=bool(ANTHROPIC_API_KEY)
    )


@app.post("/parse", response_model=ParseResponse)
def parse_endpoint(req: ParseRequest):
    """Parse natural language travel request into TripRequest JSON."""
    return parse_intake(req.text, use_llm=req.llm)


@app.post("/plan", response_model=PlanResponse)
def plan_endpoint(req: PlanRequest):
    """
    Generate, validate, and rank multi-leg itineraries.
    Stateless: base state + events rebuilt deterministically.
    """
    base_legs = generate_base_legs(req.request.travel_date)
    state = apply_disruptions(base_legs, req.events)
    feasible, rejected = get_options(
        request=req.request,
        state=state,
        now=req.now,
        rank_mode=req.rank_mode
    )

    total_candidates = len(feasible) + len(rejected)
    passed_count = len(feasible)
    rate = round(passed_count / total_candidates, 3) if total_candidates > 0 else 0.0

    notes = []
    if not feasible and not rejected:
        notes.append(f"Unsupported Route: No known corridors connect {req.request.origin} to {req.request.destination} in our current network.")
        notes.append("We only display verified, bookable routes and never fabricate connections to fill results.")
    elif not feasible:
        notes.append("No feasible itineraries match your exact deadline, budget, or accessibility criteria.")
        notes.append("Suggestion: Consider relaxing your arrival deadline by 60 minutes or adjusting your budget ceiling.")

    return PlanResponse(
        feasible=feasible,
        rejected=rejected,
        stats=PlanStats(
            candidates=total_candidates,
            passed=passed_count,
            feasibility_rate=rate
        ),
        notes=notes
    )


@app.post("/explain", response_model=ExplainResponse)
def explain_endpoint(req: ExplainRequest):
    """Provide fact-checked explanation for an itinerary in English or Telugu."""
    text, mode = explain_itinerary(
        itinerary_id=req.itinerary_id,
        request=req.request,
        events=req.events,
        original_itinerary_id=req.original_itinerary_id,
        lang=req.lang
    )
    return ExplainResponse(text=text, mode=mode)


@app.post("/disrupt", response_model=DisruptResponse)
def disrupt_endpoint(req: DisruptRequest):
    """Apply disruption event, dynamically replan, and return alternatives with diffs."""
    events, notif, alts, no_alt = handle_disruption(
        request=req.request,
        existing_events=req.events,
        new_event=req.new_event,
        booked_itinerary_id=req.booked_itinerary_id,
        now=req.now
    )
    return DisruptResponse(
        events=events,
        notification=notif,
        alternatives=alts,
        no_alternative_info=no_alt
    )


@app.post("/book", response_model=BookResponse)
def book_endpoint(req: BookRequest, db: Session = Depends(get_db)):
    """
    Book an itinerary. Strictly requires approved=True.
    Recomputes the amount on server (never trusts client price).
    """
    bkg_id, pmt_id, amount, matched_itin = verify_and_book(
        request=req.request,
        events=req.events,
        itinerary_id=req.itinerary_id,
        approved=req.approved
    )
    
    # Save to database
    db_booking = BookingModel(
        id=bkg_id,
        user_id=req.session_id,
        status="CONFIRMED", # Sandbox default success
        amount=amount,
        currency="INR",
        payment_id=pmt_id,
        payment_status="SANDBOX_SUCCESS",
        travel_date=req.request.travel_date,
        origin=req.request.origin,
        destination=req.request.destination,
        itinerary_snapshot=matched_itin.model_dump_json()
    )
    db.add(db_booking)
    db.commit()

    return BookResponse(
        booking_id=bkg_id,
        payment=SandboxPayment(
            payment_id=pmt_id,
            amount=amount,
            status="SANDBOX_SUCCESS"
        ),
        itinerary=matched_itin
    )


@app.post("/cancel", response_model=CancelResponse)
def cancel_endpoint(req: CancelRequest, db: Session = Depends(get_db)):
    """Simulated cancellation endpoint. Strictly requires approved=True."""
    bkg_id, status_str, refund, msg = verify_and_cancel(
        booking_id=req.booking_id,
        approved=req.approved
    )
    
    db_booking = db.query(BookingModel).filter(BookingModel.id == bkg_id).first()
    if db_booking:
        db_booking.status = "CANCELLED"
        db.commit()

    return CancelResponse(
        booking_id=bkg_id,
        status=status_str,
        refund_amount=refund,
        message=msg
    )


@app.get("/bookings")
def list_bookings(session_id: Optional[str] = None, db: Session = Depends(get_db)):
    """List all bookings for the user isolated by session_id."""
    if not session_id:
        return []

    bookings = db.query(BookingModel).filter(BookingModel.user_id == session_id).order_by(BookingModel.created_at.desc()).all()
    results = []
    for b in bookings:
        results.append({
            "id": b.id,
            "status": b.status,
            "amount": b.amount,
            "currency": b.currency,
            "payment_id": b.payment_id,
            "payment_status": b.payment_status,
            "travel_date": b.travel_date,
            "origin": b.origin,
            "destination": b.destination,
            "created_at": b.created_at.isoformat() if b.created_at else None,
            "itinerary": json.loads(b.itinerary_snapshot) if b.itinerary_snapshot else None
        })
    return results


@app.get("/scenarios", response_model=List[ScenarioItem])
def scenarios_endpoint():
    """List preset scenarios for demo and testing."""
    return [
        ScenarioItem(
            id="scenario-a",
            title="Scenario A: Happy Path",
            description="Vizag Railway Station to Hitech City, 2 passengers, arriving before 09:00 AM, ₹5000 budget.",
            text="Vizag to Hitech City tomorrow by 9 AM for 2 people with budget 5000",
            category="Standard"
        ),
        ScenarioItem(
            id="scenario-b",
            title="Scenario B: Trap Bus Candidate",
            description="Ultra-cheap bus arriving at 09:40 AM drop point; rejected by validator due to deadline.",
            text="Vizag to Hitech City tomorrow by 9 AM for 2 people with budget 2000",
            category="Validation Trap"
        ),
        ScenarioItem(
            id="scenario-c",
            title="Scenario C: Disruption & Re-plan",
            description="Booking top choice and testing recovery when a 120-min delay or cancellation occurs.",
            text="Vizag to Hitech City tomorrow by 9 AM for 2 people",
            category="Disruption"
        ),
        ScenarioItem(
            id="scenario-d",
            title="Scenario D: Infeasible Request",
            description="Strict 05:30 AM arrival deadline at Hitech City returns empty results and honest suggestions.",
            text="Vizag to Hitech City tomorrow by 5:30 AM for 2 people",
            category="Honest Refusal"
        ),
        ScenarioItem(
            id="scenario-e",
            title="Scenario E: Sleeper Bus Only",
            description="Filters out all seater buses and verifies sleeper chains.",
            text="Vizag to Hitech City tomorrow by 9 AM for 2 people, sleeper bus only",
            category="Filtering"
        ),
        ScenarioItem(
            id="scenario-f",
            title="Scenario F: Wheelchair Accessible",
            description="Requires wheelchair accessibility across every leg of the trip chain.",
            text="Vizag to Hitech City tomorrow by 9 AM for 2 passengers requiring wheelchair accessibility",
            category="Accessibility"
        )
    ]


@app.get("/metrics")
def metrics_endpoint():
    """Expose system benchmark metrics."""
    from app.metrics import compute_all_metrics
    return compute_all_metrics()
