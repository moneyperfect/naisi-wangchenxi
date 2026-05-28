import { Suspense } from "react";
import { getTodaysQuestion, getDailyAnswers, getDailyHistory } from "@/lib/actions";
import { PageHeader } from "@/components/layout/PageHeader";
import { DailyClient } from "@/components/daily/DailyClient";
import { DailySkeleton } from "@/components/daily/DailySkeleton";
import { ScrollReveal } from "@/components/effects/ScrollReveal";
import { PageWrapper } from "@/components/ui/PageWrapper";

export const dynamic = "force-dynamic";

async function DailyContent() {
  const question = await getTodaysQuestion();
  const answers = question ? await getDailyAnswers(question.id) : [];
  const history = await getDailyHistory();

  return (
    <ScrollReveal>
      <DailyClient question={question} answers={answers} history={history} />
    </ScrollReveal>
  );
}

export default function DailyPage() {
  return (
    <PageWrapper>
      <PageHeader title="今日一问" showBack />
      <div className="mx-auto max-w-lg px-4 py-6">
        <Suspense fallback={<DailySkeleton />}>
          <DailyContent />
        </Suspense>
      </div>
    </PageWrapper>
  );
}
