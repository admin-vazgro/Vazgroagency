import Link from "next/link";
import { requireHubAccess, getHubAdminClient } from "@/app/hub/lib";

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

function daysSince(date: string | null) {
  if (!date) return 0;
  return Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
}

function toNumber(v: unknown) {
  if (typeof v === "number") return v;
  if (typeof v === "string") return Number(v) || 0;
  return 0;
}

export default async function HubProjectsPage() {
  await requireHubAccess();
  const admin = getHubAdminClient();

  const { data: engagements } = await admin
    .from("engagements")
    .select("id, title, pillar, status, kickoff_date, monthly_value_gbp, contract_value_gbp, pm_id, account_id, created_at")
    .in("status", ["active", "paused"])
    .order("created_at", { ascending: false });

  const engList = engagements ?? [];

  // Load accounts and PMs
  const accountIds = [...new Set(engList.map((e: { account_id: string | null }) => e.account_id).filter(Boolean))];
  const pmIds = [...new Set(engList.map((e: { pm_id: string | null }) => e.pm_id).filter(Boolean))];

  const [accountsResult, pmsResult] = await Promise.all([
    accountIds.length ? admin.from("accounts").select("id, name").in("id", accountIds) : { data: [] },
    pmIds.length ? admin.from("profiles").select("id, first_name, last_name, email").in("id", pmIds) : { data: [] },
  ]);

  const accountById = new Map((accountsResult.data ?? []).map((a: { id: string; name: string }) => [a.id, a]));
  const pmById = new Map((pmsResult.data ?? []).map((p: { id: string; first_name: string | null; last_name: string | null; email: string }) => [p.id, p]));

  return (
    <div className="p-8">
      <div className="mb-8 border-b border-[var(--portal-border)] pb-6">
        <span className="font-ibm-mono text-[10px] tracking-[3px] text-[var(--portal-accent)]">// DELIVERY</span>
        <h1 className="mt-1 font-grotesk text-[32px] font-normal tracking-[-1px] text-[var(--portal-text)]">Projects</h1>
        <p className="mt-1 font-ibm-mono text-[12px] tracking-[0.5px] text-[var(--portal-text-soft)]">
          {engList.length} active project{engList.length !== 1 ? "s" : ""}. Click a project to open the workspace.
        </p>
      </div>

      {engList.length === 0 ? (
        <div className="border border-dashed border-[var(--portal-border-strong)] p-12 text-center">
          <p className="font-ibm-mono text-[11px] text-[var(--portal-text-soft)]">No active projects yet.</p>
          <p className="mt-2 font-ibm-mono text-[10px] text-[var(--portal-text-dim)]">Projects appear here when engagements are created.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-3">
          {engList.map((eng: { id: string; title: string; pillar: string; status: string; kickoff_date: string | null; monthly_value_gbp: number | null; contract_value_gbp: number | null; pm_id: string | null; account_id: string | null; created_at: string }) => {
            const account = eng.account_id ? accountById.get(eng.account_id) : null;
            const pm = eng.pm_id ? pmById.get(eng.pm_id) : null;
            const pmName = pm ? [pm.first_name, pm.last_name].filter(Boolean).join(" ") || pm.email : "Unassigned";
            const value = eng.pillar === "GROW" ? toNumber(eng.monthly_value_gbp) : toNumber(eng.contract_value_gbp);
            const days = daysSince(eng.kickoff_date || eng.created_at);

            return (
              <Link
                key={eng.id}
                href={`/hub/projects/${eng.id}`}
                className="border border-[var(--portal-border)] bg-[var(--portal-surface)] p-5 block hover:border-[var(--portal-accent)] transition-colors"
              >
                <div className="mb-3 flex items-start justify-between gap-2">
                  <span className="font-ibm-mono text-[10px] tracking-[2px]" style={{ color: pillarColors[eng.pillar] }}>{eng.pillar}</span>
                  <span
                    className="px-2 py-0.5 font-ibm-mono text-[9px] tracking-[1px]"
                    style={{ background: statusColors[eng.status]?.bg ?? "var(--portal-muted-soft)", color: statusColors[eng.status]?.text ?? "var(--portal-text-soft)" }}
                  >
                    {eng.status.toUpperCase()}
                  </span>
                </div>
                <p className="font-grotesk text-[16px] font-normal text-[var(--portal-text)] leading-tight">{eng.title}</p>
                <p className="mt-1 font-ibm-mono text-[10px] text-[var(--portal-text-soft)]">{account?.name ?? "—"}</p>
                <div className="mt-4 flex items-center justify-between border-t border-[var(--portal-border)] pt-3">
                  <div>
                    <p className="font-ibm-mono text-[9px] text-[var(--portal-text-dim)]">PM</p>
                    <p className="mt-0.5 font-ibm-mono text-[10px] text-[var(--portal-text-muted)]">{pmName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-ibm-mono text-[9px] text-[var(--portal-text-dim)]">VALUE</p>
                    <p className="mt-0.5 font-grotesk text-[14px] font-normal text-[var(--portal-accent)]">
                      £{value.toLocaleString()}{eng.pillar === "GROW" ? "/mo" : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-ibm-mono text-[9px] text-[var(--portal-text-dim)]">DAYS</p>
                    <p className="mt-0.5 font-ibm-mono text-[11px] text-[var(--portal-text-muted)]">{days}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
