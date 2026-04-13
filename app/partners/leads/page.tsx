import Link from "next/link";
import {
  advanceLeadStageAction,
  claimLeadFromPoolAction,
  logActivityAction,
  releaseLeadAction,
  submitLeadAction,
} from "@/app/partners/actions";
import {
  firstParam,
  getPartnerCapSettings,
  getPartnerContext,
  getPartnerLeadCap,
  type PartnerSearchParams,
} from "@/app/partners/lib";

type LeadRow = {
  id: string;
  first_name: string;
  last_name: string | null;
  email: string;
  company: string | null;
  pillar: "LAUNCH" | "GROW" | "BUILD" | null;
  stage: string;
  source: string | null;
  notes: string | null;
  sla_contacted_deadline: string | null;
  last_activity_at: string | null;
  created_at: string;
};

type ActivityRow = {
  id: string;
  type: string;
  subject: string | null;
  body: string | null;
  created_at: string;
};

const stageColumns = ["new", "contacted", "qualified", "proposal_sent", "negotiating", "closed_won", "closed_lost", "recycled"] as const;
const activePoolStages = ["new", "contacted", "qualified"] as const;
const pillarColors: Record<string, string> = {
  LAUNCH: "var(--portal-accent)",
  GROW: "var(--portal-warning)",
  BUILD: "var(--portal-text-soft)",
};

