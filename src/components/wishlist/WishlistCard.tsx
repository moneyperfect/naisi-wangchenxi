"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Trash2 } from "lucide-react";
import { toggleWishlistItem, deleteWishlistItem } from "@/lib/actions";
import { COUPLE } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import type { Wishlist } from "@/types";

const categoryColors: Record<string, string> = {
  "旅行": "bg-sky-100 text-sky-700",
  "美食": "bg-orange-100 text-orange-700",
  "体验": "bg-violet-100 text-violet-700",
  "其他": "bg-stone-200 text-stone-600",
};

interface WishlistCardProps {
  item: Wishlist;
}

export function WishlistCard({ item }: WishlistCardProps) {
  const [completedBy, setCompletedBy] = useState<"A" | "B">("A");
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  async function handleToggle() {
    setLoading(true);
    try {
      await toggleWishlistItem(item.id, completedBy);
      if (!item.completed) {
        toast.success("太棒了！又完成了一个心愿！");
      }
    } catch {
      toast.error("操作失败，再试一次");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    try {
      await deleteWishlistItem(item.id);
      toast.success("已删除");
    } catch {
      toast.error("删除失败");
    }
  }

  const completedByName =
    item.completedBy === "A" ? COUPLE.partnerA : COUPLE.partnerB;

  return (
    <motion.div
      layout
      className={cn(
        "group relative flex items-center gap-3 p-4 rounded-2xl transition-colors",
        item.completed
          ? "bg-warm-100/40"
          : "bg-warm-50 border border-warm-200/40 hover:border-warm-300/60"
      )}
    >
      {/* Toggle area */}
      <div className="flex flex-col items-center gap-1">
        <button
          onClick={handleToggle}
          disabled={loading}
          className={cn(
            "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all shrink-0",
            item.completed
              ? "bg-warm-500 border-warm-500 text-white"
              : "border-warm-300 hover:border-warm-500"
          )}
        >
          {item.completed && <Check size={14} strokeWidth={3} />}
        </button>
        {!item.completed && (
          <select
            value={completedBy}
            onChange={(e) => setCompletedBy(e.target.value as "A" | "B")}
            className="text-xs py-1 bg-transparent text-stone-400 border-none focus:outline-none cursor-pointer"
          >
            <option value="A">{COUPLE.partnerA}</option>
            <option value="B">{COUPLE.partnerB}</option>
          </select>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-sm text-stone-800",
            item.completed && "line-through text-stone-400"
          )}
        >
          {item.text}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span
            className={cn(
              "text-[11px] px-2 py-0.5 rounded-full font-medium",
              categoryColors[item.category] || categoryColors["其他"]
            )}
          >
            {item.category}
          </span>
          {item.completed && item.completedBy && (
            <span className="text-[11px] text-stone-400">
              by {completedByName}
            </span>
          )}
        </div>
      </div>

      {/* Delete button */}
      <button
        onClick={() => setConfirmOpen(true)}
        className="absolute top-2 right-2 p-1.5 rounded-full text-stone-300 hover:text-rose-500 hover:bg-rose-50 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all"
      >
        <Trash2 size={14} />
      </button>
      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        message="确定要删除这个心愿吗？删除后无法恢复。"
      />
    </motion.div>
  );
}
