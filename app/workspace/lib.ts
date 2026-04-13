import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { resolveUserRole } from "@/lib/auth/resolve-role";
import { isHubRole } from "@/lib/auth/roles";

export type WorkspaceSearchParams = Record<string, string | string[] | undefined>;

export function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export function displayName(profile: {
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
}) {
  const name = [profile.first_name, profile.last_name].filter(Boolean).join(" ").trim();
  return name || profile.email || "Unknown";
}

export function getGreeting(firstName: string | null, timezone = "Europe/London") {
  try {
    const hour = parseInt(
      new Intl.DateTimeFormat("en-GB", {
        timeZone: timezone,
        hour: "numeric",
        hour12: false,
      }).format(new Date()),
      10
    );
    const name = firstName ? `, ${firstName}` : "";
    if (hour < 12) return `Good morning${name}.`;
    if (hour < 17) return `Good afternoon${name}.`;
    return `Good evening${name}.`;
  } catch {
    return "Good morning.";
  }
}

export async function requireWorkspaceAccess() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const role = await resolveUserRole(supabase, user);
  if (isHubRole(role)) redirect("/hub");
  if (role !== "client") redirect("/login?error=access_denied");

  return { user };
}

export function getWorkspaceAdminClient() {
  return createAdminClient();
}
