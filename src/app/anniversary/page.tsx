import { Suspense } from "react";
import { getAnniversaries } from "@/lib/actions";

export const dynamic = "force-dynamic";
import { PageHeader } from "@/components/layout/PageHeader";
import { AnniversaryCard } from "@/components/anniversary/AnniversaryCard";
import { AnniversaryAddButton } from "./AnniversaryAddButton";
import { AnniversarySkeleton } from "@/components/anniversary/AnniversarySkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ScrollReveal } from "@/components/effects/ScrollReveal";
import { Calendar } from "lucide-react";
import { PageWrapper } from "@/components/ui/PageWrapper";

async function AnniversaryList() {
  const anniversaries = await getAnniversaries();

  if (anniversaries.length === 0) {
    return (
      <EmptyState
        icon={<Calendar size={32} />}
        title="还没有纪念日"
        description="添加你们的第一个纪念日，让重要的日子不会被遗忘"
        action={<AnniversaryAddButton />}
      />
    );
  }

  return (
    <div className="space-y-3">
      {anniversaries.map((item, i) => (
        <ScrollReveal key={item.id} delay={i * 0.08}>
          <AnniversaryCard item={item} />
        </ScrollReveal>
      ))}
    </div>
  );
}

export default function AnniversaryPage() {
  return (
    <PageWrapper>
      <PageHeader title="纪念日" showBack action={<AnniversaryAddButton />} />
      <div className="mx-auto max-w-lg px-4 py-6">
        <Suspense fallback={<AnniversarySkeleton />}>
          <AnniversaryList />
        </Suspense>
      </div>
    </PageWrapper>
  );
}
