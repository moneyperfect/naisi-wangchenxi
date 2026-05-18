import { Skeleton } from "@/components/ui/Skeleton";

export function PhotoSkeleton() {
  return (
    <div className="columns-2 gap-3 space-y-3">
      <Skeleton className="w-full h-[140px] break-inside-avoid" />
      <Skeleton className="w-full h-[200px] break-inside-avoid" />
      <Skeleton className="w-full h-[160px] break-inside-avoid" />
      <Skeleton className="w-full h-[180px] break-inside-avoid" />
      <Skeleton className="w-full h-[120px] break-inside-avoid" />
      <Skeleton className="w-full h-[220px] break-inside-avoid" />
    </div>
  );
}
