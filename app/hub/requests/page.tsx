import Link from "next/link";
import { updateRequestStatusAction } from "@/app/hub/actions";
import { firstParam, getHubAdminClient, requireHubAccess, type HubSearchParams } from "@/app/hub/lib";

type RequestRow = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  revision_notes: string | null;
  delivered_at: string | null;
  approved_at: string | null;
  created_at: string;
  engagement_id: string | null;
  account_id: string | null;
  submitted_by: string | null;
  assigned_to: string | null;
};

type EngagementRef = { id: string; title: string; pillar: string };
type AccountRef = { id: string; name: string };
type ProfileRef = { id: string; first_name: string | null; last_name: string | null; email: string };

const STATUS_ORDER = ["submitted", "in_review", "in_progress", "delivered", "revision_requested", "approved"];
const STATUS_COLORS: Record<string, string> = {
  submitted: "var(--portal-text-soft)",
  in_review: "var(--portal-warning)",
  in_progress: "var(--portal-accent)",
  delivered: "var(--portal-text)",
  revision_requested: "var(--portal-warning)",
  approved: "var(--portal-accent)",
};
const PRIORITY_COLORS: Record<string, string> = {
  low: "var(--portal-text-dim)",
  normal: "var(--portal-text-soft)",
  high: "var(--portal-warning)",
  urgent: "var(--portal-warning)",
};

