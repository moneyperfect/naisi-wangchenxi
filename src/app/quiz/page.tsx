import { Suspense } from "react";
import { getQuizQuestions } from "@/lib/actions";
import { PageHeader } from "@/components/layout/PageHeader";
import { QuizGame } from "@/components/games/QuizGame";

export const dynamic = "force-dynamic";

async function QuizContent() {
  const questions = await getQuizQuestions();
  return <QuizGame questions={questions} />;
}

export default function QuizPage() {
  return (
    <div>
      <PageHeader title="默契测试" showBack />
      <div className="mx-auto max-w-lg px-4 py-6">
        <Suspense
          fallback={
            <div className="space-y-4 animate-pulse">
              <div className="h-10 w-10 rounded-full bg-stone-100 mx-auto" />
              <div className="h-6 w-40 bg-stone-100 rounded mx-auto" />
              <div className="h-4 w-48 bg-stone-100 rounded mx-auto" />
              <div className="h-12 bg-stone-100 rounded-2xl" />
            </div>
          }
        >
          <QuizContent />
        </Suspense>
      </div>
    </div>
  );
}
