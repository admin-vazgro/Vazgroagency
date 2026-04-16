import Link from "next/link";
import {
  requireWorkspaceAccess,
  getWorkspaceAdminClient,
  getGreeting,
  firstParam,
  type WorkspaceSearchParams,
} from "@/app/workspace/lib";
import WorkspaceDashboardShell from "./WorkspaceDashboardShell";

const pillarColors: Record<string, string> = {
  LAUNCH: "var(--portal-accent)",
  GROW: "var(--portal-warning)",
  BUILD: "var(--portal-text-soft)",
};

const statusBadge = {
  submitted: { bg: "var(--portal-muted-soft)", text: "var(--portal-text-soft)", label: "Queued" },
  in_review: { bg: "var(--portal-accent-strong-soft)", text: "var(--portal-accent)", label: "In Review" },
  in_progress: { bg: "var(--portal-warning-strong-soft)", text: "var(--portal-warning)", label: "In Progress" },
  delivered: { bg: "var(--portal-accent-strong-soft)", text: "var(--portal-accent)", label: "Delivered" },
  approved: { bg: "var(--portal-muted-soft)", text: "var(--portal-text-dim)", label: "Approved" },
  revision_requested: { bg: "var(--portal-warning-strong-soft)", text: "var(--portal-warning)", label: "Revisions" },
} as const;

