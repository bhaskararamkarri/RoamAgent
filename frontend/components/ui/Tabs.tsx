"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  badge?: string | number;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
  variant?: "line" | "enclosed" | "soft" | "pills";
  orientation?: "horizontal" | "vertical";
  fullWidth?: boolean;
}

export interface TabPanelProps {
  id?: string;
  activeTab?: string;
  children: React.ReactNode;
  className?: string;
}

export function Tabs({
  tabs,
  activeTab,
  onChange,
  className,
  variant = "line",
  orientation = "horizontal",
  fullWidth = false,
}: TabsProps) {
  const [indicatorStyle, setIndicatorStyle] = useState<{ width: number; transform: string }>({
    width: 0,
    transform: "translateX(0)",
  });
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!tabsRef.current) return;
    const activeTabElement = tabsRef.current.querySelector(
      `[data-tab-id="${activeTab}"]`
    );
    if (activeTabElement) {
      const rect = activeTabElement.getBoundingClientRect();
      const containerRect = tabsRef.current.getBoundingClientRect();
      setIndicatorStyle({
        width: rect.width,
        transform: `translateX(${rect.left - containerRect.left}px)`,
      });
    }
  }, [activeTab, tabs]);

  const variantClasses = {
    line: "border-b border-neutral-800",
    enclosed: "bg-neutral-900/50 border border-neutral-800 rounded-xl p-1",
    soft: "bg-transparent",
    pills: "bg-transparent",
  };

  const tabClasses = (tab: TabItem, isActive: boolean) => {
    const base = "relative flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950";
    
    if (tab.disabled) {
      return cn(base, "opacity-40 cursor-not-allowed text-neutral-500");
    }

    switch (variant) {
      case "line":
        return cn(
          base,
          isActive
            ? "text-brand-400"
            : "text-neutral-400 hover:text-neutral-200"
        );
      case "enclosed":
        return cn(
          base,
          "rounded-lg",
          isActive
            ? "bg-brand-500/20 text-brand-300 shadow-[0_0_15px_rgba(20,184,166,0.2)]"
            : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50"
        );
      case "soft":
        return cn(
          base,
          "rounded-lg",
          isActive
            ? "bg-brand-500/15 text-brand-300"
            : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50"
        );
      case "pills":
        return cn(
          base,
          "rounded-full",
          isActive
            ? "bg-brand-500 text-neutral-950 shadow-glow-brand"
            : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50"
        );
      default:
        return base;
    }
  };

  return (
    <div className={cn("w-full", className)} role="tablist" aria-orientation={orientation}>
      <div
        ref={tabsRef}
        className={cn(
          "flex",
          orientation === "vertical" ? "flex-col" : "flex-row",
          fullWidth && orientation === "horizontal" && "w-full",
          variantClasses[variant]
        )}
        role="tablist"
      >
        {variant === "line" && (
          <motion.div
            className="absolute bottom-0 left-0 h-[2px] bg-brand-500 rounded-full"
            style={indicatorStyle}
            initial={false}
            animate={indicatorStyle}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            aria-hidden="true"
          />
        )}

        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`${tab.id}-panel`}
            id={`${tab.id}-tab`}
            data-tab-id={tab.id}
            disabled={tab.disabled}
            onClick={() => !tab.disabled && onChange(tab.id)}
            className={cn(tabClasses(tab, activeTab === tab.id))}
            whileHover={tab.disabled ? undefined : { scale: 1.02 }}
            whileTap={tab.disabled ? undefined : { scale: 0.98 }}
          >
            {tab.icon && (
              <span className="flex-shrink-0" aria-hidden="true">
                {tab.icon}
              </span>
            )}
            <span>{tab.label}</span>
            {tab.badge && (
              <span
                className="ml-1.5 px-1.5 py-0.5 text-[10px] font-semibold rounded-full bg-brand-500/20 text-brand-300"
              >
                {tab.badge}
              </span>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

export function TabPanels({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("mt-4", className)}>{children}</div>;
}

export function TabPanel({
  id,
  activeTab,
  children,
  className,
}: TabPanelProps & { id: string }) {
  const isActive = activeTab === id;

  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          key={id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          id={`${id}-panel`}
          role="tabpanel"
          aria-labelledby={`${id}-tab`}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}