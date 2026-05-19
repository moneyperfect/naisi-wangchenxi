"use client";

import { Trash2, Check } from "lucide-react";
import { toast } from "sonner";
import { cn, formatDate } from "@/lib/utils";
import { COUPLE } from "@/lib/constants";
import { deleteRant, acknowledgeRant } from "@/lib/actions";
import type { Rant } from "@/types";

const categoryLabels: Record<string, string> = {
  work: "工作",
  life: "生活",
  partner: "对方",
  other: "其他",
};

const categoryColors: Record<string, string> = {
  work: "bg-blue-50 text-blue-500",
  life: "bg-green-50 text-green-500",
  partner: "bg-rose-50 text-rose-500",
  other: "bg-stone-100 text-stone-500",
};

export function RantCard({ rant }: { rant: Rant }) {
  const authorName = rant.author === "A" ? COUPLE.partnerA : COUPLE.partnerB;

  async function handleDelete() {
    if (!window.confirm("确定要删掉这条吐槽吗？")) return;
    try {
      await deleteRant(rant.id);
      toast.success("已删除");
    } catch {
      toast.error("删除失败");
    }
  }

  async function handleAcknowledge() {
    try {
      await acknowledgeRant(rant.id, rant.author === "A" ? "B" : "A");
      toast.success("已收到！");
    } catch {
      toast.error("操作失败");
    }
  }

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-warm-200/30 p-4 group hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-xs font-serif font-semibold",
              rant.author === "A"
                ? "bg-orange-100 text-orange-600"
                : "bg-amber-100 text-amber-600"
            )}
          >
            {authorName[0]}
          </div>
          <span className="text-sm font-medium text-stone-700">
            {authorName}
          </span>
          <span
            className={cn(
              "text-xs px-2 py-0.5 rounded-full",
              categoryColors[rant.category] || categoryColors.other
            )}
          >
            {categoryLabels[rant.category] || rant.category}
          </span>
        </div>
        <span className="text-xs text-stone-400">
          {formatDate(rant.createdAt.toString())}
        </span>
      </div>

      <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-wrap mb-3">
        {rant.content}
      </p>

      <div className="flex items-center justify-between">
        {rant.acknowledged ? (
          <span className="inline-flex items-center gap-1 text-xs text-green-500">
            <Check size={12} />
            已收到回应
          </span>
        ) : (
          <button
            onClick={handleAcknowledge}
            className="text-xs px-3 py-1.5 rounded-full bg-warm-100 text-warm-600 hover:bg-warm-200 transition-colors"
          >
            知道了！
          </button>
        )}
        <button
          onClick={handleDelete}
          className="p-1.5 rounded-full text-stone-300 hover:text-red-400 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
