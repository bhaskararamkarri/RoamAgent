"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Banner } from "@/components/Banner";
import { Header } from "@/components/Header";
import { Hero } from "@/components/homepage/Hero";
import { TripSearch } from "@/components/homepage/TripSearch";
import { PopularRoutes } from "@/components/homepage/PopularRoutes";
import { DestinationCarousel } from "@/components/homepage/DestinationCarousel";
import { HowItWorks } from "@/components/homepage/HowItWorks";
import { TrustBadges } from "@/components/homepage/TrustBadges";
import { CorporateCTA } from "@/components/homepage/CorporateCTA";
import { Footer } from "@/components/homepage/Footer";
import { ConstraintChips } from "@/components/ConstraintChips";
import { ItineraryCard } from "@/components/ItineraryCard";
import { RejectedCollapsible } from "@/components/RejectedCollapsible";
import { ConsentModal } from "@/components/ConsentModal";
import { BookingCard } from "@/components/BookingCard";
import { DisruptionPanel } from "@/components/DisruptionPanel";
import { InfeasibleNotice } from "@/components/InfeasibleNotice";
import { MetricsDrawer } from "@/components/MetricsDrawer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ToastProvider, useToast } from "@/components/ui/Toast";
import {
  TripRequest,
  Itinerary,
  RejectedCandidate,
  DisruptionEvent,
  RankMode,
  ScenarioItem,
  BookResponse,
  DisruptResponse,
} from "@/lib/types";
import {
  getHealth,
  parseTrip,
  planTrip,
  explainItinerary,
  bookTrip,
  cancelBooking,
  disruptTrip,
  getScenarios,
} from "@/lib/api";
import { Destination } from "@/lib/destinations";
import { AlertCircle, CheckCircle2, Sparkles, Loader2, ChevronUp, ChevronDown } from "lucide-react";
import { formatCurrency, formatTime } from "@/lib/utils";

