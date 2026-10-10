"use client";

import { motion } from "motion/react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { AlertCircle, Info } from "lucide-react";

export function Banner() {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0, y: -20 }}
      animate={{ opacity: 1, height: "auto", y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="border-b border-amber-500/30 bg-amber-950/30"
      role="status"
      aria-live="polite"
    >
      <div className="container-app px-4 py-2.5">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <AlertCircle className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <p className="font-semibold text-amber-300 text-sm">
                Sandbox Simulation Mode
              </p>
              <p className="text-amber-200/80 text-xs mt-0.5">
                All schedules, fares, delays, and bookings are simulated. No real transactions occur.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="warning" size="sm" dot className="hidden sm:inline-flex">
              Simulated Data
            </Badge>
            <Badge variant="outline" size="sm" className="hidden sm:inline-flex">
              Prototype v1.0
            </Badge>
          </div>
        </div>
      </div>
    </motion.div>
  );
}