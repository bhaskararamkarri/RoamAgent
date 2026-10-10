import { describe, it, expect, vi, afterEach } from "vitest";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Page from "../app/page";
import { parseTrip, planTrip } from "../lib/api";

// Mock the API calls
vi.mock("../lib/api", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual as any,
    parseTrip: vi.fn(),
    planTrip: vi.fn(),
  };
});

describe("State Synchronization and Race Conditions", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("synchronizes origin/destination between TripSearch and ConstraintChips (Amritsar -> Lucknow)", async () => {
    // Setup mock returns
    vi.mocked(parseTrip).mockResolvedValue({
      request: {
        origin: "Amritsar",
        destination: "Lucknow",
        travel_date: "2026-10-10",
        arrival_deadline: "10:00",
        passengers: 1,
        seat_type: "any",
        budget_total_inr: null,
        accessibility: [],
        luggage: null,
      },
      needs_followup: false,
    });
    
    vi.mocked(planTrip).mockResolvedValue({
      feasible: [],
      rejected: [],
      stats: { candidates: 0, passed: 0, feasibility_rate: 0 },
      notes: []
    });

    render(<Page />);

    const originInput = screen.getAllByRole("combobox")[0];
    fireEvent.change(originInput, { target: { value: "Amritsar" } });

    const destInput = screen.getAllByRole("combobox")[1];
    fireEvent.change(destInput, { target: { value: "Lucknow" } });

    const submitBtn = screen.getByRole("button", { name: /Plan My Journey/i });
    fireEvent.click(submitBtn);

    // Wait for the components to render ConstraintChips after planTrip is called
    await waitFor(() => {
      expect(planTrip).toHaveBeenCalledTimes(1);
    });

    // Check ConstraintChips Origin value
    // ConstraintChips uses Autocomplete, so the value should be in the input field
    const originChipInput = screen.getAllByRole("combobox").find(el => el.getAttribute("placeholder") === "Origin");
    expect(originChipInput).toBeDefined();
    expect((originChipInput as HTMLInputElement).value).toBe("Amritsar");

    // Check Destination value
    const destChipInput = screen.getAllByRole("combobox").find(el => el.getAttribute("placeholder") === "Destination");
    expect(destChipInput).toBeDefined();
    expect((destChipInput as HTMLInputElement).value).toBe("Lucknow");

    // Edit Origin from ConstraintChips
    fireEvent.change(originChipInput!, { target: { value: "Delhi" } });
    
    // In our implementation, handleConstraintsChange updates the state immediately
    // Since page.tsx state is shared, the TripSearch natural language might not reflect it directly unless we sync it to a form field,
    // but the main TripRequest state is updated. We can verify if planTrip was called again after debounce with Delhi.
    await waitFor(() => {
      // The debounce is 400ms, so we wait for the second call
      expect(planTrip).toHaveBeenCalledTimes(2);
    }, { timeout: 1000 });

    const lastPlanCallArgs = vi.mocked(planTrip).mock.calls[1][0];
    expect(lastPlanCallArgs.origin).toBe("Delhi");
  });

  it("ignores stale responses in rapid successive searches", async () => {
    // Setup slow and fast responses
    let slowResolver: any;
    const slowPromise = new Promise((resolve) => {
      slowResolver = resolve;
    });

    vi.mocked(planTrip)
      .mockReturnValueOnce(slowPromise as any) // 1st call is slow
      .mockResolvedValueOnce({ // 2nd call is fast
        feasible: [],
        rejected: [],
        stats: { candidates: 2, passed: 0, feasibility_rate: 0 },
        notes: ["Fast Request Finished"]
      });

    render(<Page />);
    
    // Set initial request (this triggers 1st planTrip)
    vi.mocked(parseTrip).mockResolvedValueOnce({
      request: {
        origin: "Origin1",
        destination: "Dest1",
        travel_date: "2026-10-10",
        arrival_deadline: "10:00",
        passengers: 1,
        seat_type: "any",
        budget_total_inr: null,
        accessibility: [],
        luggage: null,
      },
      needs_followup: false,
    });

    let originInput = screen.getAllByRole("combobox")[0];
    fireEvent.change(originInput, { target: { value: "Origin1" } });

    let destInput = screen.getAllByRole("combobox")[1];
    fireEvent.change(destInput, { target: { value: "Dest1" } });

    let submitBtn = screen.getByRole("button", { name: /Plan My Journey/i });
    fireEvent.click(submitBtn);

    await waitFor(() => expect(planTrip).toHaveBeenCalledTimes(1));

    // Fire 2nd request (this triggers 2nd planTrip)
    vi.mocked(parseTrip).mockResolvedValueOnce({
      request: {
        origin: "Origin2",
        destination: "Dest2",
        travel_date: "2026-10-10",
        arrival_deadline: "10:00",
        passengers: 1,
        seat_type: "any",
        budget_total_inr: null,
        accessibility: [],
        luggage: null,
      },
      needs_followup: false,
    });

    fireEvent.change(originInput, { target: { value: "Origin2" } });
    fireEvent.change(destInput, { target: { value: "Dest2" } });
    fireEvent.click(submitBtn);

    await waitFor(() => expect(planTrip).toHaveBeenCalledTimes(2));

    // Now resolve the 1st request with some distinct mock data
    slowResolver({
      feasible: [],
      rejected: [],
      stats: { candidates: 1, passed: 0, feasibility_rate: 0 },
      notes: ["Slow Request Finished"]
    });

    // We wait a bit to ensure React state updates finish
    await waitFor(() => {
      // Because 2nd request finished first and updated state, and 1st request resolved later,
      // the race condition fix should drop the 1st request's result.
      // The text "Slow Request Finished" should NOT be in the document.
      // Wait for "Fast Request Finished" to appear
      expect(screen.getByText("Fast Request Finished")).toBeDefined();
    });

    const slowText = screen.queryByText("Slow Request Finished");
    expect(slowText).toBeNull();
  });
});
