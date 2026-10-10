# TBS RoamAgent - Multi-Leg Bus Travel Concierge

> **Agentic AI in Travel Technology — Samartha Hackathon Prototype**  
> An autonomous concierge that turns natural-language bus-trip goals into ranked, feasible multi-leg itineraries (first-mile + intercity bus + last-mile), proactively handles disruptions by dynamic re-planning, and strictly requires explicit user approval before any booking, payment, or cancellation.

---

## 1. Architectural Highlights & Hard Rules
- **Zero LLM Hallucination on Core Data**: The LLM is **never** the source of schedules, fares, availability, or times. All itinerary data is computed deterministically by the graph planner over structured data. The LLM is strictly confined to:
  - (a) Parsing natural language text into a typed `TripRequest` (with an offline regex fallback).
  - (b) Generating explanations verified against factual tuples.
- **Deterministic Transparency**: Every transport record is marked `source="SIMULATED"` and carries an `updated_at` freshness timestamp. A persistent warning banner and card badges make simulated data visible at all times.
- **Stateless Recomputation**: The client passes the base `TripRequest` and list of `DisruptionEvent`s on every request. The server re-generates state deterministically.
- **Safety Consent Gate**: Autonomous operations are limited to `search`, `compare`, `recommend`, `notify`, and `explain`. Critical operations (`book`, `pay`, `cancel`, `rebook`) **strictly require `approved=true`**; unapproved calls return **HTTP 403 Forbidden**.
- **Tamper-Proof Pricing**: The server ignores any client-sent fares on `/book` and recomputes the exact price from server data. Payments return simulated sandbox IDs (`SBX-<8 hex>`).
- **Dual-Mode / Offline-First**: Operates seamlessly without an API key (using high-accuracy offline regex parsing and deterministic templates) or with an `ANTHROPIC_API_KEY` (using Claude with timeouts, strict JSON schemas, and number fact-checking).

---

## 2. Prerequisites
- **Python**: 3.11+ (Tested and verified on Python 3.14)
- **Node.js**: 20+ (Tested and verified on Node.js v24 & npm 11)

---

## 3. Quick Start & Setup

### Clone Repository
```bash
git clone <repo-url>
cd roamagent
```

### Backend Installation & Verification
```bash
cd backend
pip install -r requirements.txt

# Run backend unit & integration tests (25 tests)
python -m pytest -q

# Run benchmark metrics (writes metrics_report.md)
python -m app.metrics

# Start backend server
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```
Backend API interactive docs: **http://localhost:8000/docs**

### Frontend Installation & Build
In a second terminal:
```bash
cd frontend
npm install

# TypeScript typecheck
npx tsc --noEmit

# Component tests (Vitest)
npm run test

# Production build
npm run build

# Start frontend
npm run start
```
Frontend web application: **http://localhost:3000**

---

## 4. Single-Command Startup Scripts

### On Linux / macOS / Git Bash:
```bash
bash scripts/dev.sh
```

### On Windows PowerShell:
```powershell
.\scripts\dev.ps1
```

---

## 5. Environment Variables

Create `.env` in `backend/` or set environment variables:
| Variable | Default | Purpose |
| :--- | :--- | :--- |
| `ANTHROPIC_API_KEY` | *(None)* | Optional. When supplied, enables Claude LLM parsing & explanations. |
| `ROAM_MODEL` | `claude-sonnet-4-6` | Claude model name for LLM parsing and fact-checked explanations. |
| `FRONTEND_ORIGIN` | `http://localhost:3000` | Allowed CORS origin for backend requests. |

Create `.env.local` in `frontend/`:
| Variable | Default | Purpose |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | Backend API URL. |

---

## 6. How to Open on a Mobile Phone (Same Wi-Fi)

To test the mobile-first PWA on your actual smartphone:
1. Find your computer's local IP address:
   - On Windows: Run `ipconfig` in PowerShell (look for `IPv4 Address`, e.g., `192.168.1.15`).
   - On Mac/Linux: Run `ifconfig` or `ip addr`.
2. Set environment variables to your LAN IP:
   - In `backend/.env`: `FRONTEND_ORIGIN=http://192.168.1.15:3000`
   - In `frontend/.env.local`: `NEXT_PUBLIC_API_URL=http://192.168.1.15:8000`
