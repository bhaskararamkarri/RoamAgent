"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { ChevronDown, X, Search, MapPin, Building2, Train, Plane, Navigation2 } from "lucide-react";

export interface LocationOption {
  id: string;
  name: string;
  type: "city" | "station" | "airport" | "landmark";
  state?: string;
  aliases?: string[];
}

export interface AutocompleteProps {
  label?: string;
  value: string;
  onChange: (value: string, option?: LocationOption) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  fetchOptions: (query: string) => Promise<LocationOption[]>;
  getOptionLabel?: (option: LocationOption) => string;
  className?: string;
  autoFocus?: boolean;
  required?: boolean;
  variant?: "default" | "bare";
}

export function Autocomplete({
  label,
  value,
  onChange,
  placeholder = "Search location...",
  disabled = false,
  error,
  fetchOptions,
  getOptionLabel = (opt) => opt.name,
  className,
  autoFocus = false,
  required = false,
  variant = "default",
}: AutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<LocationOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [inputValue, setInputValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(value);
    setHighlightedIndex(-1);
  }, [value]);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchOptions = useCallback(
    async (query: string) => {
      setLoading(true);
      try {
        const results = await fetchOptions(query);
        setOptions(results);
        setHighlightedIndex(-1);
      } catch {
        setOptions([]);
      } finally {
        setLoading(false);
      }
    },
    [fetchOptions]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      searchOptions(newValue);
    }, 200);

    if (!isOpen) setIsOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) => Math.min(prev + 1, options.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => Math.max(prev - 1, -1));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && options[highlightedIndex]) {
          const selected = options[highlightedIndex];
          onChange(getOptionLabel(selected), selected);
          setInputValue(getOptionLabel(selected));
          setIsOpen(false);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
      case "Tab":
        setIsOpen(false);
        break;
    }
  };

  const handleOptionClick = (option: LocationOption) => {
    onChange(getOptionLabel(option), option);
    setInputValue(getOptionLabel(option));
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("", undefined);
    setInputValue("");
    setIsOpen(false);
  };

  const handleFocus = () => {
    searchOptions(inputValue);
    setIsOpen(true);
  };

  return (
    <div
      ref={wrapperRef}
      className={cn("relative w-full", className)}
    >
      {label && (
        <label className="block text-sm font-medium text-neutral-300 mb-1.5">
          {label} {required && <span className="text-danger-500">*</span>}
        </label>
      )}

      <div className="relative">
        {variant === "default" && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none">
            <Search className="w-4 h-4" aria-hidden="true" />
          </div>
        )}

        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onClick={(e) => e.currentTarget.select()}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          className={cn(
            "w-full text-sm text-neutral-50 placeholder-neutral-500 outline-none",
            "transition-colors duration-150",
            variant === "default" ? "glass-input pl-10 pr-10 py-2.5 bg-neutral-900/50" : "bg-transparent font-semibold",
            error && "border-red-500/50 focus:border-red-500 focus:ring-red-500/20",
          )}
          aria-autocomplete="list"
          aria-controls={isOpen ? "autocomplete-options" : undefined}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          role="combobox"
        />

        {inputValue && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
            aria-label="Clear input"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </motion.button>
        )}

        <div className="absolute right-10 top-1/2 -translate-y-1/2 pointer-events-none">
          <ChevronDown
            className={cn(
              "w-4 h-4 text-neutral-500 transition-transform",
              isOpen && "rotate-180"
            )}
            aria-hidden="true"
          />
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.99 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="absolute z-[100] w-full mt-1.5"
            role="listbox"
            id="autocomplete-options"
          >
            <div className="bg-[#1C1715]/95 backdrop-blur-xl rounded-xl border border-[#4B3C35] overflow-hidden shadow-2xl shadow-black/40 ring-1 ring-[#E65D36]/20">
              {loading && (
                <div className="p-4 flex items-center justify-center gap-2 text-sm text-[#C5B6AA]">
                  <div className="w-4 h-4 border-2 border-[#E65D36] border-t-transparent rounded-full animate-spin" />
                  Loading suggestions...
                </div>
              )}

              {!loading && options.length === 0 && inputValue.length >= 2 && (
                <div className="p-4 text-sm text-[#C5B6AA] text-center">
                  No destinations found for "{inputValue}"
                </div>
              )}

              {!loading && options.length > 0 && (
                <div className="px-3 pt-3 pb-1.5 flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#F2B544]">
                    {inputValue.trim().length === 0 ? "Popular Destinations" : "Search Results"}
                  </span>
                  <div className="h-px bg-[#4B3C35] flex-1"></div>
                </div>
              )}

              <ul
                ref={listRef}
                className="max-h-72 overflow-y-auto p-1.5"
                role="listbox"
              >
                {options.map((option, index) => (
                  <motion.li
                    key={option.id}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.015 }}
                    className={cn(
                      "px-3 py-2.5 my-0.5 rounded-lg text-sm cursor-pointer transition-all duration-150 flex items-center gap-3 group",
                      highlightedIndex === index || (!inputValue && index === 0 && highlightedIndex === -1)
                        ? "bg-[#302724] border border-[#4B3C35]"
                        : "border border-transparent hover:bg-[#302724]/60 hover:border-[#4B3C35]/50"
                    )}
                    role="option"
                    aria-selected={highlightedIndex === index}
                    onClick={() => handleOptionClick(option)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                  >
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm transition-colors",
                        option.type === "city" && "bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20",
                        option.type === "station" && "bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20",
                        option.type === "airport" && "bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20",
                        option.type === "landmark" && "bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20"
                      )}
                    >
                      {option.type === "city" && <Building2 className="w-4 h-4" />}
                      {option.type === "station" && <Train className="w-4 h-4" />}
                      {option.type === "airport" && <Plane className="w-4 h-4" />}
                      {option.type === "landmark" && <Navigation2 className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#FFF7EF] truncate">
                        {option.name}
                      </p>
                      {option.state && (
                        <p className="text-[11px] text-[#C5B6AA] truncate mt-0.5 font-medium">
                          {option.state}
                        </p>
                      )}
                    </div>
                    {option.type === "station" && (
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-md shrink-0 border border-emerald-500/30">
                        Station
                      </span>
                    )}
                    {option.type === "airport" && (
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded-md shrink-0 border border-amber-500/30">
                        Airport
                      </span>
                    )}
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <p className="mt-1.5 text-sm text-red-400 flex items-center gap-1" role="alert">
          <span className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
    </div>
  );
}