import {
  firstParam,
  getPartnerContext,
  normalizeTierSettings,
  computeTierProgress,
  toNumber,
  type PartnerSearchParams,
} from "@/app/partners/lib";

type CommissionRow = {
  id: string;
  deal_id: string | null;
  recipient_type: "closer" | "referrer" | null;
  tier: string;
  rate_percent: number | string;
  base_amount_gbp: number | string;
  commission_amount_gbp: number | string;
  pillar: "LAUNCH" | "GROW" | "BUILD" | null;
  grow_month: number | null;
  status: "pending" | "approved" | "paid" | "reversed";
  claw_back_window_ends: string | null;
  paid_at: string | null;
  statement_pdf_url: string | null;
  created_at: string;
};

type DealRef = {
  id: string;
  title: string;
};

function formatMoney(value: number | string | null | undefined) {
  return `£${toNumber(value).toLocaleString()}`;
}

function taperCopy(row: CommissionRow) {
  if (row.pillar !== "GROW" || !row.grow_month) return null;
  if (row.grow_month === 1) return "Month 1 payout at 100% of base rate.";
  if (row.grow_month >= 2 && row.grow_month <= 6) return `Month ${row.grow_month} payout at 50% of base rate.`;
  if (row.grow_month >= 7 && row.grow_month <= 12) return `Month ${row.grow_month} payout at 25% of base rate.`;
  return null;
}

