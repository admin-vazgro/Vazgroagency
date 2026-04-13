import Link from "next/link";
import { createLeadAction } from "@/app/hub/actions";
import { firstParam, getHubAdminClient, type HubSearchParams, requireHubAccess } from "@/app/hub/lib";

type LeadRow = {
  id: string;
  first_name: string;
  last_name: string | null;
  email: string;
  company: string | null;
  pillar: "LAUNCH" | "GROW" | "BUILD" | null;
  stage: string;
  source: string | null;
  sla_contacted_deadline: string | null;
  created_at: string;
};

const stageOptions = [
  { value: "All", label: "All" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "proposal_sent", label: "Proposal Sent" },
  { value: "negotiating", label: "Negotiating" },
  { value: "closed_won", label: "Closed Won" },
  { value: "closed_lost", label: "Closed Lost" },
  { value: "recycled", label: "Recycled" },
] as const;

const pillarOptions = ["All", "LAUNCH", "GROW", "BUILD"] as const;
const pillarColors: Record<"LAUNCH" | "GROW" | "BUILD", string> = {
  LAUNCH: "var(--portal-accent)",
  GROW: "var(--portal-warning)",
  BUILD: "var(--portal-text-soft)",
};

function formatStage(stage: string) {
  return stage.replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatSla(deadline: string | null) {
  if (!deadline) return "—";
  const diffHours = Math.round((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60));
  if (diffHours <= 0) return "Overdue";
  return `${diffHours}h`;
}

export default async function LeadsPage(props: {
  searchParams?: Promise<HubSearchParams>;
}) {
  await requireHubAccess();

  const searchParams = props.searchParams ? await props.searchParams : {};
  const stageFilter = firstParam(searchParams.stage) || "All";
  const pillarFilter = firstParam(searchParams.pillar) || "All";
  const showNew = firstParam(searchParams.new) === "1";
  const statusMessage = firstParam(searchParams.status);
  const errorMessage = firstParam(searchParams.error);

  let leads: LeadRow[] = [];
  let dataError = "";

  try {
    const admin = getHubAdminClient();
    const { data, error } = await admin
      .from("leads")
      .select("id, first_name, last_name, email, company, pillar, stage, source, sla_contacted_deadline, created_at")
      .order("created_at", { ascending: false });

    if (error) throw error;
    leads = (data ?? []) as LeadRow[];
  } catch (error) {
    dataError = error instanceof Error ? error.message : "Unable to load leads.";
  }

  const filtered = leads.filter((lead) => {
    const stageOk = stageFilter === "All" || lead.stage === stageFilter;
    const pillarOk = pillarFilter === "All" || lead.pillar === pillarFilter;
    return stageOk && pillarOk;
  });

  const activeLeads = leads.filter((lead) => !["closed_won", "closed_lost"].includes(lead.stage)).length;

  return (
    <div className="p-8">
      <div className="mb-8 flex items-end justify-between border-b border-[var(--portal-border)] pb-6">
        <div>
          <span className="font-ibm-mono text-[10px] tracking-[3px] text-[var(--portal-accent)]">// LEADS</span>
          <h1 className="mt-1 font-grotesk text-[32px] font-normal tracking-[-1px] text-[var(--portal-text)]">Lead Pipeline</h1>
          <p className="mt-1 font-ibm-mono text-[12px] tracking-[0.5px] text-[var(--portal-text-soft)]">
            {leads.length} leads · {activeLeads} active
          </p>
        </div>
        <Link
          href={showNew ? "/hub/leads" : "/hub/leads?new=1"}
          className="bg-[var(--portal-accent)] px-5 py-2.5 font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-accent-contrast)] transition-colors hover:bg-[var(--portal-accent-hover)]"
        >
          {showNew ? "CLOSE" : "+ ADD LEAD"}
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
        <form action={createLeadAction} className="mb-8 grid grid-cols-1 gap-4 border border-[var(--portal-border)] bg-[var(--portal-surface)] p-6 lg:grid-cols-2">
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
              {pillarOptions.filter((pillar) => pillar !== "All").map((pillar) => (
                <option key={pillar} value={pillar}>{pillar}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-text-soft)]">STAGE</label>
            <select name="stage" defaultValue="new" className="w-full border border-[var(--portal-border-strong)] bg-[var(--portal-bg)] px-4 py-3 font-ibm-mono text-[12px] text-[var(--portal-text)] focus:border-[var(--portal-accent)] focus:outline-none">
              {stageOptions.filter((stage) => stage.value !== "All").map((stage) => (
                <option key={stage.value} value={stage.value}>{stage.label}</option>
              ))}
            </select>
          </div>
          <div className="lg:col-span-2">
            <label className="mb-2 block font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-text-soft)]">SOURCE</label>
            <input name="source" placeholder="website, referral, outbound..." className="w-full border border-[var(--portal-border-strong)] bg-[var(--portal-bg)] px-4 py-3 font-ibm-mono text-[12px] text-[var(--portal-text)] placeholder:text-[var(--portal-text-faint)] focus:border-[var(--portal-accent)] focus:outline-none" />
          </div>
          <div className="lg:col-span-2">
            <label className="mb-2 block font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-text-soft)]">NOTES</label>
            <textarea name="notes" rows={4} className="w-full resize-y border border-[var(--portal-border-strong)] bg-[var(--portal-bg)] px-4 py-3 font-ibm-mono text-[12px] text-[var(--portal-text)] focus:border-[var(--portal-accent)] focus:outline-none" />
          </div>
          <div className="lg:col-span-2 flex gap-3">
            <button type="submit" className="bg-[var(--portal-accent)] px-5 py-3 font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-accent-contrast)] transition-colors hover:bg-[var(--portal-accent-hover)]">
              SAVE LEAD
            </button>
            <Link href="/hub/leads" className="border border-[var(--portal-border-strong)] px-5 py-3 font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-text-soft)] transition-colors hover:text-[var(--portal-text)]">
              CANCEL
            </Link>
          </div>
        </form>
      ) : null}

      <form method="get" className="mb-6 flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="font-ibm-mono text-[9px] tracking-[2px] text-[var(--portal-text-dim)]">STAGE</label>
          <select name="stage" defaultValue={stageFilter} className="border border-[var(--portal-border)] bg-[var(--portal-surface-alt)] px-3 py-2 font-ibm-mono text-[10px] tracking-[1px] text-[var(--portal-text)] focus:border-[var(--portal-accent)] focus:outline-none">
            {stageOptions.map((stage) => (
              <option key={stage.value} value={stage.value}>{stage.label.toUpperCase()}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-ibm-mono text-[9px] tracking-[2px] text-[var(--portal-text-dim)]">PILLAR</label>
          <select name="pillar" defaultValue={pillarFilter} className="border border-[var(--portal-border)] bg-[var(--portal-surface-alt)] px-3 py-2 font-ibm-mono text-[10px] tracking-[1px] text-[var(--portal-text)] focus:border-[var(--portal-accent)] focus:outline-none">
            {pillarOptions.map((pillar) => (
              <option key={pillar} value={pillar}>{pillar}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="border border-[var(--portal-border-strong)] px-4 py-2 font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-text-soft)] transition-colors hover:text-[var(--portal-text)]">
          APPLY
        </button>
      </form>

      <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)]">
        <div className="grid grid-cols-[80px_1.2fr_1fr_90px_120px_120px_80px] gap-4 border-b border-[var(--portal-border)] px-5 py-3">
          {["ID", "Company / Contact", "Email", "Pillar", "Stage", "Source", "SLA"].map((heading) => (
            <span key={heading} className="font-ibm-mono text-[9px] tracking-[2px] text-[var(--portal-text-dim)]">{heading}</span>
          ))}
        </div>
        {filtered.map((lead) => {
          const slaText = formatSla(lead.sla_contacted_deadline);
          return (
            <div key={lead.id} className="grid grid-cols-[80px_1.2fr_1fr_90px_120px_120px_80px] gap-4 border-b border-[var(--portal-border)] px-5 py-4 transition-colors hover:bg-[var(--portal-surface-alt)]">
              <span className="font-ibm-mono text-[10px] text-[var(--portal-text-soft)]">{lead.id.slice(0, 8)}</span>
              <div>
                <p className="font-ibm-mono text-[11px] text-[var(--portal-text)]">{lead.company || "Unassigned company"}</p>
                <p className="mt-0.5 font-ibm-mono text-[10px] text-[var(--portal-text-muted)]">
                  {[lead.first_name, lead.last_name].filter(Boolean).join(" ")}
                </p>
              </div>
              <span className="font-ibm-mono text-[10px] text-[var(--portal-text-soft)]">{lead.email}</span>
              <span className="font-ibm-mono text-[10px]" style={{ color: lead.pillar ? pillarColors[lead.pillar] : "var(--portal-text-muted)" }}>
                {lead.pillar || "—"}
              </span>
              <span className="font-ibm-mono text-[10px] text-[var(--portal-text-soft)]">{formatStage(lead.stage)}</span>
              <span className="font-ibm-mono text-[10px] text-[var(--portal-text-muted)]">{lead.source || "—"}</span>
              <span className="font-ibm-mono text-[10px]" style={{ color: slaText === "Overdue" ? "var(--portal-warning)" : "var(--portal-accent)" }}>
                {slaText}
              </span>
            </div>
          );
        })}
        {!filtered.length ? (
          <div className="px-5 py-12">
            <p className="font-ibm-mono text-[11px] text-[var(--portal-text-soft)]">No leads yet.</p>
            <p className="mt-2 font-ibm-mono text-[10px] text-[var(--portal-text-dim)]">Use the add lead action to create your first live record.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
