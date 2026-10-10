"use client";

import { forwardRef, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info" | "outline";
  size?: "sm" | "md" | "lg";
  dot?: boolean;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = "default", size = "md", dot = false, className, children, ...props }, ref) => {
    const variantStyles = {
      default: "bg-neutral-800 text-neutral-200 border border-neutral-700",
      success: "bg-emerald-950/50 text-emerald-300 border border-emerald-900/50",
      warning: "bg-amber-950/50 text-amber-300 border border-amber-900/50",
      danger: "bg-red-950/50 text-red-300 border border-red-900/50",
      info: "bg-blue-950/50 text-blue-300 border border-blue-900/50",
      outline: "bg-transparent text-neutral-300 border border-neutral-700",
    };

    const sizeStyles = {
      sm: "px-2 py-0.5 text-xs",
      md: "px-2.5 py-1 text-xs",
      lg: "px-3 py-1.5 text-sm",
    };

    const dotStyles = {
      default: "bg-neutral-400",
      success: "bg-emerald-400",
      warning: "bg-amber-400",
      danger: "bg-red-400",
      info: "bg-blue-400",
      outline: "bg-neutral-500",
    };

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1.5 font-medium rounded-full border",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {dot && <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", dotStyles[variant])} aria-hidden="true" />}
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";