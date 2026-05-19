"use client";

import { useState, useEffect } from "react";
import { COUPLE } from "@/lib/constants";
import { getTimeDiff } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

function AnimatedDigit({ value }: { value: number }) {
  return (
    <span className="inline-block relative overflow-hidden h-[1.2em]">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="inline-block"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export function DaysCounter() {
  const [time, setTime] = useState(getTimeDiff(COUPLE.startDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getTimeDiff(COUPLE.startDate));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center py-6 px-4">
      <p className="text-sm text-stone-500 mb-3">我们已经在一起</p>
      <div className="inline-flex items-baseline gap-1">
        <span className="text-6xl font-serif font-bold text-warm-600 tabular-nums">
          <AnimatedDigit value={time.days} />
        </span>
        <span className="text-xl text-stone-500 font-light">天</span>
      </div>
      <div className="flex justify-center gap-4 mt-3 text-stone-400">
        <span className="text-sm tabular-nums">{time.hours}时</span>
        <span className="text-warm-300">·</span>
        <span className="text-sm tabular-nums">{time.minutes}分</span>
        <span className="text-warm-300">·</span>
        <span className="text-sm tabular-nums">{time.seconds}秒</span>
      </div>
    </div>
  );
}
