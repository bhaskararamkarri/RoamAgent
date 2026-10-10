"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Circle, MapPin, Compass } from "lucide-react";

export interface CarouselItem {
  id: string;
  image: string;
  alt: string;
  caption?: string;
  subtitle?: string;
  badge?: string;
  href?: string;
  onClick?: () => void;
}

export interface CarouselProps {
  items: CarouselItem[];
  className?: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showArrows?: boolean;
  showDots?: boolean;
  pauseOnHover?: boolean;
  itemsPerView?: 1 | 2 | 3 | 4;
  gap?: number;
  height?: string;
  aspectRatio?: string;
}

export function Carousel({
  items,
  className,
  autoPlay = false,
  autoPlayInterval = 5000,
  showArrows = true,
  showDots = true,
  pauseOnHover = true,
  itemsPerView = 1,
  gap = 16,
  height = "340px",
  aspectRatio = "16/9",
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout>();

  const maxIndex = Math.max(0, items.length - itemsPerView);

  const goToSlide = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, maxIndex));
      setCurrentIndex(clamped);
    },
    [maxIndex]
  );

  const goToNext = useCallback(() => {
    goToSlide(currentIndex + 1);
  }, [currentIndex, goToSlide]);

  const goToPrev = useCallback(() => {
    goToSlide(currentIndex - 1);
  }, [currentIndex, goToSlide]);

  // Auto-play logic
  useEffect(() => {
    if (!autoPlay || items.length <= itemsPerView) return;

    autoPlayRef.current = setInterval(() => {
      if (!isHovered || !pauseOnHover) {
        goToSlide(currentIndex + 1 > maxIndex ? 0 : currentIndex + 1);
      }
    }, autoPlayInterval);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [autoPlay, autoPlayInterval, currentIndex, isHovered, pauseOnHover, goToSlide, maxIndex, items.length, itemsPerView]);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goToNext();
      else goToPrev();
    }
    setTouchStart(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") goToPrev();
    if (e.key === "ArrowRight") goToNext();
  };

  if (items.length === 0) return null;

  // Slide width calculation taking gap into account
  const slideWidthCalc = `calc((100% - ${(itemsPerView - 1) * gap}px) / ${itemsPerView})`;
  // Track translation
  const trackTranslateCalc = `calc(-${currentIndex} * (${slideWidthCalc} + ${gap}px))`;

  return (
    <div
      className={cn("relative overflow-hidden rounded-2xl select-none group", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Carousel"
    >
      <div
        ref={trackRef}
        className="carousel-track flex transition-transform duration-500 ease-out"
        style={{
          transform: `translateX(${trackTranslateCalc})`,
          gap: `${gap}px`,
        }}
        role="list"
      >
        {items.map((item) => (
          <div
            key={item.id}
            className="carousel-slide flex-shrink-0 relative rounded-xl overflow-hidden cursor-pointer"
            style={{
              width: slideWidthCalc,
              flex: `0 0 ${slideWidthCalc}`,
            }}
            role="listitem"
            onClick={item.onClick}
          >
            <div className="relative w-full overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm transition-all duration-300 hover:shadow-card-hover hover:border-brand-500/40" style={{ height }}>
              <ImageComponent
                src={item.image}
                alt={item.alt}
                title={item.caption || item.alt}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />

              {/* Badge if present */}
              {item.badge && (
                <div className="absolute top-3 left-3 z-10">
                  <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-sunset-primary text-white shadow-md">
                    {item.badge}
                  </span>
                </div>
              )}

              {/* Gradient text overlay */}
              {(item.caption || item.subtitle) && (
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-[#211C1A]/95 via-[#211C1A]/70 to-transparent flex flex-col justify-end">
                  {item.caption && (
                    <p className="text-base font-bold text-white tracking-tight truncate drop-shadow-sm">
                      {item.caption}
                    </p>
                  )}
                  {item.subtitle && (
                    <p className="text-xs text-[#E8DCD1] truncate mt-0.5 font-medium">
                      {item.subtitle}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {showArrows && items.length > itemsPerView && (
        <>
          <button
            type="button"
            onClick={goToPrev}
            disabled={currentIndex === 0}
            className={cn(
              "absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-neutral-900/80 backdrop-blur-md text-white border border-neutral-700 shadow-lg transition-all duration-200",
              "hover:bg-sunset-primary hover:border-sunset-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunset-primary",
              currentIndex === 0 ? "opacity-0 pointer-events-none" : "opacity-90 hover:opacity-100"
            )}
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={goToNext}
            disabled={currentIndex >= maxIndex}
            className={cn(
              "absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-neutral-900/80 backdrop-blur-md text-white border border-neutral-700 shadow-lg transition-all duration-200",
              "hover:bg-sunset-primary hover:border-sunset-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunset-primary",
              currentIndex >= maxIndex ? "opacity-0 pointer-events-none" : "opacity-90 hover:opacity-100"
            )}
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" aria-hidden="true" />
          </button>
        </>
      )}

      {/* Pagination Dots */}
      {showDots && items.length > itemsPerView && maxIndex > 0 && (
        <div
          className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20 bg-neutral-950/40 backdrop-blur-sm px-3 py-1.5 rounded-full"
          role="tablist"
          aria-label="Slide navigation"
        >
          {Array.from({ length: maxIndex + 1 }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goToSlide(i)}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunset-primary",
                currentIndex === i
                  ? "bg-sunset-primary w-5 rounded-full"
                  : "bg-white/50 hover:bg-white/80"
              )}
              role="tab"
              aria-selected={currentIndex === i}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ImageComponent({
  src,
  alt,
  title,
  className,
}: {
  src: string;
  alt: string;
  title?: string;
  className?: string;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={cn("relative w-full h-full overflow-hidden bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-800 dark:to-neutral-900", className)}>
      {!hasError && src && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setHasError(true);
            setIsLoading(false);
          }}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-300",
            isLoading ? "opacity-0" : "opacity-100"
          )}
        />
      )}

      {isLoading && !hasError && (
        <div className="absolute inset-0 skeleton" aria-hidden="true" />
      )}

      {(hasError || !src) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#302724] via-[#3A302C] to-[#211C1A] text-white">
          <div className="w-12 h-12 rounded-xl bg-sunset-primary/20 border border-sunset-primary/40 flex items-center justify-center mb-3 text-sunset-amber">
            <Compass className="w-6 h-6 animate-pulse" aria-hidden="true" />
          </div>
          <span className="text-sm font-bold text-white tracking-tight block truncate max-w-full">
            {title || alt}
          </span>
          <span className="text-xs text-[#E8DCD1] mt-1 font-mono uppercase tracking-wider">
            TBS RoamAgent Journey
          </span>
        </div>
      )}
    </div>
  );
}