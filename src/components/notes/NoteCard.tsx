"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Trash2, Pencil, Clock } from "lucide-react";
import { toast } from "sonner";
import { markLetterRead, deleteLetter } from "@/lib/actions";
import { cn, formatDate } from "@/lib/utils";
import { COUPLE } from "@/lib/constants";
import { Modal } from "@/components/ui/Modal";
import { NoteForm } from "./NoteForm";
import type { Letter } from "@/types";

interface NoteCardProps {
  note: Letter;
}

function formatCountdown(target: Date) {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return "";
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const parts: string[] = [];
  if (days > 0) parts.push(`${days}天`);
  if (hours > 0) parts.push(`${hours}小时`);
  if (minutes > 0 && days === 0) parts.push(`${minutes}分钟`);
  return parts.join("") || "即将送达";
}

export function NoteCard({ note }: NoteCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const authorName = note.author === "A" ? COUPLE.partnerA : COUPLE.partnerB;

  const isScheduled =
    note.scheduledAt && new Date(note.scheduledAt).getTime() > Date.now();

  function toggle() {
    if (isScheduled) return;
    setExpanded(!expanded);
    if (!expanded && !note.isRead) {
      markLetterRead(note.id);
    }
  }

  async function handleDelete() {
    if (!window.confirm("确定要删除这条心里话吗？")) return;
    try {
      await deleteLetter(note.id);
      toast.success("已删除");
    } catch {
      toast.error("删除失败");
    }
  }

  return (
    <>
      <div
        className={cn(
          "bg-white/60 rounded-2xl border border-warm-200/30 overflow-hidden transition-all duration-300 group hover:shadow-md",
          !note.isRead && !isScheduled && "border-warm-300/50",
          isScheduled && "border-dashed border-warm-300/40"
        )}
      >
        <div
          className={cn(
            "flex items-center gap-3 p-4 transition-colors",
            isScheduled ? "cursor-default" : "cursor-pointer hover:bg-warm-100/30"
          )}
          onClick={toggle}
        >
          <div
            className={cn(
              "w-9 h-9 rounded-full flex items-center justify-center text-sm font-serif font-semibold shrink-0",
              note.author === "A"
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
              {!note.isRead && !isScheduled && (
                <span className="w-2 h-2 rounded-full bg-warm-500 shadow-[0_0_6px_rgba(217,119,87,0.5)]" />
              )}
              {isScheduled && (
                <span className="flex items-center gap-1 text-xs text-warm-400 bg-warm-100 px-2 py-0.5 rounded-full">
                  <Clock size={10} />
                  已预约
                </span>
              )}
            </div>
            {note.title && (
              <p className="text-sm text-stone-600 truncate">{note.title}</p>
            )}
            <p className="text-xs text-stone-400">
              {isScheduled
                ? `${formatDate(note.scheduledAt!.toString())} 送达 · ${formatCountdown(new Date(note.scheduledAt!))}`
                : formatDate(note.createdAt.toString())}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setEditOpen(true);
              }}
              className="p-1.5 rounded-full text-stone-300 hover:text-warm-500 hover:bg-warm-100 transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              className="p-1.5 rounded-full text-stone-300 hover:text-red-400 hover:bg-red-50 transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100"
            >
              <Trash2 size={14} />
            </button>
            {!isScheduled &&
              (expanded ? (
                <ChevronUp size={16} className="text-stone-400" />
              ) : (
                <ChevronDown size={16} className="text-stone-400" />
              ))}
          </div>
        </div>
        {isScheduled && (
          <div className="px-4 pb-4 pt-0">
            <div className="bg-warm-50 rounded-xl p-4 text-sm text-stone-400 blur-sm select-none pointer-events-none line-clamp-2">
              {note.content}
            </div>
          </div>
        )}
        {expanded && !isScheduled && (
          <div className="px-4 pb-4 pt-0">
            <div className="bg-warm-50 rounded-xl p-4 whitespace-pre-wrap text-sm text-stone-700 leading-relaxed">
              {note.content}
            </div>
          </div>
        )}
      </div>
      <Modal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        title="编辑心里话"
      >
        <NoteForm initialData={note} onClose={() => setEditOpen(false)} />
      </Modal>
    </>
  );
}
