import os
import re
from datetime import date, timedelta, datetime
from typing import Optional, Tuple, List
from app.models import TripRequest, ParseResponse

ROAM_MODEL = os.getenv("ROAM_MODEL", "claude-sonnet-4-6")
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")


def parse_offline(text: str) -> Tuple[Optional[TripRequest], bool, Optional[str]]:
    """
    High-accuracy deterministic offline NLP parser for travel requests.
    Extracts origin, destination, travel_date, arrival_deadline, passengers,
    seat_type, budget, accessibility, luggage.
    Returns: (TripRequest | None, needs_followup: bool, question: str | None).
    """
    raw = text.strip()
    lower = raw.lower()

    # 1. Origin detection
    origin: Optional[str] = None
    if "mvp colony" in lower:
        origin = "MVP Colony"
    elif "gajuwaka" in lower:
        origin = "Gajuwaka"
    elif "dwaraka" in lower or "rtc complex" in lower:
        origin = "Vizag RTC Complex (Dwaraka)"
    elif any(alias in lower for alias in ["vizag", "visakhapatnam", "vishakhapatnam", "vskp"]):
        origin = "Vizag Railway Station"

    # 2. Destination detection
    destination: Optional[str] = None
    if "hitech city" in lower or "hitech" in lower or "hi-tech" in lower:
        destination = "Hitech City"
    elif "secunderabad" in lower:
        destination = "Secunderabad"
    elif "gachibowli" in lower:
        destination = "Gachibowli"
    elif "ameerpet" in lower:
        destination = "Ameerpet"
    elif "miyapur" in lower:
        destination = "Miyapur"
    elif "mgbs" in lower:
        destination = "MGBS"
    elif "lb nagar" in lower:
        destination = "LB Nagar"
    elif "kukatpally" in lower:
        destination = "Kukatpally"
    elif "hyderabad" in lower or "hyd" in lower:
        destination = "Hitech City"  # Default hub destination

    # 3. Travel Date detection
    travel_date: Optional[str] = None
    # Check ISO format YYYY-MM-DD
    iso_match = re.search(r"\b(\d{4}-\d{2}-\d{2})\b", raw)
    if iso_match:
        travel_date = iso_match.group(1)
    elif "today" in lower or "eroju" in lower or "ee roju" in lower:
        travel_date = date.today().strftime("%Y-%m-%d")
    elif "tomorrow" in lower or "repu" in lower:
        travel_date = (date.today() + timedelta(days=1)).strftime("%Y-%m-%d")
    else:
        # Default date if not specified
        travel_date = (date.today() + timedelta(days=1)).strftime("%Y-%m-%d")

    # 4. Arrival Deadline detection
    arrival_deadline: Optional[str] = None
    # Check military time e.g. "by 0900"
    mil_match = re.search(r"\bby\s*(\d{2})(\d{2})\b", lower)
    if mil_match:
        arrival_deadline = f"{mil_match.group(1)}:{mil_match.group(2)}"
    else:
        # Check standard times
        # 1. e.g. "9:15 am", "08:30", "8:45 AM"
        time_match = re.search(r"\b(\d{1,2}):(\d{2})\s*(am|pm|AM|PM)?\b", raw)
        if time_match:
            hh = int(time_match.group(1))
            mm = int(time_match.group(2))
            meridian = time_match.group(3)
            if meridian and meridian.lower() == "pm" and hh < 12:
                hh += 12
            elif meridian and meridian.lower() == "am" and hh == 12:
                hh = 0
            arrival_deadline = f"{hh:02d}:{mm:02d}"
        else:
            # 2. e.g. "9 AM", "9am", "10 AM", "by 9"
            ampm_match = re.search(r"\b(?:by|before|at|around)?\s*(\d{1,2})\s*(am|pm|AM|PM)\b", raw)
            if ampm_match:
                hh = int(ampm_match.group(1))
                meridian = ampm_match.group(2).lower()
                if meridian == "pm" and hh < 12:
                    hh += 12
                elif meridian == "am" and hh == 12:
                    hh = 0
                arrival_deadline = f"{hh:02d}:00"
            else:
                # 3. Telugu time: "9 ki", "8 ki"
                te_match = re.search(r"\b(\d{1,2})\s*ki\b", lower)
                if te_match:
                    hh = int(te_match.group(1))
                    arrival_deadline = f"{hh:02d}:00"

    # 5. Passengers detection
    passengers: Optional[int] = None
    if "me and my wife" in lower or "wife and me" in lower or "me and my husband" in lower:
        passengers = 2
    elif "solo" in lower or "single traveler" in lower or "alone" in lower:
        passengers = 1
    else:
        # Check digit with people/passengers/pax/mandi/adults
        pax_match = re.search(r"\b(\d+)\s*(?:people|persons|pax|passengers|adults|mandi|mandiki)\b", lower)
        if pax_match:
            passengers = int(pax_match.group(1))
        else:
            # Check "for 2", "for 3"
            for_match = re.search(r"\bfor\s*(\d+)\b", lower)
            if for_match:
                passengers = int(for_match.group(1))

    # Check for missing required fields and formulate single followup
    if not origin:
        return None, True, "What is your departure location in Vizag?"
    if not destination:
        return None, True, "What is your final destination in Hyderabad?"
    if not arrival_deadline:
        return None, True, "What is your required arrival deadline?"
    if not passengers:
        return None, True, "How many passengers are traveling?"

    # 6. Seat type
    seat_type = "any"
    if "sleeper" in lower:
        seat_type = "sleeper"
    elif "seater" in lower:
        seat_type = "seater"

    # 7. Budget detection
    budget: Optional[float] = None
    # e.g. "budget under Rs 3000", "₹2500 max", "3k budget", "under 2500"
    b_match = re.search(r"(?:under|below|max|budget|within|upto)?\s*(?:rs\.?|inr|₹)?\s*(\d+(?:\.\d+)?)\s*(k|k\b)?", lower)
    # Check specifically for budget keywords or rupee symbol
    kw_budget = re.search(r"(?:₹|rs\.?|inr|budget)\s*(\d+(?:\.\d+)?)\s*(k)?\b", lower)
    k_budget = re.search(r"\b(\d+)\s*k\s*(?:budget)?\b", lower)
    under_budget = re.search(r"\b(?:under|max|budget)\s*(?:rs\.?|₹)?\s*(\d+)\b", lower)

    if kw_budget:
        val = float(kw_budget.group(1))
        if kw_budget.group(2):
            val *= 1000
        budget = val
    elif k_budget:
        budget = float(k_budget.group(1)) * 1000.0
    elif under_budget:
        budget = float(under_budget.group(1))

    # 8. Accessibility
    accessibility: List[str] = []
    if any(k in lower for k in ["wheelchair", "elderly", "senior", "handicapped", "accessible"]):
        accessibility.append("wheelchair")

    # 9. Luggage
    luggage: Optional[str] = None
    if "heavy luggage" in lower or "heavy bags" in lower or "large luggage" in lower:
        luggage = "heavy"
    elif "light luggage" in lower or "backpack" in lower or "light bags" in lower:
        luggage = "light"

    req = TripRequest(
        origin=origin,
        destination=destination,
        travel_date=travel_date,
        arrival_deadline=arrival_deadline,
        passengers=passengers,
        seat_type=seat_type,
        budget_total_inr=budget,
        accessibility=accessibility,
        luggage=luggage
    )
    return req, False, None


