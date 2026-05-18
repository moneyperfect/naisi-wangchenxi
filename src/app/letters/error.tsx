"use client";

import { ErrorState } from "@/components/ui/ErrorState";

export default function LettersError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return <ErrorState error={error} reset={reset} />;
}
