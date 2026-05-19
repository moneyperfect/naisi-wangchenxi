"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDate } from "@/lib/utils";

interface HistoryItem {
  id: number;
  question: string;
  createdAt: Date;
  answers: Record<string, string>;
}

interface AnswerHistoryProps {
  items: HistoryItem[];
}

export function AnswerHistory({ items }: AnswerHistoryProps) {
  const [openId, setOpenId] = useState<number | null>(null);

  if (items.length === 0) return null;

  return (
    <div className="space-y-3">
      <p className="text-xs text-stone-400 font-medium">往期问答</p>
      {items.map((item) => {
        const isOpen = openId === item.id;
        const authors = Object.keys(item.answers);
        return (
          <div
            key={item.id}
            className="bg-white/60 rounded-2xl border border-warm-200/30 overflow-hidden"
          >
            <button
              onClick={() => setOpenId(isOpen ? null : item.id)}
              className="w-full flex items-center gap-3 p-4 text-left"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm text-stone-700 font-serif line-clamp-1">
                  {item.question}
                </p>
                <p className="text-xs text-stone-400 mt-0.5">
                  {formatDate(item.createdAt.toString())}
                </p>
              </div>
              {isOpen ? (
                <ChevronUp size={16} className="text-stone-400 shrink-0" />
              ) : (
                <ChevronDown size={16} className="text-stone-400 shrink-0" />
              )}
            </button>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 grid grid-cols-2 gap-3">
                    {authors.map((author) => (
                      <div
                        key={author}
                        className="bg-warm-50 rounded-xl p-3"
                      >
                        <p className="text-xs font-medium text-warm-500 mb-1">
                          {author}
                        </p>
                        <p className="text-sm text-stone-600 leading-relaxed">
                          {item.answers[author]}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
