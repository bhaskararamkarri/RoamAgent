"use client";

import { forwardRef, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface SeparatorProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
}

export const Separator = forwardRef<HTMLDivElement, SeparatorProps>(
  ({ orientation = "horizontal", decorative = true, className, ...props }, ref) => (
    <div
      ref={ref}
      role={decorative ? "none" : "separator"}
      aria-orientation={decorative ? undefined : orientation}
      className={cn(
        "bg-neutral-800",
        orientation === "horizontal" ? "w-full h-px" : "h-full w-px",
        className
      )}
      {...props}
    />
  )
);

Separator.displayName = "Separator";

export interface LabelProps extends HTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  size?: "sm" | "md" | "lg";
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ required = false, size = "md", className, children, ...props }, ref) => {
    const sizeStyles = {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base",
    };

    return (
      <label
        ref={ref}
        className={cn(
          "block font-medium text-neutral-300",
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {children}
        {required && (
          <span className="text-red-400 ml-1" aria-hidden="true">*</span>
        )}
      </label>
    );
  }
);

Label.displayName = "Label";