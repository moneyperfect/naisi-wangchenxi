import { Suspense } from "react";
import { getQuizQuestions } from "@/lib/actions";
import { PageHeader } from "@/components/layout/PageHeader";
import { QuizGame } from "@/components/games/QuizGame";
import { GamesSkeleton } from "@/components/games/GamesSkeleton";

export const dynamic = "force-dynamic";

async function GamesContent() {
  const questions = await getQuizQuestions();
  return <QuizGame questions={questions} />;
}

export default function GamesPage() {
  return (
    <div>
      <PageHeader title="默契测试" showBack />
      <div className="mx-auto max-w-lg px-4 py-6">
        <Suspense fallback={<GamesSkeleton />}>
          <GamesContent />
        </Suspense>
      </div>
    </div>
  );
}
