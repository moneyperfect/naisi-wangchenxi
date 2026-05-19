import { Skeleton } from "@/components/ui/Skeleton";

export function WishlistSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i}>
          <Skeleton className="h-7 w-20 rounded-full mb-3" />
          <div className="space-y-2">
            {Array.from({ length: 2 }).map((_, j) => (
              <Skeleton key={j} className="h-16 w-full" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
