import { Suspense } from "react";
import { getDateIdeas } from "@/lib/actions";

export const dynamic = "force-dynamic";

import { PageHeader } from "@/components/layout/PageHeader";
import { DateIdeaClient } from "@/components/date-idea/DateIdeaClient";
import { DateIdeaSkeleton } from "@/components/date-idea/DateIdeaSkeleton";
import { PageWrapper } from "@/components/ui/PageWrapper";

async function DateIdeaList() {
  const ideas = await getDateIdeas();
  return <DateIdeaClient ideas={ideas} />;
}

export default function DateIdeaPage() {
  return (
    <PageWrapper>
      <PageHeader title="随机约会" showBack />
      <div className="mx-auto max-w-lg px-4 py-6">
        <Suspense fallback={<DateIdeaSkeleton />}>
          <DateIdeaList />
        </Suspense>
      </div>
    </PageWrapper>
  );
}
