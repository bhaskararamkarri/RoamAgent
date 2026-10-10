"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Separator } from "@/components/ui/Label";
import { cn, formatCurrency, formatTime } from "@/lib/utils";
import {
  ShieldCheck,
  X,
  Check,
  AlertCircle,
  Info,
  Lock,
  ArrowRight,
  Shield,
  ChevronRight,
} from "lucide-react";
import { Itinerary } from "@/lib/types";

interface ConsentModalProps {
  isOpen: boolean;
  itinerary: Itinerary | null;
  onClose: () => void;
  onApprove: (itinerary: Itinerary) => Promise<void>;
  loading: boolean;
  actionTitle?: string;
}

export function ConsentModal({
  isOpen,
  itinerary,
  onClose,
  onApprove,
  loading,
  actionTitle = "Review & Approve Booking",
}: ConsentModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !loading) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, loading, onClose]);

  if (!isOpen || !itinerary) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[500] flex items-center justify-center p-4 sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="consent-modal-title"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-0"
          aria-hidden="true"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative z-10 glass-elevated w-full max-w-xl rounded-2xl shadow-modal overflow-hidden flex flex-col max-h-[92vh] border border-neutral-800"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="p-5 sm:p-6 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/50"
          >
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 20 }}
                className="relative"
              >
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-glow-brand">
                  <ShieldCheck className="w-5 h-5 stroke-[2.2]" aria-hidden="true" />
                </div>
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
              </motion.div>
              <div>
                <h2 id="consent-modal-title" className="font-display font-bold text-lg sm:text-xl tracking-tight text-neutral-50">
                  {actionTitle}
                </h2>
                <p className="text-[11px] text-neutral-400 font-medium mt-0.5">
                  Explicit User Authorization Gate
                </p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={onClose}
              disabled={loading}
              className="p-2 rounded-xl text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </motion.button>
          </motion.div>

          {/* Content Body */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs flex-1">
            {/* Legend: Agent Autonomous vs Approval Gated */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-neutral-900/50 p-4 rounded-xl border border-neutral-800 space-y-3"
            >
              <div className="flex items-center gap-1.5 text-neutral-200 font-semibold text-[11px]">
                <Shield className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                <span>Agent Safety Governance</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px]">
                <div className="bg-neutral-800/50 p-3 rounded-lg border border-emerald-500/20">
                  <span className="text-emerald-400 font-bold block mb-1">Agent acts autonomously:</span>
                  <span className="text-neutral-300">Search, compare, rank, notify, explain</span>
                </div>
                <div className="bg-neutral-800/50 p-3 rounded-lg border border-amber-500/20">
                  <span className="text-amber-400 font-bold block mb-1">Requires your approval:</span>
                  <span className="text-neutral-300">Book, pay, cancel, rebook</span>
                </div>
              </div>
            </motion.div>

            {/* Journey Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="space-y-2"
            >
              <p className="font-semibold text-neutral-200 text-xs tracking-tight">Journey Leg Breakdown:</p>
              <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4 space-y-2.5">
                {itinerary.legs.map((leg) => (
                  <motion.div
                    key={leg.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * itinerary.legs.indexOf(leg) }}
                    className="flex items-center justify-between text-xs pb-2 border-b border-neutral-800/50 last:border-none last:pb-0"
                  >
                    <div className="pr-2">
                      <span className="font-semibold text-neutral-50 text-base">{leg.operator}</span>
                      <span className="text-[11px] text-neutral-400 flex items-center gap-1 mt-0.5">
                        <span>{leg.from_node}</span>
                        <ChevronRight className="w-3 h-3 text-neutral-600 shrink-0" aria-hidden="true" />
                        <span>{leg.to_node}</span>
                        <span className="text-neutral-500 text-[10px]">({leg.mode})</span>
                      </span>
                    </div>
                    <span className="font-mono font-bold text-emerald-400 text-xs shrink-0">
                      {formatCurrency(leg.fare)}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Amount Due & Sandbox Notice */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-emerald-950/20 border border-emerald-500/30 p-4 rounded-xl space-y-2 shadow-[inset_0_1px_0_0_rgba(16,185,129,0.1)]"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-300">Total Server-Recomputed Fare:</span>
                <span className="text-lg font-black text-neutral-50 font-mono tracking-tight">
                  {formatCurrency(itinerary.total_cost)}
                </span>
              </div>
              <div className="flex items-start gap-2 text-[10px] text-emerald-300/80">
                <Lock className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-400" aria-hidden="true" />
                <span className="leading-relaxed">
                  Sandbox Payment: Returns a simulated <code className="bg-neutral-950 px-1.5 py-0.5 rounded text-neutral-50 font-mono border border-emerald-500/30 font-semibold">SBX-XXXXXXXX</code> token.
                  No real payment or card details are accepted or stored.
                </span>
              </div>
            </motion.div>

            {/* Simulated Cancellation Policy */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-amber-950/20 border border-amber-500/30 p-4 rounded-xl flex items-start gap-2.5 text-[10px] text-amber-200/90 leading-relaxed"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-bold text-amber-300 mb-1 uppercase tracking-wider text-[10px]">
                  Simulated Policy Terms:
                </p>
                <p className="text-amber-100/80">
                  Simulated policy - illustrative, not a real refund policy.
                  Never promises insurance, compensation, or guaranteed rebooking; these are partner-dependent and not implemented in this prototype.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Footer Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-5 sm:p-6 border-t border-neutral-800 bg-neutral-950/50 flex items-center justify-end gap-3"
          >
            <Button
              variant="secondary"
              size="md"
              onClick={onClose}
              disabled={loading}
              className="min-w-[100px]"
            >
              Cancel
            </Button>

            <Button
              variant="primary"
              size="md"
              onClick={() => onApprove(itinerary)}
              disabled={loading}
              className="flex-1 sm:flex-none min-w-[140px]"
            >
              <Check className="w-4 h-4 stroke-[3]" aria-hidden="true" />
              <span>{loading ? "Authorizing..." : "Approve & Book (Sandbox)"}</span>
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

import React from "react";