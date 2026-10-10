import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ConsentModal } from "../components/ConsentModal";
import { Itinerary } from "../lib/types";

const mockItinerary: Itinerary = {
  id: "itin-test12345",
  legs: [
    {
      id: "leg-1",
      mode: "auto",
      from_node: "Vizag Railway Station",
      to_node: "Vizag RTC Complex (Dwaraka)",
      dep: "2026-10-10T19:30:00",
      arr: "2026-10-10T19:55:00",
      fare: 150,
      per_vehicle: true,
      seat_type: "na",
      seats_left: 3,
      operator: "Local Auto Union",
      accessible: false,
      delay_prob: 0.1,
      typical_delay_min: 10,
      updated_at: "2026-10-10T12:00:00Z",
      source: "SIMULATED",
      status: "ok",
    },
    {
      id: "leg-2",
      mode: "bus",
      from_node: "Vizag RTC Complex (Dwaraka)",
      to_node: "Miyapur",
      dep: "2026-10-10T20:30:00",
      arr: "2026-10-11T06:45:00",
      fare: 1150,
      per_vehicle: false,
      seat_type: "sleeper",
      seats_left: 18,
      operator: "APSRTC Amaravati Multi-Axle",
      accessible: true,
      delay_prob: 0.1,
      typical_delay_min: 25,
      updated_at: "2026-10-10T12:00:00Z",
      source: "SIMULATED",
      status: "ok",
    },
  ],
  total_cost: 1300,
  total_duration_min: 675,
  arrival: "06:45",
  buffers: [35],
  risk_label: "Low",
  risk_value: 3.5,
  assumptions: ["Source: SIMULATED"],
  data_freshness: "2026-10-10T12:00:00Z",
};

describe("ConsentModal Component", () => {
  it("renders modal with itinerary details and sandbox notice", () => {
    const handleClose = vi.fn();
    const handleApprove = vi.fn();

    render(
      <ConsentModal
        isOpen={true}
        itinerary={mockItinerary}
        onClose={handleClose}
        onApprove={handleApprove}
        loading={false}
      />
    );

    expect(screen.getByText("Review & Approve Booking")).toBeDefined();
    expect(screen.getByText(/1,?300/)).toBeDefined();
    expect(screen.getByText("APSRTC Amaravati Multi-Axle")).toBeDefined();
    expect(screen.getByText(/Sandbox Payment/i)).toBeDefined();
  });

  it("calls onApprove with itinerary when Approve button is clicked", () => {
    const handleClose = vi.fn();
    const handleApprove = vi.fn();

    render(
      <ConsentModal
        isOpen={true}
        itinerary={mockItinerary}
        onClose={handleClose}
        onApprove={handleApprove}
        loading={false}
      />
    );

    const approveBtn = screen.getByText(/Approve & Book/i);
    fireEvent.click(approveBtn);

    expect(handleApprove).toHaveBeenCalledTimes(1);
    expect(handleApprove).toHaveBeenCalledWith(mockItinerary);
    expect(handleClose).not.toHaveBeenCalled();
  });

  it("calls onClose and never calls onApprove when Cancel button is clicked", () => {
    const handleClose = vi.fn();
    const handleApprove = vi.fn();

    render(
      <ConsentModal
        isOpen={true}
        itinerary={mockItinerary}
        onClose={handleClose}
        onApprove={handleApprove}
        loading={false}
      />
    );

    const cancelBtn = screen.getByRole("button", { name: "Cancel" });
    fireEvent.click(cancelBtn);

    expect(handleClose).toHaveBeenCalledTimes(1);
    expect(handleApprove).not.toHaveBeenCalled();
  });

  it("disables action buttons while loading is true", () => {
    const handleClose = vi.fn();
    const handleApprove = vi.fn();

    render(
      <ConsentModal
        isOpen={true}
        itinerary={mockItinerary}
        onClose={handleClose}
        onApprove={handleApprove}
        loading={true}
      />
    );

    const approveBtn = screen.getByText(/Authorizing.../i).closest("button");
    expect(approveBtn?.disabled).toBe(true);
  });
});
