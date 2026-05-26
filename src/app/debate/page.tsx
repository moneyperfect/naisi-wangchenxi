import { Suspense } from "react";
import { getDebates, getDebateArguments } from "@/lib/actions";
import { PageHeader } from "@/components/layout/PageHeader";
import { DebateClient } from "@/components/debate/DebateClient";

export const dynamic = "force-dynamic";

async function DebateContent() {
  const debates = await getDebates();
  const debatesWithArgs = await Promise.all(
    debates.map(async (debate) => {
      const args = await getDebateArguments(debate.id);
      return { ...debate, arguments: args };
    })
  );
  return <DebateClient debates={debatesWithArgs} />;
}

export default function DebatePage() {
  return (
    <div>
      <PageHeader title="辩论场" showBack />
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
          <DebateContent />
        </Suspense>
      </div>
    </div>
  );
}
