"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import {
  Mic,
  MicOff,
  Send,
  HelpCircle,
  Sparkles,
  Compass,
  Zap,
  Moon,
  Accessibility,
  ChevronDown,
  X,
} from "lucide-react";
import { ScenarioItem } from "@/lib/types";

interface IntakeFormProps {
  onParseText: (text: string) => Promise<void>;
  loading: boolean;
  followupQuestion: string | null;
  onSubmitFollowup: (answer: string) => Promise<void>;
  scenarios: ScenarioItem[];
  onSelectScenario: (scenario: ScenarioItem) => void;
  lang: "en" | "te";
}

const EXAMPLE_PROMPTS = [
  {
    text: "Vizag to Hitech City tomorrow by 9 AM for 2 people with budget 5000",
    tag: "Best Value",
    icon: Zap,
  },
  {
    text: "Vizag to Miyapur tomorrow by 8:30 AM sleeper bus 1 person",
    tag: "Night Sleeper",
    icon: Moon,
  },
  {
    text: "Vizag to Hitech City tomorrow by 9 AM for 2 wheelchair accessible",
    tag: "Accessible",
    icon: Accessibility,
  },
];

export function IntakeForm({
  onParseText,
  loading,
  followupQuestion,
  onSubmitFollowup,
  scenarios,
  onSelectScenario,
  lang,
}: IntakeFormProps) {
  const [inputText, setInputText] = useState("");
  const [followupAnswer, setFollowupAnswer] = useState("");
  const [speechSupported, setSpeechSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showScenarios, setShowScenarios] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasSpeech = "SpeechRecognition" in window || "webkitSpeechRecognition" in window;
      setSpeechSupported(hasSpeech);
    }
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [inputText]);

  const handleStartVoice = () => {
    if (!speechSupported || typeof window === "undefined") return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = lang === "te" ? "te-IN" : "en-IN";
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setInputText(transcript);
    };

    try {
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || loading) return;
    onParseText(inputText);
  };

  const handleFollowupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!followupAnswer.trim() || loading) return;
    onSubmitFollowup(followupAnswer);
    setFollowupAnswer("");
  };

  const handleSelectQuickPrompt = (text: string) => {
    setInputText(text);
    onParseText(text);
  };

  const handleScenarioSelect = (scenario: ScenarioItem) => {
    setInputText(scenario.text);
    onSelectScenario(scenario);
    setShowScenarios(false);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="glass-card rounded-2xl p-5 sm:p-6 shadow-card space-y-5 border border-neutral-800"
      aria-labelledby="intake-heading"
    >
      {/* Header & Scenario Selector */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-800"
      >
        <div className="flex items-center gap-2">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 20 }}
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
            aria-hidden="true"
          >
            <Sparkles className="w-4 h-4" />
          </motion.div>
          <div>
            <h2 id="intake-heading" className="font-display font-semibold text-lg sm:text-xl tracking-tight text-neutral-50">
              Where would you like to travel?
            </h2>
            <p className="text-sm text-neutral-400 mt-0.5">
              Describe your multi-leg itinerary in natural English or Telugu.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {scenarios.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
              className="relative"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowScenarios(!showScenarios)}
                className="gap-2 px-3 py-1.5"
                aria-haspopup="listbox"
                aria-expanded={showScenarios}
                aria-label="Load preset scenario"
              >
                <Compass className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                <span className="hidden sm:inline font-medium text-neutral-300">Preset Scenarios</span>
                <ChevronDown className={cn("w-3.5 h-3.5 text-neutral-500 transition-transform", showScenarios && "rotate-180")} aria-hidden="true" />
              </Button>

              <AnimatePresence>
                {showScenarios && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-72 rounded-lg bg-neutral-900 border border-neutral-800 shadow-elevated overflow-hidden ring-1 ring-neutral-800"
                    role="listbox"
                  >
                    <div className="p-2">
                      {scenarios.map((s) => (
                        <motion.button
                          key={s.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          onClick={() => handleScenarioSelect(s)}
                          className="w-full px-3 py-2 text-left text-sm font-medium text-neutral-200 hover:bg-neutral-800 rounded-md transition-colors focus-visible:outline-none focus-visible:bg-neutral-800"
                          role="option"
                        >
                          {s.title}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Main Natural Language Chat Input */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="relative"
      >
        <div className="relative rounded-xl bg-neutral-900/50 border border-neutral-800 focus-within:border-emerald-500/50 focus-within:ring-1 focus-within:ring-emerald-500/20 transition-all duration-200">
          <textarea
            ref={textareaRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="e.g. Need to travel from Vizag to Hitech City tomorrow by 9:00 AM for 2 people with a budget under ₹5000..."
            rows={3}
            className="w-full bg-transparent rounded-xl p-4 text-sm text-neutral-50 placeholder-neutral-500 focus:outline-none resize-none pr-28 min-h-[100px] max-h-[160px]"
            disabled={loading}
            aria-label="Travel request description"
          />

          <div className="absolute right-3 bottom-3 flex items-center gap-2">
            {speechSupported && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={handleStartVoice}
                disabled={loading}
                className={cn(
                  "p-2.5 rounded-lg transition-all duration-200",
                  isListening
                    ? "bg-red-500/15 text-red-300 border border-red-500/30 shadow-[0_0_12px_rgba(239,68,68,0.2)]"
                    : "bg-neutral-800/50 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 border border-neutral-700",
                  loading && "opacity-50 cursor-not-allowed"
                )}
                title="Voice Input (Speech-to-Text)"
                aria-label="Voice Input"
                aria-pressed={isListening}
              >
                {isListening ? <MicOff className="w-4 h-4 text-red-400" /> : <Mic className="w-4 h-4" />}
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={!inputText.trim() || loading}
              className="btn btn-primary btn-md"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Planning...</span>
                </>
              ) : (
                <>
                  <span>Plan Trip</span>
                  <Send className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.form>

      {/* Inline Single Follow-up Clarification */}
      <AnimatePresence mode="wait">
        {followupQuestion && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="p-4 bg-amber-950/30 border border-amber-500/30 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in"
            role="alert"
          >
            <div className="flex items-start gap-2.5 text-amber-200">
              <div className="p-1.5 rounded-lg bg-amber-500/15 border border-amber-500/20 text-amber-400 shrink-0">
                <HelpCircle className="w-4 h-4" aria-hidden="true" />
              </div>
              <div>
                <p className="font-semibold text-amber-300 uppercase tracking-wider text-[10px] mb-0.5">
                  Clarification Needed
                </p>
                <p className="text-amber-100 font-medium text-sm">{followupQuestion}</p>
              </div>
            </div>

            <motion.form
              onSubmit={handleFollowupSubmit}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-2 w-full sm:w-auto"
            >
              <Input
                value={followupAnswer}
                onChange={(e) => setFollowupAnswer(e.target.value)}
                placeholder="Your answer..."
                className="bg-neutral-900 border-amber-500/40 text-sm max-w-[200px]"
              />
              <Button type="submit" size="sm" disabled={!followupAnswer.trim() || loading}>
                Reply
              </Button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Prompt Pills */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.3 }}
        className="flex flex-wrap items-center gap-2 pt-1"
      >
        <span className="text-neutral-500 font-medium text-xs mr-1">Quick prompts:</span>
        {EXAMPLE_PROMPTS.map((item, idx) => {
          const IconComp = item.icon;
          return (
            <motion.button
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + idx * 0.05 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => handleSelectQuickPrompt(item.text)}
              disabled={loading}
              className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 hover:text-neutral-50 border border-neutral-800 hover:border-emerald-500/40 transition-all duration-200 text-xs font-medium shadow-sm"
            >
              <motion.div
                whileHover={{ scale: 1.15 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="text-emerald-400"
              >
                <IconComp className="w-3.5 h-3.5" aria-hidden="true" />
              </motion.div>
              <span className="truncate max-w-[200px]">{item.text}</span>
              <Badge variant="outline" size="sm" className="ml-1 hidden sm:inline-flex">
                {item.tag}
              </Badge>
            </motion.button>
          );
        })}
      </motion.div>
    </motion.section>
  );
}