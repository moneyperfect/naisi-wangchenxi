"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { COUPLE } from "@/lib/constants";

interface RevealAnimationProps {
  question: string;
  answers: Record<string, string>;
}

export function RevealAnimation({ question, answers }: RevealAnimationProps) {
  const orderedAuthors = [COUPLE.partnerA, COUPLE.partnerB].filter(
    (a) => a in answers
  );

  return (
    <div className="space-y-6">
      <div className="bg-white/60 rounded-3xl p-6 border border-warm-200/30">
        <p className="text-xs text-warm-400 text-center mb-2 font-medium tracking-wider uppercase">
          今日一问
        </p>
        <p className="font-serif text-xl text-stone-800 text-center leading-relaxed">
          {question}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {orderedAuthors.map((author, i) => (
          <motion.div
            key={author}
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: i * 0.2, ease: "easeOut" }}
            className="bg-white/60 rounded-2xl p-4 border border-warm-200/30"
          >
            <p className="text-xs font-medium text-warm-500 mb-2">{author}</p>
            <p className="text-sm text-stone-700 leading-relaxed">
              {answers[author]}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
        className="flex justify-center"
      >
        <div className="p-3 rounded-full bg-warm-100 text-warm-400">
          <Heart size={24} fill="currentColor" />
        </div>
      </motion.div>
    </div>
  );
}
