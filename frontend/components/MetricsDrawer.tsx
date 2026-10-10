"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { BarChart3, X, RefreshCw, Zap, ShieldCheck, Activity, ExternalLink, ArrowRight } from "lucide-react";
import { MetricsData } from "@/lib/types";
import { getMetrics } from "@/lib/api";

interface MetricsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MetricsDrawer({ isOpen, onClose }: MetricsDrawerProps) {
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMetrics();
      setMetrics(data);
    } catch (err: any) {
      setError(err.message || "Failed to load metrics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMetrics();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="metrics-drawer-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[500] flex items-center justify-end p-0 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="metrics-drawer-title"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-0 cursor-pointer"
            aria-hidden="true"
          />

          {/* Drawer Body */}
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative z-10 glass-elevated w-full sm:max-w-lg h-full sm:h-auto sm:max-h-[92vh] rounded-none sm:rounded-2xl shadow-modal flex flex-col overflow-hidden border border-[#4B3C35] bg-[#211C1A] text-white"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-[#4B3C35] flex items-center justify-between bg-[#302724]">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-2xl bg-[#E65D36]/20 text-[#FFAA8A] border border-[#E65D36]/30 flex items-center justify-center shadow-glow-brand"
                  aria-hidden="true"
                >
                  <BarChart3 className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <h2 id="metrics-drawer-title" className="font-display font-bold text-lg tracking-tight text-white">
                    Live Benchmark Metrics
                  </h2>
                  <p className="text-[11px] text-[#C5B6AA] font-medium mt-0.5">
                    Deterministic graph solver performance & fixture sweeps
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={fetchMetrics}
                  disabled={loading}
                  className="p-2 rounded-xl text-[#C5B6AA] hover:text-white hover:bg-[#3A302C] transition-colors"
                  title="Refresh benchmarks"
                  aria-label="Refresh metrics"
                >
                  <RefreshCw className={cn("w-4 h-4", loading && "animate-spin text-[#FFAA8A]")} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded-xl text-[#C5B6AA] hover:text-white hover:bg-[#3A302C] transition-colors"
                  aria-label="Close metrics drawer"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs flex-1">
              {error && (
                <div
                  className="p-4 bg-red-500/15 border border-red-500/30 text-red-200 rounded-xl"
                  role="alert"
                >
                  {error}
                </div>
              )}

              {loading && !metrics && (
                <div className="space-y-3" role="status" aria-label="Loading metrics">
                  <div className="h-24 bg-[#302724] animate-pulse rounded-xl border border-[#4B3C35]" />
                  <div className="h-24 bg-[#302724] animate-pulse rounded-xl border border-[#4B3C35]" />
                  <div className="h-24 bg-[#302724] animate-pulse rounded-xl border border-[#4B3C35]" />
                </div>
              )}

              {metrics && (
                <div className="space-y-5">
                  {/* Primary 4 Metric Cards */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* 1. Intake Accuracy */}
                    <div className="bg-[#302724] p-4 rounded-xl border border-[#4B3C35]">
                      <span className="text-[10px] text-[#C5B6AA] uppercase tracking-wider font-semibold block mb-1.5">
                        Offline NLP Intake
                      </span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl font-black text-white font-mono tracking-tight">
                          {(metrics.intake_accuracy * 100).toFixed(1)}%
                        </span>
                        <span className="text-[10px] text-[#247A50] font-semibold">
                          ({metrics.intake_correct}/{metrics.intake_total})
                        </span>
                      </div>
                      <span className="text-[9px] text-[#C5B6AA] block mt-1.5 font-medium">Target: ≥ 85.0%</span>
                    </div>

                    {/* 2. Validation Integrity */}
                    <div className="bg-[#302724] p-4 rounded-xl border border-[#4B3C35]">
                      <span className="text-[10px] text-[#C5B6AA] uppercase tracking-wider font-semibold block mb-1.5">
                        Final Pass Rate
                      </span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl font-black text-[#247A50] font-mono tracking-tight">
                          {(metrics.final_recommended_pass_rate * 100).toFixed(0)}%
                        </span>
                      </div>
                      <span className="text-[9px] text-[#247A50] block mt-1.5 font-medium">100% Valid Guaranteed</span>
                    </div>

                    {/* 3. Disruption Recovery */}
                    <div className="bg-[#302724] p-4 rounded-xl border border-[#4B3C35]">
                      <span className="text-[10px] text-[#C5B6AA] uppercase tracking-wider font-semibold block mb-1.5">
                        Disruption Recovery
                      </span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl font-black text-[#F2B544] font-mono tracking-tight">
                          {(metrics.disruption_recovery_rate * 100).toFixed(0)}%
                        </span>
                        <span className="text-[10px] text-[#C5B6AA] font-semibold">
                          ({metrics.disruption_recoveries}/{metrics.disruption_total})
                        </span>
                      </div>
                      <span className="text-[9px] text-[#C5B6AA] block mt-1.5 font-medium">Top-3 Route Sweep</span>
                    </div>

                    {/* 4. Median Latency */}
                    <div className="bg-[#302724] p-4 rounded-xl border border-[#4B3C35]">
                      <span className="text-[10px] text-[#C5B6AA] uppercase tracking-wider font-semibold block mb-1.5">
                        Median Latency
                      </span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl font-black text-white font-mono tracking-tight">
                          {metrics.median_latency_ms} ms
                        </span>
                        <span className="text-[10px] text-[#C5B6AA]">
                          (p95: {metrics.p95_latency_ms}ms)
                        </span>
                      </div>
                      <span className="text-[9px] text-[#C5B6AA] block mt-1.5 font-medium">Pure deterministic graph</span>
                    </div>
                  </div>

                  {/* Fixture Feasibility Breakdown Table */}
                  <div className="space-y-2">
                    <span className="font-semibold text-white block text-xs tracking-tight">
                      Fixture Feasibility Breakdown
                    </span>
                    <div className="bg-[#302724] border border-[#4B3C35] rounded-xl overflow-hidden divide-y divide-[#4B3C35] text-xs">
                      {Object.entries(metrics.fixture_rates).map(([name, fix]) => (
                        <div
                          key={name}
                          className="p-3 flex items-center justify-between"
                        >
                          <span className="text-white font-semibold">{name}</span>
                          <span className="font-mono text-[#C5B6AA] text-[11px] font-semibold">
                            {fix.passed} / {fix.candidates} passed ({(fix.rate * 100).toFixed(1)}%)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Deterministic Principles Card */}
                  <div className="p-4 bg-[#302724] rounded-xl border border-[#4B3C35] text-[11px] text-[#C5B6AA] space-y-1.5">
                    <p className="font-bold text-white flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#247A50]" aria-hidden="true" />
                      <span>Deterministic Architecture:</span>
                    </p>
                    <p>• Zero LLM hallucinations on transit schedules, fares, or arrival times.</p>
                    <p>• Sub-5ms deterministic graph re-planning with independent validation.</p>
                    <p>• Mandatory user approval gates required before simulated booking tokens.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer with Fullpage Link */}
            <div className="p-4 sm:p-5 border-t border-[#4B3C35] bg-[#302724] flex items-center justify-between gap-3">
              <a
                href="/benchmarks"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FFAA8A] hover:text-white transition-colors"
              >
                <span>Full Benchmarks Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </a>

              <Button
                variant="secondary"
                size="sm"
                onClick={onClose}
              >
                Close
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default MetricsDrawer;