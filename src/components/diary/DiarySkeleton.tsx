import { Skeleton } from "@/components/ui/Skeleton";

export function DiarySkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2].map((group) => (
        <div key={group}>
          <Skeleton className="h-3 w-24 mx-auto mb-3" />
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="w-9 h-9 rounded-full shrink-0" />
                <div className="flex-1 bg-white/60 rounded-2xl p-4 space-y-2">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
