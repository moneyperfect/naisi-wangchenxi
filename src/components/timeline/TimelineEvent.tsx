"use client";

import { useState } from "react";
import { Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";
import { deleteTimelineEvent } from "@/lib/actions";
import { Modal } from "@/components/ui/Modal";
import { TimelineForm } from "./TimelineForm";
import type { TimelineEvent as TimelineEventType } from "@/types";

interface TimelineEventProps {
  event: TimelineEventType;
  index: number;
}

export function TimelineEvent({ event, index }: TimelineEventProps) {
  const [editOpen, setEditOpen] = useState(false);
  const isLeft = index % 2 === 0;

  async function handleDelete() {
    if (!window.confirm("确定要删除这个事件吗？")) return;
    try {
      await deleteTimelineEvent(event.id);
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
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-warm-200/30 group-hover:border-warm-300/50 group-hover:shadow-md transition-all duration-300">
            <div className="flex items-start justify-between gap-2">
              <div className={isLeft ? "" : "ml-auto"}>
                <span className="text-xs text-warm-500 font-medium">
                  {formatDate(event.date)}
                </span>
                <h3 className="font-serif font-semibold text-stone-800 mt-0.5">
                  {event.title}
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
            {event.description && (
              <p className="text-sm text-stone-500 mt-2">{event.description}</p>
            )}
          </div>
        </div>
      </div>
      <Modal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        title="编辑事件"
      >
        <TimelineForm initialData={event} onClose={() => setEditOpen(false)} />
      </Modal>
    </>
  );
}
