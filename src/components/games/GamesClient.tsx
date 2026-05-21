"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { WhackAMole } from "./WhackAMole";
import { ScoreBoard } from "./ScoreBoard";
import type { GameScore } from "@/types";

interface GamesClientProps {
  scores: GameScore[];
}

export function GamesClient({ scores }: GamesClientProps) {
  const [tab, setTab] = useState<"game" | "score">("game");
  const [scoreList, setScoreList] = useState(scores);

  const refreshScores = useCallback(async () => {
    const { getGameScores } = await import("@/lib/actions");
    const fresh = await getGameScores();
    setScoreList(fresh);
  }, []);

  const latestGame = scoreList[0] ?? null;

  return (
    <div>
      {/* Tab Switcher */}
      <div className="flex bg-stone-100 rounded-full p-0.5 mb-6">
        <button
          onClick={() => setTab("game")}
          className={cn(
            "flex-1 py-2 rounded-full text-sm font-medium transition-all",
            tab === "game"
              ? "bg-white text-stone-700 shadow-sm"
              : "text-stone-400 hover:text-stone-600"
          )}
        >
          打地鼠
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
          最高记录
        </button>
      </div>

      {/* Content */}
      {tab === "game" ? (
        <WhackAMole
          bestA={latestGame?.playerA ?? 0}
          bestB={latestGame?.playerB ?? 0}
          onScoreSaved={refreshScores}
        />
      ) : (
        <ScoreBoard scores={scoreList} />
      )}
    </div>
  );
}
