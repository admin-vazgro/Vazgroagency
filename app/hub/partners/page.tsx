import Link from "next/link";
import { approveApplicationAction, createPartnerAction, rejectApplicationAction, updatePartnerAction } from "@/app/hub/actions";
import {
  displayProfileName,
  firstParam,
  getHubAdminClient,
  type HubSearchParams,
  requireHubAccess,
} from "@/app/hub/lib";

type PartnerRow = {
  id: string;
  profile_id: string | null;
  tier: "tier1" | "tier2" | "tier3" | "white_label";
  status: "pending" | "active" | "suspended" | "rejected";
  type: "referral" | "commission_sdr" | "white_label";
  company_name: string | null;
  kyc_verified: boolean | null;
  tax_form_url: string | null;
  open_leads_count: number | null;
  total_closed_gbp: number | string | null;
  created_at: string;
};

type ApplicationRow = {
  id: string;
  first_name: string;
  last_name: string | null;
  email: string;
  phone: string | null;
  company_name: string | null;
  website: string | null;
  linkedin_url: string | null;
  description: string | null;
  how_heard: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

type ProfileRow = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
};

/** Shape stored in hub_settings under key "commission_tiers" */
type CommissionTierSetting = {
  tier: string;
  label: string;
  min: number;
  max: number | null;
  closer_rate: number;
  referrer_rate: number;
};

/** Shape stored in hub_settings under key "grow_taper" */
type GrowTaperEntry = {
  label: string;
  rate: number;
};

const TIER_COLORS: Record<string, string> = {
  tier1: "var(--portal-accent)",
  tier2: "var(--portal-warning)",
  tier3: "var(--portal-text)",
  white_label: "var(--portal-text-soft)",
};

function toNumber(value: number | string | null | undefined) {
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value) || 0;
  return 0;
}

