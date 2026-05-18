"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { markLetterRead, deleteLetter } from "@/lib/actions";
import { cn, formatDate } from "@/lib/utils";
import { COUPLE } from "@/lib/constants";
import { Modal } from "@/components/ui/Modal";
import { LetterForm } from "./LetterForm";
import type { Letter } from "@/types";

interface LetterCardProps {
  letter: Letter;
}

export function LetterCard({ letter }: LetterCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const authorName =
    letter.author === "A" ? COUPLE.partnerA : COUPLE.partnerB;

  function toggle() {
    setExpanded(!expanded);
    if (!expanded && !letter.isRead) {
      markLetterRead(letter.id);
    }
  }

  async function handleDelete() {
    if (!window.confirm("确定要删除这封情书吗？")) return;
    try {
      await deleteLetter(letter.id);
      toast.success("情书已删除");
    } catch {
      toast.error("删除失败");
    }
  }

  return (
    <>
      <div
        className={cn(
          "bg-white/60 backdrop-blur-sm rounded-2xl border border-warm-200/30 overflow-hidden transition-all duration-300 group hover:shadow-md",
          !letter.isRead && "border-warm-300/50"
        )}
      >
        <div
          className="flex items-center gap-3 p-4 cursor-pointer hover:bg-warm-100/30 transition-colors"
          onClick={toggle}
        >
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center text-sm font-serif font-semibold shrink-0",
              letter.author === "A"
                ? "bg-warm-200 text-warm-700"
                : "bg-rose-100 text-rose-600"
            )}
          >
            {authorName[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-serif font-semibold text-stone-800 text-sm">
                {authorName}
              </span>
              {!letter.isRead && (
                <span className="w-2 h-2 rounded-full bg-warm-500" />
              )}
            </div>
            {letter.title && (
              <p className="text-sm text-stone-600 truncate">{letter.title}</p>
            )}
            <p className="text-xs text-stone-400">
              {formatDate(letter.createdAt.toString())}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setEditOpen(true);
              }}
              className="p-1.5 rounded-full text-stone-300 hover:text-warm-500 hover:bg-warm-100 transition-colors opacity-0 group-hover:opacity-100"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              className="p-1.5 rounded-full text-stone-300 hover:text-red-400 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
            >
              <Trash2 size={14} />
            </button>
            {expanded ? (
              <ChevronUp size={16} className="text-stone-400" />
            ) : (
              <ChevronDown size={16} className="text-stone-400" />
            )}
          </div>
        </div>
        {expanded && (
          <div className="px-4 pb-4 pt-0">
            <div className="bg-warm-50 rounded-xl p-4 whitespace-pre-wrap text-sm text-stone-700 leading-relaxed">
              {letter.content}
            </div>
          </div>
        )}
      </div>
      <Modal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        title="编辑情书"
      >
        <LetterForm initialData={letter} onClose={() => setEditOpen(false)} />
      </Modal>
    </>
  );
}
