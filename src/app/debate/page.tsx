import { Suspense } from "react";
import { getDebates, getDebateArguments } from "@/lib/actions";
import { PageHeader } from "@/components/layout/PageHeader";
import { DebateClient } from "@/components/debate/DebateClient";
import { DebateSkeleton } from "@/components/debate/DebateSkeleton";
import { PageWrapper } from "@/components/ui/PageWrapper";

export const dynamic = "force-dynamic";

async function DebateContent() {
  const debates = await getDebates();
  const debatesWithArgs = await Promise.all(
    debates.map(async (d) => ({
      ...d,
      arguments: await getDebateArguments(d.id),
    }))
  );
  return <DebateClient debates={debatesWithArgs} />;
}

export default function DebatePage() {
  return (
    <PageWrapper>
      <PageHeader title="辩论场" showBack />
      <div className="mx-auto max-w-lg px-4 py-6">
        <Suspense fallback={<DebateSkeleton />}>
          <DebateContent />
        </Suspense>
      </div>
    </PageWrapper>
  );
}
