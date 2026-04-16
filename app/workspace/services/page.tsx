import Link from "next/link";
import { requireWorkspaceAccess, getWorkspaceAdminClient } from "@/app/workspace/lib";

type EngagementRow = {
  id: string;
  title: string;
  pillar: string;
  status: string;
  monthly_value_gbp: number | string | null;
  contract_value_gbp: number | string | null;
  kickoff_date: string | null;
  end_date: string | null;
  stripe_subscription_id: string | null;
};

const pillarColors: Record<string, string> = {
  LAUNCH: "var(--portal-accent)",
  GROW: "var(--portal-warning)",
  BUILD: "var(--portal-text-soft)",
};

const pillarDescriptions: Record<string, string> = {
  LAUNCH: "Fixed-price, fast-delivery package",
  GROW: "Monthly subscription — request-based delivery",
  BUILD: "Custom project — milestone-based delivery",
};

function toNumber(v: unknown) {
  if (typeof v === "number") return v;
  if (typeof v === "string") return Number(v) || 0;
  return 0;
}

export default async function WorkspaceServicesPage() {
  const { user } = await requireWorkspaceAccess();
  const admin = getWorkspaceAdminClient();

  const { data: membership } = await admin
    .from("account_members")
    .select("account_id")
    .eq("profile_id", user.id)
    .maybeSingle();

  const accountId = membership?.account_id ?? null;

  let engagements: EngagementRow[] = [];

  if (accountId) {
    const { data } = await admin
      .from("engagements")
      .select("id, title, pillar, status, monthly_value_gbp, contract_value_gbp, kickoff_date, end_date, stripe_subscription_id")
      .eq("account_id", accountId)
      .order("created_at", { ascending: false });
    engagements = (data ?? []) as EngagementRow[];
  }

  const activeEngagements = engagements.filter((e) => e.status === "active" || e.status === "paused");
  const growPlans = activeEngagements.filter((e) => e.pillar === "GROW");
  const launchPackages = activeEngagements.filter((e) => e.pillar === "LAUNCH");
  const buildProjects = activeEngagements.filter((e) => e.pillar === "BUILD");

  const totalMrr = growPlans.reduce((s, e) => s + toNumber(e.monthly_value_gbp), 0);

  return (
    <div className="p-8">
      <div className="mb-8 border-b border-[var(--portal-border)] pb-6">
        <span className="font-ibm-mono text-[10px] tracking-[3px] text-[var(--portal-accent)]">// SERVICES & BILLING</span>
        <h1 className="mt-1 font-grotesk text-[32px] font-normal tracking-[-1px] text-[var(--portal-text)]">Your Services</h1>
        <p className="mt-1 font-ibm-mono text-[12px] tracking-[0.5px] text-[var(--portal-text-soft)]">
          {activeEngagements.length} active service{activeEngagements.length !== 1 ? "s" : ""}
          {totalMrr > 0 ? ` · £${totalMrr.toLocaleString()}/mo MRR` : ""}
        </p>
      </div>

      {!accountId ? (
        <div className="border border-dashed border-[var(--portal-border-strong)] p-12 text-center">
          <p className="font-ibm-mono text-[12px] text-[var(--portal-text-soft)]">No services yet.</p>
          <p className="mt-2 font-ibm-mono text-[11px] leading-[1.7] text-[var(--portal-text-dim)]">
            Your active services will appear here once your account is set up.
          </p>
          <Link
            href="/services"
            className="mt-6 inline-flex items-center justify-center h-[44px] px-8 bg-[var(--portal-accent)] font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-accent-contrast)]"
          >
            EXPLORE SERVICES →
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-10">

          {/* GROW Plans */}
          {growPlans.length > 0 && (
            <section>
              <h2 className="mb-4 font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-warning)]">GROW — MONTHLY SUBSCRIPTIONS</h2>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {growPlans.map((eng) => (
                  <div key={eng.id} className="border border-[var(--portal-border)] bg-[var(--portal-surface)] p-6">
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div>
                        <p className="font-grotesk text-[16px] font-normal text-[var(--portal-text)]">{eng.title}</p>
                        <p className="mt-0.5 font-ibm-mono text-[10px] text-[var(--portal-text-soft)]">{pillarDescriptions.GROW}</p>
                      </div>
                      <span
                        className="shrink-0 px-2 py-1 font-ibm-mono text-[9px] tracking-[1px]"
                        style={{
                          background: eng.status === "active" ? "var(--portal-accent-strong-soft)" : "var(--portal-warning-strong-soft)",
                          color: eng.status === "active" ? "var(--portal-accent)" : "var(--portal-warning)",
                        }}
                      >
                        {eng.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-3 border-t border-[var(--portal-border)] pt-4">
                      <div>
                        <p className="font-ibm-mono text-[9px] tracking-[1px] text-[var(--portal-text-dim)]">MRR</p>
                        <p className="mt-1 font-grotesk text-[18px] font-normal text-[var(--portal-warning)]">
                          £{toNumber(eng.monthly_value_gbp).toLocaleString()}<span className="font-ibm-mono text-[10px] text-[var(--portal-text-dim)]">/mo</span>
                        </p>
                      </div>
                      <div>
                        <p className="font-ibm-mono text-[9px] tracking-[1px] text-[var(--portal-text-dim)]">STARTED</p>
                        <p className="mt-1 font-ibm-mono text-[10px] text-[var(--portal-text-muted)]">
                          {eng.kickoff_date ? new Date(eng.kickoff_date).toLocaleDateString("en-GB") : "—"}
                        </p>
                      </div>
                      <div>
                        <p className="font-ibm-mono text-[9px] tracking-[1px] text-[var(--portal-text-dim)]">BILLING</p>
                        <p className="mt-1 font-ibm-mono text-[10px] text-[var(--portal-text-muted)]">Monthly</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* LAUNCH Packages */}
          {launchPackages.length > 0 && (
            <section>
              <h2 className="mb-4 font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-accent)]">LAUNCH — ONE-OFF PACKAGES</h2>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {launchPackages.map((eng) => (
                  <div key={eng.id} className="border border-[var(--portal-border)] bg-[var(--portal-surface)] p-6">
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div>
                        <p className="font-grotesk text-[16px] font-normal text-[var(--portal-text)]">{eng.title}</p>
                        <p className="mt-0.5 font-ibm-mono text-[10px] text-[var(--portal-text-soft)]">{pillarDescriptions.LAUNCH}</p>
                      </div>
                      <span
                        className="shrink-0 px-2 py-1 font-ibm-mono text-[9px] tracking-[1px]"
                        style={{ background: "var(--portal-accent-strong-soft)", color: "var(--portal-accent)" }}
                      >
                        {eng.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 border-t border-[var(--portal-border)] pt-4">
                      <div>
                        <p className="font-ibm-mono text-[9px] tracking-[1px] text-[var(--portal-text-dim)]">CONTRACT VALUE</p>
                        <p className="mt-1 font-grotesk text-[18px] font-normal text-[var(--portal-accent)]">
                          £{toNumber(eng.contract_value_gbp).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="font-ibm-mono text-[9px] tracking-[1px] text-[var(--portal-text-dim)]">STARTED</p>
                        <p className="mt-1 font-ibm-mono text-[10px] text-[var(--portal-text-muted)]">
                          {eng.kickoff_date ? new Date(eng.kickoff_date).toLocaleDateString("en-GB") : "—"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* BUILD Projects */}
          {buildProjects.length > 0 && (
            <section>
              <h2 className="mb-4 font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-text-soft)]">BUILD — CUSTOM PROJECTS</h2>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {buildProjects.map((eng) => (
                  <div key={eng.id} className="border border-[var(--portal-border)] bg-[var(--portal-surface)] p-6">
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div>
                        <p className="font-grotesk text-[16px] font-normal text-[var(--portal-text)]">{eng.title}</p>
                        <p className="mt-0.5 font-ibm-mono text-[10px] text-[var(--portal-text-soft)]">{pillarDescriptions.BUILD}</p>
                      </div>
                      <span
                        className="shrink-0 px-2 py-1 font-ibm-mono text-[9px] tracking-[1px]"
                        style={{ background: "var(--portal-muted-soft)", color: "var(--portal-text-soft)" }}
                      >
                        {eng.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 border-t border-[var(--portal-border)] pt-4">
                      <div>
                        <p className="font-ibm-mono text-[9px] tracking-[1px] text-[var(--portal-text-dim)]">CONTRACT VALUE</p>
                        <p className="mt-1 font-grotesk text-[18px] font-normal text-[var(--portal-text)]">
                          £{toNumber(eng.contract_value_gbp).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="font-ibm-mono text-[9px] tracking-[1px] text-[var(--portal-text-dim)]">EXPECTED END</p>
                        <p className="mt-1 font-ibm-mono text-[10px] text-[var(--portal-text-muted)]">
                          {eng.end_date ? new Date(eng.end_date).toLocaleDateString("en-GB") : "TBC"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* No active services */}
          {activeEngagements.length === 0 && (
            <div className="border border-dashed border-[var(--portal-border-strong)] p-12 text-center">
              <p className="font-ibm-mono text-[12px] text-[var(--portal-text-soft)]">No active services yet.</p>
              <p className="mt-2 font-ibm-mono text-[11px] leading-[1.7] text-[var(--portal-text-dim)]">
                Your services will appear here once your first project kicks off.
              </p>
            </div>
          )}

          {/* Add a service CTA */}
          <section className="border border-[var(--portal-border)] bg-[var(--portal-surface)] p-6">
            <p className="font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-text-muted)] mb-4">ADD A SERVICE</p>
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
              {[
                { pillar: "LAUNCH", href: "/services/launch", label: "⚡ Browse LAUNCH packages", desc: "Fixed-price, fast delivery" },
                { pillar: "GROW", href: "/services/grow", label: "📈 View GROW plans", desc: "Monthly subscription" },
                { pillar: "BUILD", href: "/services/build", label: "🔨 Start a BUILD project", desc: "Custom scoped project" },
              ].map((item) => (
                <a
                  key={item.pillar}
                  href={item.href}
                  className="flex items-center justify-between border border-[var(--portal-border)] bg-[var(--portal-bg)] p-4 hover:border-[var(--portal-accent)] transition-colors"
                >
                  <div>
                    <p className="font-ibm-mono text-[10px] tracking-[1.5px]" style={{ color: pillarColors[item.pillar] }}>
                      {item.label}
                    </p>
                    <p className="mt-1 font-ibm-mono text-[10px] text-[var(--portal-text-dim)]">{item.desc}</p>
                  </div>
                  <span className="font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">→</span>
                </a>
              ))}
            </div>
          </section>

          {/* Link to Billing */}
          <div className="flex items-center justify-between border border-[var(--portal-border)] bg-[var(--portal-surface)] p-5">
            <p className="font-ibm-mono text-[11px] text-[var(--portal-text-soft)]">View invoices, payment methods, and download receipts.</p>
            <Link
              href="/workspace/billing"
              className="shrink-0 font-ibm-mono text-[10px] tracking-[1.5px] text-[var(--portal-accent)] hover:opacity-80 transition-opacity"
            >
              BILLING & INVOICES →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
