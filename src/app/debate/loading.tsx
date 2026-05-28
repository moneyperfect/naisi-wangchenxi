import { PageHeader } from "@/components/layout/PageHeader";
import { DebateSkeleton } from "@/components/debate/DebateSkeleton";

export default function DebateLoading() {
  return (
    <div>
      <PageHeader title="辩论场" showBack />
      <div className="mx-auto max-w-lg px-4 py-6">
        <DebateSkeleton />
      </div>
    </div>
  );
}
