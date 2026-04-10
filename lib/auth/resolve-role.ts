import type { User } from "@supabase/supabase-js";
import { getPostLoginDestination, isAppRole } from "@/lib/auth/roles";
const INTERNAL_DOMAINS = ["vazgro.com"];

export function isInternalEmail(email?: string | null) {
  if (!email) return false;
  const normalized = email.toLowerCase();
  return INTERNAL_DOMAINS.some((domain) => normalized.endsWith(`@${domain}`));
}

export function canUseLocalAdminAccess(user: Pick<User, "email">) {
  return process.env.NODE_ENV !== "production" && isInternalEmail(user.email);
}

function getMetadataRole(user: User) {
  const appRole = user.app_metadata?.role;
  if (typeof appRole === "string" && isAppRole(appRole)) return appRole;

  const userRole = user.user_metadata?.role;
  if (typeof userRole === "string" && isAppRole(userRole)) return userRole;

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

export { getPostLoginDestination };
