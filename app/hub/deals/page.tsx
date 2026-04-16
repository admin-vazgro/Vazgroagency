import Link from "next/link";
import { requireHubAccess, getHubAdminClient, firstParam, type HubSearchParams } from "@/app/hub/lib";
import { convertLeadToDealAction } from "@/app/hub/actions";

type DealRow = {
  id: string;
  title: string;
  pillar: string;
  stage: string;
  value_gbp: number | string | null;
  currency: string | null;
  probability: number | null;
  expected_close_date: string | null;
  closed_at: string | null;
  stripe_payment_id: string | null;
  account_id: string | null;
  partner_id: string | null;
  referrer_id: string | null;
  last_activity_at: string | null;
  created_at: string;
};

const STAGES = ["discovery", "proposal", "negotiating", "closed_won", "closed_lost"] as const;
type Stage = typeof STAGES[number];

const STAGE_LABELS: Record<Stage, string> = {
  discovery: "Discovery",
  proposal: "Proposal",
  negotiating: "Negotiating",
  closed_won: "Closed Won",
  closed_lost: "Closed Lost",
};

const STAGE_PROBS: Record<Stage, number> = {
  discovery: 20,
  proposal: 40,
  negotiating: 70,
  closed_won: 100,
  closed_lost: 0,
};

const pillarColors: Record<string, string> = {
  LAUNCH: "var(--portal-accent)",
  GROW: "var(--portal-warning)",
  BUILD: "var(--portal-text-soft)",
};

const stageHeaderColors: Record<Stage, string> = {
  discovery: "var(--portal-text-dim)",
  proposal: "var(--portal-warning)",
  negotiating: "var(--portal-accent)",
  closed_won: "var(--portal-accent)",
  closed_lost: "var(--portal-text-dim)",
};

function toNumber(v: unknown) {
  if (typeof v === "number") return v;
  if (typeof v === "string") return Number(v) || 0;
  return 0;
}

function daysSince(date: string | null) {
  if (!date) return 0;
  return Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
}

