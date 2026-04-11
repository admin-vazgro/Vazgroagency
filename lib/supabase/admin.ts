import { createClient as createSupabaseClient } from "@supabase/supabase-js";

function normalizeServiceRoleKey(rawKey: string | undefined) {
  const key = rawKey?.trim();
  if (!key) return key;

  // Recover from the common copy/paste mistake where the leading "e" is dropped from "eyJ...".
  if (key.startsWith("yJ") && key.split(".").length === 3) {
    return `e${key}`;
  }

  return key;
}

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = normalizeServiceRoleKey(process.env.SUPABASE_SERVICE_ROLE_KEY);

  if (!url || !serviceRoleKey) {
    throw new Error("Supabase admin client is not configured.");
  }

  return createSupabaseClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
