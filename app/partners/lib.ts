import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { resolveUserRole } from "@/lib/auth/resolve-role";
import { isHubRole } from "@/lib/auth/roles";

export type PartnerSearchParams = Record<string, string | string[] | undefined>;

export function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export type PartnerRecord = {
  id: string;
  profile_id: string | null;
  tier: "tier1" | "tier2" | "tier3" | "white_label";
  status: string;
  type: string;
  company_name: string | null;
  kyc_verified?: boolean | null;
  tax_form_url?: string | null;
  total_closed_gbp: number | string | null;
  open_leads_count: number | null;
  concurrent_leads_cap: number | null;
};

export type TierSetting = {
  tier: string;
  label: string;
  min: number;
  max: number | null;
  closer_rate: number;
  referrer_rate: number;
};

type RawTierSetting = Partial<{
  tier: string;
  label: string;
  min: number | string | null;
  max: number | string | null;
  min_gbp: number | string | null;
  max_gbp: number | string | null;
  closer_rate: number | string | null;
  referrer_rate: number | string | null;
}>;

export function toNumber(value: number | string | null | undefined) {
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value) || 0;
  return 0;
}

export function displayName(profile: {
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
}) {
  const name = [profile.first_name, profile.last_name].filter(Boolean).join(" ").trim();
  return name || profile.email || "Unknown";
}

export function tierDefaultLabel(tier: string) {
  if (tier === "white_label") return "White Label";
  return tier.replace(/^tier/i, "Tier ").replace(/_/g, " ");
}

export function normalizeTierSettings(value: unknown): TierSetting[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((entry) => {
      if (!entry || typeof entry !== "object") return null;
      const raw = entry as RawTierSetting;
      const tier = typeof raw.tier === "string" ? raw.tier : null;
      if (!tier) return null;

      return {
        tier,
        label: typeof raw.label === "string" && raw.label.trim() ? raw.label : tierDefaultLabel(tier),
        min: toNumber(raw.min ?? raw.min_gbp ?? 0),
        max:
          raw.max === null || raw.max_gbp === null
            ? null
            : (() => {
                const value = raw.max ?? raw.max_gbp;
                const parsed = toNumber(value ?? null);
                return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
              })(),
        closer_rate: toNumber(raw.closer_rate),
        referrer_rate: toNumber(raw.referrer_rate),
      } satisfies TierSetting;
    })
    .filter((entry): entry is TierSetting => !!entry)
    .sort((a, b) => a.min - b.min);
}

export function tierLabel(tier: string, tiers: TierSetting[]) {
  const found = tiers.find((t) => t.tier === tier);
  return found?.label ?? tierDefaultLabel(tier);
}

export function closerRate(tier: string, tiers: TierSetting[]) {
  return tiers.find((t) => t.tier === tier)?.closer_rate ?? 10;
}

export function computeTierProgress(
  monthlyRevenue: number,
  tiers: TierSetting[]
) {
  const ordered = tiers
    .filter((t) => t.tier !== "white_label")
    .sort((a, b) => a.min - b.min);

  let currentIdx = 0;
  for (let i = 0; i < ordered.length; i++) {
    const t = ordered[i];
    if (monthlyRevenue >= t.min && (t.max === null || monthlyRevenue <= t.max)) {
      currentIdx = i;
    }
  }

  const current = ordered[currentIdx];
  const next = ordered[currentIdx + 1] ?? null;
  const distanceToNext = next ? Math.max(0, next.min - monthlyRevenue) : 0;
  const progressPct = next
    ? Math.min(100, Math.round(((monthlyRevenue - current.min) / (next.min - current.min)) * 100))
    : 100;

  return { current, next, distanceToNext, progressPct };
}

export function getPartnerLeadCap(
  partner: Pick<PartnerRecord, "tier" | "concurrent_leads_cap">,
  capSettings?: Record<string, number> | null
) {
  if (typeof partner.concurrent_leads_cap === "number" && partner.concurrent_leads_cap > 0) {
    return partner.concurrent_leads_cap;
  }

  const configuredCap =
    capSettings && typeof capSettings[partner.tier] === "number" ? capSettings[partner.tier] : null;

  if (configuredCap) return configuredCap;

  if (partner.tier === "tier2") return 25;
  if (partner.tier === "tier3") return 50;
  return 10;
}

export async function getPartnerContext() {
  const { user } = await requirePartnerAccess();
  const admin = getPartnerAdminClient();

  const [profileResult, partnerResult] = await Promise.all([
    admin.from("profiles").select("id, first_name, last_name, email").eq("id", user.id).maybeSingle(),
    admin
      .from("partners")
      .select("id, profile_id, tier, status, type, company_name, kyc_verified, tax_form_url, total_closed_gbp, open_leads_count, concurrent_leads_cap")
      .eq("profile_id", user.id)
      .maybeSingle(),
  ]);

  if (profileResult.error) {
    throw profileResult.error;
  }
  if (partnerResult.error) {
    throw partnerResult.error;
  }

  if (!partnerResult.data) {
    redirect("/login?error=partner_record_missing");
  }

  return {
    user,
    admin,
    profile: profileResult.data,
    partner: partnerResult.data as PartnerRecord,
  };
}

export async function getPartnerCapSettings(admin = getPartnerAdminClient()) {
  const { data, error } = await admin
    .from("hub_settings")
    .select("value")
    .eq("key", "partner_concurrent_leads_cap")
    .maybeSingle();

  if (error) throw error;
  if (!data?.value || typeof data.value !== "object" || Array.isArray(data.value)) return null;

  const raw = data.value as Record<string, unknown>;
  return Object.fromEntries(
    Object.entries(raw)
      .map(
        ([key, value]): [string, number] => [
          key,
          toNumber(typeof value === "string" || typeof value === "number" ? value : null),
        ]
      )
      .filter(([, value]) => value > 0)
  ) as Record<string, number>;
}

export async function requirePartnerAccess() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const role = await resolveUserRole(supabase, user);
  if (role === "client") redirect("/workspace");
  if (isHubRole(role)) redirect("/hub");
  if (role !== "partner") redirect("/login?error=access_denied");

  return { user };
}

export function getPartnerAdminClient() {
  return createAdminClient();
}
