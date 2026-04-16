import Link from "next/link";
import { advanceDealStageAction, logActivityAction } from "@/app/partners/actions";
import {
  closerRate,
  firstParam,
  getPartnerContext,
  normalizeTierSettings,
  tierLabel,
  toNumber,
  type PartnerSearchParams,
} from "@/app/partners/lib";

type DealRow = {
  id: string;
  lead_id: string | null;
  account_id: string | null;
  pillar: "LAUNCH" | "GROW" | "BUILD";
  stage: string;
  title: string;
  value_gbp: number | string | null;
  closed_at: string | null;
  last_activity_at: string | null;
  notes: string | null;
  partner_id: string | null;
  referrer_id: string | null;
  created_at: string;
};

type LeadRef = {
  id: string;
  company: string | null;
  first_name: string;
  last_name: string | null;
};

type AccountRef = {
  id: string;
  name: string;
};

type ActivityRow = {
  id: string;
  type: string;
  subject: string | null;
  body: string | null;
  created_at: string;
};

const stages = ["discovery", "proposal", "negotiating", "closed_won", "closed_lost"] as const;
const pillarColors: Record<string, string> = {
  LAUNCH: "var(--portal-accent)",
  GROW: "var(--portal-warning)",
  BUILD: "var(--portal-text-soft)",
};

