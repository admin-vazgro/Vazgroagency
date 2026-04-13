import Link from "next/link";
import { createEngagementAction } from "@/app/hub/actions";
import {
  displayProfileName,
  firstParam,
  getHubAdminClient,
  type HubSearchParams,
  requireHubAccess,
} from "@/app/hub/lib";

type EngagementRow = {
  id: string;
  account_id: string | null;
  pillar: "LAUNCH" | "GROW" | "BUILD";
  title: string;
  status: string;
  pm_id: string | null;
  brief: string | null;
  start_date: string | null;
  end_date: string | null;
  monthly_value_gbp: number | string | null;
  created_at: string;
};

type AccountOption = {
  id: string;
  name: string;
};

type ProfileOption = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
};

const pillarColors: Record<"LAUNCH" | "GROW" | "BUILD", string> = {
  LAUNCH: "var(--portal-accent)",
  GROW: "var(--portal-warning)",
  BUILD: "var(--portal-text-soft)",
};

const statusColors: Record<string, { bg: string; text: string }> = {
  active: { bg: "var(--portal-accent-strong-soft)", text: "var(--portal-accent)" },
  paused: { bg: "var(--portal-warning-strong-soft)", text: "var(--portal-warning)" },
  completed: { bg: "var(--portal-muted-soft)", text: "var(--portal-text-soft)" },
  cancelled: { bg: "var(--portal-muted-soft)", text: "var(--portal-text-dim)" },
};

function toNumber(value: number | string | null | undefined) {
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value) || 0;
  return 0;
}