export default async function HubDealsPage(props: { searchParams?: Promise<HubSearchParams> }) {
  await requireHubAccess();
  const admin = getHubAdminClient();
  const searchParams = props.searchParams ? await props.searchParams : {};
  const pillarFilter = firstParam(searchParams.pillar) || "All";
  const view = firstParam(searchParams.view) || "kanban";

  const { data: rawDeals } = await admin
    .from("deals")
    .select("id, title, pillar, stage, value_gbp, currency, probability, expected_close_date, closed_at, stripe_payment_id, account_id, partner_id, referrer_id, last_activity_at, created_at")
    .order("created_at", { ascending: false });

  const allDeals = (rawDeals ?? []) as DealRow[];
  const deals = pillarFilter === "All" ? allDeals : allDeals.filter((d) => d.pillar === pillarFilter);

  // Load accounts for names
  const accountIds = [...new Set(deals.map((d) => d.account_id).filter(Boolean))];
  const accountsMap = new Map<string, string>();
  if (accountIds.length) {
    const { data: accounts } = await admin.from("accounts").select("id, name").in("id", accountIds);
    for (const a of accounts ?? []) accountsMap.set(a.id, a.name);
  }

  const openDeals = deals.filter((d) => d.stage !== "closed_won" && d.stage !== "closed_lost");
  const closedWon = deals.filter((d) => d.stage === "closed_won");

  const pipelineValue = openDeals.reduce((s, d) => s + toNumber(d.value_gbp), 0);
  const weightedValue = openDeals.reduce((s, d) => s + toNumber(d.value_gbp) * (STAGE_PROBS[d.stage as Stage] ?? 20) / 100, 0);
  const wonValue = closedWon.reduce((s, d) => s + toNumber(d.value_gbp), 0);

  const dealsByStage = STAGES.reduce<Record<Stage, DealRow[]>>((acc, s) => {
    acc[s] = deals.filter((d) => d.stage === s);
    return acc;
  }, {} as Record<Stage, DealRow[]>);

  return (
    <div className="p-8">
      <div className="mb-6 border-b border-[var(--portal-border)] pb-6">
        <span className="font-ibm-mono text-[14px] text-[var(--portal-accent)] tracking-[3px]">// SALES</span>
        <h1 className="font-grotesk text-[32px] font-normal text-[var(--portal-text)] tracking-[-1px] mt-1">Deal Pipeline</h1>
        <p className="font-ibm-mono text-[14px] text-[var(--portal-text-soft)] tracking-[0.5px] mt-1">{allDeals.length} deals total</p>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 gap-4 mb-6 lg:grid-cols-4">
        <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)] p-5">
          <p className="font-ibm-mono text-[14px] text-[var(--portal-text-muted)] tracking-[1px] mb-2">PIPELINE VALUE</p>
          <p className="font-grotesk text-[26px] font-normal text-[var(--portal-accent)]">£{pipelineValue.toLocaleString()}</p>
          <p className="mt-1 font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">{openDeals.length} open deals</p>
        </div>
        <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)] p-5">
          <p className="font-ibm-mono text-[14px] text-[var(--portal-text-muted)] tracking-[1px] mb-2">WEIGHTED VALUE</p>
          <p className="font-grotesk text-[26px] font-normal text-[var(--portal-text)]">£{Math.round(weightedValue).toLocaleString()}</p>
          <p className="mt-1 font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">probability-adjusted</p>
        </div>
        <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)] p-5">
          <p className="font-ibm-mono text-[14px] text-[var(--portal-text-muted)] tracking-[1px] mb-2">CLOSED WON</p>
          <p className="font-grotesk text-[26px] font-normal text-[var(--portal-accent)]">£{wonValue.toLocaleString()}</p>
          <p className="mt-1 font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">{closedWon.length} deals closed</p>
        </div>
        <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)] p-5">
          <p className="font-ibm-mono text-[14px] text-[var(--portal-text-muted)] tracking-[1px] mb-2">AVG DEAL SIZE</p>
          <p className="font-grotesk text-[26px] font-normal text-[var(--portal-text)]">
            £{closedWon.length ? Math.round(wonValue / closedWon.length).toLocaleString() : "—"}
          </p>
          <p className="mt-1 font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">closed won avg</p>
        </div>
      </div>

      {/* Filters + view toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex gap-0 border border-[var(--portal-border)]">
          {["All", "LAUNCH", "GROW", "BUILD"].map((p) => (
            <Link
              key={p}
              href={`/hub/deals?pillar=${p}&view=${view}`}
              className="px-4 py-2 font-ibm-mono text-[14px] tracking-[1px] transition-colors border-r border-[var(--portal-border)] last:border-r-0"
              style={{
                background: pillarFilter === p ? "var(--portal-active-bg)" : "var(--portal-surface-alt)",
                color: pillarFilter === p ? "var(--portal-accent)" : "var(--portal-text-muted)",
              }}
            >
              {p}
            </Link>
          ))}
        </div>
        <div className="flex gap-0 border border-[var(--portal-border)]">
          {["kanban", "list"].map((v) => (
            <Link
              key={v}
              href={`/hub/deals?pillar=${pillarFilter}&view=${v}`}
              className="px-4 py-2 font-ibm-mono text-[14px] tracking-[1px] transition-colors border-r border-[var(--portal-border)] last:border-r-0"
              style={{
                background: view === v ? "var(--portal-active-bg)" : "var(--portal-surface-alt)",
                color: view === v ? "var(--portal-accent)" : "var(--portal-text-muted)",
              }}
            >
              {v.toUpperCase()}
            </Link>
          ))}
        </div>
      </div>

      {/* Kanban view */}
      {view === "kanban" && (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {STAGES.filter((s) => s !== "closed_lost").map((stage) => {
            const stageDeals = dealsByStage[stage];
            const stageValue = stageDeals.reduce((s, d) => s + toNumber(d.value_gbp), 0);
            return (
              <div key={stage} className="flex-shrink-0 w-[280px]">
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-ibm-mono text-[14px] tracking-[1.5px]" style={{ color: stageHeaderColors[stage] }}>
                    {STAGE_LABELS[stage].toUpperCase()}
                  </span>
                  <span className="font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">
                    {stageDeals.length} · £{stageValue.toLocaleString()}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  {stageDeals.map((deal) => (
                    <div
                      key={deal.id}
                      className="border border-[var(--portal-border)] bg-[var(--portal-surface)] p-4 hover:border-[var(--portal-accent)] transition-colors cursor-pointer"
                    >
                      <div className="mb-2 flex items-start justify-between gap-2">
                        <span className="font-ibm-mono text-[14px] tracking-[1px]" style={{ color: pillarColors[deal.pillar] }}>{deal.pillar}</span>
                        <span className="font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">{daysSince(deal.last_activity_at || deal.created_at)}d</span>
                      </div>
                      <p className="font-ibm-mono text-[14px] text-[var(--portal-text)] leading-tight">{deal.title}</p>
                      {deal.account_id && accountsMap.get(deal.account_id) && (
                        <p className="mt-1 font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">{accountsMap.get(deal.account_id)}</p>
                      )}
                      <div className="mt-3 flex items-center justify-between">
                        <span className="font-grotesk text-[14px] font-normal text-[var(--portal-accent)]">
                          £{toNumber(deal.value_gbp).toLocaleString()}
                        </span>
                        {deal.expected_close_date && (
                          <span className="font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">
                            {new Date(deal.expected_close_date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                          </span>
                        )}
                      </div>
                      {stage === "closed_won" && !deal.stripe_payment_id && (
                        <div className="mt-2 border border-[var(--portal-warning)] px-2 py-1">
                          <p className="font-ibm-mono text-[14px] text-[var(--portal-warning)]">⚠ No payment ID linked</p>
                        </div>
                      )}
                    </div>
                  ))}
                  {stageDeals.length === 0 && (
                    <div className="border border-dashed border-[var(--portal-border)] p-6">
                      <p className="font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">No deals</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Closed Lost column */}
          <div className="flex-shrink-0 w-[200px] opacity-50">
            <div className="mb-3">
              <span className="font-ibm-mono text-[14px] tracking-[1.5px] text-[var(--portal-text-dim)]">CLOSED LOST</span>
            </div>
            <div className="flex flex-col gap-2">
              {dealsByStage.closed_lost.slice(0, 5).map((deal) => (
                <div key={deal.id} className="border border-[var(--portal-border)] bg-[var(--portal-surface)] p-3">
                  <p className="font-ibm-mono text-[14px] text-[var(--portal-text-dim)] line-clamp-2">{deal.title}</p>
                  <p className="mt-1 font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">£{toNumber(deal.value_gbp).toLocaleString()}</p>
                </div>
              ))}
              {dealsByStage.closed_lost.length > 5 && (
                <p className="font-ibm-mono text-[14px] text-[var(--portal-text-dim)] px-1">+{dealsByStage.closed_lost.length - 5} more</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* List view */}
      {view === "list" && (
        <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)]">
          <div className="grid grid-cols-[1fr_80px_180px_100px_120px_100px_60px] gap-4 px-5 py-3 border-b border-[var(--portal-border)]">
            {["Deal", "Pillar", "Account", "Value", "Stage", "Close Date", "Prob."].map((h) => (
              <span key={h} className="font-ibm-mono text-[14px] text-[var(--portal-text-dim)] tracking-[2px]">{h}</span>
            ))}
          </div>
          {deals.map((deal) => {
            const won = deal.stage === "closed_won";
            const lost = deal.stage === "closed_lost";
            return (
              <div
                key={deal.id}
                className="grid grid-cols-[1fr_80px_180px_100px_120px_100px_60px] gap-4 px-5 py-4 border-b border-[var(--portal-border)] hover:bg-[var(--portal-surface-alt)] transition-colors items-center"
                style={{ opacity: lost ? 0.5 : 1 }}
              >
                <p className="font-ibm-mono text-[14px] text-[var(--portal-text-muted)]">{deal.title}</p>
                <span className="font-ibm-mono text-[14px]" style={{ color: pillarColors[deal.pillar] }}>{deal.pillar}</span>
                <span className="font-ibm-mono text-[14px] text-[var(--portal-text-soft)] truncate">
                  {deal.account_id ? (accountsMap.get(deal.account_id) ?? "—") : "—"}
                </span>
                <span className="font-ibm-mono text-[14px] text-[var(--portal-text-muted)]">£{toNumber(deal.value_gbp).toLocaleString()}</span>
                <span
                  className="font-ibm-mono text-[14px]"
                  style={{ color: won ? "var(--portal-accent)" : lost ? "var(--portal-text-dim)" : "var(--portal-text-soft)" }}
                >
                  {STAGE_LABELS[deal.stage as Stage] ?? deal.stage}
                </span>
                <span className="font-ibm-mono text-[14px] text-[var(--portal-text-muted)]">
                  {deal.expected_close_date ? new Date(deal.expected_close_date).toLocaleDateString("en-GB") : "—"}
                </span>
                <span
                  className="font-ibm-mono text-[14px]"
                  style={{ color: (STAGE_PROBS[deal.stage as Stage] ?? 0) >= 70 ? "var(--portal-accent)" : (STAGE_PROBS[deal.stage as Stage] ?? 0) >= 40 ? "var(--portal-warning)" : "var(--portal-text-dim)" }}
                >
                  {STAGE_PROBS[deal.stage as Stage] ?? "—"}%
                </span>
              </div>
            );
          })}
          {deals.length === 0 && (
            <div className="px-5 py-12">
              <p className="font-ibm-mono text-[14px] text-[var(--portal-text-soft)]">No deals yet.</p>
              <p className="font-ibm-mono text-[14px] text-[var(--portal-text-dim)] mt-2">Convert leads to deals from the Leads page.</p>
            </div>
          )}
        </div>
      )}

      <div className="mt-4">
        <p className="font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">
          Closing a deal as Won requires a Stripe payment ID.{" "}
          <Link href="/hub/leads" className="text-[var(--portal-accent)]">Convert a lead →</Link>
        </p>
      </div>
    </div>
  );
}
