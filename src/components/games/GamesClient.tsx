"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { QuizGame } from "./QuizGame";
import { ScoreBoard } from "./ScoreBoard";
import { ScoreCreateButton } from "./ScoreCreateButton";
import type { QuizQuestion, GameScore } from "@/types";

interface GamesClientProps {
  questions: QuizQuestion[];
  scores: GameScore[];
}

export function GamesClient({ questions, scores }: GamesClientProps) {
  const [tab, setTab] = useState<"quiz" | "score">("quiz");
  const [scoreList, setScoreList] = useState(scores);

  const refreshScores = useCallback(async () => {
    const { getGameScores } = await import("@/lib/actions");
    const fresh = await getGameScores();
    setScoreList(fresh);
  }, []);

  return (
    <div>
      {/* Tab Switcher */}
      <div className="flex bg-stone-100 rounded-full p-0.5 mb-6">
        <button
          onClick={() => setTab("quiz")}
          className={cn(
            "flex-1 py-2 rounded-full text-sm font-medium transition-all",
            tab === "quiz"
              ? "bg-white text-stone-700 shadow-sm"
              : "text-stone-400 hover:text-stone-600"
          )}
        >
          默契测试
        </button>
        <button
          onClick={() => setTab("score")}
          className={cn(
            "flex-1 py-2 rounded-full text-sm font-medium transition-all",
            tab === "score"
              ? "bg-white text-stone-700 shadow-sm"
              : "text-stone-400 hover:text-stone-600"
          )}
        >
          计分板
        </button>
      </div>

      {/* Content */}
      {tab === "quiz" ? (
        <QuizGame questions={questions} />
      ) : (
        <div>
          <div className="flex justify-end mb-3">
            <ScoreCreateButton onCreated={refreshScores} />
          </div>
          <ScoreBoard scores={scoreList} onRefresh={refreshScores} />
        </div>
      )}
    </div>
  );
}
