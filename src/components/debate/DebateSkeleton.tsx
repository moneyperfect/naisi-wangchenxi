import { Skeleton } from "@/components/ui/Skeleton";

export function DebateSkeleton() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <Skeleton className="w-16 h-16 rounded-full mx-auto" />
        <Skeleton className="w-16 h-6 mx-auto" />
        <Skeleton className="w-40 h-4 mx-auto" />
      </div>
      <div className="flex gap-3">
        <Skeleton className="flex-1 h-12 rounded-2xl" />
        <Skeleton className="flex-1 h-12 rounded-2xl" />
      </div>
      <Skeleton className="w-full h-40 rounded-3xl" />
    </div>
  );
}
