import { Suspense } from "react";
import { getTodaysChallenge, getChallengeHistory } from "@/lib/actions";
import { PageHeader } from "@/components/layout/PageHeader";
import { ChallengeClient } from "@/components/challenge/ChallengeClient";

export const dynamic = "force-dynamic";

async function ChallengeContent() {
  const [todayChallenge, history] = await Promise.all([
    getTodaysChallenge(),
    getChallengeHistory(),
  ]);
  return <ChallengeClient todayChallenge={todayChallenge} history={history} />;
}

export default function ChallengePage() {
  return (
    <div>
      <PageHeader title="今日挑战" showBack />
      <div className="mx-auto max-w-lg px-4 py-6">
        <Suspense
          fallback={
            <div className="space-y-4 animate-pulse">
              <div className="h-10 w-10 rounded-full bg-stone-100 mx-auto" />
              <div className="h-6 w-40 bg-stone-100 rounded mx-auto" />
              <div className="h-32 bg-stone-100 rounded-2xl" />
            </div>
          }
        >
          <ChallengeContent />
        </Suspense>
      </div>
    </div>
  );
}