function formatStatus(status: PartnerRow["status"]) {
  return status.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatRange(tier: CommissionTierSetting) {
  const min = `£${(tier.min ?? 0).toLocaleString()}`;
  const max = tier.max != null ? `£${tier.max.toLocaleString()}` : null;
  return max ? `${min} – ${max}` : `${min}+`;
}

function tierDisplayLabel(tier: CommissionTierSetting) {
  return tier.label ?? tier.tier.replace(/_/g, " ");
}

export default async function PartnersPage(props: {
  searchParams?: Promise<HubSearchParams>;
}) {
  await requireHubAccess();

  const searchParams = props.searchParams ? await props.searchParams : {};
  const showNew = firstParam(searchParams.new) === "1";
  const statusMessage = firstParam(searchParams.status);
  const errorMessage = firstParam(searchParams.error);

  let partners: PartnerRow[] = [];
  let profiles: ProfileRow[] = [];
  let commissionTiers: CommissionTierSetting[] = [];
  let growTaper: GrowTaperEntry[] = [];
  let applications: ApplicationRow[] = [];
  let dataError = "";

  try {
    const admin = getHubAdminClient();
    const [partnersResult, profilesResult, tiersResult, taperResult, appsResult] = await Promise.all([
      admin
        .from("partners")
        .select("id, profile_id, tier, status, type, company_name, kyc_verified, tax_form_url, open_leads_count, total_closed_gbp, created_at")
        .order("created_at", { ascending: false }),
      admin.from("profiles").select("id, first_name, last_name, email"),
      admin.from("hub_settings").select("value").eq("key", "commission_tiers").maybeSingle(),
      admin.from("hub_settings").select("value").eq("key", "grow_taper").maybeSingle(),
      admin.from("partner_applications").select("id, first_name, last_name, email, phone, company_name, website, linkedin_url, description, how_heard, status, created_at").eq("status", "pending").order("created_at", { ascending: false }),
    ]);

    if (partnersResult.error) throw partnersResult.error;
    if (profilesResult.error) throw profilesResult.error;

    partners = (partnersResult.data ?? []) as PartnerRow[];
    profiles = (profilesResult.data ?? []) as ProfileRow[];
    applications = (appsResult.data ?? []) as ApplicationRow[];

    if (tiersResult.data?.value && Array.isArray(tiersResult.data.value)) {
      commissionTiers = tiersResult.data.value as CommissionTierSetting[];
    }
    if (taperResult.data?.value && Array.isArray(taperResult.data.value)) {
      growTaper = taperResult.data.value as GrowTaperEntry[];
    }
  } catch (error) {
    dataError = error instanceof Error ? error.message : "Unable to load partners.";
  }

  const profileById = new Map(profiles.map((p) => [p.id, p]));
  const activeCount = partners.filter((p) => p.status === "active").length;

  /** Find commission tier config for a partner row */
  function tierConfig(tier: PartnerRow["tier"]) {
    return commissionTiers.find((t) => t.tier === tier) ?? null;
  }

  const taperLabel =
    growTaper.length > 0
      ? growTaper.map((e) => `${e.label} ${e.rate}%`).join(", ") + "."
      : null;

  return (
    <div className="p-8">
      <div className="mb-8 flex items-end justify-between border-b border-[var(--portal-border)] pb-6">
        <div>
          <span className="font-ibm-mono text-[14px] tracking-[3px] text-[var(--portal-accent)]">// PARTNERS</span>
          <h1 className="mt-1 font-grotesk text-[32px] font-normal tracking-[-1px] text-[var(--portal-text)]">Partner Programme</h1>
          <p className="mt-1 font-ibm-mono text-[14px] tracking-[0.5px] text-[var(--portal-text-soft)]">
            {partners.length} partners · {activeCount} active
          </p>
        </div>
        <Link
          href={showNew ? "/hub/partners" : "/hub/partners?new=1"}
          className="bg-[var(--portal-accent)] px-5 py-2.5 font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-accent-contrast)] transition-colors hover:bg-[var(--portal-accent-hover)]"
        >
          {showNew ? "CLOSE" : "+ INVITE PARTNER"}
        </Link>
      </div>

      {statusMessage ? (
        <div className="mb-6 border border-[var(--portal-accent)] bg-[var(--portal-accent-soft)] px-4 py-3">
          <p className="font-ibm-mono text-[14px] text-[var(--portal-accent)]">{statusMessage}</p>
        </div>
      ) : null}

      {errorMessage || dataError ? (
        <div className="mb-6 border border-[var(--portal-warning)] bg-[var(--portal-warning-soft)] px-4 py-3">
          <p className="font-ibm-mono text-[14px] text-[var(--portal-warning)]">{errorMessage || dataError}</p>
        </div>
      ) : null}

      {showNew ? (
        <form
          action={createPartnerAction}
          className="mb-8 grid grid-cols-1 gap-4 border border-[var(--portal-border)] bg-[var(--portal-surface)] p-6 lg:grid-cols-2"
        >
          <div>
            <label className="mb-2 block font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-text-soft)]">EMAIL *</label>
            <input type="email" name="email" className="w-full border border-[var(--portal-border-strong)] bg-[var(--portal-bg)] px-4 py-3 font-ibm-mono text-[14px] text-[var(--portal-text)] focus:border-[var(--portal-accent)] focus:outline-none" />
          </div>
          <div>
            <label className="mb-2 block font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-text-soft)]">TEMP PASSWORD *</label>
            <input name="password" className="w-full border border-[var(--portal-border-strong)] bg-[var(--portal-bg)] px-4 py-3 font-ibm-mono text-[14px] text-[var(--portal-text)] focus:border-[var(--portal-accent)] focus:outline-none" />
          </div>
          <div>
            <label className="mb-2 block font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-text-soft)]">FIRST NAME</label>
            <input name="first_name" className="w-full border border-[var(--portal-border-strong)] bg-[var(--portal-bg)] px-4 py-3 font-ibm-mono text-[14px] text-[var(--portal-text)] focus:border-[var(--portal-accent)] focus:outline-none" />
          </div>
          <div>
            <label className="mb-2 block font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-text-soft)]">LAST NAME</label>
            <input name="last_name" className="w-full border border-[var(--portal-border-strong)] bg-[var(--portal-bg)] px-4 py-3 font-ibm-mono text-[14px] text-[var(--portal-text)] focus:border-[var(--portal-accent)] focus:outline-none" />
          </div>
          <div>
            <label className="mb-2 block font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-text-soft)]">COMPANY NAME *</label>
            <input name="company_name" className="w-full border border-[var(--portal-border-strong)] bg-[var(--portal-bg)] px-4 py-3 font-ibm-mono text-[14px] text-[var(--portal-text)] focus:border-[var(--portal-accent)] focus:outline-none" />
          </div>
          {/* Tier is auto-calculated from monthly revenue — hidden, always starts at tier1 */}
          <input type="hidden" name="tier" value="tier1" />

          <div>
            <label className="mb-2 block font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-text-soft)]">PROGRAMME TYPE</label>
            <select name="type" defaultValue="commission_sdr" className="w-full border border-[var(--portal-border-strong)] bg-[var(--portal-bg)] px-4 py-3 font-ibm-mono text-[14px] text-[var(--portal-text)] focus:border-[var(--portal-accent)] focus:outline-none">
              <option value="commission_sdr">STANDARD — Referral + SDR (full access)</option>
              <option value="white_label">WHITE LABEL — Reseller programme</option>
            </select>
            <p className="mt-1.5 font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">
              All standard partners can submit referrals and claim/close pool leads. Tier auto-upgrades from Tier 1 as they close more revenue.
            </p>
          </div>
          <div>
            <label className="mb-2 block font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-text-soft)]">INITIAL STATUS</label>
            <select name="status" defaultValue="pending" className="w-full border border-[var(--portal-border-strong)] bg-[var(--portal-bg)] px-4 py-3 font-ibm-mono text-[14px] text-[var(--portal-text)] focus:border-[var(--portal-accent)] focus:outline-none">
              <option value="pending">PENDING — Awaiting review</option>
              <option value="active">ACTIVE — Immediately active</option>
            </select>
          </div>
          <div className="lg:col-span-2 flex gap-3">
            <button type="submit" className="bg-[var(--portal-accent)] px-5 py-3 font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-accent-contrast)] transition-colors hover:bg-[var(--portal-accent-hover)]">
              CREATE PARTNER
            </button>
            <Link href="/hub/partners" className="border border-[var(--portal-border-strong)] px-5 py-3 font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-text-soft)] transition-colors hover:text-[var(--portal-text)]">
              CANCEL
            </Link>
          </div>
        </form>
      ) : null}

      {/* Commission tiers block */}
      <div className="mb-8 border border-[var(--portal-border)] bg-[var(--portal-surface)] p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-text)]">COMMISSION TIERS</p>
          <Link
            href="/hub/admin"
            className="font-ibm-mono text-[14px] tracking-[1px] text-[var(--portal-text-dim)] hover:text-[var(--portal-accent)] transition-colors"
          >
            Edit in Admin →
          </Link>
        </div>

        {commissionTiers.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
              {commissionTiers.map((tier) => {
                const color = TIER_COLORS[tier.tier] ?? "var(--portal-text-soft)";
                return (
                  <div key={tier.tier} className="border border-[var(--portal-border)] p-4">
                    <p className="mb-1 font-ibm-mono text-[14px] tracking-[2px]" style={{ color }}>
                      {tierDisplayLabel(tier).toUpperCase()}
                    </p>
                    <p className="font-grotesk text-[18px] font-normal" style={{ color }}>
                      {tier.closer_rate}%
                      <span className="font-ibm-mono text-[14px] text-[var(--portal-text-muted)] ml-1">closer</span>
                    </p>
                    <p className="font-ibm-mono text-[14px] text-[var(--portal-text-muted)] mt-0.5">
                      {tier.referrer_rate}% referrer
                    </p>
                    <p className="mt-2 font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">{formatRange(tier)}</p>
                  </div>
                );
              })}
            </div>
            {taperLabel ? (
              <p className="mt-4 font-ibm-mono text-[14px] text-[var(--portal-text-muted)]">
                GROW commission taper: {taperLabel}
              </p>
            ) : null}
          </>
        ) : (
          <div className="border border-dashed border-[var(--portal-border-strong)] p-4">
            <p className="font-ibm-mono text-[14px] text-[var(--portal-text-soft)]">
              Commission tiers not configured yet.
            </p>
            <p className="mt-1 font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">
              Go to{" "}
              <Link href="/hub/admin" className="text-[var(--portal-accent)] hover:underline">
                Admin → Hub Settings
              </Link>{" "}
              to set up commission tiers and GROW taper rules.
            </p>
          </div>
        )}
      </div>

      {/* Pending applications */}
      {applications.length > 0 && (
        <div className="mb-8 border border-[var(--portal-warning)] bg-[var(--portal-surface)]">
          <div className="border-b border-[var(--portal-warning)] px-6 py-4 flex items-center justify-between">
            <div>
              <p className="font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-warning)]">PENDING APPLICATIONS</p>
              <p className="mt-1 font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">
                {applications.length} application{applications.length !== 1 ? "s" : ""} awaiting review
              </p>
            </div>
            <Link href="/apply" target="_blank" className="font-ibm-mono text-[14px] tracking-[1px] text-[var(--portal-text-dim)] hover:text-[var(--portal-accent)] transition-colors">
              View Apply Page →
            </Link>
          </div>
          <div className="divide-y divide-[var(--portal-border)]">
            {applications.map((app) => (
              <div key={app.id} className="px-6 py-5 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_auto]">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-ibm-mono text-[14px] text-[var(--portal-text)]">
                      {[app.first_name, app.last_name].filter(Boolean).join(" ")}
                    </p>
                    {app.company_name && (
                      <span className="font-ibm-mono text-[14px] text-[var(--portal-text-muted)]">· {app.company_name}</span>
                    )}
                  </div>
                  <p className="font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">{app.email}</p>
                  {app.phone && <p className="font-ibm-mono text-[14px] text-[var(--portal-text-dim)] mt-0.5">{app.phone}</p>}
                  <div className="mt-3 flex flex-wrap gap-3">
                    {app.website && (
                      <a href={app.website} target="_blank" rel="noopener noreferrer" className="font-ibm-mono text-[14px] text-[var(--portal-accent)] hover:opacity-80">
                        Website →
                      </a>
                    )}
                    {app.linkedin_url && (
                      <a href={app.linkedin_url} target="_blank" rel="noopener noreferrer" className="font-ibm-mono text-[14px] text-[var(--portal-accent)] hover:opacity-80">
                        LinkedIn →
                      </a>
                    )}
                  </div>
                  {app.description && (
                    <p className="mt-3 font-ibm-mono text-[14px] leading-[1.7] text-[var(--portal-text-soft)] max-w-prose">
                      {app.description}
                    </p>
                  )}
                  <p className="mt-2 font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">
                    Applied {new Date(app.created_at).toLocaleDateString("en-GB")}
                    {app.how_heard ? ` · via ${app.how_heard}` : ""}
                  </p>
                </div>
                <div className="flex flex-col gap-2 lg:items-end">
                  <form action={approveApplicationAction}>
                    <input type="hidden" name="application_id" value={app.id} />
                    <input type="hidden" name="email" value={app.email} />
                    <input type="hidden" name="first_name" value={app.first_name} />
                    <input type="hidden" name="last_name" value={app.last_name ?? ""} />
                    <input type="hidden" name="company_name" value={app.company_name ?? ""} />
                    <button
                      type="submit"
                      className="w-full lg:w-auto bg-[var(--portal-accent)] px-4 py-2 font-ibm-mono text-[14px] tracking-[1.5px] text-[var(--portal-accent-contrast)] hover:bg-[var(--portal-accent-hover)] transition-colors"
                    >
                      APPROVE & CREATE ACCOUNT
                    </button>
                  </form>
                  <form action={rejectApplicationAction}>
                    <input type="hidden" name="application_id" value={app.id} />
                    <button
                      type="submit"
                      className="w-full lg:w-auto border border-[var(--portal-border-strong)] px-4 py-2 font-ibm-mono text-[14px] tracking-[1.5px] text-[var(--portal-text-dim)] hover:border-[var(--portal-warning)] hover:text-[var(--portal-warning)] transition-colors"
                    >
                      REJECT
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Partner cards */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {partners.map((partner) => {
          const profile = partner.profile_id ? profileById.get(partner.profile_id) : null;
          const tc = tierConfig(partner.tier);
          const color = TIER_COLORS[partner.tier] ?? "var(--portal-text-soft)";
          const tierLabel = tc ? tierDisplayLabel(tc).toUpperCase() : partner.tier.replace(/_/g, " ").toUpperCase();
          return (
            <div key={partner.id} className="border border-[var(--portal-border)] bg-[var(--portal-surface)] p-6">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <span
                      className="px-2 py-0.5 font-ibm-mono text-[14px] tracking-[2px]"
                      style={{ background: `${color}20`, color }}
                    >
                      {tierLabel}
                    </span>
                    {tc ? (
                      <span className="font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">
                        {tc.closer_rate}% closer
                      </span>
                    ) : null}
                    <span className="font-ibm-mono text-[14px] text-[var(--portal-text-faint)]">
                      {partner.id.slice(0, 8)}
                    </span>
                  </div>
                  <h3 className="font-grotesk text-[18px] font-normal text-[var(--portal-text)]">
                    {partner.company_name || "Unnamed partner"}
                  </h3>
                  <p className="mt-0.5 font-ibm-mono text-[14px] text-[var(--portal-text-soft)]">
                    {profile ? displayProfileName(profile) : "No linked user"}
                  </p>
                  <p className="mt-0.5 font-ibm-mono text-[14px] text-[var(--portal-text-muted)]">
                    {profile?.email || "—"}
                  </p>
                </div>
                <span
                  className="px-2 py-1 font-ibm-mono text-[14px] tracking-[1px]"
                  style={{
                    background:
                      partner.status === "active"
                        ? "var(--portal-accent-strong-soft)"
                        : "var(--portal-warning-strong-soft)",
                    color:
                      partner.status === "active"
                        ? "var(--portal-accent)"
                        : "var(--portal-warning)",
                  }}
                >
                  {partner.status.toUpperCase()}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 border-t border-[var(--portal-border)] pt-4">
                {[
                  { label: "Programme", value: partner.type === "white_label" ? "White Label" : "Standard (SDR + Referral)" },
                  { label: "Revenue Closed", value: `£${toNumber(partner.total_closed_gbp).toLocaleString()}` },
                  { label: "Tier (auto)", value: tierLabel },
                  { label: "Active Leads", value: partner.open_leads_count ?? 0 },
                  { label: "Joined", value: new Date(partner.created_at).toLocaleDateString("en-GB") },
                  { label: "Tax Form", value: partner.tax_form_url ? "Uploaded" : "Not uploaded" },
                  { label: "KYC", value: partner.kyc_verified ? "Verified" : "Pending" },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="font-ibm-mono text-[14px] tracking-[1px] text-[var(--portal-text-dim)]">
                      {label.toUpperCase()}
                    </p>
                    <p
                      className="mt-0.5 font-ibm-mono text-[14px]"
                      style={{
                        color:
                          label === "Tax Form" && !partner.tax_form_url
                            ? "var(--portal-warning)"
                            : label === "KYC" && !partner.kyc_verified
                            ? "var(--portal-warning)"
                            : "var(--portal-text-muted)",
                      }}
                    >
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Tax form link */}
              {partner.tax_form_url ? (
                <div className="mt-3 border-t border-[var(--portal-border)] pt-3">
                  <a
                    href={partner.tax_form_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-ibm-mono text-[14px] text-[var(--portal-accent)] hover:opacity-80 transition-opacity"
                  >
                    VIEW TAX FORM →
                  </a>
                </div>
              ) : null}

              {/* Admin actions */}
              <div className="mt-3 border-t border-[var(--portal-border)] pt-3 flex flex-wrap gap-2">
                {/* Approve / Suspend */}
                {partner.status !== "active" ? (
                  <form action={updatePartnerAction}>
                    <input type="hidden" name="partner_id" value={partner.id} />
                    <input type="hidden" name="status" value="active" />
                    <button
                      type="submit"
                      className="font-ibm-mono text-[14px] tracking-[1px] px-3 py-1.5 border border-[var(--portal-accent)] text-[var(--portal-accent)] hover:bg-[var(--portal-accent)] hover:text-[var(--portal-accent-contrast)] transition-colors"
                    >
                      APPROVE
                    </button>
                  </form>
                ) : (
                  <form action={updatePartnerAction}>
                    <input type="hidden" name="partner_id" value={partner.id} />
                    <input type="hidden" name="status" value="suspended" />
                    <button
                      type="submit"
                      className="font-ibm-mono text-[14px] tracking-[1px] px-3 py-1.5 border border-[var(--portal-border-strong)] text-[var(--portal-text-dim)] hover:border-[var(--portal-warning)] hover:text-[var(--portal-warning)] transition-colors"
                    >
                      SUSPEND
                    </button>
                  </form>
                )}

                {/* KYC toggle */}
                {!partner.kyc_verified ? (
                  <form action={updatePartnerAction}>
                    <input type="hidden" name="partner_id" value={partner.id} />
                    <input type="hidden" name="kyc_verified" value="true" />
                    <button
                      type="submit"
                      className="font-ibm-mono text-[14px] tracking-[1px] px-3 py-1.5 border border-[var(--portal-accent)] text-[var(--portal-accent)] hover:bg-[var(--portal-accent)] hover:text-[var(--portal-accent-contrast)] transition-colors"
                    >
                      MARK KYC VERIFIED
                    </button>
                  </form>
                ) : (
                  <form action={updatePartnerAction}>
                    <input type="hidden" name="partner_id" value={partner.id} />
                    <input type="hidden" name="kyc_verified" value="false" />
                    <button
                      type="submit"
                      className="font-ibm-mono text-[14px] tracking-[1px] px-3 py-1.5 border border-[var(--portal-border-strong)] text-[var(--portal-text-dim)] hover:border-[var(--portal-warning)] hover:text-[var(--portal-warning)] transition-colors"
                    >
                      REVOKE KYC
                    </button>
                  </form>
                )}
              </div>
            </div>
          );
        })}
        {!partners.length ? (
          <div className="col-span-full border border-[var(--portal-border)] bg-[var(--portal-surface)] p-6">
            <p className="font-ibm-mono text-[14px] text-[var(--portal-text-soft)]">No partner records yet.</p>
            <p className="mt-2 font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">
              Invite a partner using the button above to create their login and record.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
