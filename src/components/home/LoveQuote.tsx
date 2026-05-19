"use client";

import { useState, useEffect } from "react";
import { LOVE_QUOTES } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";

export function LoveQuote() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
        86400000
    );
    setIndex(dayOfYear % LOVE_QUOTES.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % LOVE_QUOTES.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center px-8 py-2 h-12 flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          className="text-sm text-stone-400 italic font-serif"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.5 }}
        >
          "{LOVE_QUOTES[index]}"
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
