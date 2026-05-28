import { Suspense } from "react";
import { getGameScores } from "@/lib/actions";
import { PageHeader } from "@/components/layout/PageHeader";
import { GamesClient } from "@/components/games/GamesClient";
import { GamesSkeleton } from "@/components/games/GamesSkeleton";
import { PageWrapper } from "@/components/ui/PageWrapper";

export const dynamic = "force-dynamic";

async function GamesContent() {
  const scores = await getGameScores();
  return <GamesClient scores={scores} />;
}

export default function GamesPage() {
  return (
    <PageWrapper>
      <PageHeader title="小游戏" showBack />
      <div className="mx-auto max-w-lg px-4 py-6">
        <Suspense fallback={<GamesSkeleton />}>
          <GamesContent />
        </Suspense>
      </div>
    </PageWrapper>
  );
}
