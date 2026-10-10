"""Telugu localization templates and experimental label for TBS RoamAgent."""

TELUGU_DISCLAIMER = "గమనిక: తెలుగు అవుట్‌పుట్ ప్రయోగాత్మకమైనది; సమయాలు మరియు ఛార్జీలను ఒకసారి పరిశీలించండి. (Telugu output is experimental; verify times and fares.)"

def explain_itinerary_te(
    arrival: str,
    deadline: str,
    cost: float,
    budget_str: str,
    buffer_min: int,
    risk_label: str
) -> str:
    """Templated Telugu explanation for an itinerary."""
    risk_map = {"Low": "తక్కువ (Low)", "Medium": "మధ్యస్థం (Medium)", "High": "ఎక్కువ (High)"}
    te_risk = risk_map.get(risk_label, risk_label)
    
    msg = (
        f"ఈ ప్రయాణం సాధ్యమే: ఇది ఉదయం {arrival} గంటలకు చేరుకుంటుంది (మీ గడువు {deadline} లోపు). "
        f"మొత్తం ప్రయాణ ఛార్జీ ₹{cost:.0f} {budget_str}. "
        f"బదిలీ సమయం (బఫర్): {buffer_min} నిమిషాలు. రిస్క్ స్థాయి: {te_risk}.\n\n"
        f"{TELUGU_DISCLAIMER}"
    )
    return msg


def explain_replan_te(
    arrival: str,
    cost_delta: float,
    arrival_delta_min: int,
    risk_change: str
) -> str:
    """Templated Telugu explanation for re-plan alternatives."""
    cost_txt = f"+₹{cost_delta:.0f}" if cost_delta >= 0 else f"-₹{abs(cost_delta):.0f}"
    time_txt = f"+{arrival_delta_min} నిమిషాలు" if arrival_delta_min >= 0 else f"-{abs(arrival_delta_min)} నిమిషాలు"
    
    msg = (
        f"ప్రత్యామ్నాయ ప్రయాణ మార్గం: ఉదయం {arrival} గంటలకు గమ్యం చేరుకుంటుంది. "
        f"మునుపటి బుకింగ్‌తో పోలిస్తే వ్యత్యాసం: ఛార్జీ {cost_txt}, సమయం {time_txt}, రిస్క్ మార్పు ({risk_change}).\n\n"
        f"{TELUGU_DISCLAIMER}"
    )
    return msg
