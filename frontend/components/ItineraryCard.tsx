"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Separator } from "@/components/ui/Label";
import { cn, formatTime, formatCurrency, formatDuration } from "@/lib/utils";
import {
  Bus,
  Car,
  Train,
  Clock,
  ShieldCheck,
  ShieldAlert,
  Info,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Shield,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Itinerary, Leg, RiskLevel } from "@/lib/types";

interface ItineraryCardProps {
  itinerary: Itinerary;
  rankIndex: number;
  deadline: string;
  explanation?: string;
  onSelectBook: (itinerary: Itinerary) => void;
  isSelected?: boolean;
}

const getModeIcon = (mode: Leg["mode"]) => {
  switch (mode) {
    case "bus":
      return <Bus className="w-4 h-4 text-emerald-400 stroke-[2.2]" aria-hidden="true" />;
    case "metro":
      return <Train className="w-4 h-4 text-violet-400 stroke-[2.2]" aria-hidden="true" />;
    case "cab":
    case "auto":
      return <Car className="w-4 h-4 text-amber-400 stroke-[2.2]" aria-hidden="true" />;
    default:
      return <Bus className="w-4 h-4 text-neutral-400" aria-hidden="true" />;
  }
};

const getModeBg = (mode: Leg["mode"]) => {
  switch (mode) {
    case "bus":
      return "bg-emerald-500/10 border-emerald-500/30 text-emerald-400";
    case "metro":
      return "bg-violet-500/10 border-violet-500/30 text-violet-400";
    case "cab":
    case "auto":
      return "bg-amber-500/10 border-amber-500/30 text-amber-400";
    default:
      return "bg-neutral-800 border-neutral-700 text-neutral-400";
  }
};

