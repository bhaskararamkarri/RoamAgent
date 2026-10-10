"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Shield, Zap, CheckCircle2, Award, BarChart3, Globe, RefreshCw, Lock } from "lucide-react";

interface TrustBadgesProps {
  className?: string;
}

export function TrustBadges({ className }: TrustBadgesProps) {
  const badges = [
    {
      icon: Shield,
      title: "Deterministic Constraint Verification",
      description: "Itineraries are mathematically checked against user constraints: arrival deadline, total budget, transfer buffers, and accessible seat requirements.",
      tag: "Rule-Based Validation",
    },
    {
      icon: Lock,
      title: "Explicit Consent Booking Gate",
      description: "No booking action or simulated payment is triggered automatically. The platform enforces explicit user authorization before generating SBX sandbox tokens.",
      tag: "Consent-Gated",
    },
    {
      icon: Zap,
      title: "Fast Local Graph Replanning",
      description: "Deterministic graph-search algorithms compute feasible multi-leg itineraries locally in Python with consistent sub-second prototype latency.",
      tag: "Prototype Benchmark",
    },
    {
      icon: Globe,
      title: "Multi-Modal Corridor Feeds",
      description: "Journeys connect feeder auto-rickshaws, city buses, interstate multi-axle coaches, and express passenger trains with realistic transfer points.",
      tag: "Multi-Modal Coverage",
    },
    {
      icon: RefreshCw,
      title: "Simulated Disruption Recovery",
      description: "Users can inject delay or cancellation scenarios to evaluate how the replanning algorithm calculates feasible alternatives with exact time and cost deltas.",
      tag: "Scenario Simulator",
    },
    {
      icon: BarChart3,
      title: "Transparent Data Provenance",
      description: "All schedules, availability counters, and prices are clearly labeled as SIMULATED sandbox data. No commercial credit card transactions are initiated.",
      tag: "Sandbox Prototype",
    },
  ];

  return (
    <section
      className={cn("py-12 px-4 sm:px-6 lg:px-8 space-y-8 bg-[#FFF8F1] rounded-3xl border border-[#E8DCD1] text-[#302923] my-8", className)}
      aria-labelledby="trust-badges-heading"
    >
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="px-3 py-1 rounded-full bg-[#FFEFE6] text-[#CC4827] text-xs font-bold tracking-wide uppercase">
          Engineering Principles
        </span>
        <h2 id="trust-badges-heading" className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#302923] mt-2 mb-2">
          Deterministic Guarantees & Safety Architecture
        </h2>
        <p className="text-[#81756B] text-sm leading-relaxed">
          Engineered for algorithmic transparency. Every route is validated, every constraint is enforced, and all booking actions require explicit user consent.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {badges.map((badge) => (
          <article
            key={badge.title}
            className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E8DCD1] hover:border-[#E65D36]/40 hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#FFEFE6] text-[#E65D36] border border-[#E65D36]/30 flex items-center justify-center mb-4">
                <badge.icon className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="font-bold text-base text-[#302923] mb-2">
                {badge.title}
              </h3>
              <p className="text-xs text-[#81756B] leading-relaxed mb-4">
                {badge.description}
              </p>
            </div>
            <div className="pt-3 border-t border-[#E8DCD1]/60">
              <span className="inline-block px-2.5 py-1 rounded-md bg-[#F8EDE2] text-[#CC4827] text-[11px] font-bold">
                {badge.tag}
              </span>
            </div>
          </article>
        ))}
      </div>

      {/* Disclaimers & Provenance Bar */}
      <div className="p-4 rounded-xl bg-[#F8EDE2] border border-[#E8DCD1] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#81756B]">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#247A50] shrink-0" aria-hidden="true" />
          <span>Validated against 20+ NLP test fixtures and deterministic schedule constraints.</span>
        </div>
        <span className="font-mono text-[11px] font-semibold text-[#CC4827]">
          Simulated Sandbox Environment
        </span>
      </div>
    </section>
  );
}

export default TrustBadges;