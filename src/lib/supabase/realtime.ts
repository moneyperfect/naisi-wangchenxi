import { createBrowserClient } from "./client";

export function subscribeToTable(
  table: string,
  callback: (payload: Record<string, unknown>) => void
): () => void {
  const supabase = createBrowserClient();
  const channel = supabase
    .channel(`realtime:${table}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table },
      callback as never
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
