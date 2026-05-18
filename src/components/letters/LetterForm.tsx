"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { addLetter, updateLetter } from "@/lib/actions";
import { Button } from "@/components/ui/Button";
import { COUPLE } from "@/lib/constants";
import type { Letter } from "@/types";

interface LetterFormProps {
  onClose: () => void;
  initialData?: Letter;
}

export function LetterForm({ onClose, initialData }: LetterFormProps) {
  const [loading, setLoading] = useState(false);
  const [author, setAuthor] = useState(initialData?.author || "A");
  const isEditing = !!initialData;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      const form = new FormData(e.currentTarget);

      if (isEditing) {
        await updateLetter(initialData.id, {
          title: (form.get("title") as string) || undefined,
          content: form.get("content") as string,
        });
        toast.success("情书已更新");
      } else {
        await addLetter({
          author,
          title: (form.get("title") as string) || undefined,
          content: form.get("content") as string,
        });
        toast.success("情书已发送");
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
        <label className="block text-sm font-medium text-stone-600 mb-1">
          标题（可选）
        </label>
        <input
          name="title"
          defaultValue={initialData?.title ?? ""}
          placeholder="给这封信起个名字"
          className="w-full px-4 py-2.5 rounded-xl bg-white border border-warm-200 text-stone-800 placeholder:text-stone-300 focus:outline-none focus:border-warm-400 focus:ring-2 focus:ring-warm-200 transition-all"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-600 mb-1">
          内容
        </label>
        <textarea
          name="content"
          required
          rows={6}
          defaultValue={initialData?.content}
          placeholder="想对 TA 说些什么..."
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
            "发送"
          )}
        </Button>
      </div>
    </form>
  );
}
