"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dices, PartyPopper } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DateIdea } from "@/types";

const typeEmoji: Record<string, string> = {
  户外: "🌿",
  室内: "🏠",
  美食: "🍜",
  冒险: "🚀",
  其他: "✨",
};

interface RandomizerProps {
  ideas: DateIdea[];
}

export function Randomizer({ ideas }: RandomizerProps) {
  const [spinning, setSpinning] = useState(false);
  const [currentIdea, setCurrentIdea] = useState<DateIdea | null>(null);
  const [showResult, setShowResult] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const spin = useCallback(() => {
    if (ideas.length === 0 || spinning) return;

    setSpinning(true);
    setShowResult(false);
    setCurrentIdea(null);

    let elapsed = 0;
    const totalDuration = 2000;
    const startInterval = 50;

    const tick = () => {
      const randomIndex = Math.floor(Math.random() * ideas.length);
      setCurrentIdea(ideas[randomIndex]);
      elapsed += startInterval;

      const progress = elapsed / totalDuration;
      const nextInterval = startInterval + progress * 300;

      if (elapsed >= totalDuration) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setSpinning(false);
        setShowResult(true);
        return;
      }

      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(tick, nextInterval);
    };

    intervalRef.current = setInterval(tick, startInterval);
  }, [ideas, spinning]);

  const isEmpty = ideas.length === 0;

  return (
    <div className="flex flex-col items-center py-4">
      <div className="relative w-full max-w-xs aspect-square flex items-center justify-center mb-6">
        <AnimatePresence mode="wait">
          {showResult && currentIdea ? (
            <motion.div
              key="result"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 15, stiffness: 200 }}
              className="text-center"
            >
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-4xl mb-3"
              >
                {typeEmoji[currentIdea.type] ?? "✨"}
              </motion.div>
              <h3 className="font-serif text-xl font-bold text-stone-800 mb-1">
                {currentIdea.title}
              </h3>
              {currentIdea.location && (
                <p className="text-sm text-stone-400">
                  {currentIdea.location}
                </p>
              )}
              {currentIdea.duration && (
                <p className="text-xs text-stone-300 mt-0.5">
                  {currentIdea.duration}
                </p>
              )}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
                className="mt-3"
              >
                <span className="inline-flex items-center gap-1 text-xs text-warm-500 bg-warm-50 px-3 py-1 rounded-full">
                  <PartyPopper size={12} />
                  就决定是这个了！
                </span>
              </motion.div>
            </motion.div>
          ) : spinning && currentIdea ? (
            <motion.div
              key="spinning"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center"
            >
              <p className="text-3xl mb-2">
                {typeEmoji[currentIdea.type] ?? "✨"}
              </p>
              <p className="font-serif text-lg font-semibold text-stone-700">
                {currentIdea.title}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <Dices size={48} className="text-warm-300 mx-auto mb-3" />
              <p className="text-sm text-stone-400">
                {isEmpty ? "先添加一些约会点子吧" : "摇一摇，看看今天的运气"}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.button
        onClick={spin}
        disabled={isEmpty || spinning}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.02 }}
        className={cn(
          "inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold transition-all shadow-lg",
          isEmpty
            ? "bg-stone-200 text-stone-400 cursor-not-allowed shadow-none"
            : spinning
              ? "bg-warm-400 text-white animate-pulse"
              : "bg-warm-500 text-white hover:bg-warm-600 shadow-warm-500/30"
        )}
      >
        <Dices size={18} className={spinning ? "animate-spin" : ""} />
        {spinning ? "抽取中..." : "摇一摇"}
      </motion.button>
    </div>
  );
}
