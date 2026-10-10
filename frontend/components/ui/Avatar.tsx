"use client";

import { cn } from "@/lib/utils";
import Image from "./Image";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  shape?: "circle" | "square";
  status?: "online" | "offline" | "busy" | "away";
  statusPosition?: "bottom-right" | "top-right" | "bottom-left" | "top-left";
  fallbackIcon?: React.ReactNode;
}

const SIZE_CLASSES = {
  xs: "w-6 h-6 text-xs",
  sm: "w-8 h-8 text-sm",
  md: "w-10 h-10 text-base",
  lg: "w-12 h-12 text-lg",
  xl: "w-16 h-16 text-xl",
};

const STATUS_SIZE = {
  xs: "w-1.5 h-1.5",
  sm: "w-2 h-2",
  md: "w-2.5 h-2.5",
  lg: "w-3 h-3",
  xl: "w-4 h-4",
};

const STATUS_POSITIONS = {
  "bottom-right": "bottom-0 right-0",
  "top-right": "top-0 right-0",
  "bottom-left": "bottom-0 left-0",
  "top-left": "top-0 left-0",
};

const STATUS_COLORS = {
  online: "bg-success-500",
  offline: "bg-neutral-500",
  busy: "bg-danger-500",
  away: "bg-warning-500",
};

export function Avatar({
  src,
  alt,
  name,
  size = "md",
  shape = "circle",
  status,
  statusPosition = "bottom-right",
  fallbackIcon,
  className,
  ...props
}: AvatarProps) {
  const showStatus = status && status !== "offline";
  const initials = name
    ?.split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const fallbackContent = fallbackIcon || (
    initials ? (
      <span className="font-semibold">{initials}</span>
    ) : (
      <svg
        className="w-1/2 h-1/2 text-neutral-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    )
  );

  return (
    <div
      className={cn(
        "relative inline-flex shrink-0 overflow-hidden",
        SIZE_CLASSES[size],
        shape === "circle" ? "rounded-full" : "rounded-xl",
        "bg-neutral-800",
        className
      )}
      {...props}
    >
      {src ? (
        <Image
          src={src}
          alt={alt || name || "Avatar"}
          width={parseInt(SIZE_CLASSES[size])}
          height={parseInt(SIZE_CLASSES[size])}
          className="w-full h-full object-cover"
          priority={size === "xl" || size === "lg"}
        />
      ) : (
        <div
          className={cn(
            "w-full h-full flex items-center justify-center bg-neutral-700 text-neutral-300",
            SIZE_CLASSES[size]
          )}
          aria-hidden="true"
        >
          {fallbackContent}
        </div>
      )}

      {showStatus && (
        <span
          className={cn(
            "absolute border-2 border-neutral-950 rounded-full",
            STATUS_SIZE[size],
            STATUS_COLORS[status],
            STATUS_POSITIONS[statusPosition]
          )}
          aria-label={`Status: ${status}`}
        />
      )}
    </div>
  );
}

export function AvatarGroup({
  avatars,
  max = 5,
  overlap = -8,
  className,
  ...props
}: {
  avatars: Array<{ src?: string; name?: string; alt?: string }>;
  max?: number;
  overlap?: number;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  const visibleAvatars = avatars.slice(0, max);
  const remaining = avatars.length - max;

  return (
    <div className={cn("flex flex-row-reverse", className)} {...props}>
      {visibleAvatars.map((avatar, index) => (
        <Avatar
          key={avatar.name || index}
          src={avatar.src}
          name={avatar.name}
          alt={avatar.alt}
          size="md"
          className={cn(
            "ring-2 ring-neutral-950 transition-transform hover:z-10 hover:scale-105",
            index > 0 && `ml-${Math.abs(overlap)}`
          )}
        />
      ))}
      {remaining > 0 && (
        <div
          className={cn(
            "flex items-center justify-center rounded-full",
            SIZE_CLASSES.md,
            "ml-3 bg-neutral-700 text-neutral-300 font-semibold",
            "ring-2 ring-neutral-950"
          )}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}