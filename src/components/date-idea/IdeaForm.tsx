"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { addDateIdea } from "@/lib/actions";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const TYPES = ["户外", "室内", "美食", "冒险", "其他"] as const;

const typeColors: Record<string, string> = {
  户外: "bg-emerald-100 text-emerald-600 border-emerald-200",
  室内: "bg-sky-100 text-sky-600 border-sky-200",
  美食: "bg-amber-100 text-amber-600 border-amber-200",
  冒险: "bg-violet-100 text-violet-600 border-violet-200",
  其他: "bg-stone-100 text-stone-500 border-stone-200",
};

interface IdeaFormProps {
  onClose: () => void;
}

export function IdeaForm({ onClose }: IdeaFormProps) {
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState("户外");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      const form = new FormData(e.currentTarget);
      await addDateIdea({
        title: form.get("title") as string,
        type: selectedType,
        location: (form.get("location") as string) || undefined,
        duration: (form.get("duration") as string) || undefined,
      });
      toast.success("约会点子已添加");
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "添加失败，请重试");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-stone-600 mb-1">
          点子名称
        </label>
        <input
          name="title"
          required
          placeholder="如：一起去野餐"
          className="w-full px-4 py-2.5 rounded-xl bg-white border border-warm-200 text-base text-stone-800 placeholder:text-stone-300 focus:outline-none focus:border-warm-400 focus:ring-2 focus:ring-warm-200 transition-all"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-600 mb-2">
          类型
        </label>
        <div className="flex flex-wrap gap-2">
          {TYPES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setSelectedType(t)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                selectedType === t
                  ? typeColors[t]
                  : "bg-white text-stone-400 border-warm-200"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-600 mb-1">
          地点（可选）
        </label>
        <input
          name="location"
          placeholder="如：公园、家里"
          className="w-full px-4 py-2.5 rounded-xl bg-white border border-warm-200 text-base text-stone-800 placeholder:text-stone-300 focus:outline-none focus:border-warm-400 focus:ring-2 focus:ring-warm-200 transition-all"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-600 mb-1">
          时长（可选）
        </label>
        <input
          name="duration"
          placeholder="如：2小时、半天"
          className="w-full px-4 py-2.5 rounded-xl bg-white border border-warm-200 text-base text-stone-800 placeholder:text-stone-300 focus:outline-none focus:border-warm-400 focus:ring-2 focus:ring-warm-200 transition-all"
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
              添加中...
            </>
          ) : (
            "添加"
          )}
        </Button>
      </div>
    </form>
  );
}
