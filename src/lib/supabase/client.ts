import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./database.types";

let client: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function getSupabaseBrowserClient() {
  if (client) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    // Graceful degradation: return a dummy client that never throws but returns empty data
    // Real data comes from seed fallback in data-fetching helpers
    console.warn("Supabase env vars missing — browser client degraded");
  }

  client = createBrowserClient<Database>(
    url ?? "https://placeholder.supabase.co",
    key ?? "placeholder",
  );
  return client;
}
