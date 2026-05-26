"use client";

import { useState, useEffect } from "react";
import { Target, Check, Trophy, History } from "lucide-react";
import { toast } from "sonner";
import { cn, formatDate } from "@/lib/utils";
import { COUPLE, CHALLENGES } from "@/lib/constants";
import type { Challenge } from "@/types";

const STORAGE_KEY = "couple-challenges";

function getToday() {
  return new Date().toISOString().split("T")[0];
}

function getDayIndex() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  return Math.floor((now.getTime() - start.getTime()) / 86400000);
}

function loadChallenges(): Challenge[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveChallenges(challenges: Challenge[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(challenges));
}

export function ChallengeClient() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    setChallenges(loadChallenges());
  }, []);

  const today = getToday();
  const todayChallenge = challenges.find((c) => c.date === today) ?? null;
  const history = challenges.filter((c) => c.date !== today).sort((a, b) => b.date.localeCompare(a.date));

  function handleCreate() {
    const idx = getDayIndex() % CHALLENGES.length;
    const newChallenge: Challenge = {
      id: Date.now(),
      challenge: CHALLENGES[idx],
      date: today,
      completedByA: false,
      completedByB: false,
      createdAt: new Date(),
    };
    const updated = [...challenges, newChallenge];
    saveChallenges(updated);
    setChallenges(updated);
    toast.success("挑战已生成！");
  }

  function handleComplete(author: "A" | "B") {
    if (!todayChallenge) return;
    const field = author === "A" ? "completedByA" : "completedByB";
    const updated = challenges.map((c) =>
      c.date === today ? { ...c, [field]: true } : c
    );
    saveChallenges(updated);
    setChallenges(updated);
    toast.success(
      author === "A" ? `${COUPLE.partnerA} 完成了！` : `${COUPLE.partnerB} 完成了！`
    );
  }

  const bothDone = todayChallenge?.completedByA && todayChallenge?.completedByB;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="inline-flex p-4 rounded-full bg-violet-100 text-violet-500">
          <Target size={40} />
        </div>
        <h2 className="font-serif text-xl font-bold text-stone-800">今日挑战</h2>
        <p className="text-sm text-stone-400">每天一个趣味挑战，敢不敢接？</p>
      </div>

      {!todayChallenge ? (
        <div className="text-center space-y-4">
          <p className="text-sm text-stone-400">今天还没有挑战</p>
          <button
            onClick={handleCreate}
            className="px-6 py-3 rounded-2xl bg-violet-500 text-white font-medium hover:bg-violet-600 active:scale-95 transition-all"
          >
            生成今日挑战
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div
            className={cn(
              "p-6 rounded-3xl border-2 text-center",
              bothDone
                ? "bg-emerald-50 border-emerald-200"
                : "bg-violet-50 border-violet-200"
            )}
          >
            {bothDone && (
              <div className="inline-flex p-2 rounded-full bg-emerald-100 text-emerald-500 mb-3">
                <Trophy size={24} />
              </div>
            )}
            <p className="font-serif text-lg font-semibold text-stone-800">
              {todayChallenge.challenge}
            </p>
            {bothDone && (
              <p className="text-sm text-emerald-600 mt-2">双方都完成了！默契满分！</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleComplete("A")}
              disabled={todayChallenge.completedByA}
              className={cn(
                "py-3 rounded-2xl font-medium transition-all",
                todayChallenge.completedByA
                  ? "bg-emerald-100 text-emerald-600"
                  : "bg-warm-500 text-white hover:bg-warm-600 active:scale-95"
              )}
            >
              {todayChallenge.completedByA ? (
                <span className="inline-flex items-center gap-1">
                  <Check size={16} /> {COUPLE.partnerA} 已完成
                </span>
              ) : (
                COUPLE.partnerA
              )}
            </button>
            <button
              onClick={() => handleComplete("B")}
              disabled={todayChallenge.completedByB}
              className={cn(
                "py-3 rounded-2xl font-medium transition-all",
                todayChallenge.completedByB
                  ? "bg-emerald-100 text-emerald-600"
                  : "bg-rose-500 text-white hover:bg-rose-600 active:scale-95"
              )}
            >
              {todayChallenge.completedByB ? (
                <span className="inline-flex items-center gap-1">
                  <Check size={16} /> {COUPLE.partnerB} 已完成
                </span>
              ) : (
                COUPLE.partnerB
              )}
            </button>
          </div>
        </div>
      )}

      <div>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center gap-2 text-sm text-stone-400 hover:text-stone-600 transition-colors mx-auto"
        >
          <History size={14} />
          {showHistory ? "收起历史" : "查看历史挑战"}
        </button>

        {showHistory && (
          <div className="mt-4 space-y-2">
            {history.length === 0 ? (
              <p className="text-center text-sm text-stone-400 py-4">还没有历史挑战</p>
            ) : (
              history.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-white/60 border border-warm-200/30"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-stone-400">{formatDate(item.date)}</span>
                    {item.completedByA && item.completedByB && (
                      <span className="text-xs text-emerald-500">双方完成</span>
                    )}
                  </div>
                  <p className="text-sm text-stone-700">{item.challenge}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
