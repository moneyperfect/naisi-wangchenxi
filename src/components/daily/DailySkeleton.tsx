import { Skeleton } from "@/components/ui/Skeleton";

export function DailySkeleton() {
  return (
    <div className="space-y-6">
      <div className="bg-white/60 rounded-3xl p-6 border border-warm-200/30 space-y-4">
        <Skeleton className="h-4 w-16 mx-auto" />
        <Skeleton className="h-6 w-3/4 mx-auto" />
        <Skeleton className="h-6 w-1/2 mx-auto" />
        <div className="pt-4 space-y-3">
          <Skeleton className="h-28 w-full rounded-2xl" />
          <Skeleton className="h-11 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
