"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { cn, formatCurrency } from "@/lib/utils";
import { MapPin, Clock, TrendingUp, ArrowRight, ChevronLeft, ChevronRight, Bus, Train, LayoutGrid } from "lucide-react";

export interface PopularRouteItem {
  id: string;
  origin: string;
  destination: string;
  duration: string;
  fare: number;
  frequency: string;
  modes: string[];
  trending?: boolean;
  image: string;
  alt: string;
}

export const POPULAR_ROUTES: PopularRouteItem[] = [
  {
    id: "route-vizag-hyd",
    origin: "Visakhapatnam",
    destination: "Hyderabad",
    duration: "11h 00m",
    fare: 850,
    frequency: "15+ daily",
    modes: ["Auto", "Bus", "Train"],
    trending: true,
    image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=800&q=80",
    alt: "Visakhapatnam to Hyderabad corridor scenic transit view",
  },
  {
    id: "route-delhi-mumbai",
    origin: "New Delhi",
    destination: "Mumbai",
    duration: "16h 00m",
    fare: 1200,
    frequency: "25+ daily",
    modes: ["Metro", "Train", "Bus"],
    trending: true,
    image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80",
    alt: "Gateway of India cityscape along New Delhi to Mumbai route",
  },
  {
    id: "route-blr-chennai",
    origin: "Bengaluru",
    destination: "Chennai",
    duration: "6h 00m",
    fare: 450,
    frequency: "30+ daily",
    modes: ["Bus", "Train"],
    trending: false,
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80",
    alt: "Marina Beach and South Indian temples on Bengaluru to Chennai corridor",
  },
  {
    id: "route-kolkata-bbs",
    origin: "Kolkata",
    destination: "Bhubaneswar",
    duration: "7h 30m",
    fare: 520,
    frequency: "12+ daily",
    modes: ["Bus", "Train"],
    trending: false,
    image: "https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=800&q=80",
    alt: "Howrah Bridge and coastal highway for Kolkata to Bhubaneswar",
  },
  {
    id: "route-jaipur-delhi",
    origin: "Jaipur",
    destination: "New Delhi",
    duration: "5h 30m",
    fare: 380,
    frequency: "20+ daily",
    modes: ["Bus", "Train"],
    trending: true,
    image: "https://images.unsplash.com/photo-1599660186123-2a3d7c2b72a2?auto=format&fit=crop&w=800&q=80",
    alt: "Hawa Mahal Pink City palace for Jaipur to New Delhi route",
  },
  {
    id: "route-pune-blr",
    origin: "Pune",
    destination: "Bengaluru",
    duration: "10h 00m",
    fare: 950,
    frequency: "18+ daily",
    modes: ["Sleeper Bus", "Train"],
    trending: false,
    image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80",
    alt: "Deccan plateau highway for Pune to Bengaluru route",
  },
  {
    id: "route-amd-mumbai",
    origin: "Ahmedabad",
    destination: "Mumbai",
    duration: "7h 00m",
    fare: 550,
    frequency: "22+ daily",
    modes: ["Vande Bharat", "Bus", "Train"],
    trending: false,
    image: "https://images.unsplash.com/photo-1599661046827-dacde3e6c1c8?auto=format&fit=crop&w=800&q=80",
    alt: "Western railway corridor between Ahmedabad and Mumbai",
  },
  {
    id: "route-lucknow-delhi",
    origin: "Lucknow",
    destination: "New Delhi",
    duration: "8h 00m",
    fare: 620,
    frequency: "15+ daily",
    modes: ["Expressway Bus", "Train"],
    trending: false,
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80",
    alt: "Yamuna expressway corridor between Lucknow and New Delhi",
  },
];

interface PopularRoutesProps {
  title?: string;
  subtitle?: string;
  routes?: PopularRouteItem[];
  onSelectRoute?: (origin: string, destination: string) => void;
  className?: string;
}

