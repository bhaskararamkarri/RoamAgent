export type SeatType = "sleeper" | "seater" | "any";
export type LegMode = "bus" | "auto" | "cab" | "metro";
export type RiskLevel = "Low" | "Medium" | "High";
export type DisruptionType = "DELAY" | "CANCEL" | "MISSED_CONNECTION" | "LOCAL_UNAVAILABLE";
export type RankMode = "balanced" | "cheapest" | "fastest" | "safest";

export interface TripRequest {
  origin: string;
  destination: string;
  travel_date: string;
  arrival_deadline: string;
  passengers: number;
  seat_type: SeatType;
  budget_total_inr?: number | null;
  accessibility: string[];
  luggage?: "light" | "heavy" | null;
}

export interface Leg {
  id: string;
  mode: LegMode;
  from_node: string;
  to_node: string;
  dep: string;
  arr: string;
  fare: number;
  per_vehicle: boolean;
  seat_type: "sleeper" | "seater" | "any" | "na";
  seats_left: number;
  operator: string;
  accessible: boolean;
  delay_prob: number;
  typical_delay_min: number;
  updated_at: string;
  source: "SIMULATED";
  status: "ok" | "delayed" | "cancelled" | "unavailable";
}

export interface Itinerary {
  id: string;
  legs: Leg[];
  total_cost: number;
  total_duration_min: number;
  arrival: string;
  buffers: number[];
  risk_label: RiskLevel;
  risk_value: number;
  assumptions: string[];
  data_freshness: string;
}

export interface RejectedCandidate {
  id: string;
  itinerary: Itinerary;
  rejection_reason: "deadline_missed" | "budget_exceeded" | "constraint_violation" | "no_connection";
  rejection_detail: string;
  reasons: string[];
}

export interface DisruptionEvent {
  type: DisruptionType;
  leg_id: string;
  minutes?: number | null;
}

export interface ParseResponse {
  request: TripRequest | null;
  needs_followup: boolean;
  question: string | null;
  mode: "llm" | "offline";
}

export interface PlanStats {
  candidates: number;
  passed: number;
  feasibility_rate: number;
}

export interface PlanResponse {
  feasible: Itinerary[];
  rejected: RejectedCandidate[];
  stats: PlanStats;
  notes: string[];
}

export interface ExplainResponse {
  text: string;
  mode: "llm" | "offline";
}

export interface AlternativeOption {
  itinerary: Itinerary;
  why_feasible: string;
  diff_vs_booked: {
    cost_delta: number;
    arrival_delta_min: number;
    risk_change: string;
  };
}

export interface DisruptResponse {
  events: DisruptionEvent[];
  notification: {
    ts: string;
    message: string;
  };
  alternatives: AlternativeOption[];
  no_alternative_info?: {
    message: string;
    nearest_near_miss?: Itinerary | null;
    violated_constraint?: string;
    suggestions: string[];
    disclaimer: string;
  } | null;
}

export interface SandboxPayment {
  payment_id: string;
  amount: number;
  status: string;
}

export interface BookResponse {
  booking_id: string;
  payment: SandboxPayment;
  itinerary: Itinerary;
}

export interface CancelResponse {
  booking_id: string;
  status: string;
  refund_amount: number;
  message: string;
}

export interface ScenarioItem {
  id: string;
  title: string;
  description: string;
  text: string;
  category: string;
}

export interface MetricsData {
  intake_accuracy: number;
  intake_correct: number;
  intake_total: number;
  final_recommended_pass_rate: number;
  fixture_rates: Record<string, { candidates: number; passed: number; rate: number }>;
  disruption_recovery_rate: number;
  disruption_recoveries: number;
  disruption_total: number;
  median_latency_ms: number;
  p95_latency_ms: number;
}
