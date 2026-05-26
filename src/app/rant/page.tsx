import { Suspense } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { ScrollReveal } from "@/components/effects/ScrollReveal";
import { MessageSquare } from "lucide-react";
import { getRants } from "@/lib/actions";
import { RantSkeleton } from "@/components/rant/RantSkeleton";
import { RantCard } from "@/components/rant/RantCard";
import { RantAddButton } from "./RantAddButton";

export const dynamic = "force-dynamic";

async function RantContent() {
  const rants = await getRants();

  if (rants.length === 0) {
    return (
      <EmptyState
        icon={<MessageSquare size={32} />}
        title="还没有吐槽"
        description="有什么不满？尽管开炮"
        action={<RantAddButton />}
      />
    );
  }

  return (
    <div className="space-y-3">
      {rants.map((rant, i) => (
        <ScrollReveal key={rant.id} delay={i * 0.06}>
          <RantCard rant={rant} />
        </ScrollReveal>
      ))}
    </div>
  );
}

export default function RantPage() {
  return (
    <div>
      <PageHeader title="吐槽墙" showBack action={<RantAddButton />} />
      <div className="mx-auto max-w-lg px-4 py-6">
        <Suspense fallback={<RantSkeleton />}>
          <RantContent />
        </Suspense>
      </div>
    </div>
  );
}
