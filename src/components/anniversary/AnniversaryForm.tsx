"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { addAnniversary, updateAnniversary } from "@/lib/actions";
import { Button } from "@/components/ui/Button";
import type { Anniversary } from "@/types";

interface AnniversaryFormProps {
  onClose: () => void;
  initialData?: Anniversary;
}

export function AnniversaryForm({ onClose, initialData }: AnniversaryFormProps) {
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
        isYearly: true,
      };

      if (isEditing) {
        await updateAnniversary(initialData.id, data);
        toast.success("纪念日已更新");
      } else {
        await addAnniversary(data);
        toast.success("纪念日已添加");
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
          纪念日名称
        </label>
        <input
          name="title"
          required
          defaultValue={initialData?.title}
          placeholder="如：在一起纪念日"
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
          备注（可选）
        </label>
        <textarea
          name="description"
          rows={2}
          defaultValue={initialData?.description ?? ""}
          placeholder="记录一些细节..."
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
