import {
  requireWorkspaceAccess,
  getWorkspaceAdminClient,
  firstParam,
  type WorkspaceSearchParams,
} from "@/app/workspace/lib";
import DeliverableActions from "./DeliverableActions";

type DeliverableRow = {
  id: string;
  name: string;
  file_url: string | null;
  file_type: string | null;
  requires_approval: boolean;
  approved_at: string | null;
  sign_off_notes: string | null;
  created_at: string;
  engagement_id: string | null;
  request_id: string | null;
  uploaded_by: string | null;
};

function deliverableStatus(d: DeliverableRow): "awaiting" | "approved" | "uploaded" {
  if (d.approved_at) return "approved";
  if (d.requires_approval) return "awaiting";
  return "uploaded";
}

const statusLabels = {
  awaiting: "AWAITING APPROVAL",
  approved: "APPROVED",
  uploaded: "UPLOADED",
};

const statusColors = {
  awaiting: { bg: "var(--portal-warning-strong-soft)", text: "var(--portal-warning)" },
  approved: { bg: "var(--portal-accent-strong-soft)", text: "var(--portal-accent)" },
  uploaded: { bg: "var(--portal-muted-soft)", text: "var(--portal-text-soft)" },
};

export default async function BrandHubPage(props: {
  searchParams?: Promise<WorkspaceSearchParams>;
}) {
  const { user } = await requireWorkspaceAccess();
  const admin = getWorkspaceAdminClient();

  const searchParams = props.searchParams ? await props.searchParams : {};
  const statusFilter = firstParam(searchParams.filter) || "all";
  const statusMessage = firstParam(searchParams.status);
  const errorMessage = firstParam(searchParams.error);

  const { data: membership } = await admin
    .from("account_members")
    .select("account_id")
    .eq("profile_id", user.id)
    .maybeSingle();

  const accountId = membership?.account_id ?? null;

  let deliverables: DeliverableRow[] = [];
  let engagementTitles = new Map<string, string>();
  let dataError = "";

  if (accountId) {
    try {
      const { data: engData } = await admin
        .from("engagements")
        .select("id, title")
        .eq("account_id", accountId);

      const engIds = (engData ?? []).map((e: { id: string; title: string }) => e.id);
      engagementTitles = new Map((engData ?? []).map((e: { id: string; title: string }) => [e.id, e.title]));

      if (engIds.length) {
        const { data: delData, error: delError } = await admin
          .from("deliverables")
          .select(
            "id, name, file_url, file_type, requires_approval, approved_at, sign_off_notes, created_at, engagement_id, request_id, uploaded_by"
          )
          .in("engagement_id", engIds)
          .order("created_at", { ascending: false });

        if (delError) throw delError;
        deliverables = (delData ?? []) as DeliverableRow[];
      }
    } catch (err) {
      dataError = err instanceof Error ? err.message : "Unable to load deliverables.";
    }
  }

  const filtered = deliverables.filter((d) => {
    if (statusFilter === "awaiting") return deliverableStatus(d) === "awaiting";
    if (statusFilter === "approved") return deliverableStatus(d) === "approved";
    return true;
  });

  const awaitingCount = deliverables.filter((d) => deliverableStatus(d) === "awaiting").length;

  return (
    <div className="p-8">
      <div className="mb-8 flex items-end justify-between border-b border-[var(--portal-border)] pb-6">
        <div>
          <span className="font-ibm-mono text-[10px] tracking-[3px] text-[var(--portal-accent)]">// BRAND HUB</span>
          <h1 className="mt-1 font-grotesk text-[32px] font-normal tracking-[-1px] text-[var(--portal-text)]">
            Deliverables
          </h1>
          <p className="mt-1 font-ibm-mono text-[12px] tracking-[0.5px] text-[var(--portal-text-soft)]">
            {deliverables.length} files · {awaitingCount} awaiting approval
          </p>
        </div>
      </div>

      {statusMessage && (
        <div className="mb-6 border border-[var(--portal-accent)] bg-[var(--portal-accent-soft)] px-4 py-3">
          <p className="font-ibm-mono text-[11px] text-[var(--portal-accent)]">{statusMessage}</p>
        </div>
      )}
      {(errorMessage || dataError) && (
        <div className="mb-6 border border-[var(--portal-warning)] bg-[var(--portal-warning-soft)] px-4 py-3">
          <p className="font-ibm-mono text-[11px] text-[var(--portal-warning)]">{errorMessage || dataError}</p>
        </div>
      )}

      {awaitingCount > 0 && (
        <div className="mb-6 border border-[var(--portal-warning)] bg-[var(--portal-warning-soft)] px-5 py-4 flex items-center justify-between">
          <div>
            <p className="font-ibm-mono text-[11px] tracking-[1px] text-[var(--portal-warning)]">ACTION REQUIRED</p>
            <p className="mt-1 font-ibm-mono text-[12px] text-[var(--portal-text-muted)]">
              {awaitingCount} deliverable{awaitingCount !== 1 ? "s" : ""} awaiting your approval.
            </p>
          </div>
          <a
            href="?filter=awaiting"
            className="font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-warning)] hover:opacity-80 transition-opacity"
          >
            REVIEW NOW →
          </a>
        </div>
      )}

      {/* Filter tabs */}
      <div className="mb-6 flex gap-1">
        {[
          { key: "all", label: "All" },
          { key: "awaiting", label: `Awaiting Approval${awaitingCount > 0 ? ` (${awaitingCount})` : ""}` },
          { key: "approved", label: "Approved" },
        ].map(({ key, label }) => (
          <a
            key={key}
            href={`?filter=${key}`}
            className="px-4 py-2 font-ibm-mono text-[10px] tracking-[1px] transition-colors"
            style={{
              background: statusFilter === key ? "var(--portal-accent)" : "var(--portal-surface-alt)",
              color: statusFilter === key ? "var(--portal-accent-contrast)" : "var(--portal-text-muted)",
              borderBottom: statusFilter === key ? "2px solid var(--portal-accent)" : "2px solid transparent",
            }}
          >
            {label}
          </a>
        ))}
      </div>

      {!accountId && !dataError && (
        <div className="border border-dashed border-[var(--portal-border-strong)] p-8">
          <p className="font-ibm-mono text-[11px] text-[var(--portal-text-soft)]">No account linked yet.</p>
          <p className="mt-2 font-ibm-mono text-[10px] text-[var(--portal-text-dim)]">
            Deliverables from your Vazgro team will appear here once your account is set up.
          </p>
        </div>
      )}

      {/* Deliverables table */}
      {accountId && (
        <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)]">
          <div className="grid grid-cols-[1fr_100px_120px_100px_120px] gap-4 border-b border-[var(--portal-border)] px-5 py-3">
            {["Name", "Type", "Project", "Uploaded", "Status"].map((h) => (
              <span key={h} className="font-ibm-mono text-[9px] tracking-[2px] text-[var(--portal-text-dim)]">{h}</span>
            ))}
          </div>

          {filtered.map((d) => {
            const status = deliverableStatus(d);
            const sc = statusColors[status];
            const engTitle = d.engagement_id ? engagementTitles.get(d.engagement_id) : null;

            return (
              <div
                key={d.id}
                className="grid grid-cols-[1fr_100px_120px_100px_120px] gap-4 border-b border-[var(--portal-border)] px-5 py-4 transition-colors hover:bg-[var(--portal-surface-alt)] items-center"
              >
                <div>
                  <p className="font-ibm-mono text-[11px] text-[var(--portal-text)]">{d.name}</p>
                  {d.file_url && (
                    <a
                      href={d.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-0.5 font-ibm-mono text-[10px] text-[var(--portal-accent)] hover:opacity-80 transition-opacity"
                    >
                      Download ↓
                    </a>
                  )}
                </div>
                <span className="font-ibm-mono text-[10px] text-[var(--portal-text-soft)]">
                  {d.file_type || "—"}
                </span>
                <span className="truncate font-ibm-mono text-[10px] text-[var(--portal-text-soft)]">
                  {engTitle || "—"}
                </span>
                <span className="font-ibm-mono text-[10px] text-[var(--portal-text-muted)]">
                  {new Date(d.created_at).toLocaleDateString("en-GB")}
                </span>
                <div className="flex flex-col gap-1.5">
                  <span
                    className="w-fit px-2 py-1 font-ibm-mono text-[9px] tracking-[1px]"
                    style={{ background: sc.bg, color: sc.text }}
                  >
                    {statusLabels[status]}
                  </span>
                  {status === "awaiting" && (
                    <DeliverableActions deliverableId={d.id} />
                  )}
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="px-5 py-12">
              <p className="font-ibm-mono text-[11px] text-[var(--portal-text-soft)]">
                {statusFilter === "awaiting" ? "Nothing awaiting your approval." : "No deliverables yet."}
              </p>
              <p className="mt-2 font-ibm-mono text-[10px] text-[var(--portal-text-dim)]">
                Files uploaded by your Vazgro team will appear here.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
