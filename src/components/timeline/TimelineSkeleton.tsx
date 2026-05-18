import { Skeleton } from "@/components/ui/Skeleton";

export function TimelineSkeleton() {
  return (
    <div className="relative">
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-warm-200/50" />
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-start gap-4">
            <div
              className={`w-[calc(50%-2rem)] ${
                i % 2 === 0 ? "ml-auto pl-4" : "mr-auto pr-4"
              }`}
            >
              <div className="bg-white/60 rounded-2xl p-4 border border-warm-200/30 space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
