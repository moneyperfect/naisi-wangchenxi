"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { addTimelineEvent, updateTimelineEvent } from "@/lib/actions";
import { Button } from "@/components/ui/Button";
import type { TimelineEvent } from "@/types";

interface TimelineFormProps {
  onClose: () => void;
  initialData?: TimelineEvent;
}

export function TimelineForm({ onClose, initialData }: TimelineFormProps) {
  const [loading, setLoading] = useState(false);
  const isEditing = !!initialData;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      const form = new FormData(e.currentTarget);
      const data = {
        title: form.get("title") as string,
        date: form.get("date") as string,
        description: (form.get("description") as string) || undefined,
      };

      if (isEditing) {
        await updateTimelineEvent(initialData.id, data);
        toast.success("事件已更新");
      } else {
        await addTimelineEvent(data);
        toast.success("事件已添加");
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
      <div>
        <label className="block text-sm font-medium text-stone-600 mb-1">
          事件名称
        </label>
        <input
          name="title"
          required
          defaultValue={initialData?.title}
          placeholder="如：第一次见面"
          className="w-full px-4 py-2.5 rounded-xl bg-white border border-warm-200 text-stone-800 placeholder:text-stone-300 focus:outline-none focus:border-warm-400 focus:ring-2 focus:ring-warm-200 transition-all"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-600 mb-1">
          日期
        </label>
        <input
          name="date"
          type="date"
          required
          defaultValue={initialData?.date}
          className="w-full px-4 py-2.5 rounded-xl bg-white border border-warm-200 text-stone-800 focus:outline-none focus:border-warm-400 focus:ring-2 focus:ring-warm-200 transition-all"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-600 mb-1">
          描述（可选）
        </label>
        <textarea
          name="description"
          rows={3}
          defaultValue={initialData?.description ?? ""}
          placeholder="记录这个特别的时刻..."
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
            "添加"
          )}
        </Button>
      </div>
    </form>
  );
}
