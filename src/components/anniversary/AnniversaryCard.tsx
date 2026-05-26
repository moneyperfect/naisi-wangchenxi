"use client";

import { useState } from "react";
import { Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { formatDate, getNextOccurrence, daysUntil } from "@/lib/utils";
import { deleteAnniversary } from "@/lib/actions";
import { Modal } from "@/components/ui/Modal";
import { AnniversaryForm } from "./AnniversaryForm";
import type { Anniversary } from "@/types";

interface AnniversaryCardProps {
  item: Anniversary;
}

export function AnniversaryCard({ item }: AnniversaryCardProps) {
  const [editOpen, setEditOpen] = useState(false);
  const next = getNextOccurrence(item.date);
  const days = daysUntil(next.toISOString());
  const isPast = days < 0;
  const isToday = days === 0;

  async function handleDelete() {
    if (!window.confirm("确定要删除这个纪念日吗？")) return;
    try {
      await deleteAnniversary(item.id);
      toast.success("纪念日已删除");
    } catch {
      toast.error("删除失败");
    }
  }

  return (
    <>
      <div className="bg-white/60 rounded-2xl p-5 border border-warm-200/30 group hover:shadow-md hover:border-warm-300/50 transition-all duration-300">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-serif font-semibold text-stone-800">
              {item.title}
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              {formatDate(item.date)}
            </p>
            {item.description && (
              <p className="text-sm text-stone-500 mt-2">{item.description}</p>
            )}
          </div>
          <div className="text-right flex flex-col items-end gap-2">
            {isToday ? (
              <span className="text-sm font-medium text-warm-600 bg-warm-100 px-3 py-1 rounded-full">
                今天!
              </span>
            ) : isPast ? (
              <span className="text-sm text-stone-400">已过</span>
            ) : (
              <div>
                <span className="text-2xl font-serif font-bold text-warm-600">
                  {days}
                </span>
                <span className="text-xs text-stone-400 ml-1">天后</span>
              </div>
            )}
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setEditOpen(true)}
                className="p-1.5 rounded-full text-stone-300 hover:text-warm-500 hover:bg-warm-100 transition-colors"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={handleDelete}
                className="p-1.5 rounded-full text-stone-300 hover:text-red-400 hover:bg-red-50 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        title="编辑纪念日"
      >
        <AnniversaryForm
          initialData={item}
          onClose={() => setEditOpen(false)}
        />
      </Modal>
    </>
  );
}
