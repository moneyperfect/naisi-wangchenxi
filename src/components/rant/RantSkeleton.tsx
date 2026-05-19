export function RantSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white/60 rounded-2xl border border-warm-200/30 p-4 animate-pulse"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-stone-200" />
            <div className="h-3 w-16 bg-stone-200 rounded" />
            <div className="h-4 w-10 bg-stone-200 rounded-full" />
          </div>
          <div className="space-y-2 mb-3">
            <div className="h-3 w-full bg-stone-200 rounded" />
            <div className="h-3 w-2/3 bg-stone-200 rounded" />
          </div>
          <div className="h-6 w-16 bg-stone-200 rounded-full" />
        </div>
      ))}
    </div>
  );
}
