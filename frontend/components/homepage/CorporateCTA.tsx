"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Briefcase, Building2, Users, Shield, BarChart3, ArrowRight, Zap, CheckCircle2, X } from "lucide-react";

interface CorporateCTAProps {
  className?: string;
}

export function CorporateCTA({ className }: CorporateCTAProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section
        id="corporate"
        className={cn("relative overflow-hidden rounded-3xl bg-[#211C1A] text-white border border-[#4B3C35] shadow-xl my-8", className)}
        aria-labelledby="corporate-heading"
      >
        {/* Subtle warm glow background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#E65D36]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#F2B544]/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 py-14 sm:py-20 px-4 sm:px-6 lg:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E65D36]/20 border border-[#E65D36]/30 text-[#FFAA8A] text-xs font-bold tracking-wide uppercase mb-4">
              <Zap className="w-3.5 h-3.5 text-[#F2B544]" aria-hidden="true" />
              <span>Enterprise Mobility & Groups</span>
            </div>

            <h2
              id="corporate-heading"
              className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-4"
            >
              Multi-Leg Travel Management with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E65D36] to-[#F2B544]">
                Total Policy Control
              </span>
            </h2>

            <p className="text-[#C5B6AA] text-sm sm:text-base mb-8 max-w-2xl mx-auto leading-relaxed">
              Enforce per-trip budget ceilings, strict arrival deadlines, duty-of-care alerts, and transparent receipt reconciliation with the same deterministic graph engine.
            </p>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 text-left">
              {[
                { icon: Briefcase, title: "Travel Policies", desc: "Hard budget caps and arrival deadlines" },
                { icon: Users, title: "Team Delegations", desc: "Coordinated travel for conferences and field teams" },
                { icon: Shield, title: "Disruption Care", desc: "Alternative connections calculated automatically" },
                { icon: BarChart3, title: "Expense Audit", desc: "Exportable leg-by-leg GST-ready invoices" },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="p-4 rounded-xl bg-[#302724] border border-[#4B3C35] hover:border-[#E65D36]/50 transition-colors"
                >
                  <feature.icon className="w-5 h-5 text-[#F2B544] mb-2" aria-hidden="true" />
                  <h3 className="font-bold text-sm text-white mb-1">{feature.title}</h3>
                  <p className="text-xs text-[#C5B6AA]">{feature.desc}</p>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#E65D36] hover:bg-[#CC4827] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Building2 className="w-4 h-4" aria-hidden="true" />
                <span>Request Corporate Sandbox</span>
              </button>
              <a
                href="#planner"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#302724] hover:bg-[#3A302C] text-[#FFF7EF] border border-[#4B3C35] font-semibold text-sm transition-all flex items-center justify-center gap-2"
              >
                <span>Try Prototype Planner</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Corporate Sandbox Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="corporate-modal-title"
        >
          <div className="bg-[#FFFFFF] dark:bg-[#302724] text-[#302923] dark:text-[#FFF7EF] w-full max-w-md p-6 rounded-2xl border border-[#E8DCD1] dark:border-[#4B3C35] shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8DCD1] dark:border-[#4B3C35] pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#E65D36]" />
                <h3 id="corporate-modal-title" className="font-bold text-lg">Corporate Travel Sandbox</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-[#81756B] hover:text-[#302923] dark:hover:text-white"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-[#81756B] dark:text-[#C5B6AA] leading-relaxed">
              TBS RoamAgent Corporate provides API endpoints and batch itinerary generation for team travel coordinators. All routes are constraint-validated with automated disruption re-evaluation.
            </p>
            <div className="p-3 rounded-xl bg-[#F8EDE2] dark:bg-[#3A302C] border border-[#E8DCD1] dark:border-[#4B3C35] space-y-2 text-xs">
              <div className="flex items-center gap-2 text-[#247A50] font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Simulated Sandbox Environment Active</span>
              </div>
              <p className="text-[#81756B] dark:text-[#C5B6AA] text-[11px]">
                To integrate corporate travel into your company, contact: <span className="font-mono text-[#E65D36]">corporate@tbsroamagent.in</span>
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-[#E65D36] hover:bg-[#CC4827] text-white font-bold text-xs transition-colors"
            >
              Close Information
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default CorporateCTA;