export function PopularRoutes({
  title = "Popular Routes",
  subtitle = "High-frequency multi-modal corridors across India",
  routes = POPULAR_ROUTES,
  onSelectRoute,
  className,
}: PopularRoutesProps) {
  const [sliderIndex, setSliderIndex] = useState(0);
  const [viewMode, setViewMode] = useState<"slider" | "grid">("slider");

  const itemsPerView = 3;
  const maxIndex = Math.max(0, routes.length - itemsPerView);

  const handleRouteClick = (origin: string, destination: string) => {
    if (onSelectRoute) {
      onSelectRoute(origin, destination);
    } else {
      const plannerEl = document.getElementById("planner") || document.getElementById("hero-heading");
      if (plannerEl) {
        plannerEl.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <section
      id="routes"
      className={cn("py-12 px-4 sm:px-6 lg:px-8 space-y-6 bg-[#FFF8F1] rounded-3xl border border-[#E8DCD1] text-[#302923] my-8", className)}
      aria-labelledby="popular-routes-heading"
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E8DCD1] pb-6">
        <div>
          <span className="px-3 py-1 rounded-full bg-[#FFEFE6] text-[#CC4827] text-xs font-bold tracking-wide uppercase">
            Validated Schedules
          </span>
          <h2 id="popular-routes-heading" className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#302923] mt-2">
            {title}
          </h2>
          <p className="text-[#81756B] text-sm mt-1">{subtitle}</p>
        </div>

        {/* View Toggle & Carousel Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[#F8EDE2] p-1 rounded-xl border border-[#E8DCD1]">
            <button
              type="button"
              onClick={() => setViewMode("slider")}
              className={cn(
                "px-3 py-1.5 text-xs font-semibold rounded-lg transition-all",
                viewMode === "slider" ? "bg-[#FFFFFF] text-[#302923] shadow-sm" : "text-[#81756B]"
              )}
            >
              Slider
            </button>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={cn(
                "px-3 py-1.5 text-xs font-semibold rounded-lg transition-all",
                viewMode === "grid" ? "bg-[#FFFFFF] text-[#302923] shadow-sm" : "text-[#81756B]"
              )}
            >
              All Routes ({routes.length})
            </button>
          </div>

          {viewMode === "slider" && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setSliderIndex((prev) => Math.max(prev - 1, 0))}
                disabled={sliderIndex === 0}
                className={cn(
                  "p-2 rounded-xl bg-[#FFFFFF] border border-[#E8DCD1] text-[#302923] hover:bg-[#F8EDE2]",
                  sliderIndex === 0 && "opacity-40 cursor-not-allowed pointer-events-none"
                )}
                aria-label="Previous routes"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setSliderIndex((prev) => Math.min(prev + 1, maxIndex))}
                disabled={sliderIndex >= maxIndex}
                className={cn(
                  "p-2 rounded-xl bg-[#FFFFFF] border border-[#E8DCD1] text-[#302923] hover:bg-[#F8EDE2]",
                  sliderIndex >= maxIndex && "opacity-40 cursor-not-allowed pointer-events-none"
                )}
                aria-label="Next routes"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Routes Display */}
      {viewMode === "slider" ? (
        <div className="overflow-hidden">
          <div
            className="flex gap-5 transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${sliderIndex * (100 / itemsPerView)}%)`,
            }}
          >
            {routes.map((route) => (
              <div
                key={route.id}
                className="w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)] shrink-0"
              >
                <PopularRouteCard route={route} onSelect={() => handleRouteClick(route.origin, route.destination)} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {routes.map((route) => (
            <PopularRouteCard
              key={route.id}
              route={route}
              onSelect={() => handleRouteClick(route.origin, route.destination)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function PopularRouteCard({
  route,
  onSelect,
}: {
  route: PopularRouteItem;
  onSelect: () => void;
}) {
  const [imageError, setImageError] = useState(false);

  return (
    <article
      onClick={onSelect}
      className="group flex flex-col h-full bg-[#FFFFFF] rounded-2xl overflow-hidden border border-[#E8DCD1] shadow-sm hover:shadow-card-hover hover:border-[#E65D36]/50 transition-all duration-300 cursor-pointer"
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
    >
      {/* Route Photography with Fallback */}
      <div className="relative aspect-[16/9] overflow-hidden bg-[#F8EDE2]">
        {!imageError && route.image ? (
          <img
            src={route.image}
            alt={route.alt || `${route.origin} to ${route.destination}`}
            loading="lazy"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#E65D36]/25 via-[#F2B544]/20 to-[#302724] flex items-center justify-center p-4">
            <MapPin className="w-8 h-8 text-[#E65D36] animate-pulse" aria-hidden="true" />
          </div>
        )}

        {/* Gradient Shadow */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

        {/* Trending Badge */}
        {route.trending && (
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 bg-[#F2B544] text-[#302923] text-[11px] font-bold rounded-full shadow-sm">
            <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Popular Corridor</span>
          </div>
        )}

        {/* Transport Modes Tag */}
        <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 z-10">
          {route.modes.map((m) => (
            <span key={m} className="px-2 py-0.5 rounded text-[10px] font-semibold bg-black/70 text-white backdrop-blur-sm">
              {m}
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center gap-2 text-base font-bold text-[#302923] group-hover:text-[#E65D36] transition-colors">
            <span className="truncate">{route.origin}</span>
            <ArrowRight className="w-4 h-4 text-[#E65D36] shrink-0" aria-hidden="true" />
            <span className="truncate">{route.destination}</span>
          </div>

          <div className="flex items-center justify-between text-xs text-[#81756B] mt-2">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#E65D36]" aria-hidden="true" />
              <span>{route.duration}</span>
            </span>
            <span className="font-medium bg-[#F8EDE2] px-2 py-0.5 rounded text-[11px]">
              {route.frequency}
            </span>
          </div>
        </div>

        {/* Price & Plan CTA */}
        <div className="pt-2.5 border-t border-[#E8DCD1] flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#81756B] block uppercase tracking-wider font-semibold">
              Simulated Fare From
            </span>
            <span className="font-extrabold text-[#E65D36] text-lg font-mono">
              {formatCurrency(route.fare)}
            </span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#E65D36] hover:bg-[#CC4827] rounded-xl transition-all shadow-sm flex items-center gap-1 group-hover:translate-x-0.5"
          >
            <span>Plan Route</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
}

export default PopularRoutes;