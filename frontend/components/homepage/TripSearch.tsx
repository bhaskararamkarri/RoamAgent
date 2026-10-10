"use client";

import React from "react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Autocomplete, LocationOption } from "@/components/ui/Autocomplete";
import { Button } from "@/components/ui/Button";
import { Tabs, TabPanels, TabPanel } from "@/components/ui/Tabs";
import { cn, formatCurrency } from "@/lib/utils";
import { Search, MapPin, Calendar, Clock, Users, ArrowLeftRight, ChevronDown, Settings } from "lucide-react";
import { Location, searchLocationOptions } from "@/lib/locations";
import { TripRequest, SeatType, ScenarioItem } from "@/lib/types";

interface TripSearchProps {
  onSearch: (request: TripRequest) => void;
  onNaturalSearch?: (text: string) => void;
  scenarios?: ScenarioItem[];
  onSelectScenario?: (scenario: ScenarioItem) => void;
  initialRequest?: TripRequest;
  isLoading?: boolean;
  recentSearches?: TripRequest[];
  className?: string;
}

const SEAT_TYPES: { value: SeatType; label: string; icon: string }[] = [
  { value: "any", label: "Any", icon: "🚌" },
  { value: "sleeper", label: "Sleeper", icon: "🛏️" },
  { value: "seater", label: "Seater", icon: "💺" },
];

