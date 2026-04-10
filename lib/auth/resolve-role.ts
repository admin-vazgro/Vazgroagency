import type { User } from "@supabase/supabase-js";

const INTERNAL_DOMAINS = ["vazgro.com"];

function isInternalEmail(email?: string | null) {
  if (!email) return false;
  const normalized = email.toLowerCase();
  return INTERNAL_DOMAINS.some((domain) => normalized.endsWith(`@${domain}`));
}

function getMetadataRole(user: User) {
  const appRole = user.app_metadata?.role;
  if (typeof appRole === "string" && appRole.length > 0) return appRole;

  const userRole = user.user_metadata?.role;
  if (typeof userRole === "string" && userRole.length > 0) return userRole;

  return null;
}

export async function resolveUserRole(
  supabase: any,
  user: User
) {
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role) return profile.role;

  const metadataRole = getMetadataRole(user);
  if (metadataRole) return metadataRole;

  if (isInternalEmail(user.email)) return "ops";

  return "client";
}

export function getPostLoginDestination(role: string) {
  return role === "client" ? "/workspace" : "/hub";
}
