"use client";

import { useState } from "react";
import { Loader2, Clock } from "lucide-react";
import { toast } from "sonner";
import { addLetter, updateLetter } from "@/lib/actions";
import { Button } from "@/components/ui/Button";
import { COUPLE } from "@/lib/constants";
import type { Letter } from "@/types";

interface NoteFormProps {
  onClose: () => void;
  initialData?: Letter;
}

export function NoteForm({ onClose, initialData }: NoteFormProps) {
  const [loading, setLoading] = useState(false);
  const [author, setAuthor] = useState(initialData?.author || "A");
  const [scheduled, setScheduled] = useState(!!initialData?.scheduledAt);
  const isEditing = !!initialData;

  function toLocalDatetime(d: Date) {
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      const form = new FormData(e.currentTarget);
      const content = form.get("content") as string;
      const title = (form.get("title") as string) || undefined;

      if (isEditing) {
        await updateLetter(initialData.id, { title, content });
        toast.success("已更新");
      } else {
        const scheduledAt = scheduled
          ? (form.get("scheduledAt") as string) || undefined
          : undefined;
        await addLetter({ author, title, content, scheduledAt });
        toast.success(
          scheduledAt ? "心里话已预约，到时候会悄悄出现" : "心里话已送出"
        );
      }
      onClose();
    } catch {
      toast.error("操作失败，请重试");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!isEditing && (
        <div>
          <label className="block text-sm font-medium text-stone-600 mb-2">
            谁想说？
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setAuthor("A")}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                author === "A"
                  ? "bg-warm-500 text-white"
                  : "bg-warm-100 text-warm-700 hover:bg-warm-200"
              }`}
            >
              {COUPLE.partnerA}
            </button>
            <button
              type="button"
              onClick={() => setAuthor("B")}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                author === "B"
                  ? "bg-rose-500 text-white"
                  : "bg-rose-50 text-rose-600 hover:bg-rose-100"
              }`}
            >
              {COUPLE.partnerB}
            </button>
          </div>
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-stone-600 mb-1">
          标题（可选）
        </label>
        <input
          name="title"
          defaultValue={initialData?.title ?? ""}
          placeholder="给这条消息起个名字？"
          className="w-full px-4 py-2.5 rounded-xl bg-white border border-warm-200 text-stone-800 placeholder:text-stone-300 focus:outline-none focus:border-warm-400 focus:ring-2 focus:ring-warm-200 transition-all"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-600 mb-1">
          心里话
        </label>
        <textarea
          name="content"
          required
          rows={4}
          defaultValue={initialData?.content}
          placeholder="想说什么就说，不用太长..."
          className="w-full px-4 py-2.5 rounded-xl bg-white border border-warm-200 text-stone-800 placeholder:text-stone-300 focus:outline-none focus:border-warm-400 focus:ring-2 focus:ring-warm-200 transition-all resize-none"
        />
      </div>
      {!isEditing && (
        <div>
          <button
            type="button"
            onClick={() => setScheduled(!scheduled)}
            className="flex items-center gap-2 text-sm text-stone-500 hover:text-warm-600 transition-colors"
          >
            <Clock size={14} />
            <span>定时发送</span>
            <span
              className={`w-9 h-5 rounded-full relative transition-colors ${
                scheduled ? "bg-warm-500" : "bg-stone-300"
              }`}
            >
              <span
                className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                  scheduled ? "translate-x-4" : "translate-x-0.5"
                }`}
              />
            </span>
          </button>
          {scheduled && (
            <input
              type="datetime-local"
              name="scheduledAt"
              className="mt-2 w-full px-4 py-2.5 rounded-xl bg-white border border-warm-200 text-stone-800 focus:outline-none focus:border-warm-400 focus:ring-2 focus:ring-warm-200 transition-all"
            />
          )}
        </div>
      )}
      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="ghost"
          onClick={onClose}
          className="flex-1"
        >
          取消
        </Button>
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              处理中...
            </>
          ) : isEditing ? (
            "保存"
          ) : scheduled ? (
            "预约发送"
          ) : (
            "送出"
          )}
        </Button>
      </div>
    </form>
  );
}
