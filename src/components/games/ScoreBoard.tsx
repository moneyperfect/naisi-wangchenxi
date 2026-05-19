"use client";

import { useState } from "react";
import { Plus, Minus, RotateCcw, Trash2, Trophy } from "lucide-react";
import { toast } from "sonner";
import { COUPLE } from "@/lib/constants";
import { updateGameScore, resetGameScore, deleteGame } from "@/lib/actions";
import type { GameScore } from "@/types";

interface ScoreBoardProps {
  scores: GameScore[];
  onRefresh: () => void;
}

export function ScoreBoard({ scores, onRefresh }: ScoreBoardProps) {
  return (
    <div className="space-y-4">
      {scores.length === 0 ? (
        <div className="text-center py-8">
          <Trophy className="mx-auto text-warm-300 mb-2" size={32} />
          <p className="text-sm text-stone-400">还没有比分记录</p>
          <p className="text-xs text-stone-300 mt-1">创建一个游戏开始计分吧</p>
        </div>
      ) : (
        scores.map((game) => (
          <ScoreCard key={game.id} game={game} onRefresh={onRefresh} />
        ))
      )}
    </div>
  );
}

function ScoreCard({ game, onRefresh }: { game: GameScore; onRefresh: () => void }) {
  const [pending, setPending] = useState(false);

  async function handleUpdate(player: "playerA" | "playerB", delta: number) {
    setPending(true);
    try {
      await updateGameScore(game.id, player, delta);
      onRefresh();
    } catch {
      toast.error("更新失败");
    } finally {
      setPending(false);
    }
  }

  async function handleReset() {
    if (!window.confirm("确定要重置比分吗？")) return;
    setPending(true);
    try {
      await resetGameScore(game.id);
      onRefresh();
    } catch {
      toast.error("重置失败");
    } finally {
      setPending(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm("确定要删除这个游戏吗？")) return;
    try {
      await deleteGame(game.id);
      toast.success("已删除");
      onRefresh();
    } catch {
      toast.error("删除失败");
    }
  }

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-warm-200/30">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-serif font-semibold text-stone-800 text-sm">
          {game.gameName}
        </h3>
        <div className="flex gap-1">
          <button
            onClick={handleReset}
            disabled={pending}
            className="p-1 rounded-full text-stone-300 hover:text-warm-500 hover:bg-warm-100 transition-colors"
            title="重置"
          >
            <RotateCcw size={14} />
          </button>
          <button
            onClick={handleDelete}
            className="p-1 rounded-full text-stone-300 hover:text-red-400 hover:bg-red-50 transition-colors"
            title="删除"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <PlayerScore
          name={COUPLE.partnerA}
          score={game.playerA}
          color="warm"
          onDelta={(d) => handleUpdate("playerA", d)}
          disabled={pending}
        />
        <PlayerScore
          name={COUPLE.partnerB}
          score={game.playerB}
          color="rose"
          onDelta={(d) => handleUpdate("playerB", d)}
          disabled={pending}
        />
      </div>
    </div>
  );
}

function PlayerScore({
  name,
  score,
  color,
  onDelta,
  disabled,
}: {
  name: string;
  score: number;
  color: "warm" | "rose";
  onDelta: (delta: number) => void;
  disabled: boolean;
}) {
  const bg = color === "warm" ? "bg-warm-50" : "bg-rose-50";
  const text = color === "warm" ? "text-warm-600" : "text-rose-500";
  const btnBg = color === "warm" ? "bg-warm-100 hover:bg-warm-200" : "bg-rose-100 hover:bg-rose-200";

  return (
    <div className={`${bg} rounded-xl p-3 text-center`}>
      <p className="text-xs font-medium text-stone-500 mb-1">{name}</p>
      <p className={`text-3xl font-serif font-bold ${text} tabular-nums`}>
        {score}
      </p>
      <div className="flex justify-center gap-2 mt-2">
        <button
          onClick={() => onDelta(-1)}
          disabled={disabled}
          className={`w-8 h-8 rounded-full ${btnBg} flex items-center justify-center transition-colors disabled:opacity-50`}
        >
          <Minus size={14} className="text-stone-600" />
        </button>
        <button
          onClick={() => onDelta(1)}
          disabled={disabled}
          className={`w-8 h-8 rounded-full ${btnBg} flex items-center justify-center transition-colors disabled:opacity-50`}
        >
          <Plus size={14} className="text-stone-600" />
        </button>
      </div>
    </div>
  );
}
