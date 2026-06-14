"use client";

import { useState, useEffect } from "react";
import { Lock, Unlock, Trash2, MapPin, Clock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { toggleLockDateIdea, deleteDateIdea } from "@/lib/actions";
import { cn } from "@/lib/utils";
import { COUPLE } from "@/lib/constants";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import type { DateIdea } from "@/types";

const typeColors: Record<string, string> = {
  户外: "bg-emerald-50 text-emerald-600",
  室内: "bg-sky-50 text-sky-600",
  美食: "bg-amber-50 text-amber-600",
  冒险: "bg-violet-50 text-violet-600",
  其他: "bg-stone-50 text-stone-500",
};

interface IdeaCardProps {
  idea: DateIdea;
}

export function IdeaCard({ idea }: IdeaCardProps) {
  const [pending, setPending] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [me, setMe] = useState(COUPLE.partnerA);

  useEffect(() => {
    const saved = localStorage.getItem("date-idea-user");
    if (saved === "A" || saved === "B") {
      setMe(saved === "A" ? COUPLE.partnerA : COUPLE.partnerB);
    }
  }, []);

  async function handleToggleLock() {
    setPending(true);
    try {
      await toggleLockDateIdea(idea.id, me);
      toast.success(idea.locked ? "已解锁" : "已锁定");
    } catch {
      toast.error("操作失败");
    } finally {
      setPending(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteDateIdea(idea.id);
      toast.success("已删除");
    } catch {
      toast.error("删除失败");
      setDeleting(false);
    }
  }

  return (
    <div
      className={cn(
        "bg-white/60 rounded-2xl p-4 border group hover:shadow-md transition-all duration-300",
        idea.locked
          ? "border-warm-400/60 shadow-[0_0_15px_rgba(217,119,87,0.15)]"
          : "border-warm-200/30 hover:border-warm-300/50"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-serif font-semibold text-stone-800 truncate">
            {idea.title}
          </h3>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span
              className={cn(
                "text-[11px] font-medium px-2 py-0.5 rounded-full",
                typeColors[idea.type] ?? typeColors["其他"]
              )}
            >
              {idea.type}
            </span>
            {idea.location && (
              <span className="inline-flex items-center gap-0.5 text-[11px] text-stone-400">
                <MapPin size={11} />
                {idea.location}
              </span>
            )}
            {idea.duration && (
              <span className="inline-flex items-center gap-0.5 text-[11px] text-stone-400">
                <Clock size={11} />
                {idea.duration}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleToggleLock}
            disabled={pending}
            className={cn(
              "p-1.5 rounded-full transition-colors",
              idea.locked
                ? "text-warm-500 hover:bg-warm-100"
                : "text-stone-300 hover:text-warm-500 hover:bg-warm-100"
            )}
            title={idea.locked ? "解锁" : "锁定"}
          >
            {pending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : idea.locked ? (
              <Lock size={16} />
            ) : (
              <Unlock size={16} />
            )}
          </button>
          <button
            onClick={() => setConfirmOpen(true)}
            disabled={deleting}
            className="p-1.5 rounded-full text-stone-300 hover:text-red-400 hover:bg-red-50 transition-colors"
            title="删除"
          >
            {deleting ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Trash2 size={14} />
            )}
          </button>
        </div>
      </div>
      {idea.locked && idea.lockedBy && (
        <p className="text-[10px] text-warm-400 mt-2">
          {idea.lockedBy} 锁定了这个点子
        </p>
      )}
      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        message="确定要删除这个约会点子吗？删除后无法恢复。"
      />
    </div>
  );
}
