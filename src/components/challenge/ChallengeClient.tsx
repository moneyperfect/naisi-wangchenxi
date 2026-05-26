"use client";

import { useState } from "react";
import { Target, Check, Trophy, History } from "lucide-react";
import { toast } from "sonner";
import { cn, formatDate } from "@/lib/utils";
import { COUPLE, CHALLENGES } from "@/lib/constants";
import { createChallenge, completeChallenge } from "@/lib/actions";
import { ScrollReveal } from "@/components/effects/ScrollReveal";
import type { Challenge } from "@/types";

interface ChallengeClientProps {
  todayChallenge: Challenge | null;
  history: Challenge[];
}

export function ChallengeClient({ todayChallenge, history }: ChallengeClientProps) {
  const [challenge, setChallenge] = useState(todayChallenge);
  const [creating, setCreating] = useState(false);
  const [completing, setCompleting] = useState<"A" | "B" | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  async function handleCreate() {
    setCreating(true);
    try {
      const dayOfYear = Math.floor(
        (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
      );
      const idx = dayOfYear % CHALLENGES.length;
      await createChallenge(CHALLENGES[idx]);
      setChallenge({
        id: 0,
        challenge: CHALLENGES[idx],
        date: new Date().toISOString().split("T")[0],
        completedByA: false,
        completedByB: false,
        createdAt: new Date(),
      });
      toast.success("挑战已生成！");
    } catch {
      toast.error("生成失败，请重试");
    } finally {
      setCreating(false);
    }
  }

  async function handleComplete(author: "A" | "B") {
    setCompleting(author);
    try {
      await completeChallenge(author);
      setChallenge((prev) =>
        prev
          ? {
              ...prev,
              [author === "A" ? "completedByA" : "completedByB"]: true,
            }
          : null
      );
      toast.success(
        author === "A" ? `${COUPLE.partnerA} 完成了！` : `${COUPLE.partnerB} 完成了！`
      );
    } catch {
      toast.error("操作失败，请重试");
    } finally {
      setCompleting(null);
    }
  }

  const bothDone = challenge?.completedByA && challenge?.completedByB;

  return (
    <div className="space-y-6">
      {/* Today's Challenge */}
      <div className="text-center space-y-4">
        <div className="inline-flex p-4 rounded-full bg-violet-100 text-violet-500">
          <Target size={40} />
        </div>
        <h2 className="font-serif text-xl font-bold text-stone-800">今日挑战</h2>
      </div>

      {!challenge ? (
        <div className="text-center space-y-4">
          <p className="text-sm text-stone-400">今天还没有挑战</p>
          <button
            onClick={handleCreate}
            disabled={creating}
            className="px-6 py-3 rounded-2xl bg-violet-500 text-white font-medium hover:bg-violet-600 active:scale-95 transition-all disabled:opacity-50"
          >
            {creating ? "生成中..." : "生成今日挑战"}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className={cn(
            "p-6 rounded-3xl border-2 text-center",
            bothDone
              ? "bg-emerald-50 border-emerald-200"
              : "bg-violet-50 border-violet-200"
          )}>
            {bothDone && (
              <div className="inline-flex p-2 rounded-full bg-emerald-100 text-emerald-500 mb-3">
                <Trophy size={24} />
              </div>
            )}
            <p className="font-serif text-lg font-semibold text-stone-800">
              {challenge.challenge}
            </p>
            {bothDone && (
              <p className="text-sm text-emerald-600 mt-2">双方都完成了！太棒了！</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleComplete("A")}
              disabled={challenge.completedByA || completing !== null}
              className={cn(
                "py-3 rounded-2xl font-medium transition-all",
                challenge.completedByA
                  ? "bg-emerald-100 text-emerald-600"
                  : "bg-warm-500 text-white hover:bg-warm-600 active:scale-95"
              )}
            >
              {challenge.completedByA ? (
                <span className="inline-flex items-center gap-1">
                  <Check size={16} /> {COUPLE.partnerA} 已完成
                </span>
              ) : (
                COUPLE.partnerA
              )}
            </button>
            <button
              onClick={() => handleComplete("B")}
              disabled={challenge.completedByB || completing !== null}
              className={cn(
                "py-3 rounded-2xl font-medium transition-all",
                challenge.completedByB
                  ? "bg-emerald-100 text-emerald-600"
                  : "bg-rose-500 text-white hover:bg-rose-600 active:scale-95"
              )}
            >
              {challenge.completedByB ? (
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

      {/* History */}
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
              history.map((item, i) => (
                <ScrollReveal key={item.id} delay={i * 0.05}>
                  <div className="p-4 rounded-2xl bg-white/60 border border-warm-200/30">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-stone-400">{formatDate(item.date)}</span>
                      {item.completedByA && item.completedByB && (
                        <span className="text-xs text-emerald-500">双方完成</span>
                      )}
                    </div>
                    <p className="text-sm text-stone-700">{item.challenge}</p>
                  </div>
                </ScrollReveal>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
