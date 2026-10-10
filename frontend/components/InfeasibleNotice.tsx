"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Separator } from "@/components/ui/Label";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  ShieldAlert,
  AlertTriangle,
  Ban,
  X,
  Clock,
  IndianRupee,
  RotateCcw,
  Info,
} from "lucide-react";

interface InfeasibleNoticeProps {
  notes: string[];
  onRelaxDeadline: () => void;
  onRelaxBudget: () => void;
}

export function InfeasibleNotice({
  notes,
  onRelaxDeadline,
  onRelaxBudget,
}: InfeasibleNoticeProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="glass-card rounded-2xl p-6 shadow-card border border-red-500/30 space-y-4"
      role="alert"
      aria-live="assertive"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="flex items-start gap-3"
      >
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-12 h-12 rounded-2xl bg-red-500/15 text-red-400 border border-red-500/30 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(239,68,68,0.2)]"
          aria-hidden="true"
        >
          <ShieldAlert className="w-6 h-6" />
        </motion.div>
        <div className="flex-1">
          <h2 className="font-display font-bold text-lg sm:text-xl tracking-tight text-neutral-50">
            No Feasible Itinerary Found
          </h2>
          <p className="text-neutral-400 text-sm mt-1">
            The current constraints are too strict for any valid multi-leg journey.
          </p>
        </div>
      </motion.div>

      {/* Constraint Violations */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-neutral-900/50 p-4 rounded-xl border border-neutral-800 space-y-2"
      >
        <p className="font-semibold text-neutral-200 text-xs tracking-tight flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-red-400" aria-hidden="true" />
          Violated Constraints
        </p>
        <ul className="space-y-1.5 text-sm text-neutral-300">
          {notes.map((note, idx) => (
            <motion.li
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * idx }}
              className="flex items-start gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0 mt-1.5" aria-hidden="true" />
              <span>{note}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* Quick Fix Actions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex flex-wrap items-center gap-3 pt-2"
      >
        <span className="text-xs text-neutral-500 font-medium uppercase tracking-wide">Quick fixes:</span>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={onRelaxDeadline}
          className="group flex items-center gap-2 px-4 py-2 bg-neutral-900/50 hover:bg-neutral-800 border border-neutral-800 hover:border-amber-500/40 text-neutral-300 hover:text-neutral-50 rounded-xl text-xs font-semibold transition-colors"
        >
          <Clock className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" aria-hidden="true" />
          <span>Extend Deadline +1hr</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={onRelaxBudget}
          className="group flex items-center gap-2 px-4 py-2 bg-neutral-900/50 hover:bg-neutral-800 border border-neutral-800 hover:border-emerald-500/40 text-neutral-300 hover:text-neutral-50 rounded-xl text-xs font-semibold transition-colors"
        >
          <IndianRupee className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" aria-hidden="true" />
          <span>Remove Budget Limit</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={onRelaxDeadline}
          className="group flex items-center gap-2 px-4 py-2 bg-neutral-900/50 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-neutral-50 rounded-xl text-xs font-semibold transition-colors"
        >
          <RotateCcw className="w-4 h-4 text-neutral-400 group-hover:scale-110 transition-transform" aria-hidden="true" />
          <span>Reset All Constraints</span>
        </motion.button>
      </motion.div>

      {/* Guidance */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-4 bg-neutral-900/50 rounded-xl border border-neutral-800"
      >
        <p className="font-semibold text-neutral-200 text-xs tracking-tight mb-2 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
          How the deterministic engine works
        </p>
        <ul className="space-y-1.5 text-[11px] text-neutral-400">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 shrink-0 mt-1" aria-hidden="true" />
            <span>All schedules, fares, and transfer times are pre-computed from static GTFS data.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 shrink-0 mt-1" aria-hidden="true" />
            <span>No LLM hallucination possible — every candidate is validated against hard constraints.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 shrink-0 mt-1" aria-hidden="true" />
            <span>If no route exists, it truly does not exist in the current network snapshot.</span>
          </li>
        </ul>
      </motion.div>
    </motion.section>
  );
}

import React from "react";