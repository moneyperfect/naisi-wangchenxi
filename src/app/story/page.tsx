import { Suspense } from "react";
import { getStoryEntries } from "@/lib/actions";
import { PageHeader } from "@/components/layout/PageHeader";
import { StoryAddButton } from "./StoryAddButton";
import { StorySkeleton } from "@/components/story/StorySkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { StoryList } from "./StoryList";
import { BookHeart } from "lucide-react";

export const dynamic = "force-dynamic";

async function StoryContent() {
  const entries = await getStoryEntries();

  if (entries.length === 0) {
    return (
      <EmptyState
        icon={<BookHeart size={32} />}
        title="还没有故事"
        description="记录你们的日常点滴和重要时刻，留住每一个美好瞬间"
        action={<StoryAddButton />}
      />
    );
  }

  return <StoryList entries={entries} />;
}

export default function StoryPage() {
  return (
    <div>
      <PageHeader title="我们的故事" showBack action={<StoryAddButton />} />
      <div className="mx-auto max-w-lg px-4 py-6">
        <Suspense fallback={<StorySkeleton />}>
          <StoryContent />
        </Suspense>
      </div>
    </div>
  );
}
