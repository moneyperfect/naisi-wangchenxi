"use client";

import { useState } from "react";
import { Loader2, BookHeart, Clock, Smile, Heart, Frown, HelpCircle, ThumbsUp, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { addDiaryEntry, addTimelineEvent, updateDiaryEntry, updateTimelineEvent } from "@/lib/actions";
import { Button } from "@/components/ui/Button";
import { COUPLE } from "@/lib/constants";
import type { StoryItem } from "@/types";

const moods = [
  { key: "happy", label: "开心", icon: Smile },
  { key: "love", label: "爱你", icon: Heart },
  { key: "sad", label: "难过", icon: Frown },
  { key: "thinking", label: "思考", icon: HelpCircle },
  { key: "grateful", label: "感恩", icon: ThumbsUp },
  { key: "excited", label: "激动", icon: Sparkles },
];

interface StoryFormProps {
  onClose: () => void;
  initialData?: StoryItem;
}

export function StoryForm({ onClose, initialData }: StoryFormProps) {
  const isEditing = !!initialData;
  const defaultTab = initialData?.type === "milestone" ? "milestone" : "diary";
  const [tab, setTab] = useState<"diary" | "milestone">(defaultTab);
  const [loading, setLoading] = useState(false);
  const [author, setAuthor] = useState(initialData?.type === "diary" ? initialData.author : "A");
  const [mood, setMood] = useState(initialData?.type === "diary" ? initialData.mood ?? "" : "");

  async function handleDiarySubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      const form = new FormData(e.currentTarget);
      const content = form.get("content") as string;
      const date =
        (form.get("date") as string) || new Date().toISOString().split("T")[0];

      if (isEditing && initialData?.type === "diary") {
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

  async function handleMilestoneSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      const form = new FormData(e.currentTarget);
      const data = {
        title: form.get("title") as string,
        date: form.get("date") as string,
        description: (form.get("description") as string) || undefined,
      };

      if (isEditing && initialData?.type === "milestone") {
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
    <div className="space-y-4">
      {/* Tab switcher */}
      <div className="flex gap-2 bg-warm-100/50 rounded-xl p-1">
        <button
          type="button"
          onClick={() => setTab("diary")}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-all",
            tab === "diary"
              ? "bg-white text-warm-600 shadow-sm"
              : "text-stone-400 hover:text-stone-600"
          )}
        >
          <BookHeart size={14} />
          日常
        </button>
        <button
          type="button"
          onClick={() => setTab("milestone")}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-all",
            tab === "milestone"
              ? "bg-white text-warm-600 shadow-sm"
              : "text-stone-400 hover:text-stone-600"
          )}
        >
          <Clock size={14} />
          重要节点
        </button>
      </div>

      {/* Diary form */}
      {tab === "diary" && (
        <form onSubmit={handleDiarySubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-2">
              谁写的？
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setAuthor("A")}
                className={cn(
                  "flex-1 py-2.5 rounded-xl text-sm font-medium transition-all",
                  author === "A"
                    ? "bg-warm-500 text-white"
                    : "bg-warm-100 text-warm-700 hover:bg-warm-200"
                )}
              >
                {COUPLE.partnerA}
              </button>
              <button
                type="button"
                onClick={() => setAuthor("B")}
                className={cn(
                  "flex-1 py-2.5 rounded-xl text-sm font-medium transition-all",
                  author === "B"
                    ? "bg-rose-500 text-white"
                    : "bg-rose-50 text-rose-600 hover:bg-rose-100"
                )}
              >
                {COUPLE.partnerB}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-600 mb-2">
              今天的心情
            </label>
            <div className="flex gap-2">
              {moods.map((m) => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => setMood(mood === m.key ? "" : m.key)}
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                      mood === m.key
                        ? "bg-warm-200 scale-110 text-warm-600"
                        : "bg-warm-50 hover:bg-warm-100 text-stone-400"
                    )}
                    title={m.label}
                  >
                    <Icon size={18} />
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1">
              日期
            </label>
            <input
              name="date"
              type="date"
              defaultValue={
                isEditing && initialData?.type === "diary"
                  ? initialData.date
                  : new Date().toISOString().split("T")[0]
              }
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-warm-200 text-base text-stone-800 focus:outline-none focus:border-warm-400 focus:ring-2 focus:ring-warm-200 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1">
              今天想说什么？
            </label>
            <textarea
              name="content"
              required
              rows={4}
              defaultValue={initialData?.type === "diary" ? initialData.content : ""}
              placeholder="记录今天的点滴..."
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-warm-200 text-base text-stone-800 placeholder:text-stone-300 focus:outline-none focus:border-warm-400 focus:ring-2 focus:ring-warm-200 transition-all resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
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
      )}

      {/* Milestone form */}
      {tab === "milestone" && (
        <form onSubmit={handleMilestoneSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1">
              事件名称
            </label>
            <input
              name="title"
              required
              defaultValue={initialData?.type === "milestone" ? initialData.title : ""}
              placeholder="如：第一次见面"
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-warm-200 text-base text-stone-800 placeholder:text-stone-300 focus:outline-none focus:border-warm-400 focus:ring-2 focus:ring-warm-200 transition-all"
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
              defaultValue={
                initialData?.type === "milestone"
                  ? initialData.date
                  : new Date().toISOString().split("T")[0]
              }
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
              defaultValue={initialData?.type === "milestone" ? initialData.description ?? "" : ""}
              placeholder="记录这个特别的时刻..."
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-warm-200 text-base text-stone-800 placeholder:text-stone-300 focus:outline-none focus:border-warm-400 focus:ring-2 focus:ring-warm-200 transition-all resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
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
      )}
    </div>
  );
}
