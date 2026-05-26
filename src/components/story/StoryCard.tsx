"use client";

import { useState } from "react";
import { Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { cn, formatDate } from "@/lib/utils";
import { COUPLE } from "@/lib/constants";
import { deleteDiaryEntry, deleteTimelineEvent } from "@/lib/actions";
import { Modal } from "@/components/ui/Modal";
import { StoryForm } from "./StoryForm";
import type { StoryItem } from "@/types";

const moodEmojis: Record<string, string> = {
  happy: "😊",
  love: "🥰",
  sad: "😢",
  thinking: "🤔",
  grateful: "🙏",
  excited: "🎉",
};

interface StoryCardProps {
  item: StoryItem;
  index: number;
}

export function StoryCard({ item, index }: StoryCardProps) {
  const [editOpen, setEditOpen] = useState(false);

  if (item.type === "diary") {
    return <DiaryCard item={item} editOpen={editOpen} setEditOpen={setEditOpen} />;
  }

  return <MilestoneCard item={item} index={index} editOpen={editOpen} setEditOpen={setEditOpen} />;
}

function DiaryCard({
  item,
  editOpen,
  setEditOpen,
}: {
  item: StoryItem & { type: "diary" };
  editOpen: boolean;
  setEditOpen: (v: boolean) => void;
}) {
  const authorName = item.author === "A" ? COUPLE.partnerA : COUPLE.partnerB;
  const isA = item.author === "A";

  async function handleDelete() {
    if (!window.confirm("确定要删除这篇日记吗？")) return;
    try {
      await deleteDiaryEntry(item.id);
      toast.success("日记已删除");
    } catch {
      toast.error("删除失败");
    }
  }

  return (
    <>
      <div className={cn("flex gap-3", isA ? "flex-row" : "flex-row-reverse")}>
        <div
          className={cn(
            "w-9 h-9 rounded-full flex items-center justify-center text-xs font-serif font-semibold shrink-0 mt-1",
            isA ? "bg-warm-200 text-warm-700" : "bg-rose-100 text-rose-600"
          )}
        >
          {authorName[0]}
        </div>
        <div
          className={cn(
            "max-w-[80%] rounded-2xl p-4 group relative",
            isA
              ? "bg-warm-100 text-stone-800 rounded-tl-sm"
              : "bg-rose-50 text-stone-800 rounded-tr-sm"
          )}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-stone-500">
              {authorName}
            </span>
            {item.mood && (
              <span className="text-xs">{moodEmojis[item.mood] || item.mood}</span>
            )}
          </div>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {item.content}
          </p>
          <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setEditOpen(true)}
              className="p-1 rounded-full text-stone-400 hover:text-warm-500 hover:bg-warm-200/50 transition-colors"
            >
              <Pencil size={12} />
            </button>
            <button
              onClick={handleDelete}
              className="p-1 rounded-full text-stone-400 hover:text-red-400 hover:bg-red-50 transition-colors"
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>
      </div>
      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)} title="编辑日记">
        <StoryForm onClose={() => setEditOpen(false)} />
      </Modal>
    </>
  );
}

function MilestoneCard({
  item,
  index,
  editOpen,
  setEditOpen,
}: {
  item: StoryItem & { type: "milestone" };
  index: number;
  editOpen: boolean;
  setEditOpen: (v: boolean) => void;
}) {
  const isLeft = index % 2 === 0;

  async function handleDelete() {
    if (!window.confirm("确定要删除这个事件吗？")) return;
    try {
      await deleteTimelineEvent(item.id);
      toast.success("事件已删除");
    } catch {
      toast.error("删除失败");
    }
  }

  return (
    <>
      <div className="relative flex items-start gap-4 group">
        <div className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-warm-400 border-2 border-warm-100 z-10 mt-2" />
        <div
          className={`w-[calc(50%-2rem)] ${
            isLeft ? "ml-auto pl-4" : "mr-auto pr-4 text-right"
          }`}
        >
          <div className="bg-white/60 rounded-2xl p-4 border border-warm-200/30 group-hover:border-warm-300/50 group-hover:shadow-md transition-all duration-300">
            <div className="flex items-start justify-between gap-2">
              <div className={isLeft ? "" : "ml-auto"}>
                <span className="text-xs text-warm-500 font-medium">
                  {formatDate(item.date)}
                </span>
                <h3 className="font-serif font-semibold text-stone-800 mt-0.5">
                  {item.title}
                </h3>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <button
                  onClick={() => setEditOpen(true)}
                  className="p-1 rounded-full text-stone-300 hover:text-warm-500 hover:bg-warm-100 transition-colors"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-1 rounded-full text-stone-300 hover:text-red-400 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            {item.description && (
              <p className="text-sm text-stone-500 mt-2">{item.description}</p>
            )}
          </div>
        </div>
      </div>
      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)} title="编辑事件">
        <StoryForm onClose={() => setEditOpen(false)} />
      </Modal>
    </>
  );
}
