"use client";

import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Shield, Zap, Sparkles, Compass, CheckCircle2, Navigation } from "lucide-react";

interface HeroProps {
  className?: string;
  children?: React.ReactNode;
}

export function Hero({ className, children }: HeroProps) {
  return (
    <section
      id="planner"
      className={cn("relative overflow-hidden rounded-3xl my-6 bg-[#211C1A] text-white border border-[#4B3C35] shadow-xl", className)}
      aria-labelledby="hero-heading"
    >
      {/* Background Photography with Photographic Composition */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1920&q=80"
          alt="Indian landscape highway along scenic mountain ghats"
          className="w-full h-full object-cover opacity-35"
          loading="eager"
        />
        {/* Cinematic gradient overlays for maximum text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#211C1A]/95 via-[#211C1A]/85 to-[#211C1A]/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#211C1A] via-transparent to-transparent" />
        {/* Warm Sunset Trails subtle radial accent */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#E65D36]/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="relative z-10 py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-12">
        <div className="max-w-4xl">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E65D36]/20 border border-[#E65D36]/40 text-[#FFAA8A] text-xs font-bold tracking-wide uppercase mb-5">
            <Sparkles className="w-3.5 h-3.5 text-[#F2B544]" aria-hidden="true" />
            <span>India-Wide Multi-Modal Travel Platform</span>
          </div>

          {/* Main Headline */}
          <h1
            id="hero-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-[1.15]"
          >
            Discover India.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E65D36] via-[#F2B544] to-[#FFAA8A]">
              Plan Every Journey.
            </span>
          </h1>

          {/* Supporting Copy */}
          <p className="mt-4 text-base sm:text-lg text-[#C5B6AA] max-w-2xl leading-relaxed font-normal">
            Plan connected journeys across India with multi-modal recommendations, constraint validation, and disruption-aware alternatives.
          </p>

          {/* Factual capability indicators */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-6 text-xs text-[#E8DCD1] font-medium">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#247A50]" aria-hidden="true" />
              <span>Multi-Modal Legs (Auto • Bus • Train • Metro)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-[#F2B544]" aria-hidden="true" />
              <span>Hard Constraint Validation</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Navigation className="w-4 h-4 text-[#E65D36]" aria-hidden="true" />
              <span>Consent-Gated Simulated Booking</span>
            </div>
          </div>
        </div>

        {/* Journey Planner Embedded Card */}
        {children && (
          <div className="mt-8">
            {children}
          </div>
        )}
      </div>
    </section>
  );
}

export default Hero;