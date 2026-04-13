import Link from "next/link";
import {
  closerRate,
  computeTierProgress,
  getPartnerCapSettings,
  getPartnerContext,
  getPartnerLeadCap,
  normalizeTierSettings,
  tierLabel,
  toNumber,
} from "@/app/partners/lib";

type LeadRow = {
  id: string;
  first_name: string;
  last_name: string | null;
  company: string | null;
  stage: string;
  pillar: string | null;
  sla_contacted_deadline: string | null;
};

type DealRow = {
  id: string;
  title: string;
  stage: string;
  value_gbp: number | string | null;
  pillar: string;
  last_activity_at: string | null;
};

type PartnerListRow = {
  id: string;
  profile_id: string | null;
  company_name: string | null;
};

type ProfileRow = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
};

const pillarColors: Record<string, string> = {
  LAUNCH: "var(--portal-accent)",
  GROW: "var(--portal-warning)",
  BUILD: "var(--portal-text-soft)",
};

function formatMoney(value: number | string | null | undefined) {
  return `£${toNumber(value).toLocaleString()}`;
}

function formatName(firstName?: string | null, lastName?: string | null, email?: string | null) {
  const name = [firstName, lastName].filter(Boolean).join(" ").trim();
  return name || email || "Unknown";
}

function displayLeadName(lead: LeadRow) {
  return lead.company || [lead.first_name, lead.last_name].filter(Boolean).join(" ");
}

function slaHoursLeft(deadline: string | null) {
  if (!deadline) return null;
  return Math.round((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60));
}

function slaColor(hoursLeft: number | null) {
  if (hoursLeft === null) return "var(--portal-text-dim)";
  if (hoursLeft <= 0) return "var(--portal-warning)";
  if (hoursLeft <= 6) return "var(--portal-warning)";
  return "var(--portal-accent)";
}

