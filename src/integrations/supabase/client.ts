import { createClient } from "@supabase/supabase-js";

import type { Database } from "./types";

function isNewSupabaseApiKey(value: string): boolean {
  return value.startsWith("sb_publishable_") || value.startsWith("sb_secret_");
}

function createSupabaseFetch(supabaseKey: string): typeof fetch {
  return (input, init) => {
    const headers = new Headers(
      typeof Request !== "undefined" && input instanceof Request ? input.headers : undefined,
    );

    if (init?.headers) {
      new Headers(init.headers).forEach((value, key) => headers.set(key, value));
    }

    // New Supabase API keys are opaque strings, not bearer JWTs.
    if (
      isNewSupabaseApiKey(supabaseKey) &&
      headers.get("Authorization") === `Bearer ${supabaseKey}`
    ) {
      headers.delete("Authorization");
    }

    headers.set("apikey", supabaseKey);
    return fetch(input, { ...init, headers });
  };
}

function createSupabaseClient() {
  // Static SPA: import.meta.env is the only source (Vite inlines these at build
  // time). Nothing here is hardcoded — set both in .env locally and in the
  // host's environment variables for deployed builds.
  const SUPABASE_URL = import.meta.env["VITE_SUPABASE_URL"];
  const SUPABASE_PUBLISHABLE_KEY = import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"];

  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    const missing = [
      ...(!SUPABASE_URL ? ["VITE_SUPABASE_URL"] : []),
      ...(!SUPABASE_PUBLISHABLE_KEY ? ["VITE_SUPABASE_PUBLISHABLE_KEY"] : []),
    ];
    const message = `Missing Supabase environment variable(s): ${missing.join(", ")}. Set them in .env, and in your host's environment variables for deployed builds.`;
    console.error(`[Supabase] ${message}`);
    throw new Error(message);
  }

  return createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    global: {
      fetch: createSupabaseFetch(SUPABASE_PUBLISHABLE_KEY),
    },
    auth: {
      // Default browser storage (localStorage) — the session persists across
      // reloads and the SDK refreshes the access token on its own.
      persistSession: true,
      autoRefreshToken: true,
    },
  });
}

let instance: ReturnType<typeof createSupabaseClient> | undefined;

/**
 * The single Supabase client for the whole app. Created lazily on first
 * property access and cached, so exactly one client (and therefore one auth
 * session listener and one token refresh timer) exists per page load.
 *
 * Import it like this:
 *   import { supabase } from "@/integrations/supabase/client";
 */
export const supabase = new Proxy({} as ReturnType<typeof createSupabaseClient>, {
  get(_, prop, receiver) {
    if (!instance) instance = createSupabaseClient();
    return Reflect.get(instance, prop, receiver);
  },
});
