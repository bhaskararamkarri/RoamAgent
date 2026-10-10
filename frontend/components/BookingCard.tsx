"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Separator } from "@/components/ui/Label";
import { cn, formatCurrency } from "@/lib/utils";
import {
  CheckCircle2,
  Zap,
  Copy,
  Check,
  ShieldCheck,
  Ticket,
  ExternalLink,
} from "lucide-react";
import { BookResponse } from "@/lib/types";

interface BookingCardProps {
  booking: BookResponse;
  onOpenDisruption: () => void;
  onCancelBooking: () => void;
  cancelling: boolean;
}

export function BookingCard({
  booking,
  onOpenDisruption,
  onCancelBooking,
  cancelling,
}: BookingCardProps) {
  const [copied, setCopied] = React.useState(false);

  const copyRef = () => {
    navigator.clipboard.writeText(booking.booking_id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="relative overflow-hidden glass-elevated rounded-2xl p-5 sm:p-6 shadow-elevated space-y-5 border border-emerald-500/20"
    >
      {/* Ambient background glow */}
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-neutral-800"
      >
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 300, damping: 20 }}
            className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 text-neutral-950 flex items-center justify-center shadow-glow-brand ring-1 ring-white/20"
            aria-hidden="true"
          >
            <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
          </motion.div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold text-base sm:text-lg tracking-tight text-neutral-50">
                Booking Confirmed
              </h3>
              <Badge variant="success" size="sm" dot>
                SANDBOX
              </Badge>
            </div>
            <p className="text-sm text-neutral-400 mt-0.5 font-medium">
              Your multi-leg journey has been authorized and simulated via sandbox protocol.
            </p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onOpenDisruption}
          className="group flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-neutral-950 text-xs font-black rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.3)] ring-1 ring-white/20 transition-all duration-200"
        >
          <motion.div
            whileHover={{ scale: 1.15, rotate: 10 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Zap className="w-4 h-4 fill-current" aria-hidden="true" />
          </motion.div>
          <span>Simulate Disruption</span>
        </motion.button>
      </motion.div>

      {/* Identifiers Grid */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs"
      >
        <div className="bg-neutral-900/50 p-4 rounded-xl border border-neutral-800">
          <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold block mb-1">
            Booking Reference
          </span>
          <div className="flex items-center justify-between">
            <span className="font-mono font-bold text-neutral-50 text-sm tracking-wide break-all">
              {booking.booking_id}
            </span>
            <motion.button
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={copyRef}
              className="p-2 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
              title="Copy reference"
              aria-label="Copy booking reference"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </motion.button>
          </div>
        </div>

        <div className="bg-neutral-900/50 p-4 rounded-xl border border-neutral-800">
          <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold block mb-1">
            Sandbox Payment ID
          </span>
          <span className="font-mono font-bold text-emerald-400 text-sm break-all">
            {booking.payment.payment_id}
          </span>
        </div>

        <div className="bg-neutral-900/50 p-4 rounded-xl border border-neutral-800">
          <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold block mb-1">
            Total Amount Paid
          </span>
          <span className="font-mono font-black text-neutral-50 text-lg">
            {formatCurrency(booking.payment.amount)}
          </span>
        </div>
      </motion.div>

      {/* Booked Itinerary Legs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="relative z-10 bg-neutral-900/50 p-4 rounded-xl border border-neutral-800 text-xs space-y-2"
      >
        <div className="flex items-center gap-1.5 text-neutral-300 font-semibold text-[11px]">
          <Ticket className="w-4 h-4 text-emerald-400" aria-hidden="true" />
          <span>Reserved Itinerary Chain:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-neutral-300">
          {booking.itinerary.legs.map((leg, idx) => (
            <React.Fragment key={leg.id}>
              <span className="bg-neutral-800 border border-neutral-700 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-neutral-100">
                {leg.operator} <span className="text-neutral-400 font-normal">({leg.from_node} → {leg.to_node})</span>
              </span>
              {idx < booking.itinerary.legs.length - 1 && (
                <motion.span
                  animate={{ x: [0, 2, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-neutral-600 font-bold"
                  aria-hidden="true"
                >
                  →
                </motion.span>
              )}
            </React.Fragment>
          ))}
        </div>
      </motion.div>

      {/* Bottom actions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="relative z-10 flex items-center justify-between pt-2"
      >
        <span className="text-[11px] text-neutral-400 font-medium">
          Need to change travel arrangements?
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancelBooking}
          disabled={cancelling}
          className="text-red-400 hover:text-red-300"
        >
          {cancelling ? "Processing..." : "Cancel Booking (Simulated)"}
        </Button>
      </motion.div>
    </motion.div>
  );
}

import React from "react";