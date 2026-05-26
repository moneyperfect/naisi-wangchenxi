"use client";

import { cn } from "@/lib/utils";
import { COUPLE, ACHIEVEMENTS } from "@/lib/constants";
import {
  MessageSquare, Flame, Brain, Zap, Sparkles,
  BookOpen, Swords, Target, Camera, Heart, Lock
} from "lucide-react";
import type { Achievement } from "@/types";

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  MessageSquare, Flame, Brain, Zap, Sparkles,
  BookOpen, Swords, Target, Camera, Heart,
};

interface AchievementBadgeProps {
  achievement: Achievement;
}

export function AchievementBadge({ achievement }: AchievementBadgeProps) {
  const config = ACHIEVEMENTS.find((a) => a.key === achievement.key);
  if (!config) return null;

  const Icon = ICON_MAP[config.icon] || Heart;
  const unlockedA = achievement.unlockedByA;
  const unlockedB = achievement.unlockedByB;
  const unlocked = unlockedA || unlockedB;

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-4 rounded-2xl border transition-all",
        unlocked
          ? "bg-white/60 border-warm-200/50"
          : "bg-stone-50/50 border-stone-200/30 opacity-60"
      )}
    >
      <div
        className={cn(
          "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
          unlocked
            ? "bg-warm-100 text-warm-500"
            : "bg-stone-100 text-stone-300"
        )}
      >
        {unlocked ? <Icon size={24} /> : <Lock size={20} />}
      </div>
      <div className="flex-1 min-w-0">
        <h3
          className={cn(
            "font-serif font-semibold text-sm",
            unlocked ? "text-stone-800" : "text-stone-400"
          )}
        >
          {config.name}
        </h3>
        <p className="text-xs text-stone-400 mt-0.5">{config.desc}</p>
        {unlocked && (
          <div className="flex gap-2 mt-1.5">
            {unlockedA && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-warm-100 text-warm-600">
                {COUPLE.partnerA}
              </span>
            )}
            {unlockedB && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-600">
                {COUPLE.partnerB}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
