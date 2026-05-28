import { Skeleton } from "@/components/ui/Skeleton";

export function ChallengeSkeleton() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <Skeleton className="w-16 h-16 rounded-full mx-auto" />
        <Skeleton className="w-20 h-6 mx-auto" />
        <Skeleton className="w-48 h-4 mx-auto" />
      </div>
      <Skeleton className="w-full h-32 rounded-3xl" />
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-12 rounded-2xl" />
        <Skeleton className="h-12 rounded-2xl" />
      </div>
    </div>
  );
}
