import { PageHeader } from "@/components/layout/PageHeader";
import { ChallengeSkeleton } from "@/components/challenge/ChallengeSkeleton";

export default function ChallengeLoading() {
  return (
    <div>
      <PageHeader title="今日挑战" showBack />
      <div className="mx-auto max-w-lg px-4 py-6">
        <ChallengeSkeleton />
      </div>
    </div>
  );
}
