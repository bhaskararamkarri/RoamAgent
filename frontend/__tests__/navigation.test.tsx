import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Footer } from "../components/homepage/Footer";
import { Header } from "../components/Header";
import { PopularRoutes } from "../components/homepage/PopularRoutes";

describe("Navigation & Footer Repair", () => {
  it("renders Footer with distinct product anchor links and interactive modals", () => {
    render(<Footer />);

    // Verify product section links have proper anchor targets
    const tripPlannerLink = screen.getByRole("link", { name: "Trip Planner" });
    expect(tripPlannerLink.getAttribute("href")).toBe("#planner");

    const popularRoutesLink = screen.getByRole("link", { name: "Popular Routes" });
    expect(popularRoutesLink.getAttribute("href")).toBe("#routes");

    const destinationsLink = screen.getByRole("link", { name: "Destinations (36 State/UTs)" });
    expect(destinationsLink.getAttribute("href")).toBe("#explore");

    const corporateLink = screen.getByRole("link", { name: "Corporate Travel" });
    expect(corporateLink.getAttribute("href")).toBe("#corporate");
  });

  it("opens About and Privacy modals when clicked from footer", () => {
    render(<Footer />);

    // Open About Modal
    const aboutBtn = screen.getByRole("button", { name: "About RoamAgent" });
    fireEvent.click(aboutBtn);

    expect(screen.getByRole("dialog")).toBeDefined();
    expect(screen.getByText("About TBS RoamAgent")).toBeDefined();

    // Close modal
    const closeBtn = screen.getByRole("button", { name: "Close" });
    fireEvent.click(closeBtn);

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("renders Header with proper anchor navigation links", () => {
    const handleToggleLang = vi.fn();
    const handleRankModeChange = vi.fn();
    const handleOpenMetrics = vi.fn();

    render(
      <Header
        lang="en"
        onToggleLang={handleToggleLang}
        rankMode="balanced"
        onRankModeChange={handleRankModeChange}
        llmAvailable={true}
        onOpenMetrics={handleOpenMetrics}
      />
    );

    const tripPlannerLink = screen.getByRole("link", { name: "Trip Planner" });
    expect(tripPlannerLink.getAttribute("href")).toBe("/#planner");

    const popularRoutesLink = screen.getByRole("link", { name: "Popular Routes" });
    expect(popularRoutesLink.getAttribute("href")).toBe("/#routes");

    const exploreLink = screen.getByRole("link", { name: "Explore India" });
    expect(exploreLink.getAttribute("href")).toBe("/#explore");
  });

  it("triggers onSelectRoute callback with correct origin and destination on card click", () => {
    const handleSelectRoute = vi.fn();

    render(<PopularRoutes onSelectRoute={handleSelectRoute} />);

    // Click on Visakhapatnam to Hyderabad plan route button
    const planButtons = screen.getAllByRole("button", { name: /Plan Route/i });
    expect(planButtons.length).toBeGreaterThan(0);

    fireEvent.click(planButtons[0]);
    expect(handleSelectRoute).toHaveBeenCalledTimes(1);
    expect(handleSelectRoute).toHaveBeenCalledWith("Visakhapatnam", "Hyderabad");
  });
});
