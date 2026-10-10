"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Badge } from "@/components/ui/Badge";
import { Separator } from "@/components/ui/Label";
import { cn, formatCurrency, formatTime } from "@/lib/utils";
import {
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  Clock,
  AlertTriangle,
  Ban,
  X,
  ChevronRight,
} from "lucide-react";
import { RejectedCandidate } from "@/lib/types";

interface RejectedCollapsibleProps {
  rejected: RejectedCandidate[];
}

const getRejectionIcon = (reason: RejectedCandidate["rejection_reason"]) => {
  switch (reason) {
    case "deadline_missed":
      return <Clock className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />;
    case "budget_exceeded":
      return <AlertTriangle className="w-3.5 h-3.5 text-red-400" aria-hidden="true" />;
    case "constraint_violation":
      return <Ban className="w-3.5 h-3.5 text-red-400" aria-hidden="true" />;
    case "no_connection":
      return <X className="w-3.5 h-3.5 text-neutral-400" aria-hidden="true" />;
    default:
      return <ShieldAlert className="w-3.5 h-3.5 text-neutral-400" aria-hidden="true" />;
  }
};

const getRejectionLabel = (reason: RejectedCandidate["rejection_reason"]) => {
  switch (reason) {
    case "deadline_missed":
      return "Missed Deadline";
    case "budget_exceeded":
      return "Over Budget";
    case "constraint_violation":
      return "Constraint Violation";
    case "no_connection":
      return "No Connection";
    default:
      return "Rejected";
  }
};

const getRejectionBadgeVariant = (reason: RejectedCandidate["rejection_reason"]) => {
  switch (reason) {
    case "deadline_missed":
      return "warning";
    case "budget_exceeded":
      return "danger";
    case "constraint_violation":
      return "danger";
    case "no_connection":
      return "outline";
    default:
      return "default";
  }
};

export function RejectedCollapsible({ rejected }: RejectedCollapsibleProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.section
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="glass-card rounded-2xl p-5 shadow-card border border-neutral-800"
      aria-labelledby="rejected-heading"
    >
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between gap-3 pb-3 border-b border-neutral-800"
        aria-expanded={expanded}
        aria-controls="rejected-panel"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-red-500/15 border border-red-500/30 text-red-400">
            <ShieldAlert className="w-4 h-4" aria-hidden="true" />
          </div>
          <div>
            <h2 id="rejected-heading" className="font-display font-semibold text-base tracking-tight text-neutral-50">
              Rejected Options
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              {rejected.length} candidate{rejected.length !== 1 ? "s" : ""} did not meet constraints
            </p>
          </div>
        </div>

        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="flex items-center gap-1.5 text-neutral-400 text-xs font-medium"
        >
          <span className="hidden sm:inline">{expanded ? "Show less" : "Show all"}</span>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 space-y-3"
          >
            {rejected.map((cand, idx) => (
              <motion.div
                key={cand.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * idx }}
                className="p-4 bg-neutral-900/50 border border-neutral-800 rounded-xl space-y-3"
              >
                {/* Header */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className={cn(
                      "w-7 h-7 rounded-xl font-mono text-xs font-bold flex items-center justify-center shadow-inner",
                      idx === 0
                        ? "bg-red-500/20 text-red-400 border border-red-500/30"
                        : "bg-neutral-900/80 text-neutral-400 border border-neutral-700"
                    )}>
                      #{idx + 1}
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-50 tracking-tight">
                        {cand.itinerary.legs.map((l) => l.operator).join(" + ")}
                      </h3>
                      <p className="text-[10px] text-neutral-400 font-medium">
                        {cand.itinerary.legs.length} legs • {formatCurrency(cand.itinerary.total_cost)} • {formatTime(cand.itinerary.arrival)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant={getRejectionBadgeVariant(cand.rejection_reason)} size="sm" dot>
                      {getRejectionLabel(cand.rejection_reason)}
                    </Badge>
                    <span className="text-[10px] font-mono text-neutral-400">
                      Risk: {cand.itinerary.risk_label} ({cand.itinerary.risk_value.toFixed(1)}x)
                    </span>
                  </div>
                </div>

                {/* Legs */}
                <div className="space-y-2 ml-9 border-l border-neutral-800 pl-3">
                  {cand.itinerary.legs.map((leg, legIdx) => (
                    <div key={leg.id} className="flex items-center gap-2 text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-700 flex-shrink-0 mt-1" aria-hidden="true" />
                      <span className="font-mono font-semibold text-neutral-50 text-[11px]">{formatTime(leg.dep)}</span>
                      <span className="text-neutral-400 truncate max-w-[120px]">{leg.from_node}</span>
                      <ChevronRight className="w-3 h-3 text-neutral-600 shrink-0" aria-hidden="true" />
                      <span className="font-mono font-semibold text-neutral-50 text-[11px]">{formatTime(leg.arr)}</span>
                      <span className="text-neutral-400 truncate max-w-[120px]">{leg.to_node}</span>
                      <span className="text-neutral-500 text-[10px] ml-auto">({leg.mode})</span>
                    </div>
                  ))}
                </div>

                {/* Rejection Details */}
                <div className="pt-2 border-t border-neutral-800">
                  <p className="text-[11px] text-neutral-300 leading-relaxed">
                    {cand.rejection_detail}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}