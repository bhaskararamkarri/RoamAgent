"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Bus,
  ArrowUp,
  Mail,
  Shield,
  HelpCircle,
  FileText,
  Lock,
  Info,
  CheckCircle2,
  X,
  ExternalLink,
} from "lucide-react";

interface FooterProps {
  className?: string;
}

type ModalType =
  | "about"
  | "contact"
  | "careers"
  | "help"
  | "faqs"
  | "feedback"
  | "status"
  | "privacy"
  | "terms"
  | "cookies"
  | "data"
  | null;

export function Footer({ className }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeModal = () => {
    setActiveModal(null);
    setFeedbackSent(false);
    setFeedbackText("");
  };

  return (
    <>
      <footer
        className={cn("border-t border-[#E8DCD1] bg-[#FFF8F1] text-[#302923] pt-12 pb-8 mt-12", className)}
        role="contentinfo"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 pb-12 border-b border-[#E8DCD1]">
            {/* Brand Column (2 cols) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E65D36] to-[#CC4827] text-white flex items-center justify-center shadow-md">
                  <Bus className="w-5 h-5 stroke-[2.2]" aria-hidden="true" />
                </div>
                <div>
                  <span className="font-extrabold text-lg tracking-tight text-[#302923]">TBS RoamAgent</span>
                  <p className="text-[10px] text-[#81756B] font-mono uppercase tracking-wider font-semibold">
                    Simulated Prototype • Samartha
                  </p>
                </div>
              </div>
              <p className="text-[#81756B] text-xs leading-relaxed max-w-sm">
                India-wide deterministic multi-modal journey planning. Calculates feasible connecting routes, validates hard deadlines and transfer buffers, and protects travelers with consent-gated booking.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs text-[#247A50] font-semibold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Deterministic Graph Engine Active</span>
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h3 className="font-bold text-sm text-[#302923] mb-3 uppercase tracking-wider text-[11px]">Product</h3>
              <ul className="space-y-2 text-xs">
                <li>
                  <a href="#planner" className="text-[#81756B] hover:text-[#E65D36] transition-colors">
                    Trip Planner
                  </a>
                </li>
                <li>
                  <a href="#routes" className="text-[#81756B] hover:text-[#E65D36] transition-colors">
                    Popular Routes
                  </a>
                </li>
                <li>
                  <a href="#explore" className="text-[#81756B] hover:text-[#E65D36] transition-colors">
                    Destinations (36 State/UTs)
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="text-[#81756B] hover:text-[#E65D36] transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#corporate" className="text-[#81756B] hover:text-[#E65D36] transition-colors">
                    Corporate Travel
                  </a>
                </li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="font-bold text-sm text-[#302923] mb-3 uppercase tracking-wider text-[11px]">Company</h3>
              <ul className="space-y-2 text-xs">
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveModal("about")}
                    className="text-[#81756B] hover:text-[#E65D36] transition-colors text-left"
                  >
                    About RoamAgent
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveModal("contact")}
                    className="text-[#81756B] hover:text-[#E65D36] transition-colors text-left"
                  >
                    Contact Team
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveModal("careers")}
                    className="text-[#81756B] hover:text-[#E65D36] transition-colors text-left"
                  >
                    Project Background
                  </button>
                </li>
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h3 className="font-bold text-sm text-[#302923] mb-3 uppercase tracking-wider text-[11px]">Support</h3>
              <ul className="space-y-2 text-xs">
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveModal("help")}
                    className="text-[#81756B] hover:text-[#E65D36] transition-colors text-left"
                  >
                    Help Center
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveModal("faqs")}
                    className="text-[#81756B] hover:text-[#E65D36] transition-colors text-left"
                  >
                    Frequently Asked Questions
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveModal("feedback")}
                    className="text-[#81756B] hover:text-[#E65D36] transition-colors text-left"
                  >
                    Send Feedback
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveModal("status")}
                    className="text-[#81756B] hover:text-[#E65D36] transition-colors text-left"
                  >
                    System Status
                  </button>
                </li>
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h3 className="font-bold text-sm text-[#302923] mb-3 uppercase tracking-wider text-[11px]">Legal & Safety</h3>
              <ul className="space-y-2 text-xs">
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveModal("privacy")}
                    className="text-[#81756B] hover:text-[#E65D36] transition-colors text-left"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveModal("terms")}
                    className="text-[#81756B] hover:text-[#E65D36] transition-colors text-left"
                  >
                    Terms of Service
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveModal("cookies")}
                    className="text-[#81756B] hover:text-[#E65D36] transition-colors text-left"
                  >
                    Cookie Policy
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveModal("data")}
                    className="text-[#81756B] hover:text-[#E65D36] transition-colors text-left"
                  >
                    Data Processing
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar with Back to Top */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#81756B]">
            <div>
              <p>
                © {currentYear} TBS RoamAgent Prototype. Built for Samartha Hackathon using deterministic Python & Next.js.
              </p>
              <p className="text-[11px] text-[#A89789] mt-0.5">
                All transport schedules, fares, and bookings are SIMULATED for prototype demonstration.
              </p>
            </div>

            <button
              type="button"
              onClick={scrollToTop}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFFFFF] border border-[#E8DCD1] text-[#302923] hover:text-[#E65D36] hover:border-[#E65D36]/40 transition-all font-semibold shadow-sm"
              aria-label="Scroll back to top of page"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </footer>

      {/* Information Modal Dialog */}
      {activeModal && (
        <div
          className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="footer-modal-title"
        >
          <div className="bg-[#FFFFFF] text-[#302923] w-full max-w-lg p-6 rounded-2xl border border-[#E8DCD1] shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E8DCD1] pb-3">
              <h3 id="footer-modal-title" className="font-bold text-lg text-[#302923] capitalize">
                {activeModal === "about" && "About TBS RoamAgent"}
                {activeModal === "contact" && "Contact Team"}
                {activeModal === "careers" && "Project Background"}
                {activeModal === "help" && "Help Center"}
                {activeModal === "faqs" && "Frequently Asked Questions"}
                {activeModal === "feedback" && "User Feedback"}
                {activeModal === "status" && "System & Engine Status"}
                {activeModal === "privacy" && "Privacy Policy"}
                {activeModal === "terms" && "Terms of Service"}
                {activeModal === "cookies" && "Cookie Policy"}
                {activeModal === "data" && "Data Processing Notice"}
              </h3>
              <button
                type="button"
                onClick={closeModal}
                className="p-1.5 rounded-lg text-[#81756B] hover:text-[#302923]"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Content */}
            <div className="text-xs text-[#5F5349] leading-relaxed space-y-3">
              {activeModal === "about" && (
                <>
                  <p>
                    TBS RoamAgent is a multimodal travel planning prototype designed for interconnected journeys throughout India. The platform integrates first-mile auto-rickshaws, intercity buses, express trains, and last-mile metro feeds.
                  </p>
                  <p>
                    Unlike generic generative AI travel planners that may hallucinate departure times or connections, RoamAgent uses a deterministic Python graph engine to guarantee that every suggested itinerary satisfies physical connection times, transfer buffers, and arrival deadlines.
                  </p>
                </>
              )}

              {activeModal === "contact" && (
                <>
                  <p>Have questions about the prototype or wish to test custom route corridors?</p>
                  <div className="p-3 bg-[#F8EDE2] rounded-xl space-y-1">
                    <p className="font-semibold text-[#302923]">Engineering Contact:</p>
                    <p className="font-mono text-[#E65D36]">roamagent@tbs-samartha.in</p>
                    <p className="text-[11px] text-[#81756B]">Location: Visakhapatnam & Hyderabad, India</p>
                  </div>
                </>
              )}

              {activeModal === "careers" && (
                <>
                  <p>
                    TBS RoamAgent was engineered as part of the Samartha nationwide multi-modal mobility initiative.
                  </p>
                  <p>
                    The codebase features a modular FastAPI backend, static GTFS schedule feeds, pure Python graph replanning algorithms, and a Next.js App Router frontend with Sunset Trails design architecture.
                  </p>
                </>
              )}

              {activeModal === "help" && (
                <>
                  <p className="font-semibold text-[#302923]">How to plan a journey:</p>
                  <ol className="list-decimal pl-4 space-y-1">
                    <li>Enter an origin (e.g. Visakhapatnam) and destination (e.g. Hyderabad) or type in natural language.</li>
                    <li>Specify your travel date, arrival deadline, and passenger count.</li>
                    <li>Review the ranked feasible itineraries and alternative rejected routes.</li>
                    <li>Click &ldquo;Book Itinerary&rdquo; to test simulated consent-gated booking.</li>
                  </ol>
                </>
              )}

              {activeModal === "faqs" && (
                <>
                  <div className="space-y-2">
                    <div>
                      <p className="font-bold text-[#302923]">Are actual tickets booked?</p>
                      <p className="text-[#81756B]">No. This is an engineering sandbox prototype. All booking tokens (<code className="bg-[#F8EDE2] px-1 py-0.5 rounded text-[#E65D36]">SBX-XXXXXXXX</code>) are simulated.</p>
                    </div>
                    <div>
                      <p className="font-bold text-[#302923]">How are transfer buffers calculated?</p>
                      <p className="text-[#81756B]">Buffers evaluate realistic transfer walking times between platforms and stations, plus historical delay variances.</p>
                    </div>
                    <div>
                      <p className="font-bold text-[#302923]">What languages are supported?</p>
                      <p className="text-[#81756B]">English and Telugu (తెలుగు) with multi-lingual explanations.</p>
                    </div>
                  </div>
                </>
              )}

              {activeModal === "feedback" && (
                <>
                  {feedbackSent ? (
                    <div className="p-4 bg-[#EAF7EE] rounded-xl text-[#247A50] text-center space-y-1">
                      <CheckCircle2 className="w-6 h-6 mx-auto" />
                      <p className="font-bold">Thank you for your feedback!</p>
                      <p className="text-[11px]">Your response helps us improve the multi-modal itinerary engine.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p>How was your journey planning experience?</p>
                      <textarea
                        rows={4}
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        placeholder="Share your thoughts on route feasibility, UI design, or suggestions..."
                        className="w-full p-3 rounded-xl border border-[#E8DCD1] text-xs focus:ring-2 focus:ring-[#E65D36] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setFeedbackSent(true)}
                        disabled={!feedbackText.trim()}
                        className="w-full py-2 bg-[#E65D36] hover:bg-[#CC4827] text-white font-bold rounded-xl disabled:opacity-50 transition-colors"
                      >
                        Submit Feedback
                      </button>
                    </div>
                  )}
                </>
              )}

              {activeModal === "status" && (
                <>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-[#EAF7EE] rounded-lg text-[#247A50]">
                      <span>FastAPI Graph Engine</span>
                      <span className="font-bold">Operational</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-[#EAF7EE] rounded-lg text-[#247A50]">
                      <span>Consent Authorization Gate</span>
                      <span className="font-bold">Active</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-[#EAF7EE] rounded-lg text-[#247A50]">
                      <span>Disruption Replanner</span>
                      <span className="font-bold">Operational</span>
                    </div>
                  </div>
                </>
              )}

              {activeModal === "privacy" && (
                <>
                  <p>
                    TBS RoamAgent values your privacy. We do not collect or store government IDs, payment credit cards, or personal tracking tokens.
                  </p>
                  <p>
                    All travel queries are processed in-session. Booking records are kept in local memory for prototype simulation and reset on page refresh.
                  </p>
                </>
              )}

              {activeModal === "terms" && (
                <>
                  <p>
                    By using the TBS RoamAgent prototype, you acknowledge that route recommendations, fares, and delays are simulated for research and development purposes.
                  </p>
                  <p>
                    Explicit user consent is mandatory before invoking simulated booking actions.
                  </p>
                </>
              )}

              {activeModal === "cookies" && (
                <>
                  <p>
                    This application does not use third-party advertising cookies or tracking beacons. Only essential session storage is used to remember your ranking mode and language preferences.
                  </p>
                </>
              )}

              {activeModal === "data" && (
                <>
                  <p>
                    Data Processing Notice: All route calculations occur deterministically. No personal data is transmitted to external advertising networks or commercial brokers.
                  </p>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={closeModal}
              className="w-full py-2 bg-[#F8EDE2] hover:bg-[#E8DCD1] text-[#302923] font-bold rounded-xl transition-colors text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Footer;