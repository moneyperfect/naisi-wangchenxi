"use client";

import { useState } from "react";
import { cn, formatDate } from "@/lib/utils";
import { ScrollReveal } from "@/components/effects/ScrollReveal";
import { StoryCard } from "@/components/story/StoryCard";
import type { StoryItem } from "@/types";

type Filter = "all" | "diary" | "milestone";

const tabs: { key: Filter; label: string }[] = [
  { key: "all", label: "全部" },
  { key: "diary", label: "日常" },
  { key: "milestone", label: "重要节点" },
];

interface StoryListProps {
  entries: StoryItem[];
}

export function StoryList({ entries }: StoryListProps) {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered =
    filter === "all"
      ? entries
      : entries.filter((e) => e.type === filter);

  // Group by date
  const grouped = filtered.reduce<Record<string, StoryItem[]>>((acc, item) => {
    const date = item.date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(item);
    return acc;
  }, {});

  const dates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  // Track global index for milestone alternating
  let globalIndex = 0;

  return (
    <div className="space-y-6">
      {/* Filter tabs */}
      <div className="flex gap-2 bg-warm-100/50 rounded-xl p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={cn(
              "flex-1 py-2 rounded-lg text-sm font-medium transition-all",
              filter === tab.key
                ? "bg-white text-warm-600 shadow-sm"
                : "text-stone-400 hover:text-stone-600"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {dates.length === 0 ? (
        <p className="text-center text-stone-400 text-sm py-8">
          暂无{filter === "diary" ? "日记" : filter === "milestone" ? "重要节点" : "记录"}
        </p>
      ) : (
        dates.map((date) => (
          <div key={date}>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px flex-1 bg-warm-200/50" />
              <span className="text-xs text-stone-400 font-medium whitespace-nowrap">
                {formatDate(date)}
              </span>
              <div className="h-px flex-1 bg-warm-200/50" />
            </div>
            <div className="space-y-3">
              {grouped[date].map((item) => {
                const idx = globalIndex++;
                return (
                  <ScrollReveal
                    key={`${item.type}-${item.id}`}
                    delay={idx * 0.08}
                  >
                    <StoryCard item={item} index={idx} />
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
