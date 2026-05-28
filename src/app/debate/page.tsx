import { PageHeader } from "@/components/layout/PageHeader";
import { DebateClient } from "@/components/debate/DebateClient";
import { PageWrapper } from "@/components/ui/PageWrapper";

export default function DebatePage() {
  return (
    <PageWrapper>
      <PageHeader title="辩论场" showBack />
      <div className="mx-auto max-w-lg px-4 py-6">
        <DebateClient />
      </div>
    </PageWrapper>
  );
}
