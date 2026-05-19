"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { COUPLE } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
  question: string;
  onSubmit: (author: string, answer: string) => Promise<void>;
  submitting: boolean;
  hasOneAnswer?: boolean;
}

export function QuestionCard({ question, onSubmit, submitting, hasOneAnswer }: QuestionCardProps) {
  const [author, setAuthor] = useState(COUPLE.partnerA);
  const [answer, setAnswer] = useState("");

  const handleSubmit = async () => {
    if (!answer.trim()) return;
    await onSubmit(author, answer.trim());
  };

  return (
    <div className="bg-white/60 rounded-3xl p-6 border border-warm-200/30">
      <p className="text-xs text-warm-400 text-center mb-2 font-medium tracking-wider uppercase">
        今日一问
      </p>
      <p className="font-serif text-xl text-stone-800 text-center leading-relaxed mb-4">
        {question}
      </p>

      {hasOneAnswer && (
        <p className="text-xs text-warm-500 text-center mb-4 bg-warm-50 rounded-xl py-2 px-3">
          TA 已经答了，等你呢！
        </p>
      )}

      <div className="flex gap-2 mb-4">
        {[COUPLE.partnerA, COUPLE.partnerB].map((name) => (
          <button
            key={name}
            onClick={() => setAuthor(name)}
            className={cn(
              "flex-1 py-2 rounded-xl text-sm font-medium transition-all",
              author === name
                ? "bg-warm-500 text-white shadow-sm"
                : "bg-warm-100 text-stone-500 hover:bg-warm-200"
            )}
          >
            {name}
          </button>
        ))}
      </div>

      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="写下你的答案..."
        rows={4}
        className="w-full bg-warm-50 rounded-2xl p-4 text-sm text-stone-700 placeholder:text-stone-300 border border-warm-200/50 focus:outline-none focus:ring-2 focus:ring-warm-300 resize-none mb-4"
      />

      <Button
        onClick={handleSubmit}
        disabled={!answer.trim() || submitting}
        className="w-full"
      >
        <Send size={16} />
        {submitting ? "提交中..." : "提交答案"}
      </Button>
    </div>
  );
}
