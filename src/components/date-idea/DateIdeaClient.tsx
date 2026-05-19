"use client";

import { useState, useEffect } from "react";
import { Plus, Dices } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { ScrollReveal } from "@/components/effects/ScrollReveal";
import { cn } from "@/lib/utils";
import { COUPLE } from "@/lib/constants";
import { IdeaCard } from "./IdeaCard";
import { IdeaForm } from "./IdeaForm";
import { Randomizer } from "./Randomizer";
import type { DateIdea } from "@/types";

const FILTERS = ["全部", "户外", "室内", "美食", "冒险"] as const;

interface DateIdeaClientProps {
  ideas: DateIdea[];
}

export function DateIdeaClient({ ideas }: DateIdeaClientProps) {
  const [filter, setFilter] = useState<string>("全部");
  const [formOpen, setFormOpen] = useState(false);
  const [user, setUser] = useState<"A" | "B">("A");

  useEffect(() => {
    const saved = localStorage.getItem("date-idea-user");
    if (saved === "A" || saved === "B") setUser(saved);
  }, []);

  function switchUser(u: "A" | "B") {
    setUser(u);
    localStorage.setItem("date-idea-user", u);
  }

  const filtered =
    filter === "全部" ? ideas : ideas.filter((i) => i.type === filter);

  return (
    <div>
      {/* Randomizer Section */}
      <div className="mb-6">
        <Randomizer ideas={ideas} />
      </div>

      {/* User Toggle */}
      <div className="flex justify-center mb-4">
        <div className="inline-flex bg-stone-100 rounded-full p-0.5">
          {([COUPLE.partnerA, COUPLE.partnerB] as const).map((name, i) => (
            <button
              key={name}
              onClick={() => switchUser(i === 0 ? "A" : "B")}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-medium transition-all",
                user === (i === 0 ? "A" : "B")
                  ? "bg-white text-stone-700 shadow-sm"
                  : "text-stone-400 hover:text-stone-600"
              )}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* Filter + Add */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all",
                filter === f
                  ? "bg-warm-500 text-white"
                  : "bg-warm-50 text-stone-500 hover:bg-warm-100"
              )}
            >
              {f}
            </button>
          ))}
        </div>
        <button
          onClick={() => setFormOpen(true)}
          className="flex-shrink-0 p-2 rounded-full text-warm-500 hover:bg-warm-100 transition-colors"
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Ideas Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Dices size={32} />}
          title={filter === "全部" ? "还没有约会点子" : `没有「${filter}」类型的点子`}
          description={
            filter === "全部"
              ? "添加你们想一起做的事情，然后摇一摇来随机选择"
              : "换个分类看看，或者添加一个新点子"
          }
          action={
            <button
              onClick={() => setFormOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium bg-warm-500 text-white hover:bg-warm-600 transition-colors"
            >
              <Plus size={16} />
              添加点子
            </button>
          }
        />
      ) : (
        <div className="space-y-2.5">
          {filtered.map((idea, i) => (
            <ScrollReveal key={idea.id} delay={i * 0.05}>
              <IdeaCard idea={idea} />
            </ScrollReveal>
          ))}
        </div>
      )}

      {/* Add Modal */}
      <Modal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        title="添加约会点子"
      >
        <IdeaForm onClose={() => setFormOpen(false)} />
      </Modal>
    </div>
  );
}