const getRiskBadge = (risk: RiskLevel, val: number, showRiskInfo: boolean, setShowRiskInfo: (v: boolean) => void) => {
  let colorClass = "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
  let Icon = ShieldCheck;
  let riskLabel = "Low Delay Risk";
  if (risk === "Medium") {
    colorClass = "bg-amber-500/10 text-amber-400 border-amber-500/30";
    Icon = ShieldAlert;
    riskLabel = "Medium Delay Risk";
  } else if (risk === "High") {
    colorClass = "bg-red-500/10 text-red-400 border-red-500/30";
    Icon = ShieldAlert;
    riskLabel = "High Delay Risk";
  }

  return (
    <div className="relative inline-block">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="button"
        onClick={() => setShowRiskInfo(!showRiskInfo)}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${colorClass} transition-colors cursor-pointer`}
        title="Click to view risk formula"
        aria-expanded={showRiskInfo}
        aria-controls="risk-tooltip"
      >
        <Icon className="w-3.5 h-3.5" aria-hidden="true" />
        <span>{riskLabel} ({val.toFixed(1)}x)</span>
        <Info className="w-3 h-3 opacity-70 hover:opacity-100 ml-0.5" aria-hidden="true" />
      </motion.button>

      <AnimatePresence>
        {showRiskInfo && (
          <motion.div
            id="risk-tooltip"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 z-[100] w-80 glass-card p-4 rounded-xl shadow-elevated text-[11px] text-neutral-300 animate-fade-in border border-neutral-800"
            role="tooltip"
          >
            <p className="font-bold text-neutral-50 mb-2 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-400" aria-hidden="true" />
              <span>Delay Risk Assessment</span>
            </p>
            <p className="font-mono text-emerald-400 text-[10px] bg-neutral-950 p-2 rounded-lg border border-neutral-800 mb-3 font-semibold">
              ratio = buffer_min / typical_delay_min
            </p>
            <ul className="text-[10px] space-y-1.5 text-neutral-400">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" aria-hidden="true" />
                <span><strong>Low (≥2.0x):</strong> Robust buffer, low probability of missed connection.</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" aria-hidden="true" />
                <span><strong>Medium (1.0–2.0x):</strong> Moderate buffer covers nominal delays.</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" aria-hidden="true" />
                <span><strong>High (&lt;1.0x):</strong> Transfer margin tighter than typical operator delay.</span>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export function ItineraryCard({
  itinerary,
  rankIndex,
  deadline,
  explanation,
  onSelectBook,
  isSelected = false,
}: ItineraryCardProps) {
  const [showRiskInfo, setShowRiskInfo] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const isTopPick = rankIndex === 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rankIndex * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "relative rounded-2xl overflow-hidden transition-all duration-300 flex flex-col",
        isTopPick ? "glass-elevated ring-1 ring-emerald-500/30" : "glass-card",
        isSelected && "ring-2 ring-emerald-400/60 shadow-[0_0_30px_rgba(16,185,129,0.2)]",
        !isSelected && !isTopPick && "hover:border-neutral-700 hover:shadow-card-hover hover:-translate-y-0.5"
      )}
      style={{ willChange: "transform, box-shadow, border-color" }}
    >
      {/* Top Pick Banner */}
      {isTopPick && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 20 }}
          className="absolute -top-2.5 left-6 z-10 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 text-neutral-950 text-[10px] font-extrabold uppercase tracking-wider shadow-glow-brand flex items-center gap-1 ring-1 ring-white/20"
        >
          <Sparkles className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
          <span>Top Recommendation</span>
        </motion.div>
      )}

      <div className={cn("p-5 sm:p-6 flex flex-col flex-1", isTopPick && "pt-6")}>
        {/* Card Header */}
        <div className={cn("flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-neutral-800", isTopPick && "pt-2")}>
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 20 }}
              className={cn(
                "w-8 h-8 rounded-xl font-mono text-xs font-bold flex items-center justify-center shadow-inner",
                isTopPick
                  ? "bg-emerald-400 text-neutral-950 font-extrabold shadow-glow-brand"
                  : "bg-neutral-900/80 text-emerald-400 border border-emerald-500/30"
              )}
            >
              #{rankIndex + 1}
            </motion.div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-50 tracking-tight">
                {isTopPick ? "Top Recommended Route" : "Alternative Option"}
              </h3>
              <p className="text-[11px] text-neutral-400 font-medium mt-0.5">
                {itinerary.legs.length} Multi-Modal Legs Connected
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" size="sm" className="hidden sm:inline-flex">
              SIMULATED
            </Badge>
            {getRiskBadge(itinerary.risk_label, itinerary.risk_value, showRiskInfo, setShowRiskInfo)}
          </div>
        </div>

        {/* Multi-Leg Visual Journey Timeline */}
        <div className="my-5 space-y-4">
          {itinerary.legs.map((leg, idx) => (
            <motion.div
              key={leg.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + idx * 0.08, duration: 0.3 }}
              className="relative"
            >
              {/* Vertical transit track connector */}
              {idx < itinerary.legs.length - 1 && (
                <div className="absolute left-[17px] top-[36px] bottom-[-20px] w-[2px] bg-gradient-to-b from-neutral-700/50 via-neutral-800 to-transparent z-0" />
              )}

              <div className="flex items-start gap-4 relative z-10">
                {/* Mode glyph */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 3 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className={cn("w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 mt-0.5", getModeBg(leg.mode))}
                >
                  {getModeIcon(leg.mode)}
                </motion.div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-semibold text-neutral-50 truncate">
                      {leg.operator}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-emerald-400 shrink-0">
                      {formatCurrency(leg.fare)} <span className="text-[10px] text-neutral-400 font-normal">{leg.per_vehicle ? "(vehicle)" : "(per pax)"}</span>
                    </span>
                  </div>

                  <div className="text-[11px] text-neutral-300 mt-1.5 flex flex-wrap items-center justify-between gap-2">
                    <span className="font-medium flex items-center gap-1.5">
                      <span className="font-mono font-semibold text-neutral-50">{formatTime(leg.dep)}</span>
                      <span className="text-neutral-400 truncate max-w-[140px] sm:max-w-[180px]">{leg.from_node}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-neutral-600 shrink-0" aria-hidden="true" />
                      <span className="font-mono font-semibold text-neutral-50">{formatTime(leg.arr)}</span>
                      <span className="text-neutral-400 truncate max-w-[140px] sm:max-w-[180px]">{leg.to_node}</span>
                    </span>

                    {leg.accessible && (
                      <Badge variant="info" size="sm" className="gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" aria-hidden="true" />
                        Accessible
                      </Badge>
                    )}
                  </div>

                  {/* Transfer Layover Pill */}
                  {idx < itinerary.buffers.length && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-2.5 ml-1 text-[10px] font-medium text-neutral-300 bg-neutral-900/50 border border-neutral-800 rounded-lg px-2.5 py-1.5 inline-flex items-center gap-1.5"
                    >
                      <Clock className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                      <span>{itinerary.buffers[idx]} min transfer buffer</span>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Journey Precision Scorecard */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-3 py-4 px-4 bg-neutral-900/50 border border-neutral-800 rounded-xl text-center text-xs mb-4"
        >
          <div className="border-r border-neutral-800 pr-2">
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold block mb-1">
              Total Fare
            </span>
            <span className="font-mono font-black text-neutral-50 text-lg">
              {formatCurrency(itinerary.total_cost)}
            </span>
          </div>
          <div className="border-r border-neutral-800 pr-2">
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold block mb-1">
              Duration
            </span>
            <span className="font-mono font-bold text-neutral-300 text-sm">
              {formatDuration(itinerary.total_duration_min)}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold block mb-1">
              Reaches By
            </span>
            <span className="font-mono font-bold text-emerald-400 text-sm">
              {formatTime(itinerary.arrival)} <span className="text-[10px] text-neutral-400 font-normal">(≤ {formatTime(deadline)})</span>
            </span>
          </div>
        </motion.div>

        {/* Expandable Explanation Panel */}
        <AnimatePresence>
          {(explanation || expanded) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-xl mb-4 text-xs text-emerald-100/90 leading-relaxed flex items-start gap-2.5 shadow-[inset_0_1px_0_0_rgba(16,185,129,0.1)]"
            >
              <div className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-emerald-300 text-[11px] mb-1.5 uppercase tracking-wide">
                  Why this works:
                </p>
                <p className="text-emerald-100 font-medium leading-normal">{explanation || "Tap to expand for details"}</p>
              </div>
              {!explanation && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={() => setExpanded(true)}
                  className="text-emerald-400 hover:text-emerald-300 font-medium text-sm p-1"
                  aria-label="Show explanation"
                >
                  <ChevronDown className="w-4 h-4" aria-hidden="true" />
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Deck */}
        <div className="pt-3 border-t border-neutral-800 flex items-center justify-between gap-3">
          <span className="text-[10px] text-neutral-400 font-mono">
            Data: {itinerary.data_freshness.slice(0, 10)}
          </span>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => onSelectBook(itinerary)}
            className="group relative flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 hover:from-emerald-400 hover:to-teal-400 text-neutral-950 text-xs font-black rounded-xl shadow-glow-brand ring-1 ring-white/20 transition-all duration-200 min-h-[44px]"
          >
            <motion.div
              whileHover={{ scale: 1.15 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
            </motion.div>
            <span>Book with Consent</span>
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}