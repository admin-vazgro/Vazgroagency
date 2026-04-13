export const HUB_ROLES = [
  "internal_sales",
  "sales_manager",
  "delivery",
  "ops",
  "admin",
] as const;

export const ALL_APP_ROLES = [
  "client",
  "partner",
  ...HUB_ROLES,
] as const;

export type AppRole = (typeof ALL_APP_ROLES)[number];

export function isAppRole(value: string | null | undefined): value is AppRole {
  return !!value && (ALL_APP_ROLES as readonly string[]).includes(value);
}

export function isHubRole(role: string | null | undefined) {
  return !!role && (HUB_ROLES as readonly string[]).includes(role);
}

export function getPostLoginDestination(role: string | null | undefined) {
  if (role === "client") return "/workspace";
  if (role === "partner") return "/partners";
  if (isHubRole(role)) return "/hub";
  return "/login?error=access_denied";
}