def parse_intake(text: str, use_llm: bool = True) -> ParseResponse:
    """
    Dual-mode parser: attempts Claude LLM with Pydantic JSON parsing if key present,
    falling back reliably to offline parser.
    """
    if use_llm and ANTHROPIC_API_KEY:
        try:
            import anthropic
            client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY, timeout=3.0, max_retries=0)
            prompt = (
                "You are an NLP parser for bus trips between Vizag and Hyderabad. "
                "Parse the user text into JSON matching this structure: "
                "{\"origin\": string, \"destination\": string, \"travel_date\": \"YYYY-MM-DD\", "
                "\"arrival_deadline\": \"HH:MM\", \"passengers\": int, \"seat_type\": \"sleeper\"|\"seater\"|\"any\", "
                "\"budget_total_inr\": float|null, \"accessibility\": [\"wheelchair\"]|[], \"luggage\": \"light\"|\"heavy\"|null}. "
                "If any of origin, destination, arrival_deadline, or passengers is missing, set \"needs_followup\": true "
                "and \"question\": \"single follow up question\". Output raw JSON only.\n"
                f"User text: \"{text}\""
            )
            response = client.messages.create(
                model=ROAM_MODEL,
                max_tokens=300,
                timeout=5.0,
                messages=[{"role": "user", "content": prompt}]
            )
            import json
            data = json.loads(response.content[0].text.strip())
            if data.get("needs_followup"):
                return ParseResponse(
                    request=None,
                    needs_followup=True,
                    question=data.get("question"),
                    mode="llm"
                )
            req = TripRequest.model_validate(data)
            return ParseResponse(
                request=req,
                needs_followup=False,
                question=None,
                mode="llm"
            )
        except Exception:
            pass  # Fall back to offline

    req, needs_f, q = parse_offline(text)
    return ParseResponse(
        request=req,
        needs_followup=needs_f,
        question=q,
        mode="offline"
    )