export default function Home() {
  // Global App States
  const [lang, setLang] = useState<"en" | "te">("en");
  const [rankMode, setRankMode] = useState<RankMode>("balanced");
  const [llmAvailable, setLlmAvailable] = useState<boolean>(false);
  const [isMetricsOpen, setIsMetricsOpen] = useState(false);

  // Intake & Planning States
  const [tripRequest, setTripRequest] = useState<TripRequest | null>(null);
  const [followupQuestion, setFollowupQuestion] = useState<string | null>(null);
  const [pendingText, setPendingText] = useState<string>("");
  const [scenarios, setScenarios] = useState<ScenarioItem[]>([]);
  const [isPlanning, setIsPlanning] = useState(false);
  const { toast } = useToast();

  // Results
  const [feasibleItineraries, setFeasibleItineraries] = useState<Itinerary[]>([]);
  const [rejectedCandidates, setRejectedCandidates] = useState<RejectedCandidate[]>([]);
  const [planNotes, setPlanNotes] = useState<string[]>([]);
  const [explanations, setExplanations] = useState<Record<string, string>>({});
  const [selectedItinerary, setSelectedItinerary] = useState<Itinerary | null>(null);

  // Booking & Consent States
  const [isConsentOpen, setIsConsentOpen] = useState(false);
  const [itineraryToBook, setItineraryToBook] = useState<Itinerary | null>(null);
  const [isBookingLoading, setIsBookingLoading] = useState(false);
  const [activeBooking, setActiveBooking] = useState<BookResponse | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  // Disruption States
  const [isDisruptionOpen, setIsDisruptionOpen] = useState(false);
  const [disruptionEvents, setDisruptionEvents] = useState<DisruptionEvent[]>([]);
  const [disruptResponse, setDisruptResponse] = useState<DisruptResponse | null>(null);
  const [isDisruptingLoading, setIsDisruptingLoading] = useState(false);

  // Debounce ref for constraints
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const planRequestIdRef = useRef<number>(0);

  // Initial load: check health and fetch scenarios
  useEffect(() => {
    getHealth()
      .then((h) => setLlmAvailable(h.llm_available))
      .catch(() => setLlmAvailable(false));

    getScenarios()
      .then((s) => setScenarios(s))
      .catch(() => {});
  }, []);

  // Execute Plan
  const executePlan = useCallback(
    async (
      req: TripRequest,
      events: DisruptionEvent[] = disruptionEvents,
      mode: RankMode = rankMode
    ) => {
      const currentRequestId = ++planRequestIdRef.current;
      setIsPlanning(true);
      try {
        const planRes = await planTrip(req, events, mode);
        
        // Prevent old responses from overwriting newer ones
        if (currentRequestId !== planRequestIdRef.current) {
          return;
        }

        setFeasibleItineraries(planRes.feasible);
        setRejectedCandidates(planRes.rejected);
        setPlanNotes(planRes.notes);
        setIsPlanning(false);

        if (planRes.feasible.length > 0) {
          const topId = planRes.feasible[0].id;
          setSelectedItinerary(planRes.feasible[0]);
          // Fetch explanation asynchronously in background
          explainItinerary(topId, req, events, null, lang)
            .then((exp) => {
              if (currentRequestId === planRequestIdRef.current) {
                setExplanations((prev) => ({
                  ...prev,
                  [topId]: exp.text,
                }));
              }
            })
            .catch(() => {});
        } else {
          setSelectedItinerary(null);
        }
      } catch (err: any) {
        if (currentRequestId === planRequestIdRef.current) {
          toast(err.message || "Failed to compute travel plan", { variant: "error" });
          setIsPlanning(false);
        }
      }
    },
    [disruptionEvents, rankMode, lang, toast]
  );

  // Handle Natural Language Parse
  const handleParseText = async (text: string) => {
    setPendingText(text);
    setIsPlanning(true);
    setFollowupQuestion(null);
    try {
      const res = await parseTrip(text, true);
      if (res.needs_followup && res.question) {
        setFollowupQuestion(res.question);
        setIsPlanning(false);
      } else if (res.request) {
        setTripRequest(res.request);
        setDisruptionEvents([]);
        setActiveBooking(null);
        await executePlan(res.request, [], rankMode);
      }
    } catch (err: any) {
      toast(err.message || "Failed to parse natural language request", { variant: "error" });
      setIsPlanning(false);
    }
  };

  // Handle Follow-up Answer
  const handleFollowupAnswer = async (answer: string) => {
    const combined = `${pendingText} ${answer}`;
    setFollowupQuestion(null);
    await handleParseText(combined);
  };

  // Handle Guided Trip Search
  const handleTripSearch = async (req: TripRequest) => {
    setTripRequest(req);
    setDisruptionEvents([]);
    setActiveBooking(null);
    await executePlan(req, [], rankMode);
  };

  // Handle Preset Scenario Select
  const handleSelectScenario = async (scenario: ScenarioItem) => {
    await handleParseText(scenario.text);
  };

  // Handle Popular Route Selection from UI
  const handleSelectRoute = async (origin: string, destination: string) => {
    const today = new Date().toISOString().split("T")[0];
    const newReq: TripRequest = {
      origin,
      destination,
      travel_date: today,
      arrival_deadline: "10:00",
      passengers: 1,
      seat_type: "any",
      budget_total_inr: null,
      accessibility: [],
      luggage: null,
    };
    setTripRequest(newReq);
    setDisruptionEvents([]);
    setActiveBooking(null);
    toast(`Planning route: ${origin} → ${destination}`, { variant: "info" });
    const searchFormEl = document.getElementById("search-form") || document.getElementById("planner") || document.getElementById("hero-heading");
    if (searchFormEl) searchFormEl.scrollIntoView({ behavior: "smooth", block: "center" });
    await executePlan(newReq, [], rankMode);
  };

  // Handle Destination Selection from Explore India catalogue
  const handleSelectDestination = async (dest: Destination) => {
    const today = new Date().toISOString().split("T")[0];
    const origin = dest.suggestedOrigin || "New Delhi";
    const newReq: TripRequest = {
      origin,
      destination: dest.name,
      travel_date: today,
      arrival_deadline: "10:00",
      passengers: 1,
      seat_type: "any",
      budget_total_inr: null,
      accessibility: [],
      luggage: null,
    };
    setTripRequest(newReq);
    setDisruptionEvents([]);
    setActiveBooking(null);
    toast(`Selected destination: ${dest.name} (${dest.state}) from ${origin}`, { variant: "info" });
    const searchFormEl = document.getElementById("search-form") || document.getElementById("planner") || document.getElementById("hero-heading");
    if (searchFormEl) searchFormEl.scrollIntoView({ behavior: "smooth", block: "center" });
    await executePlan(newReq, [], rankMode);
  };

  // Handle Constraints Edit
  const handleConstraintsChange = (updated: TripRequest) => {
    setTripRequest(updated);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      executePlan(updated, disruptionEvents, rankMode);
    }, 400);
  };

  // Handle Language Toggle
  const handleToggleLang = () => {
    const nextLang = lang === "en" ? "te" : "en";
    setLang(nextLang);
    // Refresh explanations if top itinerary exists
    if (selectedItinerary && tripRequest) {
      explainItinerary(selectedItinerary.id, tripRequest, disruptionEvents, null, nextLang)
        .then((exp) => {
          setExplanations((prev) => ({
            ...prev,
            [selectedItinerary.id]: exp.text,
          }));
        })
        .catch(() => {});
    }
  };

  // Handle Rank Mode Change
  const handleRankModeChange = (mode: RankMode) => {
    setRankMode(mode);
    if (tripRequest) {
      executePlan(tripRequest, disruptionEvents, mode);
    }
  };

  // Open Consent Modal for Booking
  const handleStartBooking = (itin: Itinerary) => {
    setItineraryToBook(itin);
    setIsConsentOpen(true);
  };

  // Approve and Execute Booking
  const handleApproveBooking = async (itin: Itinerary) => {
    if (!tripRequest) return;
    setIsBookingLoading(true);
    try {
      const bookingRes = await bookTrip(
        tripRequest,
        disruptionEvents,
        itin.id,
        true // explicit approval
      );
      setActiveBooking(bookingRes);
      setIsConsentOpen(false);
      toast(`Booking ${bookingRes.booking_id} confirmed via Sandbox!`, { variant: "success" });
    } catch (err: any) {
      toast(err.message || "Booking authorization failed", { variant: "error" });
    } finally {
      setIsBookingLoading(false);
    }
  };

  // Cancel Booking
  const handleCancelBooking = async () => {
    if (!activeBooking) return;
    setIsCancelling(true);
    try {
      const cancelRes = await cancelBooking(activeBooking.booking_id, true);
      toast(`Booking Cancelled. ${cancelRes.message}`, { variant: "success" });
      setActiveBooking(null);
      setIsDisruptionOpen(false);
    } catch (err: any) {
      toast(err.message || "Cancellation failed", { variant: "error" });
    } finally {
      setIsCancelling(false);
    }
  };

  // Inject Disruption Event
  const handleInjectDisruption = async (event: DisruptionEvent) => {
    if (!tripRequest || !activeBooking) return;
    setIsDisruptingLoading(true);
    try {
      const res = await disruptTrip(
        tripRequest,
        disruptionEvents,
        event,
        activeBooking.itinerary.id
      );
      setDisruptionEvents(res.events);
      setDisruptResponse(res);
      toast(res.notification.message, { variant: "success" });
    } catch (err: any) {
      toast(err.message || "Failed to inject disruption", { variant: "error" });
    } finally {
      setIsDisruptingLoading(false);
    }
  };

  // Switch to Alternative Route from Disruption (Consent Gated)
  const handleSelectAlternative = (altItin: Itinerary) => {
    setItineraryToBook(altItin);
    setIsConsentOpen(true);
  };

  return (
    <ToastProvider>
      <div className="flex-1 flex flex-col min-h-screen relative">
        {/* Ambient background - subtle gradient orbs */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-500/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-20 right-10 w-[400px] h-[200px] bg-teal-500/5 rounded-full blur-[100px]" />
        </div>


        {/* Sticky Header */}
        <Header
          lang={lang}
          onToggleLang={handleToggleLang}
          rankMode={rankMode}
          onRankModeChange={handleRankModeChange}
          llmAvailable={llmAvailable}
          onOpenMetrics={() => setIsMetricsOpen(true)}
        />

        {/* Main Single-Page App Container */}
        <main className="flex-1 max-w-7xl w-full mx-auto pb-12">
          {/* Section 1: Hero */}
          <Hero>
            <div id="search-form">
              <TripSearch
                initialRequest={tripRequest || undefined}
                onSearch={handleTripSearch}
                onNaturalSearch={handleParseText}
                isLoading={isPlanning}
                scenarios={scenarios}
                onSelectScenario={handleSelectScenario}
              />
            </div>
          </Hero>

          {/* Live Itinerary Results & Planning Area */}

          {/* Section 7: Constraint Chips / Form (appears after search) */}
          {tripRequest && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="container-app px-4 sm:px-6 lg:px-8 pt-8"
            >
              <ConstraintChips
                request={tripRequest}
                onChange={handleConstraintsChange}
                disabled={isPlanning}
              />
            </motion.section>
          )}

          {/* Section 8: Active Booking Card (if booked) */}
          {activeBooking && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="container-app px-4 sm:px-6 lg:px-8 pt-8"
            >
              <BookingCard
                booking={activeBooking}
                onOpenDisruption={() => setIsDisruptionOpen(true)}
                onCancelBooking={handleCancelBooking}
                cancelling={isCancelling}
              />
            </motion.section>
          )}

          {/* Section 9: Ranked Results / Infeasible State / Loading */}
          <motion.section
            className="container-app px-4 sm:px-6 lg:px-8 pt-8"
          >
            <AnimatePresence mode="wait">
              {isPlanning ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="p-12 text-center space-y-4 glass-card rounded-2xl border border-neutral-800"
                  role="status"
                  aria-live="polite"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 text-brand-400 animate-spin mx-auto"
                    aria-hidden="true"
                  >
                    <Loader2 className="w-full h-full stroke-[2.5]" />
                  </motion.div>
                  <div>
                    <p className="text-sm font-bold text-neutral-50 tracking-tight">
                      Evaluating Deterministic Travel Graph
                    </p>
                    <p className="text-xs text-neutral-400 mt-1">
                      Synthesizing multi-leg feeder connections, metro options, and transfer delay ratios...
                    </p>
                  </div>
                </motion.div>
              ) : tripRequest && feasibleItineraries.length === 0 ? (
                <motion.div
                  key="infeasible"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  <InfeasibleNotice
                    notes={planNotes}
                    onRelaxDeadline={() => {
                      if (!tripRequest) return;
                      const [h, m] = tripRequest.arrival_deadline.split(":").map(Number);
                      const nextHour = (h + 1) % 24;
                      const newDeadline = `${String(nextHour).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
                      handleConstraintsChange({ ...tripRequest, arrival_deadline: newDeadline });
                    }}
                    onRelaxBudget={() => {
                      if (!tripRequest) return;
                      handleConstraintsChange({ ...tripRequest, budget_total_inr: null });
                    }}
                  />
                </motion.div>
              ) : feasibleItineraries.length > 0 ? (
                <motion.section
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-2">
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="w-7 h-7 rounded-lg bg-brand-500/15 text-brand-400 border border-brand-500/30 flex items-center justify-center"
                        aria-hidden="true"
                      >
                        <Sparkles className="w-4 h-4" />
                      </motion.div>
                      <h3 className="font-display font-bold text-base sm:text-lg tracking-tight text-neutral-50">
                        Ranked Itinerary Recommendations
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" size="sm">
                        {rankMode.charAt(0).toUpperCase() + rankMode.slice(1)} Mode
                      </Badge>
                      <span className="text-xs text-neutral-400 hidden sm:inline">
                        Showing top {Math.min(5, feasibleItineraries.length)} feasible journeys
                      </span>
                    </div>
                  </div>

                  {/* Desktop 2-column grid, mobile single-column */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {feasibleItineraries.slice(0, 5).map((itin, idx) => (
                      <ItineraryCard
                        key={itin.id}
                        itinerary={itin}
                        rankIndex={idx}
                        deadline={tripRequest?.arrival_deadline || "09:00"}
                        explanation={explanations[itin.id]}
                        onSelectBook={handleStartBooking}
                        isSelected={selectedItinerary?.id === itin.id}
                      />
                    ))}
                  </div>
                </motion.section>
              ) : null}
            </AnimatePresence>

            {/* Section 10: Rejected Options Collapsible */}
            {rejectedCandidates.length > 0 && (
              <RejectedCollapsible rejected={rejectedCandidates} />
            )}
          </motion.section>

          {/* Discovery Sections with Generous Spacing and Padding */}
          <div className="space-y-12 sm:space-y-16 lg:space-y-20 pt-10">
            {/* Section: Popular Routes */}
            <PopularRoutes onSelectRoute={handleSelectRoute} />

            {/* Section: Destination Carousel */}
            <DestinationCarousel onSelectDestination={handleSelectDestination} />

            {/* Section: How It Works */}
            <HowItWorks />

            {/* Section: Trust Badges */}
            <TrustBadges />

            {/* Section: Corporate CTA */}
            <CorporateCTA />
          </div>
        </main>

        {/* Sticky Bottom Action Bar for Mobile Viewport */}
        {selectedItinerary && !activeBooking && feasibleItineraries.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="lg:hidden sticky bottom-0 z-[300] bg-neutral-950/95 backdrop-blur-2xl border-t border-neutral-800 p-4 shadow-[0_-8px_30px_rgba(0,0,0,0.6)]"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1">
                <span className="text-[10px] text-neutral-400 block font-semibold uppercase tracking-wider mb-0.5">
                  Top Selected Route
                </span>
                <span className="font-mono font-bold text-neutral-50 text-sm">
                  {formatCurrency(selectedItinerary.total_cost)} • Reaches {formatTime(selectedItinerary.arrival)}
                </span>
              </div>
              <Button
                size="lg"
                onClick={() => handleStartBooking(selectedItinerary)}
                className="w-full sm:w-auto"
              >
                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
                <span>Book Selected (Sandbox)</span>
              </Button>
            </div>
          </motion.div>
        )}

        {/* Consent Dialog Modal */}
        <ConsentModal
          isOpen={isConsentOpen}
          itinerary={itineraryToBook}
          onClose={() => setIsConsentOpen(false)}
          onApprove={handleApproveBooking}
          loading={isBookingLoading}
        />

        {/* Disruption Simulator Drawer */}
        {activeBooking && (
          <DisruptionPanel
            isOpen={isDisruptionOpen}
            onClose={() => setIsDisruptionOpen(false)}
            bookedItinerary={activeBooking.itinerary}
            onInjectDisruption={handleInjectDisruption}
            disruptResponse={disruptResponse}
            onSelectAlternative={handleSelectAlternative}
            loading={isDisruptingLoading}
          />
        )}

        {/* Metrics Slide-out Drawer */}
        <MetricsDrawer
          isOpen={isMetricsOpen}
          onClose={() => setIsMetricsOpen(false)}
        />

        {/* Footer */}
        <Footer />
      </div>
    </ToastProvider>
  );
}