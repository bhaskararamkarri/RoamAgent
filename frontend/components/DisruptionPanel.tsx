"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Separator } from "@/components/ui/Label";
import { Select } from "@/components/ui/Input";
import { cn, formatCurrency } from "@/lib/utils";
import {
  Zap,
  X,
  AlertTriangle,
  Clock,
  Ban,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Radio,
  ChevronRight,
} from "lucide-react";
import {
  DisruptionEvent,
  DisruptionType,
  Itinerary,
  DisruptResponse,
} from "@/lib/types";

interface DisruptionPanelProps {
  isOpen: boolean;
  onClose: () => void;
  bookedItinerary: Itinerary;
  onInjectDisruption: (event: DisruptionEvent) => Promise<void>;
  disruptResponse: DisruptResponse | null;
  onSelectAlternative: (itinerary: Itinerary) => void;
  loading: boolean;
}

export function DisruptionPanel({
  isOpen,
  onClose,
  bookedItinerary,
  onInjectDisruption,
  disruptResponse,
  onSelectAlternative,
  loading,
}: DisruptionPanelProps) {
  const [selectedLegId, setSelectedLegId] = useState<string>(
    bookedItinerary.legs.find((l) => l.mode === "bus")?.id || bookedItinerary.legs[0]?.id || ""
  );

  const handleTrigger = (type: DisruptionType, minutes?: number) => {
    onInjectDisruption({
      type,
      leg_id: selectedLegId,
      minutes: minutes ?? null,
    });
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[500] flex items-center justify-end p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="disruption-panel-title"
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        aria-hidden="true"
      />

      {/* Panel */}
      <motion.div
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="glass-elevated w-full sm:max-w-xl h-full sm:h-auto sm:max-h-[92vh] rounded-2xl sm:rounded-2xl shadow-modal flex flex-col overflow-hidden border border-neutral-800"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/50"
        >
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 20 }}
              className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.2)]"
              aria-hidden="true"
            >
              <Zap className="w-5 h-5 stroke-[2.2]" />
            </motion.div>
            <div>
              <h2 id="disruption-panel-title" className="font-display font-bold text-lg tracking-tight text-neutral-50">
                Disruption & Re-planning Engine
              </h2>
              <p className="text-[11px] text-neutral-400 font-medium mt-0.5">
                Inject disruptions into your trip and evaluate dynamic alternatives
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
            aria-label="Close disruption simulator"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </motion.button>
        </motion.div>

        {/* Body */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 sm:p-6 overflow-y-auto space-y-6 text-xs flex-1"
        >
          {/* Step 1: Pick a leg */}
          <div className="space-y-2">
            <label htmlFor="leg-select" className="font-semibold text-neutral-200 block text-xs tracking-tight">
              1. Select Affected Journey Leg
            </label>
            <div className="bg-neutral-900/50 p-1 rounded-xl border border-neutral-800">
              <Select
                id="leg-select"
                value={selectedLegId}
                onChange={(e) => setSelectedLegId(e.target.value)}
                options={bookedItinerary.legs.map((leg) => ({
                  value: leg.id,
                  label: `${leg.operator} (${leg.mode}: ${leg.from_node} → ${leg.to_node})`,
                }))}
                placeholder="Select leg..."
                className="w-full text-sm"
              />
            </div>
          </div>

          {/* Step 2: Inject Disruption Action */}
          <div className="space-y-3 pt-4 border-t border-neutral-800">
            <span className="font-semibold text-neutral-200 block text-xs tracking-tight">
              2. Inject Disruption Event
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                disabled={loading}
                onClick={() => handleTrigger("DELAY", 30)}
                className="p-3 bg-neutral-900/50 hover:bg-neutral-800 border border-neutral-800 hover:border-amber-500/40 text-neutral-200 hover:text-neutral-50 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <Clock className="w-4 h-4 text-amber-400" aria-hidden="true" />
                <span>Delay +30m</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                disabled={loading}
                onClick={() => handleTrigger("DELAY", 60)}
                className="p-3 bg-neutral-900/50 hover:bg-neutral-800 border border-neutral-800 hover:border-amber-500/40 text-neutral-200 hover:text-neutral-50 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <Clock className="w-4 h-4 text-amber-400" aria-hidden="true" />
                <span>Delay +60m</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                disabled={loading}
                onClick={() => handleTrigger("DELAY", 120)}
                className="p-3 bg-red-500/10 hover:bg-red-500/15 border border-red-500/30 hover:border-red-500/50 text-red-300 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <Clock className="w-4 h-4 text-red-400" aria-hidden="true" />
                <span>Delay +120m</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                disabled={loading}
                onClick={() => handleTrigger("CANCEL")}
                className="p-3 bg-red-500/15 hover:bg-red-500/20 border border-red-500/40 text-red-200 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <Ban className="w-4 h-4 text-red-400" aria-hidden="true" />
                <span>Cancel Bus</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                disabled={loading}
                onClick={() => handleTrigger("MISSED_CONNECTION")}
                className="p-3 bg-neutral-900/50 hover:bg-neutral-800 border border-neutral-800 hover:border-amber-500/40 text-neutral-200 hover:text-neutral-50 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <AlertTriangle className="w-4 h-4 text-amber-400" aria-hidden="true" />
                <span>Missed Transfer</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                disabled={loading}
                onClick={() => handleTrigger("LOCAL_UNAVAILABLE")}
                className="p-3 bg-neutral-900/50 hover:bg-neutral-800 border border-neutral-800 hover:border-amber-500/40 text-neutral-200 hover:text-neutral-50 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <Ban className="w-4 h-4 text-amber-400" aria-hidden="true" />
                <span>Local Ride Down</span>
              </motion.button>
            </div>
          </div>

          {/* Step 3: Disruption Result and Notifications */}
          <AnimatePresence mode="wait">
            {disruptResponse && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-4 pt-4 border-t border-neutral-800"
              >
                {/* Notification feed entry */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="p-4 bg-amber-950/30 border border-amber-500/30 rounded-xl flex items-start gap-3 text-xs text-amber-200 shadow-md"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="p-1.5 rounded-lg bg-amber-500/15 text-amber-400 shrink-0 mt-0.5"
                    aria-hidden="true"
                  >
                    <Radio className="w-4 h-4" />
                  </motion.div>
                  <div>
                    <p className="font-bold text-amber-300 uppercase tracking-wide text-[10px] mb-0.5">
                      Live Incident Notification
                    </p>
                    <p className="text-amber-100 font-medium text-xs mt-0.5">
                      {disruptResponse.notification.message}
                    </p>
                    <span className="text-[10px] text-amber-400/80 block mt-1 font-mono">
                      Logged: {disruptResponse.notification.ts}
                    </span>
                  </div>
                </motion.div>

                {/* Feasible Alternatives */}
                {disruptResponse.alternatives.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-3"
                  >
                    <p className="font-bold text-neutral-50 text-xs flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                      <span>Feasible Re-planned Alternatives ({disruptResponse.alternatives.length})</span>
                    </p>

                    <div className="space-y-3">
                      {disruptResponse.alternatives.slice(0, 3).map((alt, idx) => (
                        <motion.div
                          key={alt.itinerary.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.05 * idx }}
                          className="p-4 bg-neutral-900/50 border border-neutral-800 rounded-xl space-y-3 hover:border-emerald-500/30 transition-colors"
                        >
                          {/* Alternative Header */}
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-neutral-50 text-base">
                              Option {idx + 1}: {alt.itinerary.legs.map((l) => l.operator).join(" + ")}
                            </span>
                            <span className="font-mono font-black text-emerald-400 text-sm">
                              {formatCurrency(alt.itinerary.total_cost)}
                            </span>
                          </div>

                          {/* Diff vs Booked Badges */}
                          <div className="flex flex-wrap items-center gap-2 text-[10px]">
                            <Badge variant={alt.diff_vs_booked.cost_delta >= 0 ? "warning" : "success"} size="sm">
                              Fare: {alt.diff_vs_booked.cost_delta >= 0 ? `+${formatCurrency(alt.diff_vs_booked.cost_delta)}` : `-${formatCurrency(Math.abs(alt.diff_vs_booked.cost_delta))}`}
                            </Badge>
                            <Badge variant={alt.diff_vs_booked.arrival_delta_min >= 0 ? "warning" : "success"} size="sm">
                              Arrival: {alt.diff_vs_booked.arrival_delta_min >= 0 ? `+${alt.diff_vs_booked.arrival_delta_min}m` : `${alt.diff_vs_booked.arrival_delta_min}m`}
                            </Badge>
                            <Badge variant="success" size="sm" dot>
                              Risk: {alt.diff_vs_booked.risk_change}
                            </Badge>
                          </div>

                          <p className="text-[11px] text-neutral-400 leading-relaxed">
                            {alt.why_feasible}
                          </p>

                          <div className="pt-1 flex justify-end">
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => onSelectAlternative(alt.itinerary)}
                              className="gap-2"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" />
                              <span>Switch to This (Requires Approval)</span>
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* No Alternative Info */}
                {disruptResponse.no_alternative_info && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-500/15 border border-red-500/40 rounded-xl space-y-3 text-xs shadow-md"
                  >
                    <div className="flex items-start gap-2.5 text-red-300">
                      <Ban className="w-4 h-4 shrink-0 mt-0.5 text-red-400" aria-hidden="true" />
                      <div>
                        <p className="font-bold text-red-200 text-xs mb-1">
                          {disruptResponse.no_alternative_info.message}
                        </p>
                        <p className="text-[11px] text-red-400/90">
                          Violated Constraint: {disruptResponse.no_alternative_info.violated_constraint}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1 text-[11px] text-neutral-300">
                      <p className="font-bold text-neutral-50">Suggested Adjustments:</p>
                      <ul className="list-disc list-inside space-y-0.5 text-neutral-400">
                        {disruptResponse.no_alternative_info.suggestions.map((s, sIdx) => (
                          <li key={sIdx}>{s}</li>
                        ))}
                      </ul>
                    </div>

                    <p className="text-[10px] text-neutral-400 border-t border-red-900/40 pt-2 italic">
                      {disruptResponse.no_alternative_info.disclaimer}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

import React from "react";