import { Suspense } from "react";
import { getTimelineEvents } from "@/lib/actions";

export const dynamic = "force-dynamic";
import { PageHeader } from "@/components/layout/PageHeader";
import { TimelineEvent } from "@/components/timeline/TimelineEvent";
import { TimelineAddButton } from "./TimelineAddButton";
import { TimelineSkeleton } from "@/components/timeline/TimelineSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ScrollReveal } from "@/components/effects/ScrollReveal";
import { Clock } from "lucide-react";

async function TimelineList() {
  const events = await getTimelineEvents();

  if (events.length === 0) {
    return (
      <EmptyState
        icon={<Clock size={32} />}
        title="还没有故事"
        description="记录你们在一起的每一个重要时刻"
        action={<TimelineAddButton />}
      />
    );
  }

  return (
    <div className="relative">
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-warm-300/50 via-warm-400/30 to-warm-300/50" />
      <div className="space-y-6">
        {events.map((event, i) => (
          <ScrollReveal
            key={event.id}
            direction={i % 2 === 0 ? "left" : "right"}
            delay={i * 0.1}
          >
            <TimelineEvent event={event} index={i} />
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}

export default function TimelinePage() {
  return (
    <div>
      <PageHeader title="时间线" showBack action={<TimelineAddButton />} />
      <div className="mx-auto max-w-lg px-4 py-6">
        <Suspense fallback={<TimelineSkeleton />}>
          <TimelineList />
        </Suspense>
      </div>
    </div>
  );
}
