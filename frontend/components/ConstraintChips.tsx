"use client";

import { motion } from "motion/react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  Armchair,
  IndianRupee,
  Accessibility,
  Luggage,
} from "lucide-react";
import { TripRequest, SeatType } from "@/lib/types";

interface ConstraintChipsProps {
  request: TripRequest | null;
  onChange: (updated: TripRequest) => void;
  disabled?: boolean;
}

import { Autocomplete } from "@/components/ui/Autocomplete";
import { searchLocationOptions } from "@/lib/locations";

const SEAT_TYPES: { value: SeatType; label: string }[] = [
  { value: "any", label: "Any" },
  { value: "sleeper", label: "Sleeper Only" },
  { value: "seater", label: "Seater" },
];

export function ConstraintChips({
  request,
  onChange,
  disabled = false,
}: ConstraintChipsProps) {
  if (!request) return null;

  const handleUpdate = (patch: Partial<TripRequest>) => {
    onChange({ ...request, ...patch });
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="glass-card rounded-2xl p-5 sm:p-6 shadow-card border border-neutral-800 space-y-5"
      aria-labelledby="constraints-heading"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-2 h-2 rounded-full bg-emerald-400"
            aria-hidden="true"
          />
          <h2 id="constraints-heading" className="font-display font-semibold text-lg tracking-tight text-neutral-50">
            Active Trip Constraints
          </h2>
        </div>
        <span className="text-xs text-neutral-500 font-medium hidden sm:inline">
          Changes trigger deterministic re-planning
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, staggerChildren: 0.05 }}
        className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3"
      >
        {/* Origin */}
        <motion.div
          className="flex items-center gap-2 bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 rounded-xl px-3 py-2.5 transition-colors focus-within:border-emerald-500/50 focus-within:ring-1 focus-within:ring-emerald-500/20"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <MapPin className="w-4 h-4 text-emerald-400" aria-hidden="true" />
          </div>
          <div className="flex-1 min-w-0">
            <label htmlFor="origin" className="text-[10px] text-neutral-400 block font-medium leading-none mb-1 uppercase tracking-wide">
              Origin
            </label>
            <Autocomplete
              value={request.origin}
              onChange={(val, opt) => handleUpdate({ origin: opt ? opt.name : val })}
              fetchOptions={async (q) => searchLocationOptions(q, 12)}
              placeholder="Origin"
              disabled={disabled}
              variant="bare"
            />
          </div>
        </motion.div>

        {/* Destination */}
        <motion.div
          className="flex items-center gap-2 bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 rounded-xl px-3 py-2.5 transition-colors focus-within:border-teal-500/50 focus-within:ring-1 focus-within:ring-teal-500/20"
        >
          <div className="w-8 h-8 rounded-lg bg-teal-500/15 border border-teal-500/30 flex items-center justify-center shrink-0">
            <MapPin className="w-4 h-4 text-teal-400" aria-hidden="true" />
          </div>
          <div className="flex-1 min-w-0">
            <label htmlFor="destination" className="text-[10px] text-neutral-400 block font-medium leading-none mb-1 uppercase tracking-wide">
              Destination
            </label>
            <Autocomplete
              value={request.destination}
              onChange={(val, opt) => handleUpdate({ destination: opt ? opt.name : val })}
              fetchOptions={async (q) => searchLocationOptions(q, 12)}
              placeholder="Destination"
              disabled={disabled}
              variant="bare"
            />
          </div>
        </motion.div>

        {/* Travel Date */}
        <motion.div
          className="flex items-center gap-2 bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 rounded-xl px-3 py-2.5 transition-colors focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/20"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center shrink-0">
            <Calendar className="w-4 h-4 text-blue-400" aria-hidden="true" />
          </div>
          <div className="flex-1 min-w-0">
            <label htmlFor="travel-date" className="text-[10px] text-neutral-400 block font-medium leading-none mb-1 uppercase tracking-wide">
              Date
            </label>
            <input
              id="travel-date"
              type="date"
              disabled={disabled}
              value={request.travel_date}
              onChange={(e) => handleUpdate({ travel_date: e.target.value })}
              className="bg-transparent text-neutral-50 text-xs font-semibold outline-none w-full font-mono"
            />
          </div>
        </motion.div>

        {/* Arrival Deadline */}
        <motion.div
          className="flex items-center gap-2 bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 rounded-xl px-3 py-2.5 transition-colors focus-within:border-amber-500/50 focus-within:ring-1 focus-within:ring-amber-500/20"
        >
          <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4 text-amber-400" aria-hidden="true" />
          </div>
          <div className="flex-1 min-w-0">
            <label htmlFor="arrival-deadline" className="text-[10px] text-neutral-400 block font-medium leading-none mb-1 uppercase tracking-wide">
              Deadline
            </label>
            <input
              id="arrival-deadline"
              type="time"
              disabled={disabled}
              value={request.arrival_deadline}
              onChange={(e) => handleUpdate({ arrival_deadline: e.target.value })}
              className="bg-transparent text-neutral-50 text-xs font-semibold outline-none w-full font-mono"
            />
          </div>
        </motion.div>

        {/* Passengers */}
        <motion.div
          className="flex items-center gap-2 bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 rounded-xl px-3 py-2.5 transition-colors focus-within:border-purple-500/50 focus-within:ring-1 focus-within:ring-purple-500/20"
        >
          <div className="w-8 h-8 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center shrink-0">
            <Users className="w-4 h-4 text-purple-400" aria-hidden="true" />
          </div>
          <div className="flex-1 min-w-0">
            <label htmlFor="passengers" className="text-[10px] text-neutral-400 block font-medium leading-none mb-1 uppercase tracking-wide">
              Passengers
            </label>
            <select
              id="passengers"
              disabled={disabled}
              value={request.passengers}
              onChange={(e) => handleUpdate({ passengers: parseInt(e.target.value) || 1 })}
              className="bg-transparent text-neutral-50 text-xs font-semibold outline-none w-full cursor-pointer"
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n} className="bg-neutral-900 text-neutral-50">
                  {n} Pax
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Seat Type */}
        <motion.div
          className="flex items-center gap-2 bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 rounded-xl px-3 py-2.5 transition-colors focus-within:border-rose-500/50 focus-within:ring-1 focus-within:ring-rose-500/20"
        >
          <div className="w-8 h-8 rounded-lg bg-rose-500/15 border border-rose-500/30 flex items-center justify-center shrink-0">
            <Armchair className="w-4 h-4 text-rose-400" aria-hidden="true" />
          </div>
          <div className="flex-1 min-w-0">
            <label htmlFor="seat-type" className="text-[10px] text-neutral-400 block font-medium leading-none mb-1 uppercase tracking-wide">
              Seat Type
            </label>
            <select
              id="seat-type"
              disabled={disabled}
              value={request.seat_type}
              onChange={(e) => handleUpdate({ seat_type: e.target.value as SeatType })}
              className="bg-transparent text-neutral-50 text-xs font-semibold outline-none w-full cursor-pointer"
            >
              {SEAT_TYPES.map((s) => (
                <option key={s.value} value={s.value} className="bg-neutral-900 text-neutral-50">
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Budget */}
        <motion.div
          className="flex items-center gap-2 bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 rounded-xl px-3 py-2.5 transition-colors focus-within:border-emerald-500/50 focus-within:ring-1 focus-within:ring-emerald-500/20"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <IndianRupee className="w-4 h-4 text-emerald-400" aria-hidden="true" />
          </div>
          <div className="flex-1 min-w-0">
            <label htmlFor="budget" className="text-[10px] text-neutral-400 block font-medium leading-none mb-1 uppercase tracking-wide">
              Max Budget
            </label>
            <input
              id="budget"
              type="number"
              disabled={disabled}
              placeholder="No limit"
              value={request.budget_total_inr ?? ""}
              onChange={(e) => {
                const val = e.target.value ? parseFloat(e.target.value) : null;
                handleUpdate({ budget_total_inr: val });
              }}
              className="bg-transparent text-neutral-50 text-xs font-semibold outline-none w-full font-mono"
              min="0"
              step="100"
            />
          </div>
        </motion.div>

        {/* Accessibility & Luggage toggles */}
        <motion.div className="flex items-center gap-2 sm:col-span-2 lg:col-span-1">
          {/* Wheelchair toggle */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            disabled={disabled}
            onClick={() => {
              const hasW = request.accessibility.includes("wheelchair");
              handleUpdate({
                accessibility: hasW ? [] : ["wheelchair"],
              });
            }}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-bold transition-all duration-200",
              request.accessibility.includes("wheelchair")
                ? "bg-cyan-500/15 text-cyan-300 border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.2)] ring-1 ring-cyan-500/20"
                : "bg-neutral-900/50 text-neutral-400 border-neutral-800 hover:border-neutral-700 hover:text-neutral-200"
            )}
          >
            <Accessibility className="w-4 h-4" aria-hidden="true" />
            <span>Wheelchair</span>
          </motion.button>

          {/* Luggage toggle */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            disabled={disabled}
            onClick={() => {
              const next = request.luggage === "heavy" ? null : "heavy";
              handleUpdate({ luggage: next });
            }}
            className={cn(
              "flex items-center justify-center p-2.5 rounded-xl border text-xs font-bold transition-all duration-200",
              request.luggage === "heavy"
                ? "bg-amber-500/15 text-amber-300 border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.2)] ring-1 ring-amber-500/20"
                : "bg-neutral-900/50 text-neutral-400 border-neutral-800 hover:border-neutral-700 hover:text-neutral-200"
            )}
            title="Heavy luggage"
          >
            <Luggage className="w-4 h-4" aria-hidden="true" />
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}