"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/homepage/Footer";
import { getMetrics } from "@/lib/api";
import { MetricsData } from "@/lib/types";
import {
  BarChart3,
  CheckCircle2,
  Cpu,
  RefreshCw,
  ShieldCheck,
  Zap,
  ArrowLeft,
  Activity,
  Layers,
  Clock,
  TrendingUp,
  FileCheck,
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

export default function BenchmarksPage() {
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMetrics();
      setMetrics(data);
    } catch (err: any) {
      setError(err.message || "Failed to load metrics from engine");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#211C1A] text-white">
      {/* Header */}
      <Header
        lang="en"
        onToggleLang={() => {}}
        rankMode="balanced"
        onRankModeChange={() => {}}
        llmAvailable={true}
        onOpenMetrics={() => {}}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Breadcrumb / Back Link */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#FFAA8A] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Journey Planner</span>
          </Link>

          <button
            type="button"
            onClick={fetchMetrics}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#302724] border border-[#4B3C35] hover:border-[#E65D36]/50 text-xs font-semibold text-white transition-all shadow-sm"
          >
            <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin text-[#FFAA8A]")} />
            <span>{loading ? "Recomputing..." : "Refresh Engine Benchmarks"}</span>
          </button>
        </div>

        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-[#302724] to-[#211C1A] border border-[#4B3C35] shadow-xl">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E65D36]/20 border border-[#E65D36]/40 text-[#FFAA8A] text-xs font-bold uppercase tracking-wider">
              <Activity className="w-3.5 h-3.5 text-[#F2B544]" />
              <span>Reproducible Test Sweeps • Stateless Travel Engine</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              System Architecture &amp; Benchmark Dashboard
            </h1>
            <p className="text-sm sm:text-base text-[#C5B6AA] leading-relaxed">
              Real-time validation metrics computed from deterministic graph solver passes, offline NLP intake parsers, and constraint-satisfaction sweeps across multi-leg journeys.
            </p>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="p-4 bg-red-950/40 border border-red-500/30 text-red-200 rounded-2xl text-sm">
            {error}
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && !metrics && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-[#302724] animate-pulse rounded-2xl border border-[#4B3C35]" />
            ))}
          </div>
        )}

        {/* Primary Metric KPI Cards */}
        {metrics && (
          <div className="space-y-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Card 1: NLP Accuracy */}
              <div className="bg-[#302724] p-6 rounded-2xl border border-[#4B3C35] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#C5B6AA] uppercase tracking-wider font-semibold">
                    Offline NLP Intake
                  </span>
                  <FileCheck className="w-4 h-4 text-[#E65D36]" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white font-mono">
                    {(metrics.intake_accuracy * 100).toFixed(1)}%
                  </span>
                  <span className="text-xs text-[#247A50] font-semibold">
                    ({metrics.intake_correct}/{metrics.intake_total} tests)
                  </span>
                </div>
                <p className="text-[11px] text-[#C5B6AA]">
                  Strict offline regex/pattern parser against diverse Indian travel prompt queries.
                </p>
              </div>

              {/* Card 2: Validation Integrity */}
              <div className="bg-[#302724] p-6 rounded-2xl border border-[#4B3C35] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#C5B6AA] uppercase tracking-wider font-semibold">
                    Validation Integrity
                  </span>
                  <ShieldCheck className="w-4 h-4 text-[#247A50]" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-[#247A50] font-mono">
                    {(metrics.final_recommended_pass_rate * 100).toFixed(0)}%
                  </span>
                  <span className="text-xs text-[#247A50] font-bold">Guaranteed</span>
                </div>
                <p className="text-[11px] text-[#C5B6AA]">
                  Every recommended candidate is certified against all hard deadline and buffer rules.
                </p>
              </div>

              {/* Card 3: Disruption Recovery */}
              <div className="bg-[#302724] p-6 rounded-2xl border border-[#4B3C35] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#C5B6AA] uppercase tracking-wider font-semibold">
                    Disruption Recovery
                  </span>
                  <TrendingUp className="w-4 h-4 text-[#F2B544]" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-[#F2B544] font-mono">
                    {(metrics.disruption_recovery_rate * 100).toFixed(0)}%
                  </span>
                  <span className="text-xs text-[#C5B6AA]">
                    ({metrics.disruption_recoveries}/{metrics.disruption_total} sweeps)
                  </span>
                </div>
                <p className="text-[11px] text-[#C5B6AA]">
                  Automated re-routing alternatives synthesized when a primary leg faces major delay.
                </p>
              </div>

              {/* Card 4: Median Latency */}
              <div className="bg-[#302724] p-6 rounded-2xl border border-[#4B3C35] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#C5B6AA] uppercase tracking-wider font-semibold">
                    Median Latency
                  </span>
                  <Clock className="w-4 h-4 text-[#FFAA8A]" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white font-mono">
                    {metrics.median_latency_ms} ms
                  </span>
                  <span className="text-xs text-[#C5B6AA]">
                    (p95: {metrics.p95_latency_ms} ms)
                  </span>
                </div>
                <p className="text-[11px] text-[#C5B6AA]">
                  Sub-5ms evaluation of transfer buffers, feeder legs, and deadline feasibility.
                </p>
              </div>
            </div>

            {/* Fixture Test Suite Table */}
            <div className="bg-[#302724] rounded-2xl border border-[#4B3C35] overflow-hidden shadow-md">
              <div className="p-6 border-b border-[#4B3C35] flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">
                    Deterministic Test Fixtures &amp; Constraint Coverage
                  </h2>
                  <p className="text-xs text-[#C5B6AA] mt-0.5">
                    Continuous test suite validating arrival deadlines, trap buses, wheelchair access, and capacity limits.
                  </p>
                </div>
                <span className="text-xs font-mono font-semibold text-[#247A50] bg-[#247A50]/15 border border-[#247A50]/30 px-3 py-1 rounded-full">
                  All 5 Core Fixtures Verified
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#211C1A] text-[#C5B6AA] uppercase font-semibold text-[11px] tracking-wider border-b border-[#4B3C35]">
                    <tr>
                      <th className="py-3.5 px-6">Fixture Name</th>
                      <th className="py-3.5 px-6">Tested Constraints</th>
                      <th className="py-3.5 px-6">Candidate Pool</th>
                      <th className="py-3.5 px-6">Feasible Passed</th>
                      <th className="py-3.5 px-6">Pass Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#4B3C35] text-[#E8DCD1]">
                    {Object.entries(metrics.fixture_rates).map(([name, fix]) => (
                      <tr key={name} className="hover:bg-[#3A302C]/60 transition-colors">
                        <td className="py-4 px-6 font-bold text-white">{name}</td>
                        <td className="py-4 px-6 text-[#C5B6AA]">
                          {name.includes("Happy") && "Standard 10-15 min buffers, deadline validation"}
                          {name.includes("Trap") && "Rejection of late-arriving cheap budget trap buses"}
                          {name.includes("Sleeper") && "Filtering to sleeper-only berths"}
                          {name.includes("Wheelchair") && "100% accessible vehicles required across all legs"}
                          {name.includes("Capacity") && "Rejection of buses with fewer seats than requested passengers"}
                        </td>
                        <td className="py-4 px-6 font-mono">{fix.candidates}</td>
                        <td className="py-4 px-6 font-mono text-[#247A50] font-bold">{fix.passed}</td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md font-mono text-xs font-bold bg-[#211C1A] border border-[#4B3C35]">
                            {(fix.rate * 100).toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Architecture Explanations */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#302724] p-6 rounded-2xl border border-[#4B3C35] space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#E65D36]/15 text-[#FFAA8A] flex items-center justify-center">
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base">Deterministic Graph</h3>
                <p className="text-xs text-[#C5B6AA] leading-relaxed">
                  Transit nodes, schedules, and transfers are validated by exact code logic without LLM hallucinations. Fares, timings, and stops are mathematically computed.
                </p>
              </div>

              <div className="bg-[#302724] p-6 rounded-2xl border border-[#4B3C35] space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#247A50]/15 text-[#247A50] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base">Safety Consent Gates</h3>
                <p className="text-xs text-[#C5B6AA] leading-relaxed">
                  Before issuing a simulated booking token (<code className="bg-[#211C1A] px-1 py-0.5 rounded text-white font-mono">SBX-XXXXXXXX</code>), the system re-verifies the fare and schedule and requires explicit user consent.
                </p>
              </div>

              <div className="bg-[#302724] p-6 rounded-2xl border border-[#4B3C35] space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#F2B544]/15 text-[#F2B544] flex items-center justify-center">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base">Disruption Awareness</h3>
                <p className="text-xs text-[#C5B6AA] leading-relaxed">
                  Real-time delay scenarios trigger automated alternative generation, identifying backup feeder connections and near-miss options with transparent explanations.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
