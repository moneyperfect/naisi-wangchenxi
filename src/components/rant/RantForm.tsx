"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { addRant } from "@/lib/actions";
import { Button } from "@/components/ui/Button";
import { COUPLE, RANT_LEVELS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const categories = [
  { key: "work", label: "工作" },
  { key: "life", label: "生活" },
  { key: "partner", label: "对方" },
  { key: "other", label: "其他" },
];

export function RantForm({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [author, setAuthor] = useState("A");
  const [category, setCategory] = useState("other");
  const [level, setLevel] = useState("whisper");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const content = formData.get("content") as string;
    if (!content.trim()) return;

    const levelConfig = RANT_LEVELS.find((l) => l.key === level);
    const prefix = level === "whisper" ? "" : level === "shout" ? "【大声嚷嚷】" : "【暴怒模式】";

    setLoading(true);
    try {
      await addRant({ author, content: prefix + content.trim(), category });
      toast.success(level === "rage" ? "暴怒吐槽成功！" : "吐槽成功！");
      onClose();
    } catch {
      toast.error("发送失败");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-2">
        {(["A", "B"] as const).map((a) => (
          <button
            key={a}
            type="button"
            onClick={() => setAuthor(a)}
            className={cn(
              "flex-1 py-2 rounded-xl text-sm font-medium transition-colors",
              author === a
                ? "bg-warm-500 text-white"
                : "bg-stone-100 text-stone-500 hover:bg-stone-200"
            )}
          >
            {a === "A" ? COUPLE.partnerA : COUPLE.partnerB}
          </button>
        ))}
      </div>

      <div>
        <p className="text-xs text-stone-400 mb-2">吐槽等级</p>
        <div className="flex gap-2">
          {RANT_LEVELS.map((l) => (
            <button
              key={l.key}
              type="button"
              onClick={() => setLevel(l.key)}
              className={cn(
                "flex-1 py-2 rounded-xl text-xs font-medium transition-colors",
                level === l.key
                  ? l.color + " ring-1 ring-current"
                  : "bg-stone-100 text-stone-500 hover:bg-stone-200"
              )}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs text-stone-400 mb-2">分类</p>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => setCategory(c.key)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                category === c.key
                  ? "bg-orange-100 text-orange-600 ring-1 ring-orange-300"
                  : "bg-stone-100 text-stone-500 hover:bg-stone-200"
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <textarea
        name="content"
        rows={4}
        placeholder={level === "rage" ? "今天不吐不快！！！" : "有什么想吐槽的..."}
        className={cn(
          "w-full px-4 py-3 rounded-2xl text-base resize-none focus:outline-none focus:ring-2 focus:ring-warm-300 focus:border-transparent",
          level === "rage"
            ? "bg-red-50 border-red-200"
            : level === "shout"
            ? "bg-orange-50 border-orange-200"
            : "bg-stone-50 border-stone-200"
        )}
        required
      />

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : level === "rage" ? (
          "暴怒输出！"
        ) : level === "shout" ? (
          "大声说出来！"
        ) : (
          "小声bb..."
        )}
      </Button>
    </form>
  );
}