export function TripSearch({
  onSearch,
  onNaturalSearch,
  scenarios = [],
  onSelectScenario,
  initialRequest,
  isLoading = false,
  recentSearches = [],
  className,
}: TripSearchProps) {
  const [activeMode, setActiveMode] = useState<"form" | "natural">("form");
  const [request, setRequest] = useState<TripRequest>(
    initialRequest || {
      origin: "",
      destination: "",
      travel_date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
      arrival_deadline: "09:00",
      passengers: 1,
      seat_type: "any",
      budget_total_inr: null,
      accessibility: [],
      luggage: null,
    }
  );
  const [naturalText, setNaturalText] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [originSuggestions, setOriginSuggestions] = useState<Location[]>([]);
  const [destSuggestions, setDestSuggestions] = useState<Location[]>([]);
  const [originInput, setOriginInput] = useState("");
  const [destInput, setDestInput] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  // Sync request with initial props
  useEffect(() => {
    if (initialRequest) {
      setRequest((prev) => ({
        ...prev,
        ...initialRequest,
      }));
      setOriginInput(initialRequest.origin || "");
      setDestInput(initialRequest.destination || "");
    }
  }, [initialRequest, initialRequest?.origin, initialRequest?.destination]);

  const handleOriginChange = (value: string, option?: LocationOption) => {
    setOriginInput(value);
    if (option) {
      setRequest((prev) => ({ ...prev, origin: option.name }));
    } else {
      setRequest((prev) => ({ ...prev, origin: value }));
    }
  };

  const handleDestChange = (value: string, option?: LocationOption) => {
    setDestInput(value);
    if (option) {
      setRequest((prev) => ({ ...prev, destination: option.name }));
    } else {
      setRequest((prev) => ({ ...prev, destination: value }));
    }
  };

  const swapLocations = () => {
    const newOrigin = request.destination;
    const newDest = request.origin;
    setRequest((prev) => ({ ...prev, origin: newOrigin, destination: newDest }));
    setOriginInput(newOrigin);
    setDestInput(newDest);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!request.origin.trim() || !request.destination.trim()) return;
    onSearch(request);
  };

  const handleNaturalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!naturalText.trim()) return;
    if (onNaturalSearch) {
      onNaturalSearch(naturalText);
    } else {
      onSearch(request);
    }
  };

  const fetchOriginSuggestions = async (query: string): Promise<LocationOption[]> => {
    return searchLocationOptions(query, 12);
  };

  const fetchDestSuggestions = async (query: string): Promise<LocationOption[]> => {
    return searchLocationOptions(query, 12);
  };

  const tabs = [
    { id: "form", label: "Guided Form", icon: <Settings className="w-4 h-4" /> },
    { id: "natural", label: "Natural Language", icon: <Search className="w-4 h-4" /> },
  ];

  return (
    <form
      ref={formRef}
      onSubmit={activeMode === "form" ? handleSubmit : handleNaturalSubmit}
      className={cn("glass-card rounded-2xl p-5 sm:p-6 shadow-card space-y-5 border border-neutral-800", className)}
      noValidate
    >
      {/* Mode Tabs & Preset Scenarios */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex-1">
          <Tabs
            tabs={tabs}
            activeTab={activeMode}
            onChange={(tabId) => setActiveMode(tabId as "form" | "natural")}
            variant="enclosed"
            fullWidth
          />
        </div>

        {scenarios && scenarios.length > 0 && (
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <select
              aria-label="Preset Scenarios"
              className="text-xs bg-[#302724] border border-[#4B3C35] text-[#FFF7EF] rounded-xl px-3 py-2 focus:ring-1 focus:ring-[#E65D36] focus:outline-none cursor-pointer shadow-sm"
              onChange={(e) => {
                const found = scenarios.find((s) => s.id === e.target.value);
                if (found && onSelectScenario) onSelectScenario(found);
              }}
              defaultValue=""
            >
              <option value="" disabled>Load Demo Scenario...</option>
              {scenarios.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {/* Guided Form Mode */}
        {activeMode === "form" ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Origin & Destination Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Autocomplete
                label="Origin"
                value={originInput}
                onChange={handleOriginChange}
                placeholder="Where are you starting from?"
                fetchOptions={fetchOriginSuggestions}
                getOptionLabel={(opt) => opt.name}
                autoFocus
                required
                className="w-full"
              />

              <div className="relative">
                <Autocomplete
                  label="Destination"
                  value={destInput}
                  onChange={handleDestChange}
                  placeholder="Where are you going?"
                  fetchOptions={fetchDestSuggestions}
                  getOptionLabel={(opt) => opt.name}
                  required
                  className="w-full"
                />
                {/* Swap Button */}
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 180 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={swapLocations}
                  className="absolute right-3 top-[38px] z-10 p-2 rounded-lg bg-neutral-800/50 hover:bg-neutral-700 text-neutral-400 hover:text-brand-400 border border-neutral-700 transition-all"
                  aria-label="Swap origin and destination"
                >
                  <ArrowLeftRight className="w-5 h-5" aria-hidden="true" />
                </motion.button>
              </div>
            </div>

            {/* Date, Time, Passengers Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <label className="block text-sm font-medium text-neutral-300 mb-1.5">Travel Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" aria-hidden="true" />
                  <input
                    type="date"
                    value={request.travel_date}
                    onChange={(e) => setRequest((prev) => ({ ...prev, travel_date: e.target.value }))}
                    min={new Date().toISOString().split("T")[0]}
                    className="glass-input w-full pl-10 pr-3.5 py-2.5 text-sm text-neutral-50 placeholder-neutral-500 bg-neutral-900/50"
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-neutral-300 mb-1.5">Arrival Deadline</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" aria-hidden="true" />
                  <input
                    type="time"
                    value={request.arrival_deadline}
                    onChange={(e) => setRequest((prev) => ({ ...prev, arrival_deadline: e.target.value }))}
                    className="glass-input w-full pl-10 pr-3.5 py-2.5 text-sm text-neutral-50 placeholder-neutral-500 bg-neutral-900/50"
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-neutral-300 mb-1.5">Passengers</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" aria-hidden="true" />
                  <select
                    value={request.passengers}
                    onChange={(e) => setRequest((prev) => ({ ...prev, passengers: parseInt(e.target.value) }))}
                    className="glass-input w-full pl-10 pr-3.5 py-2.5 text-sm text-neutral-50 bg-neutral-900/50 cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n}>{n} Passenger{n > 1 ? "s" : ""}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-neutral-300 mb-1.5">Seat Type</label>
                <div className="relative">
                  <Settings className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" aria-hidden="true" />
                  <select
                    value={request.seat_type}
                    onChange={(e) => setRequest((prev) => ({ ...prev, seat_type: e.target.value as SeatType }))}
                    className="glass-input w-full pl-10 pr-3.5 py-2.5 text-sm text-neutral-50 bg-neutral-900/50 cursor-pointer"
                  >
                    {SEAT_TYPES.map((s) => (
                      <option key={s.value} value={s.value}>{s.icon} {s.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Advanced Options (Collapsible) */}
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: showAdvanced ? "auto" : 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="pt-4 border-t border-neutral-800">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center justify-between w-full px-4 py-3 text-left text-sm font-medium text-neutral-300 hover:text-neutral-50 rounded-lg bg-neutral-900/50 border border-neutral-800 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Settings className="w-4 h-4" aria-hidden="true" />
                    Advanced Options
                  </span>
                  <ChevronDown className={cn("w-4 h-4 text-neutral-500 transition-transform", showAdvanced && "rotate-180")} aria-hidden="true" />
                </motion.button>

                <AnimatePresence>
                  {showAdvanced && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, y: -10, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="mt-4 space-y-4"
                    >
                      {/* Budget */}
                      <div className="relative">
                        <label className="block text-sm font-medium text-neutral-300 mb-1.5">Max Budget (₹)</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">₹</span>
                          <input
                            type="number"
                            value={request.budget_total_inr ?? ""}
                            onChange={(e) => {
                              const val = e.target.value ? parseFloat(e.target.value) : null;
                              setRequest((prev) => ({ ...prev, budget_total_inr: val }));
                            }}
                            placeholder="No limit"
                            min="0"
                            step="100"
                            className="glass-input w-full pl-8 pr-3.5 py-2.5 text-sm text-neutral-50 bg-neutral-900/50"
                          />
                        </div>
                      </div>

                      {/* Accessibility */}
                      <div>
                        <label className="block text-sm font-medium text-neutral-300 mb-1.5">Accessibility</label>
                        <div className="flex flex-wrap gap-2">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            onClick={() => {
                              const hasWheelchair = request.accessibility.includes("wheelchair");
                              setRequest((prev) => ({
                                ...prev,
                                accessibility: hasWheelchair ? [] : ["wheelchair"],
                              }));
                            }}
                            className={cn(
                              "flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all",
                              request.accessibility.includes("wheelchair")
                                ? "bg-cyan-500/15 text-cyan-300 border-cyan-500/40"
                                : "bg-neutral-900/50 text-neutral-400 border-neutral-800 hover:border-neutral-700 hover:text-neutral-200"
                            )}
                          >
                            <MapPin className="w-4 h-4" aria-hidden="true" />
                            <span>Wheelchair Accessible</span>
                          </motion.button>
                        </div>
                      </div>

                      {/* Luggage */}
                      <div>
                        <label className="block text-sm font-medium text-neutral-300 mb-1.5">Luggage</label>
                        <div className="flex gap-2">
                          {(["light", "heavy", null] as const).map((val) => (
                            <motion.button
                              key={val || "none"}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              type="button"
                              onClick={() => setRequest((prev) => ({ ...prev, luggage: val }))}
                              className={cn(
                                "flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all",
                                request.luggage === val
                                  ? "bg-brand-500/15 text-brand-300 border-brand-500/40"
                                  : "bg-neutral-900/50 text-neutral-400 border-neutral-800 hover:border-neutral-700 hover:text-neutral-200"
                              )}
                            >
                              {val === "light" ? "🎒" : val === "heavy" ? "🧳" : "❌"}
                              <span>{val ? val.charAt(0).toUpperCase() + val.slice(1) : "None"}</span>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-4 border-t border-neutral-800"
              >
                <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-3">Recent Searches</p>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.slice(0, 5).map((search, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => {
                        setRequest(search);
                        setOriginInput(search.origin);
                        setDestInput(search.destination);
                      }}
                      className="px-3 py-1.5 text-sm text-neutral-300 bg-neutral-900/50 border border-neutral-800 hover:border-brand-500/50 hover:text-brand-300 rounded-full transition-colors"
                    >
                      {search.origin} → {search.destination}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading || !request.origin.trim() || !request.destination.trim()}
              className="w-full btn btn-primary btn-lg justify-center gap-3 mt-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Planning Journey...</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" aria-hidden="true" />
                  <span>Plan My Journey</span>
                </>
              )}
            </motion.button>
          </motion.div>
        ) : (
          /* Natural Language Mode */
          <motion.div
            key="natural"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <div className="relative">
              <label className="sr-only">Describe your trip in natural language</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" aria-hidden="true" />
                <textarea
                  value={naturalText}
                  onChange={(e) => setNaturalText(e.target.value)}
                  placeholder="e.g., 'Need to travel from Vizag to Hitech City tomorrow by 9 AM for 2 people with budget under ₹5000, wheelchair accessible'"
                  rows={4}
                  className="glass-input w-full pl-10 pr-12 py-4 text-sm text-neutral-50 placeholder-neutral-500 bg-neutral-900/50 resize-none min-h-[120px] max-h-[200px]"
                  disabled={isLoading}
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading || !naturalText.trim()}
                  className="absolute right-3 bottom-3 btn btn-primary btn-sm"
                >
                  {isLoading ? "Planning..." : "Plan Trip"}
                </motion.button>
              </div>
            </div>

            <p className="text-sm text-neutral-500">
              Describe your complete journey in plain English or Telugu. Our AI will parse it into structured constraints.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {[
                "Vizag to Hitech City tomorrow by 9 AM for 2 people with budget 5000",
                "Vizag to Miyapur tomorrow by 8:30 AM sleeper bus 1 person",
                "Vizag to Hitech City tomorrow by 9 AM for 2 wheelchair accessible",
              ].map((prompt, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setNaturalText(prompt)}
                  className="px-3 py-1.5 text-sm text-neutral-300 bg-neutral-900/50 border border-neutral-800 hover:border-brand-500/40 hover:text-brand-300 rounded-full transition-colors truncate max-w-[300px]"
                >
                  {prompt}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}