function formatStage(stage: string) {
  return stage.replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatName(lead: Pick<LeadRow, "first_name" | "last_name" | "company">) {
  return lead.company || [lead.first_name, lead.last_name].filter(Boolean).join(" ");
}

function formatSla(deadline: string | null) {
  if (!deadline) return "No timer";
  const diffHours = Math.round((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60));
  if (diffHours <= 0) return "Breached";
  return `${diffHours}h left`;
}

function stageHref(stage: string, view: string, leadId?: string | null) {
  const params = new URLSearchParams();
  params.set("view", view);
  params.set("stage", stage);
  if (leadId) params.set("lead", leadId);
  return `/partners/leads?${params.toString()}`;
}

export default async function PartnerLeadsPage(props: {
  searchParams?: Promise<PartnerSearchParams>;
}) {
  const { user, admin, partner } = await getPartnerContext();
  const searchParams = props.searchParams ? await props.searchParams : {};

  const view = firstParam(searchParams.view) === "list" ? "list" : "kanban";
  const stageFilter = firstParam(searchParams.stage) || "all";
  const selectedLeadId = firstParam(searchParams.lead);
  const showNew = firstParam(searchParams.new) === "1";
  const statusMessage = firstParam(searchParams.status);
  const errorMessage = firstParam(searchParams.error);

  const capSettings = await getPartnerCapSettings(admin);
  const cap = getPartnerLeadCap(partner, capSettings);

  const [leadsResult, poolResult] = await Promise.all([
    admin
      .from("leads")
      .select("id, first_name, last_name, email, company, pillar, stage, source, notes, sla_contacted_deadline, last_activity_at, created_at")
      .or(`owner_id.eq.${user.id},partner_id.eq.${partner.id}`)
      .order("created_at", { ascending: false }),
    partner.type === "commission_sdr"
      ? admin
          .from("leads")
          .select("id, first_name, last_name, email, company, pillar, stage, source, notes, sla_contacted_deadline, last_activity_at, created_at")
          .is("owner_id", null)
          .is("partner_id", null)
          .in("stage", [...activePoolStages])
          .order("created_at", { ascending: false })
          .limit(8)
      : Promise.resolve({ data: [], error: null }),
  ]);

  if (leadsResult.error) {
    throw leadsResult.error;
  }
  if (poolResult.error) {
    throw poolResult.error;
  }

  const leads = (leadsResult.data ?? []) as LeadRow[];
  const poolLeads = (poolResult.data ?? []) as LeadRow[];

  const filteredLeads = leads.filter((lead) => stageFilter === "all" || lead.stage === stageFilter);
  const selectedLead = filteredLeads.find((lead) => lead.id === selectedLeadId) ?? filteredLeads[0] ?? leads[0] ?? null;

  const activitiesResult = selectedLead
    ? await admin
        .from("activities")
        .select("id, type, subject, body, created_at")
        .eq("lead_id", selectedLead.id)
        .order("created_at", { ascending: false })
        .limit(12)
    : { data: [] as ActivityRow[], error: null };

  if (activitiesResult.error) {
    throw activitiesResult.error;
  }

  const activities = (activitiesResult.data ?? []) as ActivityRow[];
  const openLeadCount = partner.open_leads_count ?? 0;
  const canClaimFromPool = partner.type === "commission_sdr" && partner.status === "active" && !!partner.kyc_verified && openLeadCount < cap;

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-col gap-4 border-b border-[var(--portal-border)] pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className="font-ibm-mono text-[10px] tracking-[3px] text-[var(--portal-accent)]">// MY LEADS</span>
          <h1 className="mt-1 font-grotesk text-[32px] font-normal tracking-[-1px] text-[var(--portal-text)]">Lead Pipeline</h1>
          <p className="mt-1 font-ibm-mono text-[12px] tracking-[0.5px] text-[var(--portal-text-soft)]">
            {leads.length} leads in scope · {openLeadCount} open of {cap} cap
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/partners/leads?new=1"
            className="bg-[var(--portal-accent)] px-5 py-3 font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-accent-contrast)] transition-colors hover:bg-[var(--portal-accent-hover)]"
          >
            + SUBMIT A LEAD
          </Link>
          {partner.type === "commission_sdr" ? (
            <a
              href="#lead-pool"
              className="border border-[var(--portal-border-strong)] px-5 py-3 font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-text-soft)] transition-colors hover:text-[var(--portal-text)]"
            >
              CLAIM FROM POOL
            </a>
          ) : null}
        </div>
      </div>

      {statusMessage ? (
        <div className="mb-6 border border-[var(--portal-accent)] bg-[var(--portal-accent-soft)] px-4 py-3">
          <p className="font-ibm-mono text-[11px] text-[var(--portal-accent)]">{statusMessage}</p>
        </div>
      ) : null}

      {errorMessage ? (
        <div className="mb-6 border border-[var(--portal-warning)] bg-[var(--portal-warning-soft)] px-4 py-3">
          <p className="font-ibm-mono text-[11px] text-[var(--portal-warning)]">{errorMessage}</p>
        </div>
      ) : null}

      {partner.status !== "active" || !partner.kyc_verified ? (
        <div className="mb-6 border border-[var(--portal-warning)] bg-[var(--portal-warning-soft)] px-4 py-3">
          <p className="font-ibm-mono text-[11px] text-[var(--portal-warning)]">
            {partner.status !== "active"
              ? `Your partner account is ${partner.status}. Lead claiming and submissions are restricted until reactivated.`
              : "Complete KYC to unlock claiming from the shared lead pool and commission payouts."}
          </p>
        </div>
      ) : null}

      {showNew ? (
        <form action={submitLeadAction} className="mb-8 grid grid-cols-1 gap-4 border border-[var(--portal-border)] bg-[var(--portal-surface)] p-6 lg:grid-cols-2">
          <div>
            <label className="mb-2 block font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-text-soft)]">FIRST NAME *</label>
            <input name="first_name" className="w-full border border-[var(--portal-border-strong)] bg-[var(--portal-bg)] px-4 py-3 font-ibm-mono text-[12px] text-[var(--portal-text)] focus:border-[var(--portal-accent)] focus:outline-none" />
          </div>
          <div>
            <label className="mb-2 block font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-text-soft)]">LAST NAME</label>
            <input name="last_name" className="w-full border border-[var(--portal-border-strong)] bg-[var(--portal-bg)] px-4 py-3 font-ibm-mono text-[12px] text-[var(--portal-text)] focus:border-[var(--portal-accent)] focus:outline-none" />
          </div>
          <div>
            <label className="mb-2 block font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-text-soft)]">EMAIL *</label>
            <input type="email" name="email" className="w-full border border-[var(--portal-border-strong)] bg-[var(--portal-bg)] px-4 py-3 font-ibm-mono text-[12px] text-[var(--portal-text)] focus:border-[var(--portal-accent)] focus:outline-none" />
          </div>
          <div>
            <label className="mb-2 block font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-text-soft)]">COMPANY</label>
            <input name="company" className="w-full border border-[var(--portal-border-strong)] bg-[var(--portal-bg)] px-4 py-3 font-ibm-mono text-[12px] text-[var(--portal-text)] focus:border-[var(--portal-accent)] focus:outline-none" />
          </div>
          <div>
            <label className="mb-2 block font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-text-soft)]">WEBSITE</label>
            <input name="website" className="w-full border border-[var(--portal-border-strong)] bg-[var(--portal-bg)] px-4 py-3 font-ibm-mono text-[12px] text-[var(--portal-text)] focus:border-[var(--portal-accent)] focus:outline-none" />
          </div>
          <div>
            <label className="mb-2 block font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-text-soft)]">COUNTRY</label>
            <input name="country" defaultValue="GB" className="w-full border border-[var(--portal-border-strong)] bg-[var(--portal-bg)] px-4 py-3 font-ibm-mono text-[12px] text-[var(--portal-text)] focus:border-[var(--portal-accent)] focus:outline-none" />
          </div>
          <div>
            <label className="mb-2 block font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-text-soft)]">PILLAR</label>
            <select name="pillar" defaultValue="" className="w-full border border-[var(--portal-border-strong)] bg-[var(--portal-bg)] px-4 py-3 font-ibm-mono text-[12px] text-[var(--portal-text)] focus:border-[var(--portal-accent)] focus:outline-none">
              <option value="">Select pillar</option>
              <option value="LAUNCH">LAUNCH</option>
              <option value="GROW">GROW</option>
              <option value="BUILD">BUILD</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-text-soft)]">SOURCE</label>
            <input name="source" defaultValue="partner_referral" className="w-full border border-[var(--portal-border-strong)] bg-[var(--portal-bg)] px-4 py-3 font-ibm-mono text-[12px] text-[var(--portal-text)] focus:border-[var(--portal-accent)] focus:outline-none" />
          </div>
          <div className="lg:col-span-2">
            <label className="mb-2 block font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-text-soft)]">NOTES</label>
            <textarea name="notes" rows={4} className="w-full resize-y border border-[var(--portal-border-strong)] bg-[var(--portal-bg)] px-4 py-3 font-ibm-mono text-[12px] text-[var(--portal-text)] focus:border-[var(--portal-accent)] focus:outline-none" />
          </div>
          <div className="lg:col-span-2 flex gap-3">
            <button type="submit" className="bg-[var(--portal-accent)] px-5 py-3 font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-accent-contrast)] transition-colors hover:bg-[var(--portal-accent-hover)]">
              SAVE LEAD
            </button>
            <Link href="/partners/leads" className="border border-[var(--portal-border-strong)] px-5 py-3 font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-text-soft)] transition-colors hover:text-[var(--portal-text)]">
              CANCEL
            </Link>
          </div>
        </form>
      ) : null}

      {partner.type === "commission_sdr" ? (
        <section id="lead-pool" className="mb-8 border border-[var(--portal-border)] bg-[var(--portal-surface)]">
          <div className="flex flex-col gap-2 border-b border-[var(--portal-border)] px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-text)]">LEAD POOL</p>
              <p className="mt-1 font-ibm-mono text-[10px] text-[var(--portal-text-dim)]">
                Warm unclaimed leads available to commission SDR partners.
              </p>
            </div>
            <p className="font-ibm-mono text-[10px] text-[var(--portal-accent)]">
              {canClaimFromPool ? "Claiming available" : "Claiming locked"}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 p-6 lg:grid-cols-2">
            {poolLeads.map((lead) => (
              <div key={lead.id} className="border border-[var(--portal-border)] bg-[var(--portal-surface-alt)] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-ibm-mono text-[11px] text-[var(--portal-text)]">{formatName(lead)}</p>
                    <p className="mt-1 font-ibm-mono text-[10px] text-[var(--portal-text-dim)]">{lead.email}</p>
                  </div>
                  <span className="font-ibm-mono text-[9px]" style={{ color: lead.pillar ? pillarColors[lead.pillar] : "var(--portal-text-muted)" }}>
                    {lead.pillar ?? "—"}
                  </span>
                </div>
                <p className="mt-3 font-ibm-mono text-[10px] text-[var(--portal-text-muted)]">{lead.source || "Unlabelled source"}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-ibm-mono text-[10px] text-[var(--portal-text-dim)]">{formatSla(lead.sla_contacted_deadline)}</span>
                  <form action={claimLeadFromPoolAction}>
                    <input type="hidden" name="lead_id" value={lead.id} />
                    <button
                      type="submit"
                      disabled={!canClaimFromPool}
                      className="bg-[var(--portal-accent)] px-4 py-2 font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-accent-contrast)] transition-colors hover:bg-[var(--portal-accent-hover)] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      CLAIM
                    </button>
                  </form>
                </div>
              </div>
            ))}
            {!poolLeads.length ? (
              <div className="lg:col-span-2">
                <p className="font-ibm-mono text-[11px] text-[var(--portal-text-soft)]">No pool leads available right now.</p>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      <div className="mb-6 flex flex-wrap items-end gap-3">
        <div className="flex border border-[var(--portal-border)]">
          {["kanban", "list"].map((option) => (
            <Link
              key={option}
              href={`/partners/leads?view=${option}${selectedLead ? `&lead=${selectedLead.id}` : ""}`}
              className="px-4 py-2 font-ibm-mono text-[10px] tracking-[2px]"
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
          <Link
            href={`/partners/leads?view=${view}`}
            className="border border-[var(--portal-border)] px-3 py-2 font-ibm-mono text-[9px] tracking-[2px] text-[var(--portal-text-dim)]"
          >
            ALL
          </Link>
          {stageColumns.map((stage) => (
            <Link
              key={stage}
              href={stageHref(stage, view, selectedLead?.id)}
              className="border border-[var(--portal-border)] px-3 py-2 font-ibm-mono text-[9px] tracking-[2px]"
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
        <div className="mb-8 grid grid-cols-1 gap-4 xl:grid-cols-4">
          {stageColumns.map((stage) => {
            const stageLeads = filteredLeads.filter((lead) => lead.stage === stage);
            return (
              <div key={stage} className="border border-[var(--portal-border)] bg-[var(--portal-surface)]">
                <div className="border-b border-[var(--portal-border)] px-4 py-3">
                  <p className="font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-text)]">{formatStage(stage).toUpperCase()}</p>
                  <p className="mt-1 font-ibm-mono text-[10px] text-[var(--portal-text-dim)]">{stageLeads.length} lead(s)</p>
                </div>
                <div className="space-y-3 p-4">
                  {stageLeads.map((lead) => (
                    <Link
                      key={lead.id}
                      href={`/partners/leads?view=${view}&stage=${stageFilter}&lead=${lead.id}`}
                      className="block border border-[var(--portal-border)] bg-[var(--portal-surface-alt)] p-3 transition-colors hover:border-[var(--portal-border-strong)]"
                    >
                      <p className="font-ibm-mono text-[11px] text-[var(--portal-text)]">{formatName(lead)}</p>
                      <p className="mt-1 font-ibm-mono text-[10px] text-[var(--portal-text-dim)]">{lead.email}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="font-ibm-mono text-[9px]" style={{ color: lead.pillar ? pillarColors[lead.pillar] : "var(--portal-text-muted)" }}>
                          {lead.pillar ?? "—"}
                        </span>
                        <span className="font-ibm-mono text-[9px] text-[var(--portal-text-dim)]">{formatSla(lead.sla_contacted_deadline)}</span>
                      </div>
                    </Link>
                  ))}
                  {!stageLeads.length ? (
                    <p className="font-ibm-mono text-[10px] text-[var(--portal-text-dim)]">No leads.</p>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mb-8 border border-[var(--portal-border)] bg-[var(--portal-surface)]">
          <div className="grid grid-cols-[1.1fr_1fr_90px_120px_120px_110px] gap-4 border-b border-[var(--portal-border)] px-5 py-3">
            {["COMPANY / CONTACT", "EMAIL", "PILLAR", "STAGE", "SLA", ""].map((heading) => (
              <span key={heading} className="font-ibm-mono text-[9px] tracking-[2px] text-[var(--portal-text-dim)]">{heading}</span>
            ))}
          </div>
          {filteredLeads.map((lead) => (
            <div key={lead.id} className="grid grid-cols-[1.1fr_1fr_90px_120px_120px_110px] gap-4 border-b border-[var(--portal-border)] px-5 py-4 hover:bg-[var(--portal-surface-alt)]">
              <div>
                <p className="font-ibm-mono text-[11px] text-[var(--portal-text)]">{formatName(lead)}</p>
                <p className="mt-1 font-ibm-mono text-[10px] text-[var(--portal-text-dim)]">{lead.source || "No source"}</p>
              </div>
              <span className="font-ibm-mono text-[10px] text-[var(--portal-text-soft)]">{lead.email}</span>
              <span className="font-ibm-mono text-[10px]" style={{ color: lead.pillar ? pillarColors[lead.pillar] : "var(--portal-text-muted)" }}>
                {lead.pillar ?? "—"}
              </span>
              <span className="font-ibm-mono text-[10px] text-[var(--portal-text-soft)]">{formatStage(lead.stage)}</span>
              <span className="font-ibm-mono text-[10px] text-[var(--portal-text-dim)]">{formatSla(lead.sla_contacted_deadline)}</span>
              <Link href={`/partners/leads?view=${view}&stage=${stageFilter}&lead=${lead.id}`} className="font-ibm-mono text-[10px] text-[var(--portal-accent)]">
                OPEN →
              </Link>
            </div>
          ))}
          {!filteredLeads.length ? (
            <div className="px-5 py-12">
              <p className="font-ibm-mono text-[11px] text-[var(--portal-text-soft)]">No leads in this view yet.</p>
            </div>
          ) : null}
        </div>
      )}

      {selectedLead ? (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)]">
            <div className="border-b border-[var(--portal-border)] px-6 py-4">
              <p className="font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-text)]">LEAD DETAIL</p>
              <p className="mt-1 font-ibm-mono text-[11px] text-[var(--portal-text-soft)]">{formatName(selectedLead)} · {selectedLead.email}</p>
            </div>
            <div className="grid grid-cols-1 gap-4 px-6 py-5 lg:grid-cols-3">
              <div>
                <p className="font-ibm-mono text-[9px] tracking-[2px] text-[var(--portal-text-dim)]">CURRENT STAGE</p>
                <p className="mt-2 font-ibm-mono text-[11px] text-[var(--portal-text)]">{formatStage(selectedLead.stage)}</p>
              </div>
              <div>
                <p className="font-ibm-mono text-[9px] tracking-[2px] text-[var(--portal-text-dim)]">PILLAR</p>
                <p className="mt-2 font-ibm-mono text-[11px]" style={{ color: selectedLead.pillar ? pillarColors[selectedLead.pillar] : "var(--portal-text-muted)" }}>
                  {selectedLead.pillar ?? "Unassigned"}
                </p>
              </div>
              <div>
                <p className="font-ibm-mono text-[9px] tracking-[2px] text-[var(--portal-text-dim)]">FIRST-TOUCH SLA</p>
                <p className="mt-2 font-ibm-mono text-[11px] text-[var(--portal-text)]">{formatSla(selectedLead.sla_contacted_deadline)}</p>
              </div>
            </div>
            <div className="border-t border-[var(--portal-border)] px-6 py-5">
              <form action={advanceLeadStageAction} className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_auto]">
                <div>
                  <label className="mb-2 block font-ibm-mono text-[9px] tracking-[2px] text-[var(--portal-text-dim)]">MOVE STAGE</label>
                  <div className="flex flex-wrap gap-2">
                    <input type="hidden" name="lead_id" value={selectedLead.id} />
                    <input type="hidden" name="redirect_to" value={`/partners/leads?view=${view}&stage=${stageFilter}&lead=${selectedLead.id}`} />
                    <select name="stage" defaultValue={selectedLead.stage} className="min-w-[220px] border border-[var(--portal-border-strong)] bg-[var(--portal-bg)] px-4 py-3 font-ibm-mono text-[11px] text-[var(--portal-text)] focus:border-[var(--portal-accent)] focus:outline-none">
                      {stageColumns.map((stage) => (
                        <option key={stage} value={stage}>{formatStage(stage).toUpperCase()}</option>
                      ))}
                    </select>
                    <button type="submit" className="bg-[var(--portal-accent)] px-4 py-3 font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-accent-contrast)]">
                      UPDATE
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <div className="border-t border-[var(--portal-border)] px-6 py-5">
              <div className="flex items-center justify-between">
                <p className="font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-text)]">ACTIVITY TIMELINE</p>
                <span className="font-ibm-mono text-[10px] text-[var(--portal-text-dim)]">{activities.length} entries</span>
              </div>
              <div className="mt-4 space-y-3">
                {activities.map((activity) => (
                  <div key={activity.id} className="border border-[var(--portal-border)] bg-[var(--portal-surface-alt)] px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-ibm-mono text-[10px] text-[var(--portal-text)]">{activity.subject || activity.type}</p>
                      <span className="font-ibm-mono text-[9px] text-[var(--portal-text-dim)]">{new Date(activity.created_at).toLocaleString("en-GB")}</span>
                    </div>
                    {activity.body ? (
                      <p className="mt-2 font-ibm-mono text-[10px] leading-[1.6] text-[var(--portal-text-soft)]">{activity.body}</p>
                    ) : null}
                  </div>
                ))}
                {!activities.length ? (
                  <p className="font-ibm-mono text-[10px] text-[var(--portal-text-dim)]">No activity yet.</p>
                ) : null}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)]">
              <div className="border-b border-[var(--portal-border)] px-6 py-4">
                <p className="font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-text)]">LOG ACTIVITY</p>
              </div>
              <form action={logActivityAction} className="space-y-4 p-6">
                <input type="hidden" name="lead_id" value={selectedLead.id} />
                <input type="hidden" name="redirect_to" value={`/partners/leads?view=${view}&stage=${stageFilter}&lead=${selectedLead.id}`} />
                <div>
                  <label className="mb-2 block font-ibm-mono text-[9px] tracking-[2px] text-[var(--portal-text-dim)]">TYPE</label>
                  <select name="type" defaultValue="note" className="w-full border border-[var(--portal-border-strong)] bg-[var(--portal-bg)] px-4 py-3 font-ibm-mono text-[11px] text-[var(--portal-text)] focus:border-[var(--portal-accent)] focus:outline-none">
                    <option value="note">NOTE</option>
                    <option value="call">CALL</option>
                    <option value="email">EMAIL</option>
                    <option value="meeting">MEETING</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block font-ibm-mono text-[9px] tracking-[2px] text-[var(--portal-text-dim)]">SUBJECT</label>
                  <input name="subject" className="w-full border border-[var(--portal-border-strong)] bg-[var(--portal-bg)] px-4 py-3 font-ibm-mono text-[11px] text-[var(--portal-text)] focus:border-[var(--portal-accent)] focus:outline-none" />
                </div>
                <div>
                  <label className="mb-2 block font-ibm-mono text-[9px] tracking-[2px] text-[var(--portal-text-dim)]">DETAIL</label>
                  <textarea name="body" rows={5} className="w-full resize-y border border-[var(--portal-border-strong)] bg-[var(--portal-bg)] px-4 py-3 font-ibm-mono text-[11px] text-[var(--portal-text)] focus:border-[var(--portal-accent)] focus:outline-none" />
                </div>
                <button type="submit" className="bg-[var(--portal-accent)] px-4 py-3 font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-accent-contrast)]">
                  LOG ENTRY
                </button>
              </form>
            </div>

            <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)]">
              <div className="border-b border-[var(--portal-border)] px-6 py-4">
                <p className="font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-warning)]">RELEASE TO POOL</p>
              </div>
              <form action={releaseLeadAction} className="space-y-4 p-6">
                <input type="hidden" name="lead_id" value={selectedLead.id} />
                <div>
                  <label className="mb-2 block font-ibm-mono text-[9px] tracking-[2px] text-[var(--portal-text-dim)]">REASON *</label>
                  <textarea name="reason" rows={4} className="w-full resize-y border border-[var(--portal-border-strong)] bg-[var(--portal-bg)] px-4 py-3 font-ibm-mono text-[11px] text-[var(--portal-text)] focus:border-[var(--portal-warning)] focus:outline-none" />
                </div>
                <button type="submit" className="border border-[var(--portal-warning)] px-4 py-3 font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-warning)]">
                  RELEASE LEAD
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)] px-6 py-8">
          <p className="font-ibm-mono text-[11px] text-[var(--portal-text-soft)]">No lead selected.</p>
          <p className="mt-2 font-ibm-mono text-[10px] text-[var(--portal-text-dim)]">Pick a lead from the board or list to view detail and log activity.</p>
        </div>
      )}
    </div>
  );
}
