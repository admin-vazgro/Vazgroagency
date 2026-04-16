import Link from "next/link";
import {
  requireWorkspaceAccess,
  getWorkspaceAdminClient,
  displayName,
} from "@/app/workspace/lib";

type EngagementRow = {
  id: string;
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

type MilestoneRow = {
  id: string;
  engagement_id: string;
  title: string;
  due_date: string | null;
  completed_at: string | null;
  order_index: number;
};

type ProfileRow = {
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

export default async function ProjectsPage() {
  const { user } = await requireWorkspaceAccess();
  const admin = getWorkspaceAdminClient();

  const { data: membership } = await admin
    .from("account_members")
    .select("account_id")
    .eq("profile_id", user.id)
    .maybeSingle();

  const accountId = membership?.account_id ?? null;

  let engagements: EngagementRow[] = [];
  let milestones: MilestoneRow[] = [];
  let pmProfiles: ProfileRow[] = [];
  let openRequestsByEngagement = new Map<string, number>();
  let dataError = "";

  if (accountId) {
    try {
      const { data: engData, error: engError } = await admin
        .from("engagements")
        .select("id, pillar, title, status, pm_id, brief, start_date, end_date, monthly_value_gbp, created_at")
        .eq("account_id", accountId)
        .order("created_at", { ascending: false });

      if (engError) throw engError;
      engagements = (engData ?? []) as EngagementRow[];

      const engIds = engagements.map((e) => e.id);
      const pmIds = [...new Set(engagements.map((e) => e.pm_id).filter(Boolean))] as string[];

      const [milestoneResult, pmResult, reqResult] = await Promise.all([
        engIds.length
          ? admin
              .from("milestones")
              .select("id, engagement_id, title, due_date, completed_at, order_index")
              .in("engagement_id", engIds)
              .order("order_index")
          : Promise.resolve({ data: [], error: null }),
        pmIds.length
          ? admin.from("profiles").select("id, first_name, last_name, email").in("id", pmIds)
          : Promise.resolve({ data: [], error: null }),
        engIds.length
          ? admin
              .from("requests")
              .select("engagement_id")
              .in("engagement_id", engIds)
              .in("status", ["submitted", "in_review", "in_progress"])
          : Promise.resolve({ data: [], error: null }),
      ]);

      milestones = (milestoneResult.data ?? []) as MilestoneRow[];
      pmProfiles = (pmResult.data ?? []) as ProfileRow[];

      const counts: Record<string, number> = {};
      for (const row of reqResult.data ?? []) {
        counts[row.engagement_id] = (counts[row.engagement_id] ?? 0) + 1;
      }
      openRequestsByEngagement = new Map(Object.entries(counts));
    } catch (err) {
      dataError = err instanceof Error ? err.message : "Unable to load projects.";
    }
  }

  const milestonesByEngagement = new Map<string, MilestoneRow[]>();
  for (const m of milestones) {
    const existing = milestonesByEngagement.get(m.engagement_id) ?? [];
    milestonesByEngagement.set(m.engagement_id, [...existing, m]);
  }
  const pmById = new Map(pmProfiles.map((p) => [p.id, p]));

  const active = engagements.filter((e) => e.status === "active");
  const inactive = engagements.filter((e) => e.status !== "active");

  return (
    <div className="p-8">
      <div className="mb-8 flex items-end justify-between border-b border-[var(--portal-border)] pb-6">
        <div>
          <span className="font-ibm-mono text-[14px] tracking-[3px] text-[var(--portal-accent)]">// PROJECTS</span>
          <h1 className="mt-1 font-grotesk text-[32px] font-normal tracking-[-1px] text-[var(--portal-text)]">Your Projects</h1>
          <p className="mt-1 font-ibm-mono text-[14px] tracking-[0.5px] text-[var(--portal-text-soft)]">
            {active.length} active · {inactive.length} completed
          </p>
        </div>
        <Link
          href="/workspace/requests"
          className="bg-[var(--portal-accent)] px-5 py-2.5 font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-accent-contrast)] transition-colors hover:bg-[var(--portal-accent-hover)]"
        >
          + RAISE A REQUEST
        </Link>
      </div>

      {dataError && (
        <div className="mb-6 border border-[var(--portal-warning)] bg-[var(--portal-warning-soft)] px-4 py-3">
          <p className="font-ibm-mono text-[14px] text-[var(--portal-warning)]">{dataError}</p>
        </div>
      )}

      {!accountId && !dataError && (
        <div className="border border-dashed border-[var(--portal-border-strong)] p-8">
          <p className="font-ibm-mono text-[14px] text-[var(--portal-text-soft)]">Your account isn't linked to any projects yet.</p>
          <p className="mt-2 font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">
            Your Vazgro project manager will set up your projects and they'll appear here.
          </p>
        </div>
      )}

      <div className="flex flex-col gap-5">
        {engagements.map((eng) => {
          const color = pillarColors[eng.pillar] ?? "var(--portal-text-soft)";
          const sc = statusColors[eng.status] ?? { bg: "var(--portal-muted-soft)", text: "var(--portal-text-soft)" };
          const pm = eng.pm_id ? pmById.get(eng.pm_id) : null;
          const engMilestones = milestonesByEngagement.get(eng.id) ?? [];
          const openReqs = openRequestsByEngagement.get(eng.id) ?? 0;
          const completedMilestones = engMilestones.filter((m) => m.completed_at).length;
          const progress = engMilestones.length > 0 ? Math.round((completedMilestones / engMilestones.length) * 100) : 0;

          return (
            <div
              key={eng.id}
              className="border border-[var(--portal-border)] bg-[var(--portal-surface)] p-6 transition-colors hover:border-[var(--portal-border-strong)]"
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span
                    className="px-2 py-1 font-ibm-mono text-[14px] tracking-[2px]"
                    style={{ background: `${color}20`, color }}
                  >
                    {eng.pillar}
                  </span>
                  <span className="font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">{eng.id.slice(0, 8)}</span>
                </div>
                <span
                  className="px-2 py-1 font-ibm-mono text-[14px] tracking-[1px]"
                  style={{ background: sc.bg, color: sc.text }}
                >
                  {eng.status.toUpperCase()}
                </span>
              </div>

              <h3 className="mb-2 font-grotesk text-[20px] font-normal text-[var(--portal-text)]">{eng.title}</h3>
              {eng.brief && (
                <p className="mb-4 font-ibm-mono text-[14px] leading-[1.7] text-[var(--portal-text-muted)]">{eng.brief}</p>
              )}

              {engMilestones.length > 0 && (
                <div className="mb-5">
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="font-ibm-mono text-[14px] tracking-[1px] text-[var(--portal-text-dim)]">PROGRESS</span>
                    <span className="font-ibm-mono text-[14px] text-[var(--portal-text-soft)]">
                      {completedMilestones}/{engMilestones.length} milestones
                    </span>
                  </div>
                  <div className="h-1 w-full bg-[var(--portal-border)]">
                    <div className="h-1 transition-all" style={{ width: `${progress}%`, background: color }} />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 border-t border-[var(--portal-border)] pt-4 lg:grid-cols-4">
                <div>
                  <p className="font-ibm-mono text-[14px] tracking-[1px] text-[var(--portal-text-dim)]">PROJECT LEAD</p>
                  <p className="mt-1 font-ibm-mono text-[14px] text-[var(--portal-text)]">
                    {pm ? displayName(pm) : "To be assigned"}
                  </p>
                </div>
                <div>
                  <p className="font-ibm-mono text-[14px] tracking-[1px] text-[var(--portal-text-dim)]">TIMELINE</p>
                  <p className="mt-1 font-ibm-mono text-[14px] text-[var(--portal-text)]">
                    {eng.start_date || "TBD"} → {eng.end_date || "Ongoing"}
                  </p>
                </div>
                <div>
                  <p className="font-ibm-mono text-[14px] tracking-[1px] text-[var(--portal-text-dim)]">OPEN REQUESTS</p>
                  <p className="mt-1 font-ibm-mono text-[14px] text-[var(--portal-text)]">{openReqs}</p>
                </div>
                {toNumber(eng.monthly_value_gbp) > 0 && (
                  <div>
                    <p className="font-ibm-mono text-[14px] tracking-[1px] text-[var(--portal-text-dim)]">MONTHLY VALUE</p>
                    <p className="mt-1 font-ibm-mono text-[14px] text-[var(--portal-text)]">
                      £{toNumber(eng.monthly_value_gbp).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>

              {engMilestones.length > 0 && (
                <div className="mt-4 border-t border-[var(--portal-border)] pt-4">
                  <p className="mb-2 font-ibm-mono text-[14px] tracking-[1px] text-[var(--portal-text-dim)]">MILESTONES</p>
                  <div className="flex flex-col gap-1.5">
                    {engMilestones.slice(0, 5).map((m) => (
                      <div key={m.id} className="flex items-center gap-2">
                        <span
                          className="flex h-3.5 w-3.5 flex-shrink-0 items-center justify-center border font-ibm-mono text-[8px]"
                          style={{
                            borderColor: m.completed_at ? color : "var(--portal-border-strong)",
                            background: m.completed_at ? `${color}20` : "transparent",
                            color: m.completed_at ? color : "var(--portal-text-dim)",
                          }}
                        >
                          {m.completed_at ? "✓" : ""}
                        </span>
                        <span className="font-ibm-mono text-[14px] text-[var(--portal-text-muted)]">{m.title}</span>
                        {m.due_date && !m.completed_at && (
                          <span className="ml-auto font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">
                            Due {m.due_date}
                          </span>
                        )}
                      </div>
                    ))}
                    {engMilestones.length > 5 && (
                      <p className="font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">
                        +{engMilestones.length - 5} more milestones
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-4 border-t border-[var(--portal-border)] pt-4">
                <Link
                  href={`/workspace/requests?project=${eng.id}`}
                  className="font-ibm-mono text-[14px] tracking-[1px] text-[var(--portal-accent)] transition-opacity hover:opacity-80"
                >
                  View requests for this project →
                </Link>
              </div>
            </div>
          );
        })}

        {engagements.length === 0 && accountId && !dataError && (
          <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)] p-8">
            <p className="font-ibm-mono text-[14px] text-[var(--portal-text-soft)]">No projects yet.</p>
            <p className="mt-2 font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">
              Your projects will appear here once your Vazgro team sets them up.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