function formatStatus(s: string) {
  return s.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function displayName(p: ProfileRef | null | undefined) {
  if (!p) return "Unassigned";
  return [p.first_name, p.last_name].filter(Boolean).join(" ") || p.email;
}

export default async function HubRequestsPage(props: {
  searchParams?: Promise<HubSearchParams>;
}) {
  await requireHubAccess();

  const searchParams = props.searchParams ? await props.searchParams : {};
  const statusFilter = firstParam(searchParams.status) || "all";
  const selectedId = firstParam(searchParams.request);
  const statusMessage = firstParam(searchParams.status_msg) || firstParam(searchParams.status);
  const errorMessage = firstParam(searchParams.error);

  const admin = getHubAdminClient();
  let requests: RequestRow[] = [];
  let engagements: EngagementRef[] = [];
  let accounts: AccountRef[] = [];
  let profiles: ProfileRef[] = [];
  let dataError = "";

  try {
    const [reqResult, engResult, accResult, profileResult] = await Promise.all([
      admin
        .from("requests")
        .select("id, title, description, status, priority, revision_notes, delivered_at, approved_at, created_at, engagement_id, account_id, submitted_by, assigned_to")
        .order("created_at", { ascending: false }),
      admin.from("engagements").select("id, title, pillar"),
      admin.from("accounts").select("id, name"),
      admin.from("profiles").select("id, first_name, last_name, email").in("role", ["delivery", "ops", "admin", "sales_manager", "internal_sales"]),
    ]);

    if (reqResult.error) throw reqResult.error;
    requests = (reqResult.data ?? []) as RequestRow[];
    engagements = (engResult.data ?? []) as EngagementRef[];
    accounts = (accResult.data ?? []) as AccountRef[];
    profiles = (profileResult.data ?? []) as ProfileRef[];
  } catch (err) {
    dataError = err instanceof Error ? err.message : "Unable to load requests.";
  }

  const engMap = new Map(engagements.map((e) => [e.id, e]));
  const accMap = new Map(accounts.map((a) => [a.id, a]));
  const profileMap = new Map(profiles.map((p) => [p.id, p]));

  const filtered =
    statusFilter === "all" ? requests : requests.filter((r) => r.status === statusFilter);
  const selectedRequest = filtered.find((r) => r.id === selectedId) ?? filtered[0] ?? null;

  const openCount = requests.filter((r) => !["approved"].includes(r.status)).length;
  const urgentCount = requests.filter((r) => r.priority === "urgent" && r.status !== "approved").length;

  const inputClass =
    "w-full border border-[var(--portal-border-strong)] bg-[var(--portal-bg)] px-3 py-2 font-ibm-mono text-[11px] text-[var(--portal-text)] focus:border-[var(--portal-accent)] focus:outline-none";

  return (
    <div className="p-8">
      <div className="mb-8 border-b border-[var(--portal-border)] pb-6">
        <span className="font-ibm-mono text-[10px] tracking-[3px] text-[var(--portal-accent)]">// REQUESTS</span>
        <h1 className="mt-1 font-grotesk text-[32px] font-normal tracking-[-1px] text-[var(--portal-text)]">
          Client Requests
        </h1>
        <p className="mt-1 font-ibm-mono text-[12px] tracking-[0.5px] text-[var(--portal-text-soft)]">
          {requests.length} total · {openCount} open{urgentCount > 0 ? ` · ${urgentCount} urgent` : ""}
        </p>
      </div>

      {statusMessage && !errorMessage && (
        <div className="mb-6 border border-[var(--portal-accent)] bg-[var(--portal-accent-soft)] px-4 py-3">
          <p className="font-ibm-mono text-[11px] text-[var(--portal-accent)]">{statusMessage}</p>
        </div>
      )}
      {errorMessage && (
        <div className="mb-6 border border-[var(--portal-warning)] bg-[var(--portal-warning-soft)] px-4 py-3">
          <p className="font-ibm-mono text-[11px] text-[var(--portal-warning)]">{errorMessage}</p>
        </div>
      )}
      {dataError && (
        <div className="mb-6 border border-[var(--portal-warning)] bg-[var(--portal-warning-soft)] px-4 py-3">
          <p className="font-ibm-mono text-[11px] text-[var(--portal-warning)]">{dataError}</p>
        </div>
      )}

      {/* Status filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        {["all", ...STATUS_ORDER].map((s) => {
          const isActive = statusFilter === s;
          const count = s === "all" ? requests.length : requests.filter((r) => r.status === s).length;
          return (
            <Link
              key={s}
              href={`/hub/requests?status=${s}`}
              className="px-3 py-1.5 font-ibm-mono text-[10px] tracking-[1px] border transition-colors"
              style={{
                borderColor: isActive ? "var(--portal-accent)" : "var(--portal-border)",
                background: isActive ? "var(--portal-accent-soft)" : "var(--portal-surface)",
                color: isActive ? "var(--portal-accent)" : "var(--portal-text-muted)",
              }}
            >
              {s === "all" ? "ALL" : formatStatus(s)} ({count})
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 && !dataError ? (
        <div className="border border-dashed border-[var(--portal-border-strong)] p-8">
          <p className="font-ibm-mono text-[11px] text-[var(--portal-text-soft)]">No requests in this view.</p>
          <p className="mt-2 font-ibm-mono text-[10px] text-[var(--portal-text-dim)]">
            Requests are submitted by clients from their workspace portal.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_400px]">
          {/* Request list */}
          <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)]">
            <div className="grid grid-cols-[1.5fr_1fr_80px_90px_80px] gap-3 border-b border-[var(--portal-border)] px-5 py-3">
              {["REQUEST", "CLIENT / ENGAGEMENT", "PRIORITY", "STATUS", ""].map((h) => (
                <span key={h} className="font-ibm-mono text-[9px] tracking-[2px] text-[var(--portal-text-dim)]">{h}</span>
              ))}
            </div>
            {filtered.map((req) => {
              const eng = req.engagement_id ? engMap.get(req.engagement_id) : null;
              const acc = req.account_id ? accMap.get(req.account_id) : null;
              const assignee = req.assigned_to ? profileMap.get(req.assigned_to) : null;
              const isSelected = selectedRequest?.id === req.id;
              return (
                <Link
                  key={req.id}
                  href={`/hub/requests?status=${statusFilter}&request=${req.id}`}
                  className="grid grid-cols-[1.5fr_1fr_80px_90px_80px] gap-3 border-b border-[var(--portal-border)] px-5 py-4 transition-colors hover:bg-[var(--portal-surface-alt)]"
                  style={{ background: isSelected ? "var(--portal-surface-alt)" : undefined }}
                >
                  <div>
                    <p className="font-ibm-mono text-[11px] text-[var(--portal-text)] leading-[1.4]">{req.title}</p>
                    <p className="mt-0.5 font-ibm-mono text-[10px] text-[var(--portal-text-dim)]">
                      {assignee ? `→ ${displayName(assignee)}` : "Unassigned"}
                    </p>
                  </div>
                  <div>
                    <p className="font-ibm-mono text-[10px] text-[var(--portal-text-soft)]">{acc?.name ?? "—"}</p>
                    <p className="mt-0.5 font-ibm-mono text-[10px] text-[var(--portal-text-dim)]">{eng?.title ?? "—"}</p>
                  </div>
                  <span
                    className="font-ibm-mono text-[10px] self-center"
                    style={{ color: PRIORITY_COLORS[req.priority] ?? "var(--portal-text-muted)" }}
                  >
                    {req.priority.toUpperCase()}
                  </span>
                  <span
                    className="font-ibm-mono text-[10px] self-center"
                    style={{ color: STATUS_COLORS[req.status] ?? "var(--portal-text-muted)" }}
                  >
                    {formatStatus(req.status)}
                  </span>
                  <span className="font-ibm-mono text-[10px] text-[var(--portal-accent)] self-center">OPEN →</span>
                </Link>
              );
            })}
          </div>

          {/* Detail panel */}
          {selectedRequest ? (
            <div className="flex flex-col gap-4">
              <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)]">
                <div className="border-b border-[var(--portal-border)] px-5 py-4">
                  <p className="font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-text)]">REQUEST DETAIL</p>
                  <p className="mt-1 font-grotesk text-[16px] text-[var(--portal-text)] leading-[1.3]">{selectedRequest.title}</p>
                  <p className="mt-1 font-ibm-mono text-[10px] text-[var(--portal-text-dim)]">
                    {accMap.get(selectedRequest.account_id ?? "")?.name ?? "No account"} ·{" "}
                    {engMap.get(selectedRequest.engagement_id ?? "")?.title ?? "No engagement"}
                  </p>
                </div>

                <div className="px-5 py-4 grid grid-cols-2 gap-3">
                  {[
                    { label: "Status", value: formatStatus(selectedRequest.status), color: STATUS_COLORS[selectedRequest.status] },
                    { label: "Priority", value: selectedRequest.priority.toUpperCase(), color: PRIORITY_COLORS[selectedRequest.priority] },
                    { label: "Submitted", value: new Date(selectedRequest.created_at).toLocaleDateString("en-GB"), color: "var(--portal-text-muted)" },
                    { label: "Assignee", value: displayName(selectedRequest.assigned_to ? profileMap.get(selectedRequest.assigned_to) : null), color: "var(--portal-text-muted)" },
                  ].map(({ label, value, color }) => (
                    <div key={label}>
                      <p className="font-ibm-mono text-[9px] tracking-[1.5px] text-[var(--portal-text-dim)]">{label.toUpperCase()}</p>
                      <p className="mt-1 font-ibm-mono text-[11px]" style={{ color }}>{value}</p>
                    </div>
                  ))}
                </div>

                {selectedRequest.description && (
                  <div className="border-t border-[var(--portal-border)] px-5 py-4">
                    <p className="font-ibm-mono text-[9px] tracking-[2px] text-[var(--portal-text-dim)] mb-2">DESCRIPTION</p>
                    <p className="font-ibm-mono text-[11px] leading-[1.7] text-[var(--portal-text-soft)]">
                      {selectedRequest.description}
                    </p>
                  </div>
                )}

                {selectedRequest.revision_notes && (
                  <div className="border-t border-[var(--portal-warning)] bg-[var(--portal-warning-soft)] px-5 py-4">
                    <p className="font-ibm-mono text-[9px] tracking-[2px] text-[var(--portal-warning)] mb-2">REVISION NOTES</p>
                    <p className="font-ibm-mono text-[11px] leading-[1.7] text-[var(--portal-text-soft)]">
                      {selectedRequest.revision_notes}
                    </p>
                  </div>
                )}
              </div>

              {/* Update form */}
              <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)] p-5">
                <p className="font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-text)] mb-4">UPDATE REQUEST</p>
                <form action={updateRequestStatusAction} className="flex flex-col gap-3">
                  <input type="hidden" name="request_id" value={selectedRequest.id} />

                  <div>
                    <label className="mb-1.5 block font-ibm-mono text-[9px] tracking-[2px] text-[var(--portal-text-dim)]">
                      STATUS
                    </label>
                    <select name="status" defaultValue={selectedRequest.status} className={inputClass}>
                      {STATUS_ORDER.map((s) => (
                        <option key={s} value={s}>{formatStatus(s)}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block font-ibm-mono text-[9px] tracking-[2px] text-[var(--portal-text-dim)]">
                      ASSIGN TO
                    </label>
                    <select name="assigned_to" defaultValue={selectedRequest.assigned_to ?? ""} className={inputClass}>
                      <option value="">Unassigned</option>
                      {profiles.map((p) => (
                        <option key={p.id} value={p.id}>{displayName(p)}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block font-ibm-mono text-[9px] tracking-[2px] text-[var(--portal-text-dim)]">
                      REVISION NOTES (if requesting revision)
                    </label>
                    <textarea
                      name="revision_notes"
                      rows={3}
                      defaultValue={selectedRequest.revision_notes ?? ""}
                      className="w-full resize-y border border-[var(--portal-border-strong)] bg-[var(--portal-bg)] px-3 py-2 font-ibm-mono text-[11px] text-[var(--portal-text)] focus:border-[var(--portal-accent)] focus:outline-none"
                      placeholder="Describe what needs to be changed..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-[var(--portal-accent)] px-5 py-3 font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-accent-contrast)] hover:bg-[var(--portal-accent-hover)] transition-colors"
                  >
                    UPDATE REQUEST →
                  </button>
                </form>
              </div>

              {/* Client workspace link */}
              {selectedRequest.account_id && (
                <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)] px-5 py-4">
                  <p className="font-ibm-mono text-[9px] tracking-[2px] text-[var(--portal-text-dim)] mb-2">RELATED</p>
                  <Link
                    href={`/hub/engagements`}
                    className="font-ibm-mono text-[10px] text-[var(--portal-accent)] hover:opacity-80"
                  >
                    View Engagements →
                  </Link>
                </div>
              )}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
