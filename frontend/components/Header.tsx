"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import {
  Bus,
  Globe,
  BarChart3,
  Cpu,
  SlidersHorizontal,
  ChevronDown,
  Navigation,
  Compass,
  MapPin,
  HelpCircle,
} from "lucide-react";
import { RankMode } from "@/lib/types";

interface HeaderProps {
  lang: "en" | "te";
  onToggleLang: () => void;
  rankMode: RankMode;
  onRankModeChange: (mode: RankMode) => void;
  llmAvailable: boolean;
  onOpenMetrics: () => void;
}

const RANK_MODES: { value: RankMode; label: string; icon: string }[] = [
  { value: "balanced", label: "Balanced", icon: "⚖️" },
  { value: "cheapest", label: "Cheapest", icon: "🏷️" },
  { value: "fastest", label: "Fastest", icon: "⚡" },
  { value: "safest", label: "Safest Buffer", icon: "🛡️" },
];

export function Header({
  lang,
  onToggleLang,
  rankMode,
  onRankModeChange,
  llmAvailable,
  onOpenMetrics,
}: HeaderProps) {
  const [isRankOpen, setIsRankOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isRankOpen && !(e.target as HTMLElement).closest("[data-rank-dropdown]")) {
        setIsRankOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isRankOpen]);

  return (
    <header
      className="sticky top-0 z-[200] bg-[#FFF8F1]/95 dark:bg-[#211C1A]/95 backdrop-blur-xl border-b border-[#E8DCD1] dark:border-[#4B3C35] shadow-sm transition-colors"
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          {/* Brand Identity */}
          <a
            href="#planner"
            className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E65D36] rounded-xl p-1"
            aria-label="TBS RoamAgent Homepage"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E65D36] to-[#CC4827] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Bus className="w-5 h-5 stroke-[2.2]" aria-hidden="true" />
            </div>

            <div>
              <div className="font-extrabold text-base sm:text-lg tracking-tight text-[#302923] dark:text-[#FFF7EF] flex items-center gap-1.5">
                <span>TBS RoamAgent</span>
                <span className="hidden sm:inline-block px-1.5 py-0.2 bg-[#F2B544]/20 text-[#A96512] dark:text-[#F2B544] text-[10px] font-bold rounded">
                  India
                </span>
              </div>
              <div className="text-[10px] font-mono font-medium uppercase tracking-wider text-[#81756B] dark:text-[#C5B6AA]">
                Multi-Modal Travel Engine
              </div>
            </div>
          </a>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-semibold" aria-label="Main Navigation">
            <a
              href="#planner"
              className="px-3 py-1.5 rounded-lg text-[#302923] dark:text-[#FFF7EF] hover:bg-[#F8EDE2] dark:hover:bg-[#302724] hover:text-[#E65D36] transition-colors"
            >
              Trip Planner
            </a>
            <a
              href="#routes"
              className="px-3 py-1.5 rounded-lg text-[#81756B] dark:text-[#C5B6AA] hover:bg-[#F8EDE2] dark:hover:bg-[#302724] hover:text-[#E65D36] transition-colors"
            >
              Popular Routes
            </a>
            <a
              href="#explore"
              className="px-3 py-1.5 rounded-lg text-[#81756B] dark:text-[#C5B6AA] hover:bg-[#F8EDE2] dark:hover:bg-[#302724] hover:text-[#E65D36] transition-colors"
            >
              Explore India
            </a>
            <a
              href="#how-it-works"
              className="px-3 py-1.5 rounded-lg text-[#81756B] dark:text-[#C5B6AA] hover:bg-[#F8EDE2] dark:hover:bg-[#302724] hover:text-[#E65D36] transition-colors"
            >
              How It Works
            </a>
          </nav>

          {/* Action Controls Deck */}
          <div className="flex items-center gap-2">
            {/* Engine Status Indicator */}
            <div
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FFFFFF] dark:bg-[#302724] border border-[#E8DCD1] dark:border-[#4B3C35] text-[11px] font-medium"
              title={llmAvailable ? "Hybrid LLM + Deterministic Validator Active" : "Pure Deterministic Engine Active"}
            >
              {llmAvailable ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-[#247A50] animate-pulse" aria-hidden="true" />
                  <span className="text-[#247A50] font-bold">Hybrid LLM</span>
                </>
              ) : (
                <>
                  <Cpu className="w-3.5 h-3.5 text-[#A96512]" aria-hidden="true" />
                  <span className="text-[#A96512] font-semibold">Deterministic</span>
                </>
              )}
            </div>

            {/* Ranking Mode Selector */}
            <div className="relative" data-rank-dropdown>
              <button
                type="button"
                onClick={() => setIsRankOpen(!isRankOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFFFFF] dark:bg-[#302724] border border-[#E8DCD1] dark:border-[#4B3C35] text-xs font-semibold text-[#302923] dark:text-[#FFF7EF] hover:border-[#E65D36]/50 transition-colors"
                aria-haspopup="listbox"
                aria-expanded={isRankOpen}
                aria-label="Select itinerary ranking mode"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#E65D36]" aria-hidden="true" />
                <span className="hidden sm:inline">{RANK_MODES.find((m) => m.value === rankMode)?.label}</span>
                <ChevronDown className={cn("w-3 h-3 text-[#81756B] transition-transform", isRankOpen && "rotate-180")} aria-hidden="true" />
              </button>

              <AnimatePresence>
                {isRankOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-1.5 w-44 rounded-xl bg-[#FFFFFF] dark:bg-[#302724] border border-[#E8DCD1] dark:border-[#4B3C35] shadow-lg overflow-hidden z-50 p-1"
                    role="listbox"
                  >
                    {RANK_MODES.map((mode) => (
                      <button
                        key={mode.value}
                        type="button"
                        onClick={() => {
                          onRankModeChange(mode.value);
                          setIsRankOpen(false);
                        }}
                        className={cn(
                          "w-full px-3 py-2 text-left text-xs font-semibold rounded-lg transition-colors flex items-center justify-between",
                          rankMode === mode.value
                            ? "bg-[#FFEFE6] dark:bg-[#3A302C] text-[#E65D36]"
                            : "text-[#302923] dark:text-[#FFF7EF] hover:bg-[#F8EDE2] dark:hover:bg-[#3A302C]"
                        )}
                        role="option"
                        aria-selected={rankMode === mode.value}
                      >
                        <span className="flex items-center gap-2">
                          <span aria-hidden="true">{mode.icon}</span>
                          <span>{mode.label}</span>
                        </span>
                        {rankMode === mode.value && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#E65D36]" />
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Language Switcher */}
            <button
              type="button"
              onClick={onToggleLang}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#FFFFFF] dark:bg-[#302724] border border-[#E8DCD1] dark:border-[#4B3C35] text-xs font-semibold text-[#302923] dark:text-[#FFF7EF] hover:border-[#E65D36]/50 transition-colors"
              aria-label={`Switch language to ${lang === "en" ? "Telugu" : "English"}`}
            >
              <Globe className="w-3.5 h-3.5 text-[#E65D36]" aria-hidden="true" />
              <span>{lang === "en" ? "English" : "తెలుగు"}</span>
            </button>

            {/* Benchmark Drawer Trigger */}
            <button
              type="button"
              onClick={onOpenMetrics}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E65D36] hover:bg-[#CC4827] text-white text-xs font-bold shadow-sm transition-all"
              aria-label="View system benchmark metrics"
            >
              <BarChart3 className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Benchmarks</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;