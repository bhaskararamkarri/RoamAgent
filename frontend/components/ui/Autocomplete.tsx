"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { ChevronDown, X, Search, MapPin } from "lucide-react";

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
      if (!query.trim() || query.length < 2) {
        setOptions([]);
        return;
      }
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
    if (inputValue.length >= 2) {
      searchOptions(inputValue);
    }
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
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none">
          <Search className="w-4 h-4" aria-hidden="true" />
        </div>

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
            "glass-input w-full pl-10 pr-10 py-2.5 text-sm text-neutral-50 placeholder-neutral-500",
            "transition-colors duration-150",
            error && "border-red-500/50 focus:border-red-500 focus:ring-red-500/20",
            "bg-neutral-900/50"
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
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="absolute z-[100] w-full mt-1"
            role="listbox"
            id="autocomplete-options"
          >
            <div className="glass-elevated rounded-xl border border-neutral-700 overflow-hidden shadow-elevated">
              {loading && (
                <div className="p-3 flex items-center gap-2 text-sm text-neutral-400">
                  <div className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                  Searching locations...
                </div>
              )}

              {!loading && options.length === 0 && inputValue.length >= 2 && (
                <div className="p-3 text-sm text-neutral-400 text-center">
                  No locations found for "{inputValue}"
                </div>
              )}

              {!loading && options.length === 0 && inputValue.length < 2 && (
                <div className="p-3 text-sm text-neutral-500 text-center">
                  Type at least 2 characters to search
                </div>
              )}

              <ul
                ref={listRef}
                className="max-h-60 overflow-y-auto"
                role="listbox"
              >
                {options.map((option, index) => (
                  <motion.li
                    key={option.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className={cn(
                      "px-3 py-2.5 text-sm cursor-pointer transition-colors",
                      "hover:bg-neutral-800/50",
                      highlightedIndex === index && "bg-neutral-800/50 text-neutral-50"
                    )}
                    role="option"
                    aria-selected={highlightedIndex === index}
                    onClick={() => handleOptionClick(option)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={cn(
                          "w-5 h-5 rounded-lg flex items-center justify-center shrink-0",
                          option.type === "city" && "bg-blue-500/20 text-blue-400",
                          option.type === "station" && "bg-emerald-500/20 text-emerald-400",
                          option.type === "airport" && "bg-amber-500/20 text-amber-400",
                          option.type === "landmark" && "bg-purple-500/20 text-purple-400"
                        )}
                      >
                        {option.type === "city" && <MapPin className="w-3 h-3" />}
                        {option.type === "station" && <MapPin className="w-3 h-3" />}
                        {option.type === "airport" && <MapPin className="w-3 h-3" />}
                        {option.type === "landmark" && <MapPin className="w-3 h-3" />}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-neutral-50 truncate">
                          {option.name}
                        </p>
                        {option.state && (
                          <p className="text-xs text-neutral-400 truncate">
                            {option.state}
                          </p>
                        )}
                      </div>
                      {option.type === "station" && (
                        <span className="text-xs px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full">
                          Terminal
                        </span>
                      )}
                      {option.type === "airport" && (
                        <span className="text-xs px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded-full">
                          Airport
                        </span>
                      )}
                    </div>
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