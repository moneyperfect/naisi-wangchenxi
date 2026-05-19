"use client";

import { ErrorState } from "@/components/ui/ErrorState";

export default function QuizError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return <ErrorState error={error} reset={reset} />;
}