export default async function PartnerCommissionsPage(props: {
  searchParams?: Promise<PartnerSearchParams>;
}) {
  const { admin, partner } = await getPartnerContext();
  const searchParams = props.searchParams ? await props.searchParams : {};

  const statusFilter = firstParam(searchParams.status) || "all";
  const pillarFilter = firstParam(searchParams.pillar) || "all";
  const roleFilter = firstParam(searchParams.role) || "all";

  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();

  const [commissionResult, tierResult, monthDealsResult] = await Promise.all([
    admin
      .from("commissions")
      .select("id, deal_id, recipient_type, tier, rate_percent, base_amount_gbp, commission_amount_gbp, pillar, grow_month, status, claw_back_window_ends, paid_at, statement_pdf_url, created_at")
      .eq("recipient_id", partner.id)
      .order("created_at", { ascending: false }),
    admin.from("hub_settings").select("value").eq("key", "commission_tiers").maybeSingle(),
    admin
      .from("deals")
      .select("value_gbp")
      .eq("partner_id", partner.id)
      .eq("stage", "closed_won")
      .gte("closed_at", startOfMonth),
  ]);

  if (commissionResult.error) throw commissionResult.error;
  if (tierResult.error) throw tierResult.error;
  if (monthDealsResult.error) throw monthDealsResult.error;

  const commissions = (commissionResult.data ?? []) as CommissionRow[];
  const tiers = normalizeTierSettings(tierResult.data?.value);
  const monthlyRevenue = (monthDealsResult.data ?? []).reduce((sum, deal) => sum + toNumber(deal.value_gbp), 0);
  const tierProgress = tiers.length ? computeTierProgress(monthlyRevenue, tiers) : null;

  const dealIds = [...new Set(commissions.map((row) => row.deal_id).filter((id): id is string => !!id))];
  const dealRefsResult =
    dealIds.length > 0
      ? await admin.from("deals").select("id, title").in("id", dealIds)
      : { data: [] as DealRef[], error: null };

  if (dealRefsResult.error) throw dealRefsResult.error;

  const dealById = new Map(((dealRefsResult.data ?? []) as DealRef[]).map((deal) => [deal.id, deal]));
  const filtered = commissions.filter((row) => {
    const statusOk = statusFilter === "all" || row.status === statusFilter;
    const pillarOk = pillarFilter === "all" || row.pillar === pillarFilter;
    const roleOk = roleFilter === "all" || row.recipient_type === roleFilter;
    return statusOk && pillarOk && roleOk;
  });

  const pendingTotal = commissions
    .filter((row) => row.status === "pending")
    .reduce((sum, row) => sum + toNumber(row.commission_amount_gbp), 0);
  const approvedTotal = commissions
    .filter((row) => row.status === "approved")
    .reduce((sum, row) => sum + toNumber(row.commission_amount_gbp), 0);
  const paidLifetime = commissions
    .filter((row) => row.status === "paid")
    .reduce((sum, row) => sum + toNumber(row.commission_amount_gbp), 0);

  return (
    <div className="p-8">
      <div className="mb-8 border-b border-[var(--portal-border)] pb-6">
        <span className="font-ibm-mono text-[14px] tracking-[3px] text-[var(--portal-accent)]">// EARNINGS</span>
        <h1 className="mt-1 font-grotesk text-[32px] font-normal tracking-[-1px] text-[var(--portal-text)]">Commissions</h1>
        <p className="mt-1 font-ibm-mono text-[14px] tracking-[0.5px] text-[var(--portal-text-soft)]">
          Pending, approved, paid, and claw-back status across every deal you own.
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)] p-5">
          <p className="font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-text-muted)]">PENDING</p>
          <p className="mt-2 font-grotesk text-[30px] font-normal text-[var(--portal-warning)]">{formatMoney(pendingTotal)}</p>
          <p className="mt-1 font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">Inside claw-back hold</p>
        </div>
        <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)] p-5">
          <p className="font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-text-muted)]">APPROVED</p>
          <p className="mt-2 font-grotesk text-[30px] font-normal text-[var(--portal-accent)]">{formatMoney(approvedTotal)}</p>
          <p className="mt-1 font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">Awaiting payout run</p>
        </div>
        <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)] p-5">
          <p className="font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-text-muted)]">PAID LIFETIME</p>
          <p className="mt-2 font-grotesk text-[30px] font-normal text-[var(--portal-text)]">{formatMoney(paidLifetime)}</p>
          <p className="mt-1 font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">Total cash released</p>
        </div>
      </div>

      {tierProgress ? (
        <div className="mb-8 border border-[var(--portal-border)] bg-[var(--portal-surface)] p-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-text)]">TIER PROGRESS</p>
            <p className="font-ibm-mono text-[14px] text-[var(--portal-accent)]">
              {tierProgress.next ? `${formatMoney(tierProgress.distanceToNext)} to ${tierProgress.next.label}` : "Top tier reached"}
            </p>
          </div>
          <div className="mb-2 h-1.5 w-full bg-[var(--portal-border)]">
            <div className="h-1.5 bg-[var(--portal-accent)]" style={{ width: `${tierProgress.progressPct}%` }} />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">
              Closed this month: {formatMoney(monthlyRevenue)}
            </span>
            <span className="font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">
              Current tier: {tierProgress.current.label}
            </span>
          </div>
        </div>
      ) : null}

      <form method="get" className="mb-6 flex flex-wrap items-end gap-3">
        <div>
          <label className="mb-2 block font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-text-dim)]">STATUS</label>
          <select name="status" defaultValue={statusFilter} className="border border-[var(--portal-border)] bg-[var(--portal-surface-alt)] px-3 py-2 font-ibm-mono text-[14px] text-[var(--portal-text)]">
            <option value="all">ALL</option>
            <option value="pending">PENDING</option>
            <option value="approved">APPROVED</option>
            <option value="paid">PAID</option>
            <option value="reversed">REVERSED</option>
          </select>
        </div>
        <div>
          <label className="mb-2 block font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-text-dim)]">PILLAR</label>
          <select name="pillar" defaultValue={pillarFilter} className="border border-[var(--portal-border)] bg-[var(--portal-surface-alt)] px-3 py-2 font-ibm-mono text-[14px] text-[var(--portal-text)]">
            <option value="all">ALL</option>
            <option value="LAUNCH">LAUNCH</option>
            <option value="GROW">GROW</option>
            <option value="BUILD">BUILD</option>
          </select>
        </div>
        <div>
          <label className="mb-2 block font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-text-dim)]">ROLE</label>
          <select name="role" defaultValue={roleFilter} className="border border-[var(--portal-border)] bg-[var(--portal-surface-alt)] px-3 py-2 font-ibm-mono text-[14px] text-[var(--portal-text)]">
            <option value="all">ALL</option>
            <option value="closer">CLOSER</option>
            <option value="referrer">REFERRER</option>
          </select>
        </div>
        <button type="submit" className="border border-[var(--portal-border-strong)] px-4 py-2 font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-text-soft)]">
          APPLY
        </button>
      </form>

      <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)]">
        <div className="grid grid-cols-[80px_1fr_80px_80px_120px_100px_130px_130px] gap-4 border-b border-[var(--portal-border)] px-5 py-3">
          {["ID", "DEAL", "PILLAR", "ROLE", "RATE", "AMOUNT", "STATUS", "PAYOUT"].map((heading) => (
            <span key={heading} className="font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-text-dim)]">{heading}</span>
          ))}
        </div>
        {filtered.map((row) => (
          <div key={row.id} className="grid grid-cols-[80px_1fr_80px_80px_120px_100px_130px_130px] gap-4 border-b border-[var(--portal-border)] px-5 py-4 hover:bg-[var(--portal-surface-alt)]">
            <span className="font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">{row.id.slice(0, 8)}</span>
            <div>
              <p className="font-ibm-mono text-[14px] text-[var(--portal-text)]">{dealById.get(row.deal_id ?? "")?.title || "Linked deal"}</p>
              {taperCopy(row) ? (
                <p className="mt-1 font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">{taperCopy(row)}</p>
              ) : null}
            </div>
            <span className="font-ibm-mono text-[14px] text-[var(--portal-text-soft)]">{row.pillar ?? "—"}</span>
            <span className="font-ibm-mono text-[14px] text-[var(--portal-text-soft)]">{row.recipient_type ?? "—"}</span>
            <span className="font-ibm-mono text-[14px] text-[var(--portal-text-soft)]">
              {row.rate_percent}% · {row.tier}
            </span>
            <span className="font-ibm-mono text-[14px] text-[var(--portal-text)]">{formatMoney(row.commission_amount_gbp)}</span>
            <div>
              <p className="font-ibm-mono text-[14px] text-[var(--portal-text-soft)]">{row.status}</p>
              {row.claw_back_window_ends ? (
                <p className="mt-1 font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">
                  Hold ends {new Date(row.claw_back_window_ends).toLocaleDateString("en-GB")}
                </p>
              ) : null}
            </div>
            <div>
              <p className="font-ibm-mono text-[14px] text-[var(--portal-text-soft)]">
                {row.paid_at ? new Date(row.paid_at).toLocaleDateString("en-GB") : "Not paid"}
              </p>
              {row.statement_pdf_url ? (
                <a href={row.statement_pdf_url} target="_blank" rel="noreferrer" className="mt-1 inline-block font-ibm-mono text-[14px] text-[var(--portal-accent)]">
                  STATEMENT →
                </a>
              ) : null}
            </div>
          </div>
        ))}
        {!filtered.length ? (
          <div className="px-5 py-12">
            <p className="font-ibm-mono text-[14px] text-[var(--portal-text-soft)]">No commissions in this view yet.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
