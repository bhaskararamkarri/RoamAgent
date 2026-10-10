"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import {
  MapPin,
  Search,
  Sparkles,
  ArrowRight,
  Filter,
  X,
  Compass,
  Train,
  SlidersHorizontal,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  DESTINATIONS,
  Destination,
  TourismRegion,
  DestinationCategory,
  searchDestinations,
  getDestinationStats,
} from "@/lib/destinations";

interface DestinationCarouselProps {
  title?: string;
  subtitle?: string;
  onSelectDestination?: (dest: Destination) => void;
  className?: string;
}

const REGION_TABS: { id: TourismRegion | "all"; label: string; count: number }[] = [
  { id: "all", label: "All India", count: 46 },
  { id: "north", label: "North India", count: 10 },
  { id: "south", label: "South India", count: 10 },
  { id: "east", label: "East India", count: 6 },
  { id: "west", label: "West India", count: 7 },
  { id: "central", label: "Central India", count: 5 },
  { id: "northeast", label: "Northeast", count: 8 },
];

const CATEGORIES: (DestinationCategory | "all")[] = [
  "all",
  "Heritage & Culture",
  "Metro Hub",
  "Nature & Hills",
  "Coastal & Beach",
  "Spiritual & Pilgrimage",
  "Wildlife & Safari",
];

