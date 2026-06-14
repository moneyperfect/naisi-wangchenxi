"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { addQuizQuestion } from "@/lib/actions";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const correctOptions = [
  { key: "A", label: "A" },
  { key: "B", label: "B" },
  { key: "C", label: "C" },
  { key: "D", label: "D" },
];

export function QuestionForm({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [correct, setCorrect] = useState("A");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const question = formData.get("question") as string;
    const optionA = formData.get("optionA") as string;
    const optionB = formData.get("optionB") as string;
    const optionC = formData.get("optionC") as string;
    const optionD = formData.get("optionD") as string;

    if (!question.trim() || !optionA.trim() || !optionB.trim()) return;

    setLoading(true);
    try {
      await addQuizQuestion({
        question: question.trim(),
        optionA: optionA.trim(),
        optionB: optionB.trim(),
        optionC: optionC.trim() || "-",
        optionD: optionD.trim() || "-",
        correct,
      });
      toast.success("题目已添加");
      onClose();
    } catch {
      toast.error("添加失败");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-xs text-stone-400 mb-1 block">题目</label>
        <input
          name="question"
          placeholder="例如：我最喜欢的食物是？"
          className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-base focus:outline-none focus:ring-2 focus:ring-warm-300"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {["A", "B", "C", "D"].map((label) => (
          <div key={label}>
            <label className="text-xs text-stone-400 mb-1 block">选项 {label}</label>
            <input
              name={`option${label}`}
              placeholder={`选项 ${label}`}
              className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-base focus:outline-none focus:ring-2 focus:ring-warm-300"
              required={label === "A" || label === "B"}
            />
          </div>
        ))}
      </div>

      <div>
        <p className="text-xs text-stone-400 mb-2">正确答案</p>
        <div className="flex gap-2">
          {correctOptions.map((o) => (
            <button
              key={o.key}
              type="button"
              onClick={() => setCorrect(o.key)}
              className={cn(
                "flex-1 py-2 rounded-xl text-sm font-medium transition-colors",
                correct === o.key
                  ? "bg-warm-500 text-white"
                  : "bg-stone-100 text-stone-500 hover:bg-stone-200"
              )}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? <Loader2 size={16} className="animate-spin" /> : "添加题目"}
      </Button>
    </form>
  );
}
