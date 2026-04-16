import { notFound } from "next/navigation";
import Link from "next/link";
import { requireHubAccess, getHubAdminClient, displayProfileName, firstParam } from "@/app/hub/lib";

type PageProps = {
  params: Promise<{ engagementId: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const pillarColors: Record<string, string> = {
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

const requestStatusColors: Record<string, { bg: string; text: string }> = {
  submitted: { bg: "var(--portal-muted-soft)", text: "var(--portal-text-soft)" },
  in_review: { bg: "var(--portal-warning-strong-soft)", text: "var(--portal-warning)" },
  in_progress: { bg: "var(--portal-accent-strong-soft)", text: "var(--portal-accent)" },
  delivered: { bg: "var(--portal-accent-strong-soft)", text: "var(--portal-accent)" },
  approved: { bg: "var(--portal-accent-strong-soft)", text: "var(--portal-accent)" },
  revision_requested: { bg: "var(--portal-warning-strong-soft)", text: "var(--portal-warning)" },
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

export default async function HubProjectWorkspace({ params, searchParams }: PageProps) {
  await requireHubAccess();
  const { engagementId } = await params;
  const sp = searchParams ? await searchParams : {};
  const activeTab = firstParam(sp.tab) || "overview";

  const admin = getHubAdminClient();

  // Load engagement with account and PM
  const { data: eng, error: engError } = await admin
    .from("engagements")
    .select("id, title, pillar, status, brief, kickoff_date, end_date, monthly_value_gbp, contract_value_gbp, pm_id, account_id, stripe_subscription_id, created_at")
    .eq("id", engagementId)
    .maybeSingle();

  if (engError || !eng) notFound();

  // Load in parallel: account, team, requests, deliverables, milestones, activities, invoices
  const [
    accountResult,
    pmResult,
    teamResult,
    requestsResult,
    deliverablesResult,
    milestonesResult,
    activitiesResult,
    invoicesResult,
  ] = await Promise.all([
    eng.account_id
      ? admin.from("accounts").select("id, name, website, stripe_customer_id, mrr_gbp").eq("id", eng.account_id).maybeSingle()
      : { data: null },
    eng.pm_id
      ? admin.from("profiles").select("id, first_name, last_name, email, role").eq("id", eng.pm_id).maybeSingle()
      : { data: null },
    admin.from("engagement_team").select("id, profile_id, role").eq("engagement_id", engagementId),
    admin.from("requests").select("id, title, status, created_at, description").eq("engagement_id", engagementId).order("created_at", { ascending: false }),
    admin.from("deliverables").select("id, name, file_url, file_type, requires_approval, approved_at, created_at").eq("engagement_id", engagementId).order("created_at", { ascending: false }),
    admin.from("milestones").select("id, title, due_date, completed_at, amount_gbp").eq("engagement_id", engagementId).order("due_date"),
    admin.from("activities").select("id, type, subject, body, created_at").eq("lead_id", engagementId).order("created_at", { ascending: false }).limit(50),
    eng.account_id
      ? admin.from("invoices").select("id, title, amount_gbp, status, due_date, paid_at, created_at").eq("account_id", eng.account_id).order("created_at", { ascending: false }).limit(20)
      : { data: [] },
  ]);

  const account = accountResult.data;
  const pm = pmResult.data;
  const team = teamResult.data ?? [];
  const requests = requestsResult.data ?? [];
  const deliverables = deliverablesResult.data ?? [];
  const milestones = milestonesResult.data ?? [];
  const activities = activitiesResult.data ?? [];
  const invoices = invoicesResult.data ?? [];

  // Load team member profiles
  const teamProfileIds = team.map((t: { profile_id: string }) => t.profile_id);
  const teamProfiles =
    teamProfileIds.length
      ? (await admin.from("profiles").select("id, first_name, last_name, email, role").in("id", teamProfileIds)).data ?? []
      : [];
  const profileById = new Map(teamProfiles.map((p: { id: string; first_name: string | null; last_name: string | null; email: string; role: string }) => [p.id, p]));

  const daysRunning = daysSince(eng.kickoff_date || eng.created_at);
  const value = eng.pillar === "GROW" ? toNumber(eng.monthly_value_gbp) : toNumber(eng.contract_value_gbp);
  const valueLabel = eng.pillar === "GROW" ? "/mo" : " total";

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "tasks", label: `Tasks (${requests.length})` },
    { key: "files", label: `Files (${deliverables.length})` },
    { key: "team", label: "Team" },
    { key: "activity", label: "Activity" },
    { key: "billing", label: "Billing" },
    { key: "notes", label: "Notes" },
  ];

  const kanbanCols = [
    { key: "submitted", label: "Submitted" },
    { key: "in_review", label: "In Review" },
    { key: "in_progress", label: "In Progress" },
    { key: "delivered", label: "Delivered" },
    { key: "approved", label: "Approved" },
    { key: "revision_requested", label: "Revisions" },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-[var(--portal-border)] bg-[var(--portal-surface)] px-8 py-5">
        <div className="mb-2 flex items-center gap-2">
          <Link href="/hub/engagements" className="font-ibm-mono text-[14px] text-[var(--portal-text-dim)] hover:text-[var(--portal-text-soft)] transition-colors">
            ← Engagements
          </Link>
          <span className="font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">/</span>
          <span className="font-ibm-mono text-[14px] text-[var(--portal-text-muted)]">{eng.title}</span>
        </div>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-1">
              <span className="font-ibm-mono text-[14px] tracking-[2px]" style={{ color: pillarColors[eng.pillar] }}>{eng.pillar}</span>
              <span
                className="px-2 py-0.5 font-ibm-mono text-[14px] tracking-[1px]"
                style={{ background: statusColors[eng.status]?.bg ?? "var(--portal-muted-soft)", color: statusColors[eng.status]?.text ?? "var(--portal-text-soft)" }}
              >
                {eng.status.toUpperCase()}
              </span>
            </div>
            <h1 className="font-grotesk text-[28px] font-normal tracking-[-1px] text-[var(--portal-text)]">{eng.title}</h1>
            <p className="mt-1 font-ibm-mono text-[14px] text-[var(--portal-text-soft)]">
              {account?.name ?? "—"} · {daysRunning} days running · {pm ? displayProfileName(pm) + " (PM)" : "No PM assigned"}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-ibm-mono text-[14px] tracking-[1px] text-[var(--portal-text-dim)]">{eng.pillar === "GROW" ? "MRR" : "VALUE"}</p>
              <p className="font-grotesk text-[22px] font-normal text-[var(--portal-accent)]">
                £{value.toLocaleString()}<span className="font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">{valueLabel}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Tab bar */}
        <div className="mt-4 flex gap-0 border-b border-[var(--portal-border)] -mb-[1px]">
          {tabs.map((tab) => (
            <Link
              key={tab.key}
              href={`/hub/projects/${engagementId}?tab=${tab.key}`}
              className="px-5 py-2.5 font-ibm-mono text-[14px] tracking-[1px] transition-colors border-b-2"
              style={{
                color: activeTab === tab.key ? "var(--portal-accent)" : "var(--portal-text-muted)",
                borderColor: activeTab === tab.key ? "var(--portal-accent)" : "transparent",
                background: "transparent",
              }}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-auto p-8">

        {/* ── OVERVIEW ── */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[2fr_1fr]">
            <div className="flex flex-col gap-6">
              {/* Brief */}
              <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)] p-6">
                <p className="mb-3 font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-text-muted)]">PROJECT BRIEF</p>
                <p className="font-ibm-mono text-[14px] leading-[1.8] text-[var(--portal-text-soft)]">
                  {eng.brief || "No brief added yet."}
                </p>
              </div>

              {/* Milestones */}
              <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)]">
                <div className="border-b border-[var(--portal-border)] px-6 py-4">
                  <p className="font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-text-muted)]">MILESTONES</p>
                </div>
                {milestones.length ? (
                  milestones.map((m: { id: string; title: string; due_date: string | null; completed_at: string | null; amount_gbp: number | null }) => (
                    <div key={m.id} className="flex items-center justify-between gap-4 border-b border-[var(--portal-border)] px-6 py-4 last:border-b-0">
                      <div className="flex items-center gap-3">
                        <div
                          className="h-4 w-4 flex-shrink-0 border"
                          style={{
                            background: m.completed_at ? "var(--portal-accent)" : "transparent",
                            borderColor: m.completed_at ? "var(--portal-accent)" : "var(--portal-border-strong)",
                          }}
                        />
                        <div>
                          <p className="font-ibm-mono text-[14px] text-[var(--portal-text)]">{m.title}</p>
                          {m.due_date && (
                            <p className="mt-0.5 font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">
                              Due {new Date(m.due_date).toLocaleDateString("en-GB")}
                            </p>
                          )}
                        </div>
                      </div>
                      {m.amount_gbp && (
                        <span className="font-ibm-mono text-[14px] text-[var(--portal-text-muted)]">
                          £{toNumber(m.amount_gbp).toLocaleString()}
                        </span>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="px-6 py-8">
                    <p className="font-ibm-mono text-[14px] text-[var(--portal-text-soft)]">No milestones yet.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right rail */}
            <div className="flex flex-col gap-4">
              <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)] p-5">
                <p className="mb-3 font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-text-muted)]">KEY DATES</p>
                <div className="flex flex-col gap-3">
                  {[
                    ["KICKOFF", eng.kickoff_date ? new Date(eng.kickoff_date).toLocaleDateString("en-GB") : "—"],
                    ["END DATE", eng.end_date ? new Date(eng.end_date).toLocaleDateString("en-GB") : "Ongoing"],
                    ["RUNNING", `${daysRunning} days`],
                  ].map(([label, val]) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">{label}</span>
                      <span className="font-ibm-mono text-[14px] text-[var(--portal-text-muted)]">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)] p-5">
                <p className="mb-3 font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-text-muted)]">STATS</p>
                <div className="flex flex-col gap-3">
                  {[
                    ["OPEN TASKS", requests.filter((r: { status: string }) => !["approved"].includes(r.status)).length],
                    ["DELIVERABLES", deliverables.length],
                    ["AWAITING APPROVAL", deliverables.filter((d: { requires_approval: boolean; approved_at: string | null }) => d.requires_approval && !d.approved_at).length],
                  ].map(([label, val]) => (
                    <div key={String(label)} className="flex items-center justify-between">
                      <span className="font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">{label}</span>
                      <span className="font-grotesk text-[16px] font-normal text-[var(--portal-text)]">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)] p-5">
                <p className="mb-3 font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-text-muted)]">QUICK ACTIONS</p>
                <div className="flex flex-col gap-2">
                  {[
                    { href: `?tab=tasks`, label: "+ Add Request" },
                    { href: `?tab=files`, label: "↑ Upload File" },
                    { href: `?tab=billing`, label: "Create Invoice" },
                  ].map((action) => (
                    <Link
                      key={action.label}
                      href={`/hub/projects/${engagementId}${action.href}`}
                      className="block border border-[var(--portal-border)] bg-[var(--portal-bg)] px-4 py-3 font-ibm-mono text-[14px] tracking-[1px] text-[var(--portal-text-muted)] transition-colors hover:border-[var(--portal-accent)] hover:text-[var(--portal-accent)]"
                    >
                      {action.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TASKS (Kanban) ── */}
        {activeTab === "tasks" && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-text-muted)]">TASK BOARD</h2>
              <span className="font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">{requests.length} total requests</span>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {kanbanCols.map((col) => {
                const colRequests = requests.filter((r: { status: string }) => r.status === col.key);
                return (
                  <div key={col.key} className="flex-shrink-0 w-[260px]">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="font-ibm-mono text-[14px] tracking-[1px] text-[var(--portal-text-muted)]">{col.label.toUpperCase()}</span>
                      <span
                        className="flex h-5 w-5 items-center justify-center font-ibm-mono text-[14px]"
                        style={{ background: "var(--portal-border)", color: "var(--portal-text-soft)" }}
                      >
                        {colRequests.length}
                      </span>
                    </div>
                    <div className="flex flex-col gap-2">
                      {colRequests.map((req: { id: string; title: string; status: string; created_at: string; description: string | null }) => {
                        const sc = requestStatusColors[req.status] ?? { bg: "var(--portal-muted-soft)", text: "var(--portal-text-soft)" };
                        return (
                          <div
                            key={req.id}
                            className="border border-[var(--portal-border)] bg-[var(--portal-surface)] p-4 cursor-pointer hover:border-[var(--portal-accent)] transition-colors"
                          >
                            <p className="font-ibm-mono text-[14px] text-[var(--portal-text)] leading-[1.5]">{req.title}</p>
                            {req.description && (
                              <p className="mt-1 font-ibm-mono text-[14px] text-[var(--portal-text-dim)] leading-[1.5] line-clamp-2">{req.description}</p>
                            )}
                            <div className="mt-3 flex items-center justify-between">
                              <span
                                className="px-1.5 py-0.5 font-ibm-mono text-[8px] tracking-[0.5px]"
                                style={{ background: sc.bg, color: sc.text }}
                              >
                                {req.status.replace(/_/g, " ").toUpperCase()}
                              </span>
                              <span className="font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">
                                {daysSince(req.created_at)}d
                              </span>
                            </div>
                          </div>
                        );
                      })}
                      {colRequests.length === 0 && (
                        <div className="border border-dashed border-[var(--portal-border)] p-4">
                          <p className="font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">Empty</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── FILES ── */}
        {activeTab === "files" && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-text-muted)]">DELIVERABLES & FILES</h2>
              <span className="font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">{deliverables.length} files</span>
            </div>
            <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)]">
              <div className="grid grid-cols-[1fr_100px_120px_100px] gap-4 border-b border-[var(--portal-border)] px-5 py-3">
                {["Name", "Type", "Uploaded", "Status"].map((h) => (
                  <span key={h} className="font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-text-dim)]">{h}</span>
                ))}
              </div>
              {deliverables.length ? deliverables.map((d: { id: string; name: string; file_url: string | null; file_type: string | null; requires_approval: boolean; approved_at: string | null; created_at: string }) => (
                <div key={d.id} className="grid grid-cols-[1fr_100px_120px_100px] gap-4 items-center border-b border-[var(--portal-border)] px-5 py-4 hover:bg-[var(--portal-surface-alt)] last:border-b-0">
                  <div>
                    <p className="font-ibm-mono text-[14px] text-[var(--portal-text)]">{d.name}</p>
                    {d.file_url && (
                      <a href={d.file_url} target="_blank" rel="noopener noreferrer" className="font-ibm-mono text-[14px] text-[var(--portal-accent)] hover:opacity-80">
                        Download ↓
                      </a>
                    )}
                  </div>
                  <span className="font-ibm-mono text-[14px] text-[var(--portal-text-soft)]">{d.file_type || "—"}</span>
                  <span className="font-ibm-mono text-[14px] text-[var(--portal-text-muted)]">{new Date(d.created_at).toLocaleDateString("en-GB")}</span>
                  <span
                    className="w-fit px-2 py-1 font-ibm-mono text-[14px] tracking-[1px]"
                    style={d.approved_at ? { background: "var(--portal-accent-strong-soft)", color: "var(--portal-accent)" } : d.requires_approval ? { background: "var(--portal-warning-strong-soft)", color: "var(--portal-warning)" } : { background: "var(--portal-muted-soft)", color: "var(--portal-text-soft)" }}
                  >
                    {d.approved_at ? "APPROVED" : d.requires_approval ? "AWAITING" : "UPLOADED"}
                  </span>
                </div>
              )) : (
                <div className="px-5 py-10">
                  <p className="font-ibm-mono text-[14px] text-[var(--portal-text-soft)]">No files yet.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TEAM ── */}
        {activeTab === "team" && (
          <div>
            <h2 className="mb-6 font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-text-muted)]">PROJECT TEAM</h2>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {pm && (
                <div className="border border-[var(--portal-accent)] bg-[var(--portal-surface)] p-5">
                  <p className="mb-3 font-ibm-mono text-[14px] tracking-[1.5px] text-[var(--portal-accent)]">PROJECT MANAGER</p>
                  <p className="font-grotesk text-[16px] font-normal text-[var(--portal-text)]">{displayProfileName(pm)}</p>
                  <p className="mt-1 font-ibm-mono text-[14px] text-[var(--portal-text-muted)]">{pm.email}</p>
                </div>
              )}
              {team.map((member: { id: string; profile_id: string; role: string }) => {
                const profile = profileById.get(member.profile_id);
                if (!profile) return null;
                return (
                  <div key={member.id} className="border border-[var(--portal-border)] bg-[var(--portal-surface)] p-5">
                    <p className="mb-3 font-ibm-mono text-[14px] tracking-[1.5px] text-[var(--portal-text-dim)]">{member.role.toUpperCase()}</p>
                    <p className="font-grotesk text-[16px] font-normal text-[var(--portal-text)]">{displayProfileName(profile)}</p>
                    <p className="mt-1 font-ibm-mono text-[14px] text-[var(--portal-text-muted)]">{profile.email}</p>
                  </div>
                );
              })}
              {!pm && team.length === 0 && (
                <div className="border border-dashed border-[var(--portal-border-strong)] p-8">
                  <p className="font-ibm-mono text-[14px] text-[var(--portal-text-soft)]">No team members assigned yet.</p>
                  <Link href="/hub/admin" className="mt-2 block font-ibm-mono text-[14px] text-[var(--portal-accent)]">Assign via Admin →</Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── ACTIVITY ── */}
        {activeTab === "activity" && (
          <div>
            <h2 className="mb-6 font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-text-muted)]">ACTIVITY TIMELINE</h2>
            {activities.length ? (
              <div className="flex flex-col gap-0 border-l-2 border-[var(--portal-border)] ml-2">
                {activities.map((act: { id: string; type: string; subject: string | null; body: string | null; created_at: string }) => (
                  <div key={act.id} className="relative pl-6 pb-5">
                    <div className="absolute -left-[5px] top-1 h-2.5 w-2.5 bg-[var(--portal-border-strong)]" />
                    <p className="font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">
                      {new Date(act.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </p>
                    <p className="mt-1 font-ibm-mono text-[14px] text-[var(--portal-text)]">{act.type.replace(/_/g, " ")}</p>
                    {act.subject && <p className="mt-0.5 font-ibm-mono text-[14px] text-[var(--portal-text-muted)]">{act.subject}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="font-ibm-mono text-[14px] text-[var(--portal-text-soft)]">No activity logged yet.</p>
            )}
          </div>
        )}

        {/* ── BILLING ── */}
        {activeTab === "billing" && (
          <div>
            <h2 className="mb-6 font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-text-muted)]">BILLING & INVOICES</h2>
            {eng.stripe_subscription_id && (
              <div className="mb-6 border border-[var(--portal-accent)] bg-[var(--portal-accent-soft)] px-5 py-4">
                <p className="font-ibm-mono text-[14px] text-[var(--portal-accent)]">GROW Subscription Active</p>
                <p className="mt-1 font-ibm-mono text-[14px] text-[var(--portal-text-muted)]">Stripe Subscription ID: {eng.stripe_subscription_id}</p>
              </div>
            )}
            {(invoices as Array<{ id: string; title: string; amount_gbp: number | string; status: string; due_date: string | null; paid_at: string | null; created_at: string }>).length ? (
              <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)]">
                <div className="grid grid-cols-[1fr_100px_120px_100px] gap-4 border-b border-[var(--portal-border)] px-5 py-3">
                  {["Invoice", "Amount", "Due", "Status"].map((h) => (
                    <span key={h} className="font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-text-dim)]">{h}</span>
                  ))}
                </div>
                {(invoices as Array<{ id: string; title: string; amount_gbp: number | string; status: string; due_date: string | null; paid_at: string | null; created_at: string }>).map((inv) => (
                  <div key={inv.id} className="grid grid-cols-[1fr_100px_120px_100px] gap-4 items-center border-b border-[var(--portal-border)] px-5 py-4 hover:bg-[var(--portal-surface-alt)] last:border-b-0">
                    <p className="font-ibm-mono text-[14px] text-[var(--portal-text)]">{inv.title}</p>
                    <span className="font-ibm-mono text-[14px] text-[var(--portal-text-muted)]">£{toNumber(inv.amount_gbp).toLocaleString()}</span>
                    <span className="font-ibm-mono text-[14px] text-[var(--portal-text-muted)]">{inv.due_date ? new Date(inv.due_date).toLocaleDateString("en-GB") : "—"}</span>
                    <span className="font-ibm-mono text-[14px] text-[var(--portal-accent)]">{inv.status.toUpperCase()}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="font-ibm-mono text-[14px] text-[var(--portal-text-soft)]">No invoices for this engagement.</p>
            )}
          </div>
        )}

        {/* ── NOTES ── */}
        {activeTab === "notes" && (
          <div>
            <h2 className="mb-6 font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-text-muted)]">INTERNAL NOTES</h2>
            <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)] p-6">
              <p className="font-ibm-mono text-[14px] text-[var(--portal-text-soft)]">
                {eng.brief || "No internal notes yet. Use this space for internal team context only — clients cannot see this."}
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
