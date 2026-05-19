"use client";

export default function RantError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <p className="text-stone-500 mb-4">加载吐槽失败了</p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-warm-500 text-white rounded-2xl text-sm"
      >
        重试
      </button>
    </div>
  );
}
