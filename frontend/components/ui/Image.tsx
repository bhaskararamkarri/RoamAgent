"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  aspectRatio?: string;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export function Image({
  src,
  alt,
  width,
  height,
  aspectRatio,
  placeholder = "empty",
  blurDataURL,
  priority = false,
  sizes,
  className,
  onLoad,
  onError,
  ...props
}: ImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    onError?.();
  };

  if (hasError) {
    return (
      <div
        className={cn(
          "relative flex items-center justify-center bg-neutral-800/50 text-neutral-400 overflow-hidden",
          aspectRatio && `aspect-[${aspectRatio}]`,
          className
        )}
        style={{ width, height }}
        role="img"
        aria-label={alt}
      >
        <div className="text-center p-4">
          <svg
            className="w-8 h-8 mx-auto text-neutral-500 mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-sm font-medium">Image unavailable</p>
          <p className="text-xs text-neutral-500 truncate max-w-xs">{alt}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        aspectRatio && `aspect-[${aspectRatio}]`,
        className
      )}
      style={{ width, height }}
    >
      {placeholder === "blur" && blurDataURL && (
        <img
          src={blurDataURL}
          alt=""
          aria-hidden="true"
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-opacity duration-700",
            isLoading ? "opacity-100 blur-[20px] scale-110" : "opacity-0 blur-0 scale-100"
          )}
        />
      )}

      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100"
        )}
        {...props}
      />

      {isLoading && placeholder === "empty" && (
        <div className="absolute inset-0 skeleton" aria-hidden="true" />
      )}
    </div>
  );
}

export default Image;

export function BlurhashPlaceholder({ blurhash, width, height }: { blurhash: string; width: number; height: number }) {
  return (
    <div
      className="absolute inset-0"
      style={{
        background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${width} ${height}'%3E%3Cfilter id='b'%3E%3CfeGaussianBlur stdDeviation='30'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23b)'/%3E%3C/svg%3E")`,
        backgroundSize: "cover",
        filter: "blur(30px)",
        transform: "scale(1.1)",
      }}
      aria-hidden="true"
    />
  );
}