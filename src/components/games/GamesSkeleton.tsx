export function GamesSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="text-center space-y-3">
        <div className="h-4 w-32 bg-stone-200 rounded mx-auto" />
        <div className="flex gap-3 justify-center">
          <div className="h-14 w-24 bg-stone-200 rounded-2xl" />
          <div className="h-14 w-24 bg-stone-200 rounded-2xl" />
        </div>
      </div>
      <div className="h-3 w-48 bg-stone-200 rounded mx-auto" />
    </div>
  );
}
