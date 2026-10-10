"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-[100dvh] flex items-center justify-center px-4 bg-neutral-950"
    >
      <div className="text-center max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 20 }}
          className="w-16 h-16 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center mx-auto mb-6"
        >
          <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-heading-lg tracking-tight text-neutral-50 mb-4"
        >
          Something went wrong
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-neutral-400 text-body-md mb-8"
        >
          We encountered an unexpected error. Please try again or go back to the homepage.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={reset}
            className="group flex items-center justify-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-400 text-neutral-950 font-semibold rounded-xl transition-colors min-h-[48px] active:scale-[0.98]"
          >
            <RefreshCw className="w-5 h-5 transition-transform group-hover:rotate-90" aria-hidden="true" />
            <span>Try Again</span>
          </button>
          <Link
            href="/"
            className="group flex items-center justify-center gap-2 px-6 py-3 bg-neutral-800/50 hover:bg-neutral-700/50 border border-neutral-700 text-neutral-300 hover:text-neutral-50 font-semibold rounded-xl transition-all min-h-[48px] active:scale-[0.98]"
          >
            <Home className="w-5 h-5" aria-hidden="true" />
            <span>Go Home</span>
          </Link>
        </motion.div>

        {process.env.NODE_ENV === "development" && (
          <motion.details
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ delay: 0.5, duration: 0.3 }}
            className="mt-10 text-left max-w-md mx-auto p-4 bg-neutral-900/50 border border-neutral-800 rounded-xl"
          >
            <summary className="font-mono text-xs text-neutral-500 cursor-pointer mb-2">
              Error Details (Development)
            </summary>
            <pre className="font-mono text-xs text-neutral-400 overflow-x-auto whitespace-pre-wrap">
              {error.message}
              {error.digest && `\nDigest: ${error.digest}`}
            </pre>
          </motion.details>
        )}
      </div>
    </motion.div>
  );
}