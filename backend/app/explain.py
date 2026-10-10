import os
import re
from typing import Dict, Any, Tuple, Optional, Set
from app.models import Itinerary, TripRequest, DisruptionEvent
from app.data import generate_base_legs
from app.disruption import apply_disruptions
from app.planner import get_options
from app.i18n import explain_itinerary_te, explain_replan_te

ROAM_MODEL = os.getenv("ROAM_MODEL", "claude-sonnet-4-6")
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")


def extract_allowed_numbers(facts: Dict[str, Any]) -> Set[str]:
    """Extract set of all valid numeric and time tokens from facts dictionary."""
    allowed: Set[str] = set()

    def add_val(val: Any):
        if val is None:
            return
        if isinstance(val, (int, float)):
            allowed.add(str(val))
            allowed.add(f"{val:.0f}")
            allowed.add(f"{val:.2f}")
        elif isinstance(val, str):
            # If string is time HH:MM or ISO
            for match in re.findall(r"\b\d{1,4}(?::\d{2})?\b", val):
                allowed.add(match)
                if ":" in match:
                    parts = match.split(":")
                    allowed.add(parts[0])
                    allowed.add(parts[1])
                    allowed.add(f"{int(parts[0])}:{parts[1]}")
        elif isinstance(val, list):
            for item in val:
                add_val(item)
        elif isinstance(val, dict):
            for v in val.values():
                add_val(v)

    for k, v in facts.items():
        add_val(v)

    return allowed


def verify_text_against_facts(text: str, allowed: Set[str]) -> bool:
    """
    Verify that every number or time appearing in the generated text
    is present in the facts allowed set. Returns False if an invented number appears.
    """
    found_tokens = re.findall(r"\b\d+(?::\d{2})?(?:\.\d+)?\b", text)
    for token in found_tokens:
        clean = token.lstrip("0") or "0"
        # Check token directly or normalized
        if token not in allowed and clean not in allowed and token.rstrip(".0") not in allowed:
            return False
    return True


def build_template_explanation(facts: Dict[str, Any], is_replan: bool = False) -> str:
    """Deterministic, truthful explanation template."""
    arr = facts["arrival"]
    deadline = facts["deadline"]
    cost = facts["total_cost"]
    budget = facts.get("budget")
    buf = facts["buffers"][0] if facts.get("buffers") else 0
    risk_lbl = facts["risk_label"]

    budget_phrase = f"within your ₹{budget:.0f} budget" if budget else "with competitive pricing"

    if is_replan:
        c_delta = facts.get("cost_delta", 0.0)
        a_delta = facts.get("arrival_delta_min", 0)
        c_str = f"+₹{c_delta:.0f}" if c_delta >= 0 else f"-₹{abs(c_delta):.0f}"
        t_str = f"+{a_delta} min" if a_delta >= 0 else f"{a_delta} min"
        return (
            f"Alternative Re-plan: Arrives at {arr} ({t_str} vs original) comfortably before your {deadline} deadline. "
            f"Cost adjustment: {c_str}. Transfer buffer is {buf} min with {risk_lbl.lower()} risk."
        )

    return (
        f"This itinerary is feasible: it reaches your destination at {arr}, well before your {deadline} deadline. "
        f"Total fare is ₹{cost:.0f} ({budget_phrase}). "
        f"Key transfer buffer is {buf} minutes, giving a {risk_lbl.lower()} delay risk."
    )


def explain_itinerary(
    itinerary_id: str,
    request: TripRequest,
    events: list[DisruptionEvent],
    original_itinerary_id: Optional[str] = None,
    lang: str = "en"
) -> Tuple[str, str]:
    """
    Produce fact-checked explanation for an itinerary.
    Uses LLM if available and strictly fact-checks output against numbers in facts.
    Falls back to deterministic template on failure or disallowed numbers.
    """
    base_legs = generate_base_legs(request.travel_date)
    state = apply_disruptions(base_legs, events)
    feasible, rejected = get_options(request, state)
    all_itins = feasible + [r.itinerary for r in rejected]

    itin = next((i for i in all_itins if i.id == itinerary_id), None)
    if not itin:
        return "Itinerary details not found.", "offline"

    orig_itin = None
    if original_itinerary_id:
        orig_itin = next((i for i in all_itins if i.id == original_itinerary_id), None)

    is_replan = bool(orig_itin)
    cost_delta = round(itin.total_cost - orig_itin.total_cost, 2) if orig_itin else 0.0

    try:
        alt_hh, alt_mm = map(int, itin.arrival.split(":"))
        orig_hh, orig_mm = map(int, orig_itin.arrival.split(":")) if orig_itin else (alt_hh, alt_mm)
        arr_delta = (alt_hh * 60 + alt_mm) - (orig_hh * 60 + orig_mm)
    except Exception:
        arr_delta = 0

    facts = {
        "arrival": itin.arrival,
        "deadline": request.arrival_deadline,
        "total_cost": itin.total_cost,
        "budget": request.budget_total_inr,
        "buffers": itin.buffers,
        "risk_label": itin.risk_label,
        "risk_value": itin.risk_value,
        "duration_min": itin.total_duration_min,
        "cost_delta": cost_delta,
        "arrival_delta_min": arr_delta,
        "risk_change": f"{orig_itin.risk_label if orig_itin else 'None'} -> {itin.risk_label}"
    }

    # Telugu localization (templated directly)
    if lang == "te":
        budget_str = f"(బడ్జెట్: ₹{request.budget_total_inr:.0f})" if request.budget_total_inr else ""
        buf = itin.buffers[0] if itin.buffers else 0
        if is_replan:
            text = explain_replan_te(itin.arrival, cost_delta, arr_delta, facts["risk_change"])
        else:
            text = explain_itinerary_te(
                itin.arrival, request.arrival_deadline, itin.total_cost, budget_str, buf, itin.risk_label
            )
        return text, "offline"

    # If ANTHROPIC_API_KEY is available, attempt LLM explanation
    if ANTHROPIC_API_KEY:
        try:
            import anthropic
            client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY, timeout=3.0, max_retries=0)
            prompt = (
                "You are an explainer for a bus travel concierge. Explain why this itinerary works "
                "using ONLY the numbers provided in the FACTS below. Never invent new times or fares.\n"
                f"FACTS: {facts}\n"
                "Respond in 2 concise sentences."
            )
            response = client.messages.create(
                model=ROAM_MODEL,
                max_tokens=150,
                timeout=5.0,
                messages=[{"role": "user", "content": prompt}]
            )
            llm_text = response.content[0].text.strip()
            allowed = extract_allowed_numbers(facts)
            if verify_text_against_facts(llm_text, allowed):
                return llm_text, "llm"
        except Exception:
            pass  # Fall back to template silently

    # Default deterministic template
    template_text = build_template_explanation(facts, is_replan=is_replan)
    return template_text, "offline"
