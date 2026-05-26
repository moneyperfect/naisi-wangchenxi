"use client";

import { Clock, Trophy } from "lucide-react";
import { COUPLE } from "@/lib/constants";
import type { GameScore } from "@/types";

interface ScoreBoardProps {
  scores: GameScore[];
}

export function ScoreBoard({ scores }: ScoreBoardProps) {
  const record = scores[0] ?? null;

  if (!record) {
    return (
      <div className="rounded-3xl border border-warm-200/40 bg-white/60 px-5 py-8 text-center ">
        <Trophy className="mx-auto mb-3 text-warm-300" size={34} />
        <p className="font-serif text-base font-semibold text-stone-700">
          还没有打地鼠记录
        </p>
        <p className="mt-1 text-sm text-stone-400">
          完成一局后，这里会自动保存你们各自的最高分
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-warm-200/40 bg-white/65 p-5 shadow-sm shadow-warm-100/40 ">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium tracking-[0.18em] text-warm-400">
            最高记录
          </p>
          <h2 className="mt-1 font-serif text-xl font-bold text-stone-800">
            打地鼠最高记录
          </h2>
        </div>
        <div className="rounded-full bg-warm-100 p-3 text-warm-500">
          <Trophy size={22} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <PlayerBest name={COUPLE.partnerA} score={record.playerA} tone="warm" />
        <PlayerBest name={COUPLE.partnerB} score={record.playerB} tone="rose" />
      </div>

      <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-stone-400">
        <Clock size={13} />
        <span>
          最近更新：{new Date(record.updatedAt).toLocaleDateString("zh-CN")}
        </span>
      </div>
    </div>
  );
}

function PlayerBest({
  name,
  score,
  tone,
}: {
  name: string;
  score: number;
  tone: "warm" | "rose";
}) {
  const classes =
    tone === "warm"
      ? "bg-warm-50 text-warm-600 border-warm-200/60"
      : "bg-rose-50 text-rose-500 border-rose-200/60";

  return (
    <div className={`rounded-2xl border p-4 text-center ${classes}`}>
      <p className="mb-1 truncate text-xs font-medium text-stone-500">{name}</p>
      <p className="font-serif text-4xl font-bold tabular-nums">{score}</p>
      <p className="mt-1 text-xs text-stone-400">最高分</p>
    </div>
  );
}
