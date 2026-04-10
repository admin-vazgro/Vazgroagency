import { redirect } from "next/navigation";
import { isHubRole } from "@/lib/auth/roles";
import { resolveUserRole } from "@/lib/auth/resolve-role";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export type HubSearchParams = Record<string, string | string[] | undefined>;

export function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export function displayProfileName(profile: {
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
}) {
  const name = [profile.first_name, profile.last_name].filter(Boolean).join(" ").trim();
  return name || profile.email || "Unknown user";
}

export async function requireHubAccess() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const role = await resolveUserRole(supabase, user);
  if (!isHubRole(role)) {
    redirect(role === "client" ? "/workspace" : "/login?error=access_denied");
  }

  return { supabase, user, role };
}

export function getHubAdminClient() {
  return createAdminClient();
}
