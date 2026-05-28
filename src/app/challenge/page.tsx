import { Suspense } from "react";
import { getTodaysChallenge, getChallengeHistory } from "@/lib/actions";
import { PageHeader } from "@/components/layout/PageHeader";
import { ChallengeClient } from "@/components/challenge/ChallengeClient";
import { ChallengeSkeleton } from "@/components/challenge/ChallengeSkeleton";
import { PageWrapper } from "@/components/ui/PageWrapper";

export const dynamic = "force-dynamic";

async function ChallengeContent() {
  const todayChallenge = await getTodaysChallenge();
  const history = await getChallengeHistory();

  return <ChallengeClient todayChallenge={todayChallenge} history={history} />;
}

export default function ChallengePage() {
  return (
    <PageWrapper>
      <PageHeader title="今日挑战" showBack />
      <div className="mx-auto max-w-lg px-4 py-6">
        <Suspense fallback={<ChallengeSkeleton />}>
          <ChallengeContent />
        </Suspense>
      </div>
    </PageWrapper>
  );
}
