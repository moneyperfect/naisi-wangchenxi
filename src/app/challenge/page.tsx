import { PageHeader } from "@/components/layout/PageHeader";
import { ChallengeClient } from "@/components/challenge/ChallengeClient";
import { PageWrapper } from "@/components/ui/PageWrapper";

export default function ChallengePage() {
  return (
    <PageWrapper>
      <PageHeader title="今日挑战" showBack />
      <div className="mx-auto max-w-lg px-4 py-6">
        <ChallengeClient />
      </div>
    </PageWrapper>
  );
}