function formatStatus(status: string) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export default async function HubEngagementsPage(props: {
  searchParams?: Promise<HubSearchParams>;
}) {
  await requireHubAccess();

  const searchParams = props.searchParams ? await props.searchParams : {};
  const pillarFilter = firstParam(searchParams.pillar) || "All";
  const showNew = firstParam(searchParams.new) === "1";
  const statusMessage = firstParam(searchParams.status);
  const errorMessage = firstParam(searchParams.error);

  let engagements: EngagementRow[] = [];
  let accounts: AccountOption[] = [];
  let profiles: ProfileOption[] = [];
  let dataError = "";

  try {
    const admin = getHubAdminClient();
    const [engagementsResult, accountsResult, profilesResult] = await Promise.all([
      admin
        .from("engagements")
        .select("id, account_id, pillar, title, status, pm_id, brief, start_date, end_date, monthly_value_gbp, created_at")
        .order("created_at", { ascending: false }),
      admin.from("accounts").select("id, name").order("name"),
      admin.from("profiles").select("id, first_name, last_name, email").order("first_name"),
    ]);

    if (engagementsResult.error) throw engagementsResult.error;
    if (accountsResult.error) throw accountsResult.error;
    if (profilesResult.error) throw profilesResult.error;

    engagements = (engagementsResult.data ?? []) as EngagementRow[];
    accounts = (accountsResult.data ?? []) as AccountOption[];
    profiles = (profilesResult.data ?? []) as ProfileOption[];
  } catch (error) {
    dataError = error instanceof Error ? error.message : "Unable to load engagements.";
  }

  const accountById = new Map(accounts.map((account) => [account.id, account.name]));
  const profileById = new Map(profiles.map((profile) => [profile.id, profile]));
  const filtered = engagements.filter((engagement) => pillarFilter === "All" || engagement.pillar === pillarFilter);

  return (
    <div className="p-8">
      <div className="mb-8 flex items-end justify-between border-b border-[var(--portal-border)] pb-6">
        <div>
          <span className="font-ibm-mono text-[10px] tracking-[3px] text-[var(--portal-accent)]">// ENGAGEMENTS</span>
          <h1 className="mt-1 font-grotesk text-[32px] font-normal tracking-[-1px] text-[var(--portal-text)]">All Engagements</h1>
          <p className="mt-1 font-ibm-mono text-[12px] tracking-[0.5px] text-[var(--portal-text-soft)]">
            {engagements.filter((engagement) => engagement.status !== "completed" && engagement.status !== "cancelled").length} active ·{" "}
            {engagements.filter((engagement) => engagement.status === "completed").length} completed
          </p>
        </div>
        <Link
          href={showNew ? "/hub/engagements" : "/hub/engagements?new=1"}
          className="bg-[var(--portal-accent)] px-5 py-2.5 font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-accent-contrast)] transition-colors hover:bg-[var(--portal-accent-hover)]"
        >
          {showNew ? "CLOSE" : "+ NEW ENGAGEMENT"}
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
        <form action={createEngagementAction} className="mb-8 grid grid-cols-1 gap-4 border border-[var(--portal-border)] bg-[var(--portal-surface)] p-6 lg:grid-cols-2">
          <div>
            <label className="mb-2 block font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-text-soft)]">TITLE *</label>
            <input name="title" className="w-full border border-[var(--portal-border-strong)] bg-[var(--portal-bg)] px-4 py-3 font-ibm-mono text-[12px] text-[var(--portal-text)] focus:border-[var(--portal-accent)] focus:outline-none" />
          </div>
          <div>
            <label className="mb-2 block font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-text-soft)]">PILLAR *</label>
            <select name="pillar" defaultValue="LAUNCH" className="w-full border border-[var(--portal-border-strong)] bg-[var(--portal-bg)] px-4 py-3 font-ibm-mono text-[12px] text-[var(--portal-text)] focus:border-[var(--portal-accent)] focus:outline-none">
              <option value="LAUNCH">LAUNCH</option>
              <option value="GROW">GROW</option>
              <option value="BUILD">BUILD</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-text-soft)]">ACCOUNT *</label>
            <select name="account_id" required defaultValue="" className="w-full border border-[var(--portal-border-strong)] bg-[var(--portal-bg)] px-4 py-3 font-ibm-mono text-[12px] text-[var(--portal-text)] focus:border-[var(--portal-accent)] focus:outline-none">
              <option value="" disabled>Select account</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>{account.name}</option>
              ))}
            </select>
            {!accounts.length ? (
              <p className="mt-1.5 font-ibm-mono text-[10px] text-[var(--portal-warning)]">
                No accounts yet —{" "}
                <a href="/hub/accounts?new=1" className="underline">create one first</a>.
              </p>
            ) : null}
          </div>
          <div>
            <label className="mb-2 block font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-text-soft)]">STATUS</label>
            <select name="status" defaultValue="active" className="w-full border border-[var(--portal-border-strong)] bg-[var(--portal-bg)] px-4 py-3 font-ibm-mono text-[12px] text-[var(--portal-text)] focus:border-[var(--portal-accent)] focus:outline-none">
              <option value="active">ACTIVE</option>
              <option value="paused">PAUSED</option>
              <option value="completed">COMPLETED</option>
              <option value="cancelled">CANCELLED</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-text-soft)]">START DATE</label>
            <input type="date" name="start_date" className="w-full border border-[var(--portal-border-strong)] bg-[var(--portal-bg)] px-4 py-3 font-ibm-mono text-[12px] text-[var(--portal-text)] focus:border-[var(--portal-accent)] focus:outline-none" />
          </div>
          <div>
            <label className="mb-2 block font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-text-soft)]">END DATE</label>
            <input type="date" name="end_date" className="w-full border border-[var(--portal-border-strong)] bg-[var(--portal-bg)] px-4 py-3 font-ibm-mono text-[12px] text-[var(--portal-text)] focus:border-[var(--portal-accent)] focus:outline-none" />
          </div>
          <div>
            <label className="mb-2 block font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-text-soft)]">MONTHLY VALUE (GBP)</label>
            <input type="number" min="0" step="0.01" name="monthly_value_gbp" className="w-full border border-[var(--portal-border-strong)] bg-[var(--portal-bg)] px-4 py-3 font-ibm-mono text-[12px] text-[var(--portal-text)] focus:border-[var(--portal-accent)] focus:outline-none" />
          </div>
          <div className="lg:col-span-2">
            <label className="mb-2 block font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-text-soft)]">BRIEF</label>
            <textarea name="brief" rows={4} className="w-full resize-y border border-[var(--portal-border-strong)] bg-[var(--portal-bg)] px-4 py-3 font-ibm-mono text-[12px] text-[var(--portal-text)] focus:border-[var(--portal-accent)] focus:outline-none" />
          </div>
          <div className="lg:col-span-2 flex gap-3">
            <button type="submit" className="bg-[var(--portal-accent)] px-5 py-3 font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-accent-contrast)] transition-colors hover:bg-[var(--portal-accent-hover)]">
              SAVE ENGAGEMENT
            </button>
            <Link href="/hub/engagements" className="border border-[var(--portal-border-strong)] px-5 py-3 font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-text-soft)] transition-colors hover:text-[var(--portal-text)]">
              CANCEL
            </Link>
          </div>
        </form>
      ) : null}

      <form method="get" className="mb-6 flex gap-3">
        <select name="pillar" defaultValue={pillarFilter} className="border border-[var(--portal-border)] bg-[var(--portal-surface-alt)] px-3 py-2 font-ibm-mono text-[10px] tracking-[1px] text-[var(--portal-text)] focus:border-[var(--portal-accent)] focus:outline-none">
          <option value="All">All</option>
          <option value="LAUNCH">LAUNCH</option>
          <option value="GROW">GROW</option>
          <option value="BUILD">BUILD</option>
        </select>
        <button type="submit" className="border border-[var(--portal-border-strong)] px-4 py-2 font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-text-soft)] transition-colors hover:text-[var(--portal-text)]">
          APPLY FILTER
        </button>
      </form>

      <div className="flex flex-col gap-3">
        {filtered.map((engagement) => {
          const statusColor = statusColors[engagement.status] ?? { bg: "var(--portal-muted-soft)", text: "var(--portal-text-soft)" };
          const pm = engagement.pm_id ? profileById.get(engagement.pm_id) : null;
          return (
            <div key={engagement.id} className="border border-[var(--portal-border)] bg-[var(--portal-surface)] p-5 transition-colors hover:border-[var(--portal-border-strong)]">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 font-ibm-mono text-[9px] tracking-[2px]" style={{ background: `${pillarColors[engagement.pillar]}20`, color: pillarColors[engagement.pillar] }}>
                    {engagement.pillar}
                  </span>
                  <span className="font-ibm-mono text-[10px] text-[var(--portal-text-dim)]">{engagement.id.slice(0, 8)}</span>
                </div>
                <span className="px-2 py-1 font-ibm-mono text-[9px] tracking-[1px]" style={{ background: statusColor.bg, color: statusColor.text }}>
                  {engagement.status.toUpperCase()}
                </span>
              </div>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1fr_160px_160px] lg:items-start">
                <div>
                  <p className="font-grotesk text-[18px] font-normal text-[var(--portal-text)]">{engagement.title}</p>
                  <p className="mt-1 font-ibm-mono text-[10px] text-[var(--portal-text-soft)]">{accountById.get(engagement.account_id || "") || "No account linked"}</p>
                  {engagement.brief ? (
                    <p className="mt-3 font-ibm-mono text-[10px] leading-[1.7] text-[var(--portal-text-muted)]">{engagement.brief}</p>
                  ) : null}
                </div>
                <div>
                  <p className="font-ibm-mono text-[10px] tracking-[1px] text-[var(--portal-text-dim)]">PROJECT LEAD</p>
                  <p className="mt-1 font-ibm-mono text-[11px] text-[var(--portal-text)]">{pm ? displayProfileName(pm) : "Unassigned"}</p>
                </div>
                <div>
                  <p className="font-ibm-mono text-[10px] tracking-[1px] text-[var(--portal-text-dim)]">TIMELINE</p>
                  <p className="mt-1 font-ibm-mono text-[10px] text-[var(--portal-text)]">
                    {engagement.start_date || "TBD"} → {engagement.end_date || "TBD"}
                  </p>
                </div>
                <div>
                  <p className="font-ibm-mono text-[10px] tracking-[1px] text-[var(--portal-text-dim)]">MONTHLY VALUE</p>
                  <p className="mt-1 font-ibm-mono text-[10px] text-[var(--portal-text)]">
                    {toNumber(engagement.monthly_value_gbp) ? `£${toNumber(engagement.monthly_value_gbp).toLocaleString()}` : "—"}
                  </p>
                  <p className="mt-3 font-ibm-mono text-[10px] text-[var(--portal-text-muted)]">{formatStatus(engagement.status)}</p>
                </div>
              </div>
            </div>
          );
        })}
        {!filtered.length ? (
          <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)] p-6">
            <p className="font-ibm-mono text-[11px] text-[var(--portal-text-soft)]">No engagements yet.</p>
            <p className="mt-2 font-ibm-mono text-[10px] text-[var(--portal-text-dim)]">Create an engagement to track active delivery work.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
