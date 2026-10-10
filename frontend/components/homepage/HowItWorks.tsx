"use client";

import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Search, Shield, Sparkles, RefreshCw, ShieldCheck, CheckCircle2 } from "lucide-react";

interface HowItWorksProps {
  className?: string;
}

export function HowItWorks({ className }: HowItWorksProps) {
  const steps = [
    {
      number: "01",
      title: "Describe Your Journey",
      description: "Enter your route via natural language in English or Telugu, or use our guided origin-destination planner with arrival deadlines and passenger requirements.",
      icon: Search,
      highlights: ["Natural language parser", "Multi-modal origin/destination hubs", "Deadline & budget constraints"],
    },
    {
      number: "02",
      title: "Deterministic Validation",
      description: "Our pure Python graph engine validates every multi-leg candidate across hard constraints: deadlines, transfer buffers, seat availability, and transit modes.",
      icon: Shield,
      highlights: ["Minimum transfer buffers verified", "Strict deadline compliance", "Accessibility & seat checks"],
    },
    {
      number: "03",
      title: "Ranked Recommendations",
      description: "Compare feasible itineraries ranked by your priority: Balanced, Cheapest, Fastest, or Safest Buffer. Review complete leg-by-leg feeds and delay risk factors.",
      icon: Sparkles,
      highlights: ["Leg-by-leg timeline", "Feeder autos & metro included", "Alternative rejected option logs"],
    },
    {
      number: "04",
      title: "Consent-Gated Booking",
      description: "No booking occurs automatically. The system requires your explicit authorization before generating simulated booking tokens.",
      icon: ShieldCheck,
      highlights: ["Server price revalidation", "Explicit user consent required", "Simulated SBX tokens generated"],
    },
    {
      number: "05",
      title: "Disruption Recovery",
      description: "Test simulated delays or cancellations. The replanner calculates alternative feasible options with exact price and arrival time deltas instantly.",
      icon: RefreshCw,
      highlights: ["Incident impact analysis", "Ranked alternative recovery", "Consent-gated rebooking"],
    },
  ];

  const handleStartPlanning = () => {
    const plannerEl = document.getElementById("planner") || document.getElementById("hero-heading");
    if (plannerEl) {
      plannerEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="how-it-works"
      className={cn("py-12 px-4 sm:px-6 lg:px-8 space-y-8 bg-[#FFF8F1] rounded-3xl border border-[#E8DCD1] text-[#302923] my-8", className)}
      aria-labelledby="how-it-works-heading"
    >
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="px-3 py-1 rounded-full bg-[#FFEFE6] text-[#CC4827] text-xs font-bold tracking-wide uppercase">
          Engine Architecture
        </span>
        <h2
          id="how-it-works-heading"
          className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#302923] mt-2 mb-3"
        >
          From Request to Recovery in 5 Steps
        </h2>
        <p className="text-[#81756B] text-sm sm:text-base leading-relaxed">
          Engineered for travelers needing certainty across connecting transport legs. Every itinerary is validated, explained, and consent-gated.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {steps.map((step) => (
          <article
            key={step.number}
            className="group relative p-6 rounded-2xl bg-[#FFFFFF] border border-[#E8DCD1] hover:border-[#E65D36]/40 hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Step Number Badge */}
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#FFEFE6] text-[#E65D36] border border-[#E65D36]/30 flex items-center justify-center">
                  <step.icon className="w-6 h-6" />
                </div>
                <span className="font-mono font-black text-2xl text-[#E8DCD1] group-hover:text-[#F2B544] transition-colors">
                  {step.number}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-bold text-lg text-[#302923] mb-2 group-hover:text-[#E65D36] transition-colors">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-xs text-[#81756B] leading-relaxed mb-4">
                {step.description}
              </p>
            </div>

            {/* Highlights */}
            <ul className="space-y-1.5 pt-3 border-t border-[#E8DCD1]/60" role="list">
              {step.highlights.map((highlight, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs text-[#5F5349]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#247A50] shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      {/* CTA Button */}
      <div className="text-center pt-4">
        <button
          type="button"
          onClick={handleStartPlanning}
          className="px-6 py-3 rounded-xl bg-[#E65D36] hover:bg-[#CC4827] text-white font-bold text-sm shadow-md transition-all inline-flex items-center gap-2"
        >
          <Search className="w-4 h-4" aria-hidden="true" />
          <span>Plan a Connected Journey</span>
        </button>
      </div>
    </section>
  );
}

export default HowItWorks;