3. Launch both servers bound to `0.0.0.0`:
   - Backend: `python -m uvicorn app.main:app --host 0.0.0.0 --port 8000`
   - Frontend: `npm run dev -- -H 0.0.0.0`
4. On your mobile phone connected to the same Wi-Fi, open:  
   `http://192.168.1.15:3000`
5. **Install as PWA**: Tap the browser menu and select **"Add to Home Screen"** to launch RoamAgent in standalone full-screen mobile app mode.

---

## 7. 4-Minute Interactive Demo Script

Follow this script to experience the full agentic flow:

### Minute 1: Natural Language Intake & Ranked Recommendations
1. Open **http://localhost:3000**.
2. Notice the global amber warning banner: `SIMULATED DATA - No live operator feeds...`.
3. In the scenario dropdown, select **"Scenario A: Happy Path"**.
4. Click **"Plan Trip"**. The concierge generates 48 multi-leg candidates, filters them through the independent validator, and displays ranked itineraries.
5. Inspect the top card:
   - Vertical leg timeline (Auto from Station → APSRTC Bus from RTC Complex → Hyderabad Metro to Hitech City).
   - Arrival time (07:45 AM) well before the 09:00 AM deadline.
   - Click the **"Low Delay Risk"** badge to view the mathematical popover: `ratio = buffer / typical_delay_min`.
   - Read the **"Why this works"** explanation box.

### Minute 2: Interactive Chips & Rejection Traps
1. Scroll down and expand **"Rejected Options & Trap Candidates"**.
2. Observe **"SuperSaver Budget Express (Trap)"** (₹650): notice the validator failure reason explicitly explaining that arriving at 09:40 AM violates the 09:00 AM deadline.
3. In the **Active Trip Constraints** section, change passengers from 2 to 4. Notice the fare automatically scales with per-vehicle taxi scaling.

### Minute 3: Safety Consent Gate & Sandbox Booking
1. Click **"Book with Consent"** on the #1 ranked itinerary.
2. The **Consent Authorization Modal** opens:
   - Notice the governance legend: Autonomous vs. Approval-Gated actions.
   - Inspect the complete leg breakdown and server-enforced total fare.
   - Notice the Sandbox payment disclaimer and simulated refund terms.
3. Click **"Approve & Book (Sandbox)"**.
4. The **Booking Confirmed Card** appears showing a unique Booking Reference (`BKG-XXXXXXXX`) and Sandbox Payment Token (`SBX-XXXXXXXX`).

### Minute 4: Disruption Injection & Re-planning
1. On the Booking Confirmation Card, click **"Simulate Disruption"**.
2. In the disruption simulator, select the intercity bus leg and click **"Delay +120m"** or **"Cancel Bus"**.
3. Observe:
   - An incident notification is added to the feed.
   - The replanner identifies feasible alternatives and computes diffs (`+₹X / -₹X`, `+Y mins`, `Risk: Old -> New`).
4. Click **"Switch to This (Requires Approval)"**. The consent modal opens again, requiring explicit authorization before updating the booking.
5. Switch to **"Scenario D: Infeasible Request"** (deadline 05:30 AM). Observe that RoamAgent gives an honest refusal with suggestions to relax the deadline.

---

## 8. Benchmark Metrics & Test Results

Run tests and benchmarks anytime:
```bash
# 1. Run all 25 backend pytest tests
pytest -v

# 2. Run system benchmark evaluator
python -m app.metrics

# 3. Run frontend Vitest component tests
cd ../frontend && npm run test
```

### Verified Benchmark Results:
- **Intake Parser Accuracy**: **95.0%** (19/20 test cases passing across messy, multilingual, and transliterated queries; requirement $\ge 85\%$).
- **Final Recommended Itineraries Validity**: **100.0%** (Every recommended itinerary passes independent validation).
- **Disruption Recovery Rate**: **100.0%** (Full recovery across delay +30/60/120m and cancellation sweeps).
- **Median Time-to-Itinerary**: **1.86 ms** (Deterministic Python graph search and validation).

---

## 9. Production Deployment Notes
- **Frontend**: Can be deployed to **Vercel** with zero extra configuration. Set `NEXT_PUBLIC_API_URL` to your production backend URL.
- **Backend**: Can be containerized with Docker or deployed to **Render / Fly.io / Railway / Google Cloud Run** (`uvicorn app.main:app --host 0.0.0.0 --port $PORT`). Ensure `FRONTEND_ORIGIN` matches your production frontend domain.
