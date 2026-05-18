import { Suspense } from "react";
import { getDiaryEntries } from "@/lib/actions";
import { PageHeader } from "@/components/layout/PageHeader";
import { DiaryEntry } from "@/components/diary/DiaryEntry";
import { DiaryAddButton } from "./DiaryAddButton";
import { DiarySkeleton } from "@/components/diary/DiarySkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ScrollReveal } from "@/components/effects/ScrollReveal";
import { formatDate } from "@/lib/utils";
import { BookHeart } from "lucide-react";

async function DiaryList() {
  const entries = await getDiaryEntries();

  if (entries.length === 0) {
    return (
      <EmptyState
        icon={<BookHeart size={32} />}
        title="还没有日记"
        description="记录你们的日常点滴，留住每一个美好瞬间"
        action={<DiaryAddButton />}
      />
    );
  }

  // Group by date
  const grouped = entries.reduce((acc, entry) => {
    const date = entry.date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(entry);
    return acc;
  }, {} as Record<string, typeof entries>);

  const dates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <div className="space-y-6">
      {dates.map((date) => (
        <div key={date}>
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px flex-1 bg-warm-200/50" />
            <span className="text-xs text-stone-400 font-medium whitespace-nowrap">
              {formatDate(date)}
            </span>
            <div className="h-px flex-1 bg-warm-200/50" />
          </div>
          <div className="space-y-3">
            {grouped[date].map((entry, i) => (
              <ScrollReveal key={entry.id} delay={i * 0.08}>
                <DiaryEntry entry={entry} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function DiaryPage() {
  return (
    <div>
      <PageHeader title="恋爱日记" showBack action={<DiaryAddButton />} />
      <div className="mx-auto max-w-lg px-4 py-6">
        <Suspense fallback={<DiarySkeleton />}>
          <DiaryList />
        </Suspense>
      </div>
    </div>
  );
}
