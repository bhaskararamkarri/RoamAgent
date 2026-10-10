import {
  TripRequest,
  DisruptionEvent,
  RankMode,
  ParseResponse,
  PlanResponse,
  ExplainResponse,
  DisruptResponse,
  BookResponse,
  CancelResponse,
  ScenarioItem,
  MetricsData,
} from "./types";

function getApiBase(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (typeof window !== "undefined") {
    const host = window.location.hostname || "127.0.0.1";
    return `http://${host}:8000`;
  }
  return "http://127.0.0.1:8000";
}

async function fetchJson<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${getApiBase()}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });

  if (!res.ok) {
    let errMsg = `Request failed: ${res.status}`;
    try {
      const errorData = await res.json();
      if (errorData.detail) {
        errMsg = errorData.detail;
      }
    } catch {
      // ignore
    }
    const err = new Error(errMsg);
    (err as any).status = res.status;
    throw err;
  }

  return res.json() as Promise<T>;
}

export async function getHealth(): Promise<{ status: string; llm_available: boolean }> {
  return fetchJson("/health");
}

export async function parseTrip(text: string, llm: boolean = true): Promise<ParseResponse> {
  return fetchJson("/parse", {
    method: "POST",
    body: JSON.stringify({ text, llm }),
  });
}

export async function planTrip(
  request: TripRequest,
  events: DisruptionEvent[] = [],
  rankMode: RankMode = "balanced",
  now?: string | null
): Promise<PlanResponse> {
  return fetchJson("/plan", {
    method: "POST",
    body: JSON.stringify({ request, events, rank_mode: rankMode, now }),
  });
}

export async function explainItinerary(
  itineraryId: string,
  request: TripRequest,
  events: DisruptionEvent[] = [],
  originalItineraryId?: string | null,
  lang: "en" | "te" = "en"
): Promise<ExplainResponse> {
  return fetchJson("/explain", {
    method: "POST",
    body: JSON.stringify({
      itinerary_id: itineraryId,
      request,
      events,
      original_itinerary_id: originalItineraryId,
      lang,
    }),
  });
}

export async function disruptTrip(
  request: TripRequest,
  events: DisruptionEvent[],
  newEvent: DisruptionEvent,
  bookedItineraryId: string,
  now?: string | null
): Promise<DisruptResponse> {
  return fetchJson("/disrupt", {
    method: "POST",
    body: JSON.stringify({
      request,
      events,
      new_event: newEvent,
      booked_itinerary_id: bookedItineraryId,
      now,
    }),
  });
}

export async function bookTrip(
  request: TripRequest,
  events: DisruptionEvent[],
  itineraryId: string,
  approved: boolean
): Promise<BookResponse> {
  return fetchJson("/book", {
    method: "POST",
    body: JSON.stringify({
      request,
      events,
      itinerary_id: itineraryId,
      approved,
    }),
  });
}

export async function cancelBooking(
  bookingId: string,
  approved: boolean
): Promise<CancelResponse> {
  return fetchJson("/cancel", {
    method: "POST",
    body: JSON.stringify({
      booking_id: bookingId,
      approved,
    }),
  });
}

export async function getScenarios(): Promise<ScenarioItem[]> {
  return fetchJson("/scenarios");
}

export async function getMetrics(): Promise<MetricsData> {
  return fetchJson("/metrics");
}
