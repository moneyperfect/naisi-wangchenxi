"use client";

import { useState } from "react";
import { Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { cn, formatDate } from "@/lib/utils";
import { COUPLE } from "@/lib/constants";
import { deleteDiaryEntry } from "@/lib/actions";
import { Modal } from "@/components/ui/Modal";
import { DiaryForm } from "./DiaryForm";
import type { DiaryEntry as DiaryEntryType } from "@/types";

const moodEmojis: Record<string, string> = {
  happy: "😊",
  love: "🥰",
  sad: "😢",
  thinking: "🤔",
  grateful: "🙏",
  excited: "🎉",
};

interface DiaryEntryProps {
  entry: DiaryEntryType;
}

export function DiaryEntry({ entry }: DiaryEntryProps) {
  const [editOpen, setEditOpen] = useState(false);
  const authorName =
    entry.author === "A" ? COUPLE.partnerA : COUPLE.partnerB;
  const isA = entry.author === "A";

  async function handleDelete() {
    if (!window.confirm("确定要删除这篇日记吗？")) return;
    try {
      await deleteDiaryEntry(entry.id);
      toast.success("日记已删除");
    } catch {
      toast.error("删除失败");
    }
  }

  return (
    <>
      <div
        className={cn(
          "flex gap-3",
          isA ? "flex-row" : "flex-row-reverse"
        )}
      >
        <div
          className={cn(
            "w-9 h-9 rounded-full flex items-center justify-center text-xs font-serif font-semibold shrink-0 mt-1",
            isA
              ? "bg-warm-200 text-warm-700"
              : "bg-rose-100 text-rose-600"
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
            {entry.mood && (
              <span className="text-xs">{moodEmojis[entry.mood] || entry.mood}</span>
            )}
          </div>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {entry.content}
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
      <Modal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        title="编辑日记"
      >
        <DiaryForm initialData={entry} onClose={() => setEditOpen(false)} />
      </Modal>
    </>
  );
}