function formatStage(stage: string) {
  return stage.replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatCurrency(value: number | string | null | undefined) {
  return `£${toNumber(value).toLocaleString()}`;
}

function formatIdleDate(value: string | null) {
  if (!value) return "No activity";
  const diffDays = Math.floor((Date.now() - new Date(value).getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return "Updated today";
  return `${diffDays} day${diffDays === 1 ? "" : "s"} idle`;
}

function detailHref(view: string, stage: string, dealId: string) {
  const params = new URLSearchParams();
  params.set("view", view);
  if (stage !== "all") params.set("stage", stage);
  params.set("deal", dealId);
  return `/partners/deals?${params.toString()}`;
}

export default async function PartnerDealsPage(props: {
  searchParams?: Promise<PartnerSearchParams>;
}) {
  const { admin, partner } = await getPartnerContext();
  const searchParams = props.searchParams ? await props.searchParams : {};

  const view = firstParam(searchParams.view) === "list" ? "list" : "kanban";
  const stageFilter = firstParam(searchParams.stage) || "all";
  const selectedDealId = firstParam(searchParams.deal);
  const statusMessage = firstParam(searchParams.status);
  const errorMessage = firstParam(searchParams.error);

  const [{ data: dealsData, error: dealsError }, { data: tierRow, error: tierError }] = await Promise.all([
    admin
      .from("deals")
      .select("id, lead_id, account_id, pillar, stage, title, value_gbp, closed_at, last_activity_at, notes, partner_id, referrer_id, created_at")
      .or(`partner_id.eq.${partner.id},referrer_id.eq.${partner.id}`)
      .order("created_at", { ascending: false }),
    admin.from("hub_settings").select("value").eq("key", "commission_tiers").maybeSingle(),
  ]);

  if (dealsError) throw dealsError;
  if (tierError) throw tierError;

  const deals = (dealsData ?? []) as DealRow[];
  const selectedDeals = deals.filter((deal) => stageFilter === "all" || deal.stage === stageFilter);
  const selectedDeal = selectedDeals.find((deal) => deal.id === selectedDealId) ?? selectedDeals[0] ?? deals[0] ?? null;

  const [leadRefsResult, accountRefsResult, activityResult] = await Promise.all([
    selectedDeal?.lead_id
      ? admin.from("leads").select("id, company, first_name, last_name").eq("id", selectedDeal.lead_id).maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    selectedDeal?.account_id
      ? admin.from("accounts").select("id, name").eq("id", selectedDeal.account_id).maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    selectedDeal
      ? admin
          .from("activities")
          .select("id, type, subject, body, created_at")
          .eq("deal_id", selectedDeal.id)
          .order("created_at", { ascending: false })
          .limit(12)
      : Promise.resolve({ data: [], error: null }),
  ]);

  if (leadRefsResult.error) throw leadRefsResult.error;
  if (accountRefsResult.error) throw accountRefsResult.error;
  if (activityResult.error) throw activityResult.error;

  const leadRef = (leadRefsResult.data ?? null) as LeadRef | null;
  const accountRef = (accountRefsResult.data ?? null) as AccountRef | null;
  const activities = (activityResult.data ?? []) as ActivityRow[];

  const tiers = normalizeTierSettings(tierRow?.value);
  const currentCloserRate = closerRate(partner.tier, tiers);
  const currentReferrerRate = tiers.find((tier) => tier.tier === partner.tier)?.referrer_rate ?? 5;

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-col gap-4 border-b border-[var(--portal-border)] pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className="font-ibm-mono text-[14px] tracking-[3px] text-[var(--portal-accent)]">// MY DEALS</span>
          <h1 className="mt-1 font-grotesk text-[32px] font-normal tracking-[-1px] text-[var(--portal-text)]">Deals</h1>
          <p className="mt-1 font-ibm-mono text-[14px] tracking-[0.5px] text-[var(--portal-text-soft)]">
            {deals.length} deals in scope · {tierLabel(partner.tier, tiers)} rate card live
          </p>
        </div>
      </div>

      {statusMessage ? (
        <div className="mb-6 border border-[var(--portal-accent)] bg-[var(--portal-accent-soft)] px-4 py-3">
          <p className="font-ibm-mono text-[14px] text-[var(--portal-accent)]">{statusMessage}</p>
        </div>
      ) : null}

      {errorMessage ? (
        <div className="mb-6 border border-[var(--portal-warning)] bg-[var(--portal-warning-soft)] px-4 py-3">
          <p className="font-ibm-mono text-[14px] text-[var(--portal-warning)]">{errorMessage}</p>
        </div>
      ) : null}

      <div className="mb-6 flex flex-wrap items-end gap-3">
        <div className="flex border border-[var(--portal-border)]">
          {["kanban", "list"].map((option) => (
            <Link
              key={option}
              href={`/partners/deals?view=${option}${selectedDeal ? `&deal=${selectedDeal.id}` : ""}`}
              className="px-4 py-2 font-ibm-mono text-[14px] tracking-[2px]"
              style={{
                background: view === option ? "var(--portal-accent)" : "var(--portal-surface-alt)",
                color: view === option ? "var(--portal-accent-contrast)" : "var(--portal-text-soft)",
              }}
            >
              {option.toUpperCase()}
            </Link>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={`/partners/deals?view=${view}`} className="border border-[var(--portal-border)] px-3 py-2 font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-text-dim)]">
            ALL
          </Link>
          {stages.map((stage) => (
            <Link
              key={stage}
              href={`/partners/deals?view=${view}&stage=${stage}${selectedDeal ? `&deal=${selectedDeal.id}` : ""}`}
              className="border border-[var(--portal-border)] px-3 py-2 font-ibm-mono text-[14px] tracking-[2px]"
              style={{
                color: stageFilter === stage ? "var(--portal-accent)" : "var(--portal-text-dim)",
                borderColor: stageFilter === stage ? "var(--portal-accent)" : "var(--portal-border)",
              }}
            >
              {formatStage(stage).toUpperCase()}
            </Link>
          ))}
        </div>
      </div>

      {view === "kanban" ? (
        <div className="mb-8 grid grid-cols-1 gap-4 xl:grid-cols-5">
          {stages.map((stage) => {
            const stageDeals = selectedDeals.filter((deal) => deal.stage === stage);
            return (
              <div key={stage} className="border border-[var(--portal-border)] bg-[var(--portal-surface)]">
                <div className="border-b border-[var(--portal-border)] px-4 py-3">
                  <p className="font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-text)]">{formatStage(stage).toUpperCase()}</p>
                  <p className="mt-1 font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">{stageDeals.length} deal(s)</p>
                </div>
                <div className="space-y-3 p-4">
                  {stageDeals.map((deal) => {
                    const previewRate = deal.partner_id === partner.id ? currentCloserRate : currentReferrerRate;
                    return (
                      <Link
                        key={deal.id}
                        href={detailHref(view, stageFilter, deal.id)}
                        className="block border border-[var(--portal-border)] bg-[var(--portal-surface-alt)] p-3 transition-colors hover:border-[var(--portal-border-strong)]"
                      >
                        <p className="font-ibm-mono text-[14px] text-[var(--portal-text)]">{deal.title}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="font-ibm-mono text-[14px]" style={{ color: pillarColors[deal.pillar] ?? "var(--portal-text-soft)" }}>
                            {deal.pillar}
                          </span>
                          <span className="font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">{formatCurrency(deal.value_gbp)}</span>
                        </div>
                        <p className="mt-2 font-ibm-mono text-[14px] text-[var(--portal-accent)]">
                          {formatCurrency(toNumber(deal.value_gbp) * previewRate / 100)} expected
                        </p>
                      </Link>
                    );
                  })}
                  {!stageDeals.length ? (
                    <p className="font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">No deals.</p>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mb-8 border border-[var(--portal-border)] bg-[var(--portal-surface)]">
          <div className="grid grid-cols-[1.1fr_100px_120px_120px_120px_110px] gap-4 border-b border-[var(--portal-border)] px-5 py-3">
            {["TITLE", "PILLAR", "VALUE", "STAGE", "IDLE", ""].map((heading) => (
              <span key={heading} className="font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-text-dim)]">{heading}</span>
            ))}
          </div>
          {selectedDeals.map((deal) => (
            <div key={deal.id} className="grid grid-cols-[1.1fr_100px_120px_120px_120px_110px] gap-4 border-b border-[var(--portal-border)] px-5 py-4 hover:bg-[var(--portal-surface-alt)]">
              <div>
                <p className="font-ibm-mono text-[14px] text-[var(--portal-text)]">{deal.title}</p>
                <p className="mt-1 font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">
                  {deal.partner_id === partner.id ? "Closer commission" : "Referrer commission"}
                </p>
              </div>
              <span className="font-ibm-mono text-[14px]" style={{ color: pillarColors[deal.pillar] ?? "var(--portal-text-soft)" }}>
                {deal.pillar}
              </span>
              <span className="font-ibm-mono text-[14px] text-[var(--portal-text-soft)]">{formatCurrency(deal.value_gbp)}</span>
              <span className="font-ibm-mono text-[14px] text-[var(--portal-text-soft)]">{formatStage(deal.stage)}</span>
              <span className="font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">{formatIdleDate(deal.last_activity_at)}</span>
              <Link href={detailHref(view, stageFilter, deal.id)} className="font-ibm-mono text-[14px] text-[var(--portal-accent)]">
                OPEN →
              </Link>
            </div>
          ))}
          {!selectedDeals.length ? (
            <div className="px-5 py-12">
              <p className="font-ibm-mono text-[14px] text-[var(--portal-text-soft)]">No deals yet.</p>
            </div>
          ) : null}
        </div>
      )}

      {selectedDeal ? (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)]">
            <div className="border-b border-[var(--portal-border)] px-6 py-4">
              <p className="font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-text)]">DEAL DETAIL</p>
              <p className="mt-1 font-ibm-mono text-[14px] text-[var(--portal-text-soft)]">{selectedDeal.title}</p>
            </div>
            <div className="grid grid-cols-1 gap-4 px-6 py-5 lg:grid-cols-3">
              <div>
                <p className="font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-text-dim)]">LINKED LEAD</p>
                <p className="mt-2 font-ibm-mono text-[14px] text-[var(--portal-text)]">
                  {leadRef ? leadRef.company || [leadRef.first_name, leadRef.last_name].filter(Boolean).join(" ") : "No linked lead"}
                </p>
              </div>
              <div>
                <p className="font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-text-dim)]">ACCOUNT</p>
                <p className="mt-2 font-ibm-mono text-[14px] text-[var(--portal-text)]">{accountRef?.name || "No account linked"}</p>
              </div>
              <div>
                <p className="font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-text-dim)]">EXPECTED COMMISSION</p>
                <p className="mt-2 font-ibm-mono text-[14px] text-[var(--portal-accent)]">
                  {formatCurrency(
                    toNumber(selectedDeal.value_gbp) *
                      (selectedDeal.partner_id === partner.id ? currentCloserRate : currentReferrerRate) /
                      100
                  )}
                </p>
              </div>
            </div>
            <div className="border-t border-[var(--portal-border)] px-6 py-5">
              <div className="flex items-center justify-between">
                <p className="font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-text)]">ACTIVITY TIMELINE</p>
                <span className="font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">{activities.length} entries</span>
              </div>
              <div className="mt-4 space-y-3">
                {activities.map((activity) => (
                  <div key={activity.id} className="border border-[var(--portal-border)] bg-[var(--portal-surface-alt)] px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-ibm-mono text-[14px] text-[var(--portal-text)]">{activity.subject || activity.type}</p>
                      <span className="font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">{new Date(activity.created_at).toLocaleString("en-GB")}</span>
                    </div>
                    {activity.body ? (
                      <p className="mt-2 font-ibm-mono text-[14px] leading-[1.6] text-[var(--portal-text-soft)]">{activity.body}</p>
                    ) : null}
                  </div>
                ))}
                {!activities.length ? (
                  <p className="font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">No activity yet.</p>
                ) : null}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)]">
              <div className="border-b border-[var(--portal-border)] px-6 py-4">
                <p className="font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-text)]">UPDATE DEAL</p>
                <p className="mt-1 font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">
                  Closing won requires a Stripe payment or invoice reference.
                </p>
              </div>
              <form action={advanceDealStageAction} className="space-y-4 p-6">
                <input type="hidden" name="deal_id" value={selectedDeal.id} />
                <input type="hidden" name="redirect_to" value={detailHref(view, stageFilter, selectedDeal.id)} />
                <div>
                  <label className="mb-2 block font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-text-dim)]">STAGE</label>
                  <select name="stage" defaultValue={selectedDeal.stage} className="w-full border border-[var(--portal-border-strong)] bg-[var(--portal-bg)] px-4 py-3 font-ibm-mono text-[14px] text-[var(--portal-text)] focus:border-[var(--portal-accent)] focus:outline-none">
                    {stages.map((stage) => (
                      <option key={stage} value={stage}>{formatStage(stage).toUpperCase()}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-text-dim)]">PAYMENT / INVOICE REFERENCE</label>
                  <input name="payment_reference" placeholder="pi_... or invoice_..." className="w-full border border-[var(--portal-border-strong)] bg-[var(--portal-bg)] px-4 py-3 font-ibm-mono text-[14px] text-[var(--portal-text)] focus:border-[var(--portal-accent)] focus:outline-none" />
                </div>
                <button type="submit" className="bg-[var(--portal-accent)] px-4 py-3 font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-accent-contrast)]">
                  SAVE STAGE
                </button>
              </form>
            </div>

            <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)]">
              <div className="border-b border-[var(--portal-border)] px-6 py-4">
                <p className="font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-text)]">LOG DEAL ACTIVITY</p>
              </div>
              <form action={logActivityAction} className="space-y-4 p-6">
                <input type="hidden" name="deal_id" value={selectedDeal.id} />
                <input type="hidden" name="redirect_to" value={detailHref(view, stageFilter, selectedDeal.id)} />
                <div>
                  <label className="mb-2 block font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-text-dim)]">TYPE</label>
                  <select name="type" defaultValue="note" className="w-full border border-[var(--portal-border-strong)] bg-[var(--portal-bg)] px-4 py-3 font-ibm-mono text-[14px] text-[var(--portal-text)] focus:border-[var(--portal-accent)] focus:outline-none">
                    <option value="note">NOTE</option>
                    <option value="call">CALL</option>
                    <option value="email">EMAIL</option>
                    <option value="meeting">MEETING</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-text-dim)]">SUBJECT</label>
                  <input name="subject" className="w-full border border-[var(--portal-border-strong)] bg-[var(--portal-bg)] px-4 py-3 font-ibm-mono text-[14px] text-[var(--portal-text)] focus:border-[var(--portal-accent)] focus:outline-none" />
                </div>
                <div>
                  <label className="mb-2 block font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-text-dim)]">DETAIL</label>
                  <textarea name="body" rows={5} className="w-full resize-y border border-[var(--portal-border-strong)] bg-[var(--portal-bg)] px-4 py-3 font-ibm-mono text-[14px] text-[var(--portal-text)] focus:border-[var(--portal-accent)] focus:outline-none" />
                </div>
                <button type="submit" className="bg-[var(--portal-accent)] px-4 py-3 font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-accent-contrast)]">
                  LOG ENTRY
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)] px-6 py-8">
          <p className="font-ibm-mono text-[14px] text-[var(--portal-text-soft)]">No deals found.</p>
        </div>
      )}
    </div>
  );
}