export function DestinationCarousel({
  title = "Explore India",
  subtitle = "Connected journeys across all 28 states and 8 union territories",
  onSelectDestination,
  className,
}: DestinationCarouselProps) {
  const [selectedRegion, setSelectedRegion] = useState<TourismRegion | "all">("all");
  const [selectedCategory, setSelectedCategory] = useState<DestinationCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"slider" | "grid">("slider");
  const [sliderIndex, setSliderIndex] = useState(0);

  // Filtered destinations
  const filtered = useMemo(() => {
    return searchDestinations(searchQuery, selectedRegion, "all", selectedCategory);
  }, [searchQuery, selectedRegion, selectedCategory]);

  const stats = useMemo(() => getDestinationStats(), []);

  // Slider navigation
  const itemsPerView = 3;
  const maxSliderIndex = Math.max(0, filtered.length - itemsPerView);

  const handleNext = () => {
    setSliderIndex((prev) => Math.min(prev + 1, maxSliderIndex));
  };

  const handlePrev = () => {
    setSliderIndex((prev) => Math.max(prev - 1, 0));
  };

  const resetFilters = () => {
    setSelectedRegion("all");
    setSelectedCategory("all");
    setSearchQuery("");
    setSliderIndex(0);
  };

  const handleCardClick = (dest: Destination) => {
    if (onSelectDestination) {
      onSelectDestination(dest);
    } else {
      // Smooth scroll to planner
      const plannerEl = document.getElementById("planner") || document.getElementById("hero-heading");
      if (plannerEl) {
        plannerEl.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <section
      id="explore"
      className={cn("py-12 px-4 sm:px-6 lg:px-8 space-y-8 bg-[#FFF8F1] rounded-3xl border border-[#E8DCD1] text-[#302923] my-8", className)}
      aria-labelledby="explore-heading"
    >
      {/* Header and Live Catalogue Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E8DCD1] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFEFE6] text-[#CC4827] text-xs font-bold tracking-wide uppercase mb-2">
            <Compass className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Catalogue: {stats.statesRepresented} States • {stats.unionTerritoriesRepresented} UTs • {stats.totalDestinations} Destinations</span>
          </div>
          <h2 id="explore-heading" className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#302923]">
            {title}
          </h2>
          <p className="text-[#81756B] text-sm sm:text-base mt-1.5 max-w-2xl">
            {subtitle}
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="flex items-center bg-[#F8EDE2] p-1 rounded-xl border border-[#E8DCD1]">
            <button
              type="button"
              onClick={() => setViewMode("slider")}
              className={cn(
                "px-3 py-1.5 text-xs font-semibold rounded-lg transition-all",
                viewMode === "slider"
                  ? "bg-[#FFFFFF] text-[#302923] shadow-sm"
                  : "text-[#81756B] hover:text-[#302923]"
              )}
              aria-label="Carousel slider view"
            >
              Slider View
            </button>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={cn(
                "px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5",
                viewMode === "grid"
                  ? "bg-[#FFFFFF] text-[#302923] shadow-sm"
                  : "text-[#81756B] hover:text-[#302923]"
              )}
              aria-label="Grid view all"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>View All ({filtered.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search and Category Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative max-w-xl">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#81756B]" aria-hidden="true" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSliderIndex(0);
            }}
            placeholder="Search destination, state, station, or landmark..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#E8DCD1] text-[#302923] placeholder-[#81756B] text-sm focus:outline-none focus:ring-2 focus:ring-[#E65D36] focus:border-[#E65D36] shadow-sm transition-all"
            aria-label="Search destinations"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#81756B] hover:text-[#302923]"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* 6 Tourism Regions Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {REGION_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setSelectedRegion(tab.id);
                setSliderIndex(0);
              }}
              className={cn(
                "px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border",
                selectedRegion === tab.id
                  ? "bg-[#E65D36] text-white border-[#E65D36] shadow-sm"
                  : "bg-[#FFFFFF] text-[#81756B] border-[#E8DCD1] hover:border-[#E65D36]/40 hover:text-[#302923]"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-[#81756B] font-medium shrink-0 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            Category:
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setSelectedCategory(cat);
                setSliderIndex(0);
              }}
              className={cn(
                "px-2.5 py-1 rounded-md whitespace-nowrap transition-all text-xs font-medium",
                selectedCategory === cat
                  ? "bg-[#F8EDE2] text-[#CC4827] font-bold border border-[#E8DCD1]"
                  : "text-[#81756B] hover:text-[#302923] hover:bg-[#F8EDE2]/60"
              )}
            >
              {cat === "all" ? "All Categories" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content: Slider or Grid */}
      {filtered.length === 0 ? (
        /* Empty State */
        <div className="text-center py-16 px-4 bg-[#FFFFFF] rounded-2xl border border-[#E8DCD1] space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#FFEFE6] text-[#E65D36] flex items-center justify-center mx-auto">
            <Compass className="w-7 h-7" aria-hidden="true" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-lg font-bold text-[#302923]">No destinations match your filters</h3>
            <p className="text-sm text-[#81756B] mt-1">
              We couldn't find destinations in this region matching &ldquo;{searchQuery}&rdquo;. Try selecting All India or resetting your filters.
            </p>
          </div>
          <button
            type="button"
            onClick={resetFilters}
            className="px-4 py-2 text-sm font-semibold text-white bg-[#E65D36] hover:bg-[#CC4827] rounded-xl transition-all shadow-sm"
          >
            Reset All Filters
          </button>
        </div>
      ) : viewMode === "slider" ? (
        /* Slider Mode */
        <div className="relative">
          {/* Controls */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs text-[#81756B] font-medium">
              Showing {Math.min(filtered.length, sliderIndex + 1)}–{Math.min(filtered.length, sliderIndex + itemsPerView)} of {filtered.length} destinations
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrev}
                disabled={sliderIndex === 0}
                className={cn(
                  "p-2 rounded-xl bg-[#FFFFFF] border border-[#E8DCD1] text-[#302923] transition-all",
                  "hover:bg-[#F8EDE2] hover:border-[#E65D36]/40",
                  sliderIndex === 0 && "opacity-40 cursor-not-allowed pointer-events-none"
                )}
                aria-label="Previous destination slides"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={sliderIndex >= maxSliderIndex}
                className={cn(
                  "p-2 rounded-xl bg-[#FFFFFF] border border-[#E8DCD1] text-[#302923] transition-all",
                  "hover:bg-[#F8EDE2] hover:border-[#E65D36]/40",
                  sliderIndex >= maxSliderIndex && "opacity-40 cursor-not-allowed pointer-events-none"
                )}
                aria-label="Next destination slides"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Cards Track */}
          <div className="overflow-hidden">
            <div
              className="flex gap-5 transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${sliderIndex * (100 / itemsPerView)}%)`,
              }}
            >
              {filtered.map((dest) => (
                <div
                  key={dest.id}
                  className="w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)] shrink-0"
                >
                  <DestinationCard destination={dest} onSelect={() => handleCardClick(dest)} />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Grid Mode */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((dest) => (
            <DestinationCard key={dest.id} destination={dest} onSelect={() => handleCardClick(dest)} />
          ))}
        </div>
      )}
    </section>
  );
}

function DestinationCard({
  destination,
  onSelect,
}: {
  destination: Destination;
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
      {/* Destination Image with Fallback */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[#F8EDE2]">
        {!imageError && destination.image ? (
          <img
            src={destination.image}
            alt={destination.alt || destination.name}
            loading="lazy"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#E65D36]/20 via-[#F2B544]/20 to-[#302724] flex flex-col items-center justify-center p-4 text-center">
            <Compass className="w-8 h-8 text-[#E65D36] mb-2 animate-pulse" aria-hidden="true" />
            <span className="text-xs font-bold text-[#302923]">{destination.name}</span>
            <span className="text-[10px] text-[#81756B]">{destination.state}</span>
          </div>
        )}

        {/* Region & State Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span className="px-2 py-0.5 text-[11px] font-bold rounded-md bg-[#302724]/90 text-white backdrop-blur-sm shadow-sm">
            {destination.state}
          </span>
          <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-[#E65D36] text-white shadow-sm uppercase tracking-wider">
            {destination.region}
          </span>
        </div>

        {/* Category Pill */}
        <div className="absolute bottom-2.5 right-2.5 z-10">
          <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-black/60 text-white backdrop-blur-sm">
            {destination.category}
          </span>
        </div>
      </div>

      {/* Destination Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-bold text-lg text-[#302923] group-hover:text-[#E65D36] transition-colors truncate">
              {destination.name}
            </h3>
            <span className="text-[11px] font-mono text-[#81756B] shrink-0 font-semibold bg-[#F8EDE2] px-2 py-0.5 rounded">
              {destination.routeCount}+ routes
            </span>
          </div>

          <p className="text-xs text-[#81756B] line-clamp-2 mt-1.5 leading-relaxed">
            {destination.description}
          </p>

          <div className="flex items-center gap-1.5 text-[11px] text-[#81756B] mt-2.5 font-medium truncate">
            <Train className="w-3.5 h-3.5 text-[#E65D36] shrink-0" aria-hidden="true" />
            <span className="truncate">{destination.hubStation}</span>
          </div>
        </div>

        {/* Card CTA */}
        <div className="pt-2 border-t border-[#E8DCD1] flex items-center justify-between">
          <span className="text-xs font-semibold text-[#CC4827] flex items-center gap-1">
            <span>Plan Journey</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </span>
          <span className="text-[10px] text-[#81756B]">
            From {destination.suggestedOrigin}
          </span>
        </div>
      </div>
    </article>
  );
}

export default DestinationCarousel;