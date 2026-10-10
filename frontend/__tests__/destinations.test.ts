import { describe, it, expect } from "vitest";
import {
  DESTINATIONS,
  getAllDestinations,
  getDestinationsByRegion,
  getDestinationsByState,
  searchDestinations,
  getDestinationStats,
} from "../lib/destinations";
import { INDIAN_STATES } from "../lib/locations";

describe("India-Wide Destination Catalogue", () => {
  it("covers all 28 states and 8 union territories (all 36 entities)", () => {
    const stats = getDestinationStats();

    expect(stats.statesRepresented).toBe(28);
    expect(stats.unionTerritoriesRepresented).toBe(8);
    expect(stats.totalEntitiesRepresented).toBe(36);
    expect(stats.all36Represented).toBe(true);
    expect(stats.totalDestinations).toBeGreaterThanOrEqual(36);
  });

  it("verifies every state in INDIAN_STATES is represented in the catalogue", () => {
    const representedCodes = new Set(DESTINATIONS.map((d) => d.stateCode));

    INDIAN_STATES.forEach((state) => {
      expect(representedCodes.has(state.code)).toBe(true);
    });
  });

  it("covers all 6 Indian tourism regions with realistic destinations", () => {
    const regions = ["north", "south", "east", "west", "central", "northeast"] as const;

    regions.forEach((region) => {
      const dests = getDestinationsByRegion(region);
      expect(dests.length).toBeGreaterThan(0);
      dests.forEach((d) => {
        expect(d.region).toBe(region);
        expect(d.name).toBeDefined();
        expect(d.state).toBeDefined();
        expect(d.hubStation).toBeDefined();
        expect(d.suggestedOrigin).toBeDefined();
      });
    });
  });

  it("filters destinations accurately by search keyword and category", () => {
    const searchResult = searchDestinations("Temple");
    expect(searchResult.length).toBeGreaterThan(0);

    const northHeritage = searchDestinations("", "north", "all", "Heritage & Culture");
    expect(northHeritage.length).toBeGreaterThan(0);
    northHeritage.forEach((d) => {
      expect(d.region).toBe("north");
      expect(d.category).toBe("Heritage & Culture");
    });
  });

  it("handles non-matching search queries gracefully without crashing", () => {
    const noResults = searchDestinations("NonExistentPlaceXYZ1234");
    expect(noResults).toEqual([]);
  });
});
