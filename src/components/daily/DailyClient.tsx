"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitDailyAnswer } from "@/lib/actions";
import { toast } from "sonner";
import { QuestionCard } from "./QuestionCard";
import { RevealAnimation } from "./RevealAnimation";
import { AnswerHistory } from "./AnswerHistory";
import { EmptyState } from "@/components/ui/EmptyState";
import { HelpCircle } from "lucide-react";

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

  if (!question) {
    return (
      <EmptyState
        icon={<HelpCircle size={32} />}
        title="还没有问题"
        description="管理员还没有添加今日问题"
      />
    );
  }

  const bothAnswered = answers.length >= 2;
  const hasOneAnswer = answers.length === 1;

  const answerMap: Record<string, string> = {};
  for (const a of answers) {
    answerMap[a.author] = a.answer;
  }

  const handleSubmit = async (author: string, answer: string) => {
    setSubmitting(true);
    try {
      await submitDailyAnswer(question.id, author, answer);
      toast.success("提交成功");
      setJustSubmitted(true);
      router.refresh();
    } catch {
      toast.error("提交失败，请重试");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {bothAnswered || justSubmitted ? (
        <RevealAnimation question={question.question} answers={answerMap} />
      ) : (
        <QuestionCard
          question={question.question}
          onSubmit={handleSubmit}
          submitting={submitting}
          hasOneAnswer={hasOneAnswer}
        />
      )}

      <AnswerHistory items={history} />
    </div>
  );
}
