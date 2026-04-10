import Link from "next/link";
import { createPartnerAction } from "@/app/hub/actions";
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
  open_leads_count: number | null;
  total_closed_gbp: number | string | null;
  created_at: string;
};

type ProfileRow = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
};

const tierThresholds = [
  { tier: "tier1", label: "Tier 1", range: "£0 – £9,999/mo", rate: "15%", color: "var(--portal-accent)" },
  { tier: "tier2", label: "Tier 2", range: "£10,000 – £24,999/mo", rate: "20%", color: "var(--portal-warning)" },
  { tier: "tier3", label: "Tier 3", range: "£25,000+/mo", rate: "25%", color: "var(--portal-text)" },
  { tier: "white_label", label: "White Label", range: "Custom", rate: "Custom", color: "var(--portal-text-soft)" },
] as const;

function toNumber(value: number | string | null | undefined) {
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value) || 0;
  return 0;
}

function formatStatus(status: PartnerRow["status"]) {
  return status.replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());
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
  let dataError = "";

  try {
    const admin = getHubAdminClient();
    const [partnersResult, profilesResult] = await Promise.all([
      admin
        .from("partners")
        .select("id, profile_id, tier, status, type, company_name, open_leads_count, total_closed_gbp, created_at")
        .order("created_at", { ascending: false }),
      admin.from("profiles").select("id, first_name, last_name, email"),
    ]);

    if (partnersResult.error) throw partnersResult.error;
    if (profilesResult.error) throw profilesResult.error;

    partners = (partnersResult.data ?? []) as PartnerRow[];
    profiles = (profilesResult.data ?? []) as ProfileRow[];
  } catch (error) {
    dataError = error instanceof Error ? error.message : "Unable to load partners.";
  }

  const profileById = new Map(profiles.map((profile) => [profile.id, profile]));
  const activeCount = partners.filter((partner) => partner.status === "active").length;

  return (
    <div className="p-8">
      <div className="mb-8 flex items-end justify-between border-b border-[var(--portal-border)] pb-6">
        <div>
          <span className="font-ibm-mono text-[10px] tracking-[3px] text-[var(--portal-accent)]">// PARTNERS</span>
          <h1 className="mt-1 font-grotesk text-[32px] font-normal tracking-[-1px] text-[var(--portal-text)]">Partner Programme</h1>
          <p className="mt-1 font-ibm-mono text-[12px] tracking-[0.5px] text-[var(--portal-text-soft)]">{partners.length} partners · {activeCount} active</p>
        </div>
        <Link
          href={showNew ? "/hub/partners" : "/hub/partners?new=1"}
          className="bg-[var(--portal-accent)] px-5 py-2.5 font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-accent-contrast)] transition-colors hover:bg-[var(--portal-accent-hover)]"
        >
          {showNew ? "CLOSE" : "+ INVITE PARTNER"}
        </Link>
      </div>

      {statusMessage ? (
        <div className="mb-6 border border-[var(--portal-accent)] bg-[var(--portal-accent-soft)] px-4 py-3">
          <p className="font-ibm-mono text-[11px] text-[var(--portal-accent)]">{statusMessage}</p>
        </div>
      ) : null}

      {errorMessage || dataError ? (
        <div className="mb-6 border border-[var(--portal-warning)] bg-[var(--portal-warning-soft)] px-4 py-3">
          <p className="font-ibm-mono text-[11px] text-[var(--portal-warning)]">{errorMessage || dataError}</p>
        </div>
      ) : null}

      {showNew ? (
        <form action={createPartnerAction} className="mb-8 grid grid-cols-1 gap-4 border border-[var(--portal-border)] bg-[var(--portal-surface)] p-6 lg:grid-cols-2">
          <div>
            <label className="mb-2 block font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-text-soft)]">EMAIL *</label>
            <input type="email" name="email" className="w-full border border-[var(--portal-border-strong)] bg-[var(--portal-bg)] px-4 py-3 font-ibm-mono text-[12px] text-[var(--portal-text)] focus:border-[var(--portal-accent)] focus:outline-none" />
          </div>
          <div>
            <label className="mb-2 block font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-text-soft)]">TEMP PASSWORD *</label>
            <input name="password" className="w-full border border-[var(--portal-border-strong)] bg-[var(--portal-bg)] px-4 py-3 font-ibm-mono text-[12px] text-[var(--portal-text)] focus:border-[var(--portal-accent)] focus:outline-none" />
          </div>
          <div>
            <label className="mb-2 block font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-text-soft)]">FIRST NAME</label>
            <input name="first_name" className="w-full border border-[var(--portal-border-strong)] bg-[var(--portal-bg)] px-4 py-3 font-ibm-mono text-[12px] text-[var(--portal-text)] focus:border-[var(--portal-accent)] focus:outline-none" />
          </div>
          <div>
            <label className="mb-2 block font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-text-soft)]">LAST NAME</label>
            <input name="last_name" className="w-full border border-[var(--portal-border-strong)] bg-[var(--portal-bg)] px-4 py-3 font-ibm-mono text-[12px] text-[var(--portal-text)] focus:border-[var(--portal-accent)] focus:outline-none" />
          </div>
          <div>
            <label className="mb-2 block font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-text-soft)]">COMPANY NAME *</label>
            <input name="company_name" className="w-full border border-[var(--portal-border-strong)] bg-[var(--portal-bg)] px-4 py-3 font-ibm-mono text-[12px] text-[var(--portal-text)] focus:border-[var(--portal-accent)] focus:outline-none" />
          </div>
          <div>
            <label className="mb-2 block font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-text-soft)]">TIER</label>
            <select name="tier" defaultValue="tier1" className="w-full border border-[var(--portal-border-strong)] bg-[var(--portal-bg)] px-4 py-3 font-ibm-mono text-[12px] text-[var(--portal-text)] focus:border-[var(--portal-accent)] focus:outline-none">
              {tierThresholds.map((tier) => (
                <option key={tier.tier} value={tier.tier}>{tier.label.toUpperCase()}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-text-soft)]">TYPE</label>
            <select name="type" defaultValue="referral" className="w-full border border-[var(--portal-border-strong)] bg-[var(--portal-bg)] px-4 py-3 font-ibm-mono text-[12px] text-[var(--portal-text)] focus:border-[var(--portal-accent)] focus:outline-none">
              <option value="referral">REFERRAL</option>
              <option value="commission_sdr">COMMISSION SDR</option>
              <option value="white_label">WHITE LABEL</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-text-soft)]">STATUS</label>
            <select name="status" defaultValue="pending" className="w-full border border-[var(--portal-border-strong)] bg-[var(--portal-bg)] px-4 py-3 font-ibm-mono text-[12px] text-[var(--portal-text)] focus:border-[var(--portal-accent)] focus:outline-none">
              <option value="pending">PENDING</option>
              <option value="active">ACTIVE</option>
              <option value="suspended">SUSPENDED</option>
              <option value="rejected">REJECTED</option>
            </select>
          </div>
          <div className="lg:col-span-2 flex gap-3">
            <button type="submit" className="bg-[var(--portal-accent)] px-5 py-3 font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-accent-contrast)] transition-colors hover:bg-[var(--portal-accent-hover)]">
              CREATE PARTNER
            </button>
            <Link href="/hub/partners" className="border border-[var(--portal-border-strong)] px-5 py-3 font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-text-soft)] transition-colors hover:text-[var(--portal-text)]">
              CANCEL
            </Link>
          </div>
        </form>
      ) : null}

      <div className="mb-8 border border-[var(--portal-border)] bg-[var(--portal-surface)] p-5">
        <p className="mb-4 font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-text)]">COMMISSION TIERS (MONTHLY CLOSED REVENUE)</p>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          {tierThresholds.map((tier) => (
            <div key={tier.tier} className="border border-[var(--portal-border)] p-4">
              <p className="mb-1 font-ibm-mono text-[10px] tracking-[2px]" style={{ color: tier.color }}>{tier.label.toUpperCase()}</p>
              <p className="font-grotesk text-[20px] font-normal" style={{ color: tier.color }}>{tier.rate}</p>
              <p className="mt-1 font-ibm-mono text-[10px] text-[var(--portal-text-muted)]">{tier.range}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 font-ibm-mono text-[10px] text-[var(--portal-text-muted)]">GROW commissions taper: 100% m1, 50% m2–6, 25% m7–12, 0% after 12 months.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {partners.map((partner) => {
          const profile = partner.profile_id ? profileById.get(partner.profile_id) : null;
          const tier = tierThresholds.find((item) => item.tier === partner.tier) ?? tierThresholds[0];
          return (
            <div key={partner.id} className="border border-[var(--portal-border)] bg-[var(--portal-surface)] p-6">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <span className="px-2 py-0.5 font-ibm-mono text-[9px] tracking-[2px]" style={{ background: `${tier.color}20`, color: tier.color }}>
                      {tier.label.toUpperCase()}
                    </span>
                    <span className="font-ibm-mono text-[9px] text-[var(--portal-text-dim)]">{partner.id.slice(0, 8)}</span>
                  </div>
                  <h3 className="font-grotesk text-[18px] font-normal text-[var(--portal-text)]">{partner.company_name || "Unnamed partner"}</h3>
                  <p className="mt-0.5 font-ibm-mono text-[11px] text-[var(--portal-text-soft)]">{profile ? displayProfileName(profile) : "No linked user"}</p>
                  <p className="mt-0.5 font-ibm-mono text-[10px] text-[var(--portal-text-muted)]">{profile?.email || "—"}</p>
                </div>
                <span
                  className="px-2 py-1 font-ibm-mono text-[9px] tracking-[1px]"
                  style={{
                    background: partner.status === "active" ? "var(--portal-accent-strong-soft)" : "var(--portal-warning-strong-soft)",
                    color: partner.status === "active" ? "var(--portal-accent)" : "var(--portal-warning)",
                  }}
                >
                  {partner.status.toUpperCase()}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 border-t border-[var(--portal-border)] pt-4">
                {[
                  { label: "Programme", value: partner.type.replaceAll("_", " ") },
                  { label: "Revenue Closed", value: `£${toNumber(partner.total_closed_gbp).toLocaleString()}` },
                  { label: "Active Leads", value: partner.open_leads_count ?? 0 },
                  { label: "Joined", value: new Date(partner.created_at).toLocaleDateString("en-GB") },
                  { label: "Tier", value: tier.label },
                  { label: "Status", value: formatStatus(partner.status) },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="font-ibm-mono text-[9px] tracking-[1px] text-[var(--portal-text-dim)]">{label.toUpperCase()}</p>
                    <p className="mt-0.5 font-ibm-mono text-[11px] text-[var(--portal-text-muted)]">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {!partners.length ? (
          <div className="col-span-full border border-[var(--portal-border)] bg-[var(--portal-surface)] p-6">
            <p className="font-ibm-mono text-[11px] text-[var(--portal-text-soft)]">No partner records yet.</p>
            <p className="mt-2 font-ibm-mono text-[10px] text-[var(--portal-text-dim)]">Invite a partner to create a real record and login.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
