"use client";

import { ErrorState } from "@/components/ui/ErrorState";

export default function GamesError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return <ErrorState error={error} reset={reset} />;
}
