"use client";

import { useState, useMemo } from "react";
import { Heart, Trophy, RotateCcw, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { COUPLE } from "@/lib/constants";
import { QuestionForm } from "./QuestionForm";
import type { QuizQuestion } from "@/types";

type Phase = "idle" | "playing" | "result";

interface QuizGameProps {
  questions: QuizQuestion[];
}

export function QuizGame({ questions }: QuizGameProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showForm, setShowForm] = useState(false);

  const pool = useMemo(() => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(10, shuffled.length));
  }, [questions, phase]);

  const total = pool.length;
  const question = pool[current];

  function handleSelect(option: string) {
    if (selected) return;
    setSelected(option);
    if (option === question.correct) {
      setScore((s) => s + 1);
    }
    setTimeout(() => {
      if (current + 1 < total) {
        setCurrent((c) => c + 1);
        setSelected(null);
      } else {
        setPhase("result");
      }
    }, 800);
  }

  function startGame() {
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setPhase("playing");
  }

  if (questions.length === 0) {
    return (
      <div className="text-center space-y-6">
        <div className="inline-flex p-4 rounded-full bg-emerald-50 text-emerald-500">
          <Heart size={40} fill="currentColor" />
        </div>
        <div>
          <h2 className="font-serif text-xl font-bold text-stone-800 mb-1">
            默契测试
          </h2>
          <p className="text-sm text-stone-400">还没有题目哦</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-500 text-white font-medium hover:bg-emerald-600 active:scale-95 transition-all"
        >
          <Plus size={16} />
          添加第一道题
        </button>
        {showForm && (
          <div className="mt-4">
            <QuestionForm onClose={() => setShowForm(false)} />
          </div>
        )}
      </div>
    );
  }

  if (phase === "idle") {
    return (
      <div className="text-center space-y-6">
        <div className="inline-flex p-4 rounded-full bg-emerald-50 text-emerald-500">
          <Heart size={40} fill="currentColor" />
        </div>
        <div>
          <h2 className="font-serif text-xl font-bold text-stone-800 mb-1">
            默契测试
          </h2>
          <p className="text-sm text-stone-400">
            共 {questions.length} 道题，随机抽取 {total} 道
          </p>
        </div>
        <button
          onClick={startGame}
          className="w-full py-3 rounded-2xl bg-emerald-500 text-white font-medium hover:bg-emerald-600 active:scale-95 transition-all"
        >
          开始测试
        </button>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-xs text-stone-400 hover:text-stone-600 transition-colors"
        >
          {showForm ? "收起" : "添加新题目"}
        </button>
        {showForm && <QuestionForm onClose={() => setShowForm(false)} />}
      </div>
    );
  }

  if (phase === "result") {
    const pct = Math.round((score / total) * 100);
    return (
      <div className="text-center space-y-6">
        <div className="inline-flex p-4 rounded-full bg-emerald-50 text-emerald-500">
          <Trophy size={40} />
        </div>
        <div>
          <p className="text-6xl font-serif font-bold text-emerald-600 tabular-nums">
            {score}/{total}
          </p>
          <p className="text-sm text-stone-400 mt-1">
            正确率 {pct}%{" "}
            {pct === 100 ? "满分！太默契了！" : pct >= 70 ? "很棒！" : "继续加油~"}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={startGame}
            className="flex-1 py-3 rounded-2xl bg-emerald-500 text-white font-medium hover:bg-emerald-600 active:scale-95 transition-all inline-flex items-center justify-center gap-2"
          >
            <RotateCcw size={16} />
            再来一次
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex-1 py-3 rounded-2xl border border-emerald-300 text-emerald-600 font-medium hover:bg-emerald-50 active:scale-95 transition-all"
          >
            添加题目
          </button>
        </div>
        {showForm && (
          <div className="mt-4">
            <QuestionForm onClose={() => setShowForm(false)} />
          </div>
        )}
      </div>
    );
  }

  // playing phase
  const options = ["A", "B", "C", "D"].filter(
    (k) => question[`option${k}` as keyof QuizQuestion]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-xs text-stone-400">
          {current + 1} / {total}
        </p>
        <p className="text-xs text-emerald-500 font-medium">
          {score} 分
        </p>
      </div>

      <div>
        <div className="w-full bg-stone-100 rounded-full h-1 mb-4">
          <div
            className="bg-emerald-500 h-1 rounded-full transition-all duration-300"
            style={{ width: `${((current + 1) / total) * 100}%` }}
          />
        </div>
        <h3 className="font-serif text-lg font-semibold text-stone-800 text-center">
          {question.question}
        </h3>
      </div>

      <div className="space-y-3">
        {options.map((key) => {
          const value = question[`option${key}` as keyof QuizQuestion] as string;
          const isCorrect = key === question.correct;
          const isSelected = selected === key;
          const showResult = selected !== null;

          return (
            <button
              key={key}
              onClick={() => handleSelect(key)}
              disabled={!!selected}
              className={cn(
                "w-full text-left px-5 py-4 rounded-2xl border transition-all duration-200",
                !showResult && "border-warm-200/50 bg-white hover:border-emerald-300 hover:bg-emerald-50/50 active:scale-[0.98]",
                showResult && isCorrect && "border-emerald-400 bg-emerald-50 text-emerald-700",
                showResult && isSelected && !isCorrect && "border-red-300 bg-red-50 text-red-600",
                showResult && !isSelected && !isCorrect && "border-stone-200/50 bg-stone-50 text-stone-400"
              )}
            >
              <span className="text-sm font-medium">
                {key}. {value}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
