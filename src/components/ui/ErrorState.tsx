"use client";

import { HeartCrack } from "lucide-react";
import { Button } from "./Button";

interface ErrorStateProps {
  error: Error;
  reset: () => void;
}

export function ErrorState({ error, reset }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="p-4 rounded-full bg-rose-50 text-rose-400 mb-4">
        <HeartCrack size={32} />
      </div>
      <h3 className="font-serif text-lg font-semibold text-stone-700 mb-1">
        出了点小问题
      </h3>
      <p className="text-sm text-stone-400 mb-6">
        {error.message || "别担心，刷新一下试试"}
      </p>
      <Button onClick={reset} variant="secondary">
        重试
      </Button>
    </div>
  );
}
