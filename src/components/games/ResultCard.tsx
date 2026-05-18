"use client";

import { useState, useEffect } from "react";
import { RotateCcw, Heart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { COUPLE } from "@/lib/constants";
import type { QuizQuestion } from "@/types";

interface ResultCardProps {
  questions: QuizQuestion[];
  answers: string[];
  partner: "A" | "B";
  onRestart: () => void;
}

export function ResultCard({ questions, answers, partner, onRestart }: ResultCardProps) {
  const [showScore, setShowScore] = useState(false);
  const partnerName = partner === "A" ? COUPLE.partnerA : COUPLE.partnerB;

  const correct = answers.filter((a, i) => a === questions[i].correct).length;
  const total = questions.length;
  const percent = Math.round((correct / total) * 100);

  useEffect(() => {
    const timer = setTimeout(() => setShowScore(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const getMessage = () => {
    if (percent >= 90) return "心有灵犀！你们太了解彼此了";
    if (percent >= 70) return "默契十足！继续加油";
    if (percent >= 50) return "还不错，还有进步空间";
    return "需要多了解对方一些哦";
  };

  return (
    <div className="text-center space-y-6">
      <div className="py-8">
        <Heart
          size={48}
          className={`mx-auto text-warm-400 mb-4 transition-all duration-1000 ${
            showScore ? "scale-100 opacity-100" : "scale-50 opacity-0"
          }`}
          fill="currentColor"
        />
        <p className="text-sm text-stone-500 mb-2">{partnerName} 的得分</p>
        <div
          className={`transition-all duration-700 delay-300 ${
            showScore ? "scale-100 opacity-100" : "scale-75 opacity-0"
          }`}
        >
          <span className="text-6xl font-serif font-bold text-warm-600">
            {correct}
          </span>
          <span className="text-2xl text-stone-400 font-light"> / {total}</span>
        </div>
        <p className="text-sm text-stone-500 mt-3">{getMessage()}</p>
      </div>

      <div className="space-y-2">
        {questions.map((q, i) => {
          const isCorrect = answers[i] === q.correct;
          return (
            <div
              key={q.id}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm ${
                isCorrect
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-rose-50 text-rose-600"
              }`}
            >
              <span className="shrink-0">{isCorrect ? "✓" : "✗"}</span>
              <span className="truncate">{q.question}</span>
            </div>
          );
        })}
      </div>

      <Button onClick={onRestart} variant="secondary" className="w-full">
        <RotateCcw size={16} />
        再来一次
      </Button>
    </div>
  );
}
