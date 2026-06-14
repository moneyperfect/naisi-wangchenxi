"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitDailyAnswer, createDailyQuestion } from "@/lib/actions";
import { toast } from "sonner";
import { QuestionCard } from "./QuestionCard";
import { RevealAnimation } from "./RevealAnimation";
import { AnswerHistory } from "./AnswerHistory";
import { Button } from "@/components/ui/Button";
import { HelpCircle, Plus, Loader2 } from "lucide-react";

interface DailyClientProps {
  question: { id: number; question: string } | null;
  answers: { author: string; answer: string }[];
  history: {
    id: number;
    question: string;
    createdAt: Date;
    answers: Record<string, string>;
  }[];
}

export function DailyClient({ question, answers, history }: DailyClientProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [justSubmitted, setJustSubmitted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");

  const bothAnswered = answers.length >= 2;
  const hasOneAnswer = answers.length === 1;

  const answerMap: Record<string, string> = {};
  for (const a of answers) {
    answerMap[a.author] = a.answer;
  }

  const handleSubmit = async (author: string, answer: string) => {
    setSubmitting(true);
    try {
      await submitDailyAnswer(question!.id, author, answer);
      toast.success("提交成功");
      setJustSubmitted(true);
      router.refresh();
    } catch {
      toast.error("提交失败，请重试");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreate = async () => {
    if (!newQuestion.trim()) return;
    setCreating(true);
    try {
      await createDailyQuestion(newQuestion.trim());
      toast.success("问题已创建");
      setNewQuestion("");
      setShowForm(false);
      router.refresh();
    } catch {
      toast.error("创建失败，请重试");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Create question form */}
      {showForm ? (
        <div className="space-y-3">
          <textarea
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="写下你想问对方的问题..."
            rows={3}
            className="w-full px-4 py-3 rounded-2xl bg-white border border-warm-200 text-base text-stone-800 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-warm-300 resize-none"
          />
          <div className="flex gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setShowForm(false);
                setNewQuestion("");
              }}
              className="flex-1"
            >
              取消
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!newQuestion.trim() || creating}
              className="flex-1"
            >
              {creating ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                "创建"
              )}
            </Button>
          </div>
        </div>
      ) : (
        <Button onClick={() => setShowForm(true)} className="w-full">
          <Plus size={16} />
          创建新问题
        </Button>
      )}

      {/* Current question or reveal */}
      {question &&
        (bothAnswered || justSubmitted ? (
          <RevealAnimation question={question.question} answers={answerMap} />
        ) : (
          <QuestionCard
            question={question.question}
            onSubmit={handleSubmit}
            submitting={submitting}
            hasOneAnswer={hasOneAnswer}
          />
        ))}

      <AnswerHistory items={history} />
    </div>
  );
}
