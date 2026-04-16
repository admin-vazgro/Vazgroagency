import {
  requireWorkspaceAccess,
  getWorkspaceAdminClient,
  firstParam,
  type WorkspaceSearchParams,
} from "@/app/workspace/lib";
import RequestsBoard from "./RequestsBoard";

type RequestRow = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  created_at: string;
  engagement_id: string | null;
};

type EngagementOption = {
  id: string;
  title: string;
  pillar: string;
};

export default async function RequestsPage(props: {
  searchParams?: Promise<WorkspaceSearchParams>;
}) {
  const { user } = await requireWorkspaceAccess();
  const admin = getWorkspaceAdminClient();

  const searchParams = props.searchParams ? await props.searchParams : {};
  const statusMessage = firstParam(searchParams.status);
  const errorMessage = firstParam(searchParams.error);
  const projectFilter = firstParam(searchParams.project);

  const { data: membership } = await admin
    .from("account_members")
    .select("account_id")
    .eq("profile_id", user.id)
    .maybeSingle();

  const accountId = membership?.account_id ?? null;

  let requests: RequestRow[] = [];
  let engagements: EngagementOption[] = [];
  let dataError = "";

  if (accountId) {
    try {
      const { data: engData, error: engError } = await admin
        .from("engagements")
        .select("id, title, pillar")
        .eq("account_id", accountId)
        .in("status", ["active", "paused"])
        .order("title");

      if (engError) throw engError;
      engagements = (engData ?? []) as EngagementOption[];

      const engIds = engagements.map((e) => e.id);

      if (engIds.length) {
        const { data: reqData, error: reqError } = await admin
          .from("requests")
          .select("id, title, description, status, priority, created_at, engagement_id")
          .in("engagement_id", engIds)
          .order("created_at", { ascending: false });

        if (reqError) throw reqError;
        requests = (reqData ?? []) as RequestRow[];
      }
    } catch (err) {
      dataError = err instanceof Error ? err.message : "Unable to load requests.";
    }
  }

  const openCount = requests.filter((r) =>
    ["submitted", "in_review", "in_progress", "delivered"].includes(r.status)
  ).length;

  return (
    <div className="p-8">
      <div className="mb-8 flex items-end justify-between border-b border-[var(--portal-border)] pb-6">
        <div>
          <span className="font-ibm-mono text-[14px] tracking-[3px] text-[var(--portal-accent)]">// REQUESTS</span>
          <h1 className="mt-1 font-grotesk text-[32px] font-normal tracking-[-1px] text-[var(--portal-text)]">Requests</h1>
          <p className="mt-1 font-ibm-mono text-[14px] tracking-[0.5px] text-[var(--portal-text-soft)]">
            {requests.length} total · {openCount} in progress
          </p>
        </div>
      </div>

      {dataError && (
        <div className="mb-6 border border-[var(--portal-warning)] bg-[var(--portal-warning-soft)] px-4 py-3">
          <p className="font-ibm-mono text-[14px] text-[var(--portal-warning)]">{dataError}</p>
        </div>
      )}

      {!accountId && !dataError && (
        <div className="border border-dashed border-[var(--portal-border-strong)] p-8">
          <p className="font-ibm-mono text-[14px] text-[var(--portal-text-soft)]">No account linked yet.</p>
          <p className="mt-2 font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">
            Your Vazgro team will link your account and you'll be able to submit requests.
          </p>
        </div>
      )}

      {(accountId || dataError) && (
        <RequestsBoard
          initialRequests={requests}
          engagements={engagements}
          statusMessage={statusMessage}
          errorMessage={errorMessage}
          projectFilter={projectFilter}
        />
      )}
    </div>
  );
}
