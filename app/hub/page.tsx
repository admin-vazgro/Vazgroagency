import Link from "next/link";
import { getHubAdminClient, requireHubAccess } from "./lib";

type RecentLead = {
  id: string;
  first_name: string;
  last_name: string | null;
  company: string | null;
  pillar: "LAUNCH" | "GROW" | "BUILD" | null;
  stage: string;
  source: string | null;
  created_at: string;
};

const pillarColors: Record<string, string> = {
  LAUNCH: "var(--portal-accent)",
  GROW: "var(--portal-warning)",
  BUILD: "var(--portal-text-soft)",
};

function formatStage(stage: string) {
  return stage.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function daysSince(iso: string) {
  return Math.floor((Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24));
}

export default async function HubDashboard() {
  await requireHubAccess();

  const formattedDate = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  let activeLeads = 0;
  let activeEngagements = 0;
  let recentLeads: RecentLead[] = [];
  let recentActivity: Array<{ text: string; time: string }> = [];

  try {
    const admin = getHubAdminClient();
    const [leadsResult, engagementsResult] = await Promise.all([
      admin
        .from("leads")
        .select("id, first_name, last_name, company, pillar, stage, source, created_at")
        .order("created_at", { ascending: false }),
      admin.from("engagements").select("id, status"),
    ]);

    if (leadsResult.data) {
      const all = leadsResult.data as RecentLead[];
      activeLeads = all.filter(
        (l) => !["closed_won", "closed_lost"].includes(l.stage)
      ).length;
      recentLeads = all.slice(0, 6);

      recentActivity = all.slice(0, 8).map((l) => ({
        text: `Lead added: ${l.first_name}${l.company ? ` · ${l.company}` : ""}`,
        time: new Date(l.created_at).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));
    }

    if (engagementsResult.data) {
      activeEngagements = (engagementsResult.data as { status: string }[]).filter(
        (e) => e.status === "active"
      ).length;
    }
  } catch {
    // DB unavailable — show zeros, don't crash
  }

  const stats = [
    {
      label: "Active Leads",
      value: String(activeLeads),
      delta: activeLeads === 0 ? "No active leads yet" : `${activeLeads} in pipeline`,
      color: "var(--portal-accent)",
    },
    {
      label: "Open Deals",
      value: "0",
      delta: "No live deal data yet",
      color: "var(--portal-accent)",
    },
    {
      label: "Active Engagements",
      value: String(activeEngagements),
      delta: activeEngagements === 0 ? "No active engagements yet" : `${activeEngagements} running`,
      color: "var(--portal-accent)",
    },
    {
      label: "Commissions Pending",
      value: "£0",
      delta: "No pending commissions",
      color: "var(--portal-warning)",
    },
    {
      label: "Unread Messages",
      value: "0",
      delta: "No unread messages",
      color: "var(--portal-warning)",
    },
    {
      label: "SLA Breaches",
      value: "0",
      delta: "No SLA activity yet",
      color: "var(--portal-accent)",
    },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 border-b border-[var(--portal-border)] pb-6">
        <span className="font-ibm-mono text-[14px] text-[var(--portal-accent)] tracking-[3px]">// INTERNAL HUB</span>
        <h1 className="font-grotesk text-[32px] font-bold text-[var(--portal-text)] tracking-[-1px] mt-1">Command Centre</h1>
        <p className="font-ibm-mono text-[14px] text-[var(--portal-text-soft)] tracking-[0.5px] mt-1">{formattedDate}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {stats.map(({ label, value, delta, color }) => (
          <div key={label} className="border border-[var(--portal-border)] bg-[var(--portal-surface)] p-5">
            <p className="font-ibm-mono text-[14px] text-[var(--portal-text-muted)] tracking-[1px] mb-2">{label.toUpperCase()}</p>
            <p className="font-grotesk text-[28px] font-bold" style={{ color }}>{value}</p>
            <p className="font-ibm-mono text-[14px] text-[var(--portal-text-dim)] mt-1">{delta}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-[1fr_320px] gap-6">
        {/* Left — recent leads */}
        <div>
          <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)] mb-6">
            <div className="px-6 py-4 border-b border-[var(--portal-border)] flex items-center justify-between">
              <span className="font-ibm-mono text-[14px] text-[var(--portal-text)] tracking-[2px]">RECENT LEADS</span>
              <Link href="/hub/leads" className="font-ibm-mono text-[14px] text-[var(--portal-accent)] tracking-[1px] hover:opacity-80">VIEW ALL →</Link>
            </div>
            <div>
              <div className="grid grid-cols-[80px_1fr_80px_120px_100px_60px] gap-4 px-5 py-3 border-b border-[var(--portal-border)]">
                {["ID", "Company", "Pillar", "Stage", "Source", "Days"].map((h) => (
                  <span key={h} className="font-ibm-mono text-[14px] text-[var(--portal-text-dim)] tracking-[2px]">{h}</span>
                ))}
              </div>
              {recentLeads.length ? recentLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="grid grid-cols-[80px_1fr_80px_120px_100px_60px] gap-4 px-5 py-3.5 border-b border-[var(--portal-border)]"
                >
                  <span className="font-ibm-mono text-[14px] text-[var(--portal-text-soft)]">{lead.id.slice(0, 8)}</span>
                  <div>
                    <p className="font-ibm-mono text-[14px] text-[var(--portal-text-muted)] font-bold">{lead.company || "—"}</p>
                    <p className="font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">
                      {[lead.first_name, lead.last_name].filter(Boolean).join(" ")}
                    </p>
                  </div>
                  <span
                    className="font-ibm-mono text-[14px]"
                    style={{ color: lead.pillar ? pillarColors[lead.pillar] : "var(--portal-text-muted)" }}
                  >
                    {lead.pillar || "—"}
                  </span>
                  <span className="font-ibm-mono text-[14px] text-[var(--portal-text-soft)]">{formatStage(lead.stage)}</span>
                  <span className="font-ibm-mono text-[14px] text-[var(--portal-text-muted)]">{lead.source || "—"}</span>
                  <span className="font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">{daysSince(lead.created_at)}d</span>
                </div>
              )) : (
                <div className="px-5 py-12">
                  <p className="font-ibm-mono text-[14px] text-[var(--portal-text-soft)]">No lead data yet.</p>
                  <p className="font-ibm-mono text-[14px] text-[var(--portal-text-dim)] mt-2">Leads will appear here once they exist in the system.</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick links */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "New Lead", href: "/hub/leads?new=1", desc: "Add to pipeline" },
              { label: "New Engagement", href: "/hub/engagements?new=1", desc: "Kick off a project" },
              { label: "New Account", href: "/hub/accounts?new=1", desc: "Onboard a client" },
            ].map(({ label, href, desc }) => (
              <Link
                key={label}
                href={href}
                className="border border-[var(--portal-border)] bg-[var(--portal-surface)] p-4 hover:border-[var(--portal-accent)] transition-colors group"
              >
                <p className="font-ibm-mono text-[14px] text-[var(--portal-text-muted)] group-hover:text-[var(--portal-accent)] transition-colors">+ {label}</p>
                <p className="font-ibm-mono text-[14px] text-[var(--portal-text-dim)] mt-1">{desc}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Right — activity feed */}
        <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)]">
          <div className="px-5 py-4 border-b border-[var(--portal-border)]">
            <span className="font-ibm-mono text-[14px] text-[var(--portal-text)] tracking-[2px]">RECENT ACTIVITY</span>
          </div>
          <div className="divide-y divide-[var(--portal-border)]">
            {recentActivity.length ? recentActivity.map((a, i) => (
              <div key={i} className="px-5 py-3.5">
                <p className="font-ibm-mono text-[14px] text-[var(--portal-text-muted)] leading-[1.5]">{a.text}</p>
                <p className="font-ibm-mono text-[14px] text-[var(--portal-text-faint)] mt-1">{a.time}</p>
              </div>
            )) : (
              <div className="px-5 py-12">
                <p className="font-ibm-mono text-[14px] text-[var(--portal-text-soft)]">No activity recorded yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
