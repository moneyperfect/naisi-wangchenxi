"use client";

import { useState } from "react";
import { QuestionCard } from "./QuestionCard";
import { ResultCard } from "./ResultCard";
import { Button } from "@/components/ui/Button";
import { COUPLE } from "@/lib/constants";
import type { QuizQuestion } from "@/types";

type Phase = "selecting" | "answering" | "result";

interface QuizGameProps {
  questions: QuizQuestion[];
}

export function QuizGame({ questions }: QuizGameProps) {
  const [phase, setPhase] = useState<Phase>("selecting");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [partner, setPartner] = useState<"A" | "B">("A");

  function handleAnswer(answer: string) {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setPhase("result");
    }
  }

  function reset() {
    setPhase("selecting");
    setCurrentQ(0);
    setAnswers([]);
  }

  if (phase === "selecting") {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <p className="text-stone-500 text-sm mb-4">谁来回答？</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                setPartner("A");
                setPhase("answering");
              }}
              className="px-8 py-4 rounded-2xl bg-warm-100 hover:bg-warm-200 text-warm-700 font-serif font-semibold transition-all"
            >
              {COUPLE.partnerA}
            </button>
            <button
              onClick={() => {
                setPartner("B");
                setPhase("answering");
              }}
              className="px-8 py-4 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-serif font-semibold transition-all"
            >
              {COUPLE.partnerB}
            </button>
          </div>
        </div>
        <p className="text-center text-xs text-stone-400">
          共 {questions.length} 道题，测测你有多了解对方
        </p>
      </div>
    );
  }

  if (phase === "result") {
    return (
      <ResultCard
        questions={questions}
        answers={answers}
        partner={partner}
        onRestart={reset}
      />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-stone-400">
          {partner === "A" ? COUPLE.partnerA : COUPLE.partnerB} 回答中
        </span>
        <span className="text-sm text-warm-500 font-medium">
          {currentQ + 1} / {questions.length}
        </span>
      </div>
      <div className="w-full bg-warm-100 rounded-full h-1.5 mb-6">
        <div
          className="bg-warm-500 h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
        />
      </div>
      <QuestionCard
        question={questions[currentQ]}
        onAnswer={handleAnswer}
        index={currentQ}
      />
    </div>
  );
}
