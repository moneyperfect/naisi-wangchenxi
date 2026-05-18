"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { addDiaryEntry, updateDiaryEntry } from "@/lib/actions";
import { Button } from "@/components/ui/Button";
import { COUPLE } from "@/lib/constants";
import type { DiaryEntry } from "@/types";

const moods = [
  { key: "happy", label: "😊" },
  { key: "love", label: "🥰" },
  { key: "sad", label: "😢" },
  { key: "thinking", label: "🤔" },
  { key: "grateful", label: "🙏" },
  { key: "excited", label: "🎉" },
];

interface DiaryFormProps {
  onClose: () => void;
  initialData?: DiaryEntry;
}

export function DiaryForm({ onClose, initialData }: DiaryFormProps) {
  const [loading, setLoading] = useState(false);
  const [author, setAuthor] = useState(initialData?.author || "A");
  const [mood, setMood] = useState(initialData?.mood || "");
  const isEditing = !!initialData;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      const form = new FormData(e.currentTarget);
      const content = form.get("content") as string;
      const date = (form.get("date") as string) || new Date().toISOString().split("T")[0];

      if (isEditing) {
        await updateDiaryEntry(initialData.id, { content, mood: mood || undefined });
        toast.success("日记已更新");
      } else {
        await addDiaryEntry({ author, content, mood: mood || undefined, date });
        toast.success("日记已保存");
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
            谁写的？
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
        <label className="block text-sm font-medium text-stone-600 mb-2">
          今天的心情
        </label>
        <div className="flex gap-2">
          {moods.map((m) => (
            <button
              key={m.key}
              type="button"
              onClick={() => setMood(mood === m.key ? "" : m.key)}
              className={`w-10 h-10 rounded-xl text-lg flex items-center justify-center transition-all ${
                mood === m.key
                  ? "bg-warm-200 scale-110"
                  : "bg-warm-50 hover:bg-warm-100"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {!isEditing && (
        <div>
          <label className="block text-sm font-medium text-stone-600 mb-1">
            日期
          </label>
          <input
            name="date"
            type="date"
            defaultValue={new Date().toISOString().split("T")[0]}
            className="w-full px-4 py-2.5 rounded-xl bg-white border border-warm-200 text-stone-800 focus:outline-none focus:border-warm-400 focus:ring-2 focus:ring-warm-200 transition-all"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-stone-600 mb-1">
          今天想说什么？
        </label>
        <textarea
          name="content"
          required
          rows={5}
          defaultValue={initialData?.content}
          placeholder="记录今天的点滴..."
          className="w-full px-4 py-2.5 rounded-xl bg-white border border-warm-200 text-stone-800 placeholder:text-stone-300 focus:outline-none focus:border-warm-400 focus:ring-2 focus:ring-warm-200 transition-all resize-none"
        />
      </div>

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
          ) : (
            "记录"
          )}
        </Button>
      </div>
    </form>
  );
}
