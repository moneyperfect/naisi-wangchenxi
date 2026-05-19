import { Skeleton } from "@/components/ui/Skeleton";

export function StorySkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((group) => (
        <div key={group}>
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px flex-1 bg-warm-200/50" />
            <Skeleton className="h-3 w-24" />
            <div className="h-px flex-1 bg-warm-200/50" />
          </div>
          <div className="space-y-3">
            {/* Alternating bubble and card placeholders */}
            {[1, 2].map((i) =>
              i % 2 === 0 ? (
                // Timeline card skeleton
                <div
                  key={i}
                  className="bg-white/60 rounded-2xl p-4 border border-warm-200/30 space-y-2"
                >
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-5 w-36" />
                  <Skeleton className="h-3 w-48" />
                </div>
              ) : (
                // Bubble skeleton
                <div key={i} className="flex gap-3">
                  <Skeleton className="w-9 h-9 rounded-full shrink-0" />
                  <div className="flex-1 bg-white/60 rounded-2xl p-4 space-y-2">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