export default async function PartnerDashboard() {
  const { profile, partner, admin } = await getPartnerContext();
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();

  const [
    tiersResult,
    capSettings,
    monthDealsResult,
    pendingCommissionResult,
    paidCommissionResult,
    atRiskLeadsResult,
    activeDealsResult,
    leaderboardPartnersResult,
  ] = await Promise.all([
    admin.from("hub_settings").select("value").eq("key", "commission_tiers").maybeSingle(),
    getPartnerCapSettings(admin),
    admin
      .from("deals")
      .select("value_gbp")
      .eq("partner_id", partner.id)
      .eq("stage", "closed_won")
      .gte("closed_at", startOfMonth),
    admin
      .from("commissions")
      .select("commission_amount_gbp")
      .eq("recipient_id", partner.id)
      .in("status", ["pending", "approved"]),
    admin
      .from("commissions")
      .select("commission_amount_gbp")
      .eq("recipient_id", partner.id)
      .eq("status", "paid")
      .gte("paid_at", startOfMonth),
    admin
      .from("leads")
      .select("id, first_name, last_name, company, stage, pillar, sla_contacted_deadline")
      .or(`owner_id.eq.${profile?.id},partner_id.eq.${partner.id}`)
      .in("stage", ["new", "contacted", "qualified", "proposal_sent", "negotiating"])
      .not("sla_contacted_deadline", "is", null)
      .lte("sla_contacted_deadline", new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString())
      .order("sla_contacted_deadline")
      .limit(5),
    admin
      .from("deals")
      .select("id, title, stage, value_gbp, pillar, last_activity_at")
      .or(`partner_id.eq.${partner.id},referrer_id.eq.${partner.id}`)
      .in("stage", ["discovery", "proposal", "negotiating"])
      .order("last_activity_at", { ascending: true })
      .limit(5),
    admin.from("partners").select("id, profile_id, company_name").eq("status", "active"),
  ]);

  if (tiersResult.error) throw tiersResult.error;
  if (monthDealsResult.error) throw monthDealsResult.error;
  if (pendingCommissionResult.error) throw pendingCommissionResult.error;
  if (paidCommissionResult.error) throw paidCommissionResult.error;
  if (atRiskLeadsResult.error) throw atRiskLeadsResult.error;
  if (activeDealsResult.error) throw activeDealsResult.error;
  if (leaderboardPartnersResult.error) throw leaderboardPartnersResult.error;

  const tiers = normalizeTierSettings(tiersResult.data?.value);
  const monthlyRevenue = (monthDealsResult.data ?? []).reduce((sum, deal) => sum + toNumber(deal.value_gbp), 0);
  const pendingTotal = (pendingCommissionResult.data ?? []).reduce((sum, row) => sum + toNumber(row.commission_amount_gbp), 0);
  const paidThisMonth = (paidCommissionResult.data ?? []).reduce((sum, row) => sum + toNumber(row.commission_amount_gbp), 0);
  const openLeadCount = partner.open_leads_count ?? 0;
  const cap = getPartnerLeadCap(partner, capSettings);
  const tierProgress = tiers.length ? computeTierProgress(monthlyRevenue, tiers) : null;
  const currentCloserRate = closerRate(partner.tier, tiers);
  const currentTierLabel = tierLabel(partner.tier, tiers);
  const atRiskLeads = (atRiskLeadsResult.data ?? []) as LeadRow[];
  const activeDeals = (activeDealsResult.data ?? []) as DealRow[];

  const leaderboardPartners = (leaderboardPartnersResult.data ?? []) as PartnerListRow[];
  const leaderboardDealPartnerIds = leaderboardPartners.map((row) => row.id);
  const leaderboardDealsResult =
    leaderboardDealPartnerIds.length > 0
      ? await admin
          .from("deals")
          .select("partner_id, value_gbp")
          .in("partner_id", leaderboardDealPartnerIds)
          .eq("stage", "closed_won")
          .gte("closed_at", startOfMonth)
      : { data: [], error: null };
  if (leaderboardDealsResult.error) throw leaderboardDealsResult.error;

  const leaderboardProfileIds = leaderboardPartners
    .map((row) => row.profile_id)
    .filter((id): id is string => !!id);
  const leaderboardProfilesResult =
    leaderboardProfileIds.length > 0
      ? await admin.from("profiles").select("id, first_name, last_name, email").in("id", leaderboardProfileIds)
      : { data: [], error: null };
  if (leaderboardProfilesResult.error) throw leaderboardProfilesResult.error;

  const profileById = new Map(((leaderboardProfilesResult.data ?? []) as ProfileRow[]).map((row) => [row.id, row]));
  const revenueByPartner = new Map<string, number>();
  for (const deal of leaderboardDealsResult.data ?? []) {
    const current = revenueByPartner.get(deal.partner_id) ?? 0;
    revenueByPartner.set(deal.partner_id, current + toNumber(deal.value_gbp));
  }

  const rankedPartners = leaderboardPartners
    .map((row) => {
      const linkedProfile = row.profile_id ? profileById.get(row.profile_id) : null;
      return {
        id: row.id,
        name: row.company_name || formatName(linkedProfile?.first_name, linkedProfile?.last_name, linkedProfile?.email),
        revenue: revenueByPartner.get(row.id) ?? 0,
      };
    })
    .sort((a, b) => b.revenue - a.revenue);

  const myRank = rankedPartners.findIndex((row) => row.id === partner.id);
  const above = myRank > 0 ? rankedPartners[myRank - 1] : null;
  const below = myRank >= 0 && myRank < rankedPartners.length - 1 ? rankedPartners[myRank + 1] : null;

  const greeting = (() => {
    const hour = parseInt(
      new Intl.DateTimeFormat("en-GB", {
        timeZone: "Europe/London",
        hour: "numeric",
        hour12: false,
      }).format(new Date()),
      10
    );
    const name = profile?.first_name ? `, ${profile.first_name}` : "";
    if (hour < 12) return `Good morning${name}.`;
    if (hour < 17) return `Good afternoon${name}.`;
    return `Good evening${name}.`;
  })();

  const needsOnboarding = !partner.kyc_verified || !partner.tax_form_url || partner.status !== "active";
  const canClaimFromPool = partner.type === "commission_sdr" && partner.status === "active" && !!partner.kyc_verified && openLeadCount < cap;

  return (
    <div className="p-8">
      <div className="mb-8 border-b border-[var(--portal-border)] pb-6">
        <span className="font-ibm-mono text-[10px] tracking-[3px] text-[var(--portal-accent)]">// PARTNER PORTAL</span>
        <h1 className="mt-1 font-grotesk text-[32px] font-normal tracking-[-1px] text-[var(--portal-text)]">{greeting}</h1>
        <p className="mt-1 font-ibm-mono text-[12px] tracking-[0.5px] text-[var(--portal-text-soft)]">
          {partner.company_name ?? "Partner"} · {currentTierLabel} · {currentCloserRate}% closer rate
        </p>
      </div>

      {needsOnboarding ? (
        <div className="mb-6 border border-[var(--portal-warning)] bg-[var(--portal-warning-soft)] px-5 py-4">
          <p className="font-ibm-mono text-[11px] text-[var(--portal-warning)]">
            Finish onboarding to unlock the full portal.
          </p>
          <p className="mt-2 font-ibm-mono text-[10px] leading-[1.7] text-[var(--portal-text-soft)]">
            {partner.status !== "active" ? "Approval is still pending. " : ""}
            {!partner.tax_form_url ? "Tax form not uploaded. " : ""}
            {!partner.kyc_verified ? "Stripe Connect KYC not complete." : ""}
          </p>
        </div>
      ) : null}

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)] p-5">
          <p className="font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-text-muted)]">CLOSED THIS MONTH</p>
          <p className="mt-2 font-grotesk text-[30px] font-normal text-[var(--portal-accent)]">{formatMoney(monthlyRevenue)}</p>
        </div>
        <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)] p-5">
          <p className="font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-text-muted)]">CURRENT TIER</p>
          <p className="mt-2 font-grotesk text-[30px] font-normal text-[var(--portal-text)]">{currentTierLabel}</p>
          <p className="mt-1 font-ibm-mono text-[10px] text-[var(--portal-text-dim)]">{currentCloserRate}% closer rate</p>
        </div>
        <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)] p-5">
          <p className="font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-text-muted)]">COMMISSIONS PENDING</p>
          <p className="mt-2 font-grotesk text-[30px] font-normal text-[var(--portal-warning)]">{formatMoney(pendingTotal)}</p>
        </div>
        <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)] p-5">
          <p className="font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-text-muted)]">PAID THIS MONTH</p>
          <p className="mt-2 font-grotesk text-[30px] font-normal text-[var(--portal-text)]">{formatMoney(paidThisMonth)}</p>
        </div>
        <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)] p-5">
          <p className="font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-text-muted)]">LEAD CAP</p>
          <p className="mt-2 font-grotesk text-[30px] font-normal text-[var(--portal-text)]">{openLeadCount}/{cap}</p>
          <p className="mt-1 font-ibm-mono text-[10px] text-[var(--portal-text-dim)]">{canClaimFromPool ? "Pool claim open" : "Pool claim limited"}</p>
        </div>
      </div>

      {tierProgress ? (
        <div className="mb-8 border border-[var(--portal-border)] bg-[var(--portal-surface)] p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <p className="font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-text)]">TIER PROGRESS</p>
            <p className="font-ibm-mono text-[10px] text-[var(--portal-accent)]">
              {tierProgress.next ? `${formatMoney(tierProgress.distanceToNext)} to ${tierProgress.next.label}` : "Top tier reached"}
            </p>
          </div>
          <div className="mb-2 h-1.5 w-full bg-[var(--portal-border)]">
            <div className="h-1.5 bg-[var(--portal-accent)]" style={{ width: `${tierProgress.progressPct}%` }} />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="font-ibm-mono text-[10px] text-[var(--portal-text-dim)]">{tierProgress.current.label}</span>
            <span className="font-ibm-mono text-[10px] text-[var(--portal-text-dim)]">Closed revenue this month: {formatMoney(monthlyRevenue)}</span>
          </div>
        </div>
      ) : null}

      <div className="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)]">
          <div className="border-b border-[var(--portal-border)] px-6 py-4">
            <p className="font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-warning)]">NEEDS YOUR ATTENTION</p>
          </div>
          <div className="divide-y divide-[var(--portal-border)]">
            {atRiskLeads.map((lead) => {
              const hoursLeft = slaHoursLeft(lead.sla_contacted_deadline);
              return (
                <Link key={lead.id} href={`/partners/leads?lead=${lead.id}`} className="flex items-start justify-between gap-4 px-6 py-4 hover:bg-[var(--portal-surface-alt)]">
                  <div>
                    <p className="font-ibm-mono text-[11px] text-[var(--portal-text)]">{displayLeadName(lead)}</p>
                    <p className="mt-1 font-ibm-mono text-[10px] text-[var(--portal-text-dim)]">
                      {lead.stage.replace(/_/g, " ")} · {lead.pillar ?? "—"}
                    </p>
                  </div>
                  <span className="font-ibm-mono text-[10px]" style={{ color: slaColor(hoursLeft) }}>
                    {hoursLeft !== null && hoursLeft <= 0 ? "SLA BREACHED" : hoursLeft !== null ? `${hoursLeft}h left` : "—"}
                  </span>
                </Link>
              );
            })}
            {!atRiskLeads.length ? (
              <div className="px-6 py-6">
                <p className="font-ibm-mono text-[11px] text-[var(--portal-accent)]">No SLA warnings right now.</p>
              </div>
            ) : null}
          </div>
        </div>

        <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)]">
          <div className="border-b border-[var(--portal-border)] px-6 py-4">
            <p className="font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-text)]">LEADERBOARD</p>
          </div>
          <div className="space-y-4 px-6 py-5">
            <div>
              <p className="font-ibm-mono text-[10px] text-[var(--portal-text-dim)]">Your rank this month</p>
              <p className="mt-2 font-grotesk text-[28px] font-normal text-[var(--portal-accent)]">
                {myRank >= 0 ? `#${myRank + 1}` : "—"}
              </p>
            </div>
            <div className="space-y-3">
              {above ? (
                <div className="border border-[var(--portal-border)] bg-[var(--portal-surface-alt)] px-4 py-3">
                  <p className="font-ibm-mono text-[10px] text-[var(--portal-text-dim)]">Above you</p>
                  <p className="mt-1 font-ibm-mono text-[11px] text-[var(--portal-text)]">{above.name}</p>
                  <p className="mt-1 font-ibm-mono text-[10px] text-[var(--portal-text-dim)]">{formatMoney(above.revenue)}</p>
                </div>
              ) : null}
              {below ? (
                <div className="border border-[var(--portal-border)] bg-[var(--portal-surface-alt)] px-4 py-3">
                  <p className="font-ibm-mono text-[10px] text-[var(--portal-text-dim)]">Below you</p>
                  <p className="mt-1 font-ibm-mono text-[11px] text-[var(--portal-text)]">{below.name}</p>
                  <p className="mt-1 font-ibm-mono text-[10px] text-[var(--portal-text-dim)]">{formatMoney(below.revenue)}</p>
                </div>
              ) : null}
              {!above && !below ? (
                <p className="font-ibm-mono text-[10px] text-[var(--portal-text-dim)]">Leaderboard will populate once there are multiple active partners this month.</p>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)]">
          <div className="flex items-center justify-between border-b border-[var(--portal-border)] px-6 py-4">
            <p className="font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-text)]">ACTIVE DEALS</p>
            <Link href="/partners/deals" className="font-ibm-mono text-[10px] text-[var(--portal-accent)]">VIEW ALL →</Link>
          </div>
          <div className="divide-y divide-[var(--portal-border)]">
            {activeDeals.map((deal) => (
              <Link key={deal.id} href={`/partners/deals?deal=${deal.id}`} className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-[var(--portal-surface-alt)]">
                <div>
                  <p className="font-ibm-mono text-[11px] text-[var(--portal-text)]">{deal.title}</p>
                  <p className="mt-1 font-ibm-mono text-[10px] text-[var(--portal-text-dim)]">
                    {deal.stage} · {formatMoney(deal.value_gbp)}
                  </p>
                </div>
                <span className="font-ibm-mono text-[10px]" style={{ color: pillarColors[deal.pillar] ?? "var(--portal-text-soft)" }}>
                  {deal.pillar}
                </span>
              </Link>
            ))}
            {!activeDeals.length ? (
              <div className="px-6 py-6">
                <p className="font-ibm-mono text-[11px] text-[var(--portal-text-soft)]">No active deals yet.</p>
              </div>
            ) : null}
          </div>
        </div>

        <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)]">
          <div className="border-b border-[var(--portal-border)] px-6 py-4">
            <p className="font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-text)]">PRIMARY ACTIONS</p>
          </div>
          <div className="grid grid-cols-1 gap-3 p-6">
            <Link href="/partners/leads?new=1" className="flex items-center justify-between border border-[var(--portal-border)] bg-[var(--portal-surface-alt)] p-4">
              <div>
                <p className="font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-accent)]">+ SUBMIT A LEAD</p>
                <p className="mt-1 font-ibm-mono text-[10px] text-[var(--portal-text-dim)]">Refer a new prospect and lock attribution.</p>
              </div>
              <span className="font-ibm-mono text-[18px] text-[var(--portal-text-dim)]">→</span>
            </Link>
            <Link href="/partners/leads#lead-pool" className="flex items-center justify-between border border-[var(--portal-border)] bg-[var(--portal-surface-alt)] p-4">
              <div>
                <p className="font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-text)]">CLAIM FROM POOL</p>
                <p className="mt-1 font-ibm-mono text-[10px] text-[var(--portal-text-dim)]">
                  {canClaimFromPool ? "Warm leads available to claim now." : "Available after KYC and cap checks."}
                </p>
              </div>
              <span className="font-ibm-mono text-[18px] text-[var(--portal-text-dim)]">→</span>
            </Link>
            <Link href={activeDeals[0] ? `/partners/deals?deal=${activeDeals[0].id}` : "/partners/deals"} className="flex items-center justify-between border border-[var(--portal-border)] bg-[var(--portal-surface-alt)] p-4">
              <div>
                <p className="font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-text)]">OPEN MY NEXT DEAL</p>
                <p className="mt-1 font-ibm-mono text-[10px] text-[var(--portal-text-dim)]">Jump back into the next live opportunity.</p>
              </div>
              <span className="font-ibm-mono text-[18px] text-[var(--portal-text-dim)]">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