export default async function WorkspaceDashboard(props: { searchParams?: Promise<WorkspaceSearchParams> }) {
  const { user } = await requireWorkspaceAccess();
  const admin = getWorkspaceAdminClient();
  const searchParams = props.searchParams ? await props.searchParams : {};
  const showWizard = firstParam(searchParams.welcome) === "1";

  const [profileResult, membershipResult] = await Promise.all([
    admin.from("profiles").select("first_name, last_name, email, timezone").eq("id", user.id).maybeSingle(),
    admin.from("account_members").select("account_id").eq("profile_id", user.id).maybeSingle(),
  ]);

  const profile = profileResult.data;
  const accountId = membershipResult.data?.account_id ?? null;
  const greeting = getGreeting(profile?.first_name ?? null, profile?.timezone ?? "Europe/London");

  // Default empty state
  let activeEngagementCount = 0;
  let openRequestCount = 0;
  let pendingApprovalCount = 0;
  let invoicesDueGbp = 0;
  let recentRequests: Array<{
    id: string;
    title: string;
    status: string;
    created_at: string;
  }> = [];
  let recentDeliverables: Array<{
    id: string;
    name: string;
    file_type: string | null;
    created_at: string;
    approved_at: string | null;
    requires_approval: boolean;
  }> = [];
  let engagementCards: Array<{
    id: string;
    pillar: string;
    title: string;
    status: string;
  }> = [];

  if (accountId) {
    // Get engagement IDs for this account (used in sub-queries)
    const { data: engRows } = await admin
      .from("engagements")
      .select("id, pillar, title, status")
      .eq("account_id", accountId)
      .order("created_at", { ascending: false });

    engagementCards = (engRows ?? []).filter((e) => e.status === "active").slice(0, 4);
    activeEngagementCount = (engRows ?? []).filter((e) => e.status === "active").length;

    const engagementIds = (engRows ?? []).map((e) => e.id);

    const [reqResult, delResult, invResult, recentReqResult, recentDelResult] = await Promise.all([
      // Open requests count
      engagementIds.length
        ? admin
            .from("requests")
            .select("id", { count: "exact", head: true })
            .in("engagement_id", engagementIds)
            .in("status", ["submitted", "in_review", "in_progress"])
        : Promise.resolve({ count: 0, error: null }),

      // Pending approvals count
      engagementIds.length
        ? admin
            .from("deliverables")
            .select("id", { count: "exact", head: true })
            .in("engagement_id", engagementIds)
            .eq("requires_approval", true)
            .is("approved_at", null)
        : Promise.resolve({ count: 0, error: null }),

      // Invoices due sum
      admin
        .from("invoices")
        .select("amount_gbp")
        .eq("account_id", accountId)
        .in("status", ["sent", "overdue"]),

      // Recent requests
      engagementIds.length
        ? admin
            .from("requests")
            .select("id, title, status, created_at")
            .in("engagement_id", engagementIds)
            .order("created_at", { ascending: false })
            .limit(5)
        : Promise.resolve({ data: [], error: null }),

      // Recent deliverables
      engagementIds.length
        ? admin
            .from("deliverables")
            .select("id, name, file_type, created_at, approved_at, requires_approval")
            .in("engagement_id", engagementIds)
            .order("created_at", { ascending: false })
            .limit(5)
        : Promise.resolve({ data: [], error: null }),
    ]);

    openRequestCount = reqResult.count ?? 0;
    pendingApprovalCount = delResult.count ?? 0;
    invoicesDueGbp = (invResult.data ?? []).reduce(
      (sum, inv) => sum + (typeof inv.amount_gbp === "number" ? inv.amount_gbp : Number(inv.amount_gbp) || 0),
      0
    );
    recentRequests = (recentReqResult.data ?? []) as typeof recentRequests;
    recentDeliverables = (recentDelResult.data ?? []) as typeof recentDeliverables;
  }

  const profileName = profile?.first_name ?? profile?.email?.split("@")[0] ?? "there";

  return (
    <WorkspaceDashboardShell showWizard={showWizard} profileName={profileName}>
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 border-b border-[var(--portal-border)] pb-6">
        <span className="font-ibm-mono text-[14px] text-[var(--portal-accent)] tracking-[3px]">// YOUR WORKSPACE</span>
        <h1 className="font-grotesk text-[32px] font-normal text-[var(--portal-text)] tracking-[-1px] mt-1">{greeting}</h1>
        {!accountId ? (
          <p className="font-ibm-mono text-[14px] text-[var(--portal-text-soft)] tracking-[0.5px] mt-1">
            Your workspace is ready. Projects, requests, and files will appear here once your team sets up your account.
          </p>
        ) : (
          <p className="font-ibm-mono text-[14px] text-[var(--portal-text-soft)] tracking-[0.5px] mt-1">
            {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4 mb-8 lg:grid-cols-4">
        {[
          { label: "Active Projects", value: String(activeEngagementCount), note: activeEngagementCount === 0 ? "No active projects" : `${activeEngagementCount} in delivery` },
          { label: "Open Requests", value: String(openRequestCount), note: openRequestCount === 0 ? "Nothing queued" : `${openRequestCount} in progress` },
          { label: "Pending Approvals", value: String(pendingApprovalCount), note: pendingApprovalCount === 0 ? "All up to date" : "Awaiting your review", warning: pendingApprovalCount > 0 },
          { label: "Invoices Due", value: invoicesDueGbp > 0 ? `£${invoicesDueGbp.toLocaleString()}` : "£0", note: invoicesDueGbp > 0 ? "Payment required" : "All paid", warning: invoicesDueGbp > 0 },
        ].map(({ label, value, note, warning }) => (
          <div key={label} className="border border-[var(--portal-border)] bg-[var(--portal-surface)] p-5">
            <p className="font-ibm-mono text-[14px] text-[var(--portal-text-muted)] tracking-[1px] mb-2">{label.toUpperCase()}</p>
            <p
              className="font-grotesk text-[28px] font-normal"
              style={{ color: warning ? "var(--portal-warning)" : "var(--portal-text)" }}
            >
              {value}
            </p>
            <p className="font-ibm-mono text-[14px] text-[var(--portal-text-dim)] tracking-[0.5px] mt-1">{note}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Active Projects */}
        <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)]">
          <div className="px-6 py-4 border-b border-[var(--portal-border)] flex items-center justify-between">
            <span className="font-ibm-mono text-[14px] text-[var(--portal-text)] tracking-[2px]">ACTIVE PROJECTS</span>
            <Link href="/workspace/engagements" className="font-ibm-mono text-[14px] text-[var(--portal-accent)] tracking-[1px] hover:opacity-80">
              VIEW ALL →
            </Link>
          </div>
          <div className="p-4 flex flex-col gap-3">
            {engagementCards.map((eng) => {
              const color = pillarColors[eng.pillar] ?? "var(--portal-text-soft)";
              return (
                <Link
                  key={eng.id}
                  href="/workspace/engagements"
                  className="block p-4 border border-[var(--portal-border)] hover:border-[var(--portal-border-strong)] transition-colors bg-[var(--portal-bg)]"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="font-ibm-mono text-[14px] tracking-[2px] px-2 py-1"
                      style={{ background: `${color}20`, color }}
                    >
                      {eng.pillar}
                    </span>
                    <span className="font-ibm-mono text-[14px] text-[var(--portal-text-muted)] tracking-[1px]">
                      {eng.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="font-grotesk text-[15px] font-normal text-[var(--portal-text)]">{eng.title}</p>
                </Link>
              );
            })}
            {engagementCards.length === 0 && (
              <div className="p-4 border border-dashed border-[var(--portal-border)]">
                <p className="font-ibm-mono text-[14px] text-[var(--portal-text-soft)]">No active projects yet.</p>
                <p className="mt-1 font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">
                  Projects appear here when your Vazgro team creates them.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right column: recent deliverables + recent requests */}
        <div className="flex flex-col gap-6">
          {/* Recent deliverables */}
          <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)]">
            <div className="px-6 py-4 border-b border-[var(--portal-border)] flex items-center justify-between">
              <span className="font-ibm-mono text-[14px] text-[var(--portal-text)] tracking-[2px]">RECENT DELIVERABLES</span>
              <Link href="/workspace/files" className="font-ibm-mono text-[14px] text-[var(--portal-accent)] tracking-[1px] hover:opacity-80">
                VIEW ALL →
              </Link>
            </div>
            <div className="divide-y divide-[var(--portal-border)]">
              {recentDeliverables.map((d) => {
                const isApproved = !!d.approved_at;
                const isAwaiting = d.requires_approval && !d.approved_at;
                return (
                  <div key={d.id} className="px-6 py-3 flex items-center justify-between">
                    <div>
                      <p className="font-ibm-mono text-[14px] text-[var(--portal-text-muted)]">{d.name}</p>
                      <p className="font-ibm-mono text-[14px] text-[var(--portal-text-dim)] mt-0.5">
                        {d.file_type || "File"} · {new Date(d.created_at).toLocaleDateString("en-GB")}
                      </p>
                    </div>
                    <span
                      className="font-ibm-mono text-[14px] tracking-[1px] px-2 py-1"
                      style={{
                        background: isApproved ? "var(--portal-accent-strong-soft)" : isAwaiting ? "var(--portal-warning-strong-soft)" : "var(--portal-muted-soft)",
                        color: isApproved ? "var(--portal-accent)" : isAwaiting ? "var(--portal-warning)" : "var(--portal-text-soft)",
                      }}
                    >
                      {isApproved ? "APPROVED" : isAwaiting ? "REVIEW" : "UPLOADED"}
                    </span>
                  </div>
                );
              })}
              {recentDeliverables.length === 0 && (
                <div className="px-6 py-6">
                  <p className="font-ibm-mono text-[14px] text-[var(--portal-text-soft)]">No deliverables yet.</p>
                  <p className="mt-1 font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">Files uploaded by your team will appear here.</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent requests */}
          <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)]">
            <div className="px-6 py-4 border-b border-[var(--portal-border)] flex items-center justify-between">
              <span className="font-ibm-mono text-[14px] text-[var(--portal-text)] tracking-[2px]">RECENT REQUESTS</span>
              <Link href="/workspace/requests" className="font-ibm-mono text-[14px] text-[var(--portal-accent)] tracking-[1px] hover:opacity-80">
                VIEW ALL →
              </Link>
            </div>
            <div className="divide-y divide-[var(--portal-border)]">
              {recentRequests.map((r) => {
                const badge = statusBadge[r.status as keyof typeof statusBadge] ?? {
                  bg: "var(--portal-muted-soft)",
                  text: "var(--portal-text-soft)",
                  label: r.status,
                };
                return (
                  <div key={r.id} className="px-6 py-3 flex items-center justify-between">
                    <div>
                      <p className="font-ibm-mono text-[14px] text-[var(--portal-text-muted)]">{r.title}</p>
                      <p className="font-ibm-mono text-[14px] text-[var(--portal-text-dim)] mt-0.5">
                        {r.id.slice(0, 8)} · {new Date(r.created_at).toLocaleDateString("en-GB")}
                      </p>
                    </div>
                    <span
                      className="font-ibm-mono text-[14px] tracking-[1px] px-2 py-1"
                      style={{ background: badge.bg, color: badge.text }}
                    >
                      {badge.label.toUpperCase()}
                    </span>
                  </div>
                );
              })}
              {recentRequests.length === 0 && (
                <div className="px-6 py-6">
                  <p className="font-ibm-mono text-[14px] text-[var(--portal-text-soft)]">No requests yet.</p>
                  <p className="mt-1 font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">
                    <Link href="/workspace/requests" className="text-[var(--portal-accent)] hover:underline">
                      Raise your first request →
                    </Link>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </WorkspaceDashboardShell>
  );
}
