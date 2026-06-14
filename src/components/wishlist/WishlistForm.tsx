"use client";

import { useState } from "react";
import { addWishlistItem } from "@/lib/actions";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const CATEGORIES = ["旅行", "美食", "体验", "其他"] as const;

const categoryColors: Record<string, string> = {
  "旅行": "bg-sky-100 text-sky-700",
  "美食": "bg-orange-100 text-orange-700",
  "体验": "bg-violet-100 text-violet-700",
  "其他": "bg-stone-200 text-stone-600",
};

interface WishlistFormProps {
  onClose: () => void;
}

export function WishlistForm({ onClose }: WishlistFormProps) {
  const [text, setText] = useState("");
  const [category, setCategory] = useState<string>("旅行");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    try {
      await addWishlistItem({ text: text.trim(), category });
      toast.success("心愿已添加！");
      onClose();
    } catch {
      toast.error("添加失败，再试一次");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-stone-600 mb-2">
          心愿内容
        </label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="想一起做的事情..."
          className="w-full rounded-2xl bg-warm-100/60 border border-warm-200/50 px-4 py-3 text-base text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-warm-400/40"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-600 mb-2">
          分类
        </label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium transition-all",
                category === cat
                  ? categoryColors[cat] + " ring-2 ring-offset-1 ring-warm-400"
                  : "bg-warm-100/60 text-stone-500 hover:bg-warm-200/60"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "添加中..." : "许下心愿"}
      </Button>
    </form>
  );
}
