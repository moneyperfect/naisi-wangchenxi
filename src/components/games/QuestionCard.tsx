"use client";

import { useState } from "react";
import type { QuizQuestion } from "@/types";

interface QuestionCardProps {
  question: QuizQuestion;
  onAnswer: (answer: string) => void;
  index: number;
}

const optionLabels = ["A", "B", "C", "D"];

export function QuestionCard({ question, onAnswer, index }: QuestionCardProps) {
  const [selected, setSelected] = useState<string | null>(null);

  function handleSelect(option: string) {
    if (selected) return;
    setSelected(option);
    setTimeout(() => {
      onAnswer(option);
      setSelected(null);
    }, 400);
  }

  const options = [question.optionA, question.optionB, question.optionC, question.optionD];

  return (
    <div className="animate-fade-in-up">
      <h3 className="font-serif text-lg font-semibold text-stone-800 mb-6 text-center">
        {question.question}
      </h3>
      <div className="space-y-3">
        {options.map((opt, i) => {
          const label = optionLabels[i];
          const isSelected = selected === label;
          return (
            <button
              key={label}
              onClick={() => handleSelect(label)}
              className={`w-full text-left px-5 py-3.5 rounded-xl border transition-all duration-200 ${
                isSelected
                  ? "bg-warm-500 border-warm-500 text-white scale-[0.98]"
                  : "bg-white/60 border-warm-200/30 text-stone-700 hover:border-warm-300 hover:bg-warm-50"
              }`}
            >
              <span className="font-medium mr-2 text-sm opacity-60">{label}.</span>
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
