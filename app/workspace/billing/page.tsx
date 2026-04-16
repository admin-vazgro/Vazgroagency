import {
  requireWorkspaceAccess,
  getWorkspaceAdminClient,
} from "@/app/workspace/lib";
import StripePortalButton from "./StripePortalButton";

type InvoiceRow = {
  id: string;
  title: string;
  amount_gbp: number | string;
  currency: string | null;
  status: string;
  due_date: string | null;
  paid_at: string | null;
  created_at: string;
  pdf_url: string | null;
};

type EngagementRow = {
  id: string;
  title: string;
  pillar: string;
  status: string;
  monthly_value_gbp: number | null;
  contract_value_gbp: number | null;
  kickoff_date: string | null;
  stripe_subscription_id: string | null;
};

const statusColors: Record<string, { bg: string; text: string }> = {
  draft: { bg: "var(--portal-muted-soft)", text: "var(--portal-text-dim)" },
  sent: { bg: "var(--portal-warning-strong-soft)", text: "var(--portal-warning)" },
  paid: { bg: "var(--portal-accent-strong-soft)", text: "var(--portal-accent)" },
  overdue: { bg: "var(--portal-warning-strong-soft)", text: "var(--portal-warning)" },
  refunded: { bg: "var(--portal-muted-soft)", text: "var(--portal-text-soft)" },
};

const pillarColors: Record<string, string> = {
  LAUNCH: "var(--portal-accent)",
  GROW: "var(--portal-warning)",
  BUILD: "var(--portal-text-soft)",
};

function toNumber(value: number | string | null | undefined) {
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value) || 0;
  return 0;
}

export default async function BillingPage() {
  const { user } = await requireWorkspaceAccess();
  const admin = getWorkspaceAdminClient();

  const { data: membership } = await admin
    .from("account_members")
    .select("account_id")
    .eq("profile_id", user.id)
    .maybeSingle();

  const accountId = membership?.account_id ?? null;

  let invoices: InvoiceRow[] = [];
  let engagements: EngagementRow[] = [];
  let hasStripeCustomer = false;
  let dataError = "";

  if (accountId) {
    const [invResult, engResult, accResult] = await Promise.all([
      admin
        .from("invoices")
        .select("id, title, amount_gbp, currency, status, due_date, paid_at, created_at, pdf_url")
        .eq("account_id", accountId)
        .order("created_at", { ascending: false }),
      admin
        .from("engagements")
        .select("id, title, pillar, status, monthly_value_gbp, contract_value_gbp, kickoff_date, stripe_subscription_id")
        .eq("account_id", accountId)
        .in("status", ["active", "paused"])
        .order("created_at", { ascending: false }),
      admin
        .from("accounts")
        .select("stripe_customer_id")
        .eq("id", accountId)
        .maybeSingle(),
    ]);

    if (invResult.error) dataError = invResult.error.message;
    else invoices = (invResult.data ?? []) as InvoiceRow[];

    engagements = (engResult.data ?? []) as EngagementRow[];
    hasStripeCustomer = !!(accResult.data?.stripe_customer_id);
  }

  const totalPaid = invoices
    .filter((i) => i.status === "paid")
    .reduce((s, i) => s + toNumber(i.amount_gbp), 0);

  const totalOutstanding = invoices
    .filter((i) => ["sent", "overdue"].includes(i.status))
    .reduce((s, i) => s + toNumber(i.amount_gbp), 0);

  const overdueInvoices = invoices.filter((i) => i.status === "overdue");

  const nextDue = invoices
    .filter((i) => i.status === "sent" && i.due_date)
    .sort((a, b) => (a.due_date! < b.due_date! ? -1 : 1))[0];

  const monthlyMrr = engagements
    .filter((e) => e.pillar === "GROW" && e.monthly_value_gbp)
    .reduce((s, e) => s + toNumber(e.monthly_value_gbp), 0);

  return (
    <div className="p-8">
      <div className="mb-8 border-b border-[var(--portal-border)] pb-6">
        <span className="font-ibm-mono text-[14px] tracking-[3px] text-[var(--portal-accent)]">// SERVICES & BILLING</span>
        <h1 className="mt-1 font-grotesk text-[32px] font-normal tracking-[-1px] text-[var(--portal-text)]">
          Billing & Invoices
        </h1>
        <p className="mt-1 font-ibm-mono text-[14px] tracking-[0.5px] text-[var(--portal-text-soft)]">
          Manage your services, invoices, and payment methods.
        </p>
      </div>

      {dataError && (
        <div className="mb-6 border border-[var(--portal-warning)] bg-[var(--portal-warning-soft)] px-4 py-3">
          <p className="font-ibm-mono text-[14px] text-[var(--portal-warning)]">{dataError}</p>
        </div>
      )}

      {/* Overdue banner */}
      {overdueInvoices.length > 0 && (
        <div className="mb-6 flex items-center justify-between border border-[var(--portal-warning)] bg-[var(--portal-warning-soft)] px-6 py-4">
          <div>
            <p className="font-ibm-mono text-[14px] tracking-[1px] text-[var(--portal-warning)]">PAYMENT OVERDUE</p>
            <p className="mt-1 font-ibm-mono text-[14px] text-[var(--portal-text-muted)]">
              {overdueInvoices.length} invoice{overdueInvoices.length !== 1 ? "s" : ""} overdue totalling £{overdueInvoices.reduce((s, i) => s + toNumber(i.amount_gbp), 0).toLocaleString()}.
            </p>
          </div>
          {hasStripeCustomer ? (
            <StripePortalButton label="PAY NOW →" />
          ) : (
            <a
              href="mailto:billing@vazgro.com"
              className="border-none bg-[var(--portal-warning)] px-6 py-3 font-ibm-mono text-[14px] tracking-[2px] text-white transition-opacity hover:opacity-80"
            >
              CONTACT BILLING →
            </a>
          )}
        </div>
      )}

      {/* KPI tiles */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)] p-5">
          <p className="mb-2 font-ibm-mono text-[14px] tracking-[1px] text-[var(--portal-text-muted)]">TOTAL PAID</p>
          <p className="font-grotesk text-[28px] font-normal text-[var(--portal-accent)]">
            £{totalPaid.toLocaleString()}
          </p>
          <p className="mt-1 font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">
            {invoices.filter((i) => i.status === "paid").length} invoices
          </p>
        </div>
        <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)] p-5">
          <p className="mb-2 font-ibm-mono text-[14px] tracking-[1px] text-[var(--portal-text-muted)]">OUTSTANDING</p>
          <p
            className="font-grotesk text-[28px] font-normal"
            style={{ color: totalOutstanding > 0 ? "var(--portal-warning)" : "var(--portal-text)" }}
          >
            £{totalOutstanding.toLocaleString()}
          </p>
          <p className="mt-1 font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">
            {invoices.filter((i) => ["sent", "overdue"].includes(i.status)).length} invoice{invoices.filter((i) => ["sent", "overdue"].includes(i.status)).length !== 1 ? "s" : ""} due
          </p>
        </div>
        <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)] p-5">
          <p className="mb-2 font-ibm-mono text-[14px] tracking-[1px] text-[var(--portal-text-muted)]">NEXT DUE DATE</p>
          <p className="font-grotesk text-[28px] font-normal text-[var(--portal-text)]">
            {nextDue?.due_date
              ? new Date(nextDue.due_date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })
              : "—"}
          </p>
          <p className="mt-1 font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">
            {nextDue ? `£${toNumber(nextDue.amount_gbp).toLocaleString()}` : "No upcoming invoice"}
          </p>
        </div>
        <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)] p-5">
          <p className="mb-2 font-ibm-mono text-[14px] tracking-[1px] text-[var(--portal-text-muted)]">MONTHLY MRR</p>
          <p className="font-grotesk text-[28px] font-normal text-[var(--portal-text)]">
            £{monthlyMrr.toLocaleString()}
          </p>
          <p className="mt-1 font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">
            {engagements.filter((e) => e.pillar === "GROW").length} GROW plan{engagements.filter((e) => e.pillar === "GROW").length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Active services */}
      {engagements.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-4 font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-text-muted)]">ACTIVE SERVICES</h2>
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {engagements.map((eng) => (
              <div key={eng.id} className="border border-[var(--portal-border)] bg-[var(--portal-surface)] p-5">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <span
                      className="font-ibm-mono text-[14px] tracking-[2px]"
                      style={{ color: pillarColors[eng.pillar] ?? "var(--portal-text-soft)" }}
                    >
                      {eng.pillar}
                    </span>
                    <p className="mt-1 font-grotesk text-[14px] font-normal text-[var(--portal-text)]">{eng.title}</p>
                  </div>
                  <span
                    className="shrink-0 px-2 py-1 font-ibm-mono text-[14px] tracking-[1px]"
                    style={{
                      background: eng.status === "active" ? "var(--portal-accent-strong-soft)" : "var(--portal-muted-soft)",
                      color: eng.status === "active" ? "var(--portal-accent)" : "var(--portal-text-dim)",
                    }}
                  >
                    {eng.status.toUpperCase()}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 border-t border-[var(--portal-border)] pt-3">
                  <div>
                    <p className="font-ibm-mono text-[14px] tracking-[1px] text-[var(--portal-text-dim)]">
                      {eng.pillar === "GROW" ? "MONTHLY VALUE" : "CONTRACT VALUE"}
                    </p>
                    <p className="mt-1 font-grotesk text-[16px] font-normal text-[var(--portal-text)]">
                      £{toNumber(eng.pillar === "GROW" ? eng.monthly_value_gbp : eng.contract_value_gbp).toLocaleString()}
                      {eng.pillar === "GROW" && <span className="font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">/mo</span>}
                    </p>
                  </div>
                  <div>
                    <p className="font-ibm-mono text-[14px] tracking-[1px] text-[var(--portal-text-dim)]">STARTED</p>
                    <p className="mt-1 font-ibm-mono text-[14px] text-[var(--portal-text-muted)]">
                      {eng.kickoff_date ? new Date(eng.kickoff_date).toLocaleDateString("en-GB") : "—"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stripe Customer Portal */}
      {hasStripeCustomer && (
        <div className="mb-8 border border-[var(--portal-border)] bg-[var(--portal-surface)] p-6">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <p className="font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-text)]">PAYMENT METHODS & BILLING SETTINGS</p>
              <p className="mt-1 font-ibm-mono text-[14px] leading-[1.6] text-[var(--portal-text-soft)]">
                Update your card, download VAT receipts, change billing address, or manage subscriptions — all via the Stripe secure portal.
              </p>
            </div>
          </div>
          <StripePortalButton label="OPEN BILLING PORTAL →" />
        </div>
      )}

      {/* Invoice table */}
      {!accountId && !dataError && (
        <div className="border border-dashed border-[var(--portal-border-strong)] p-8">
          <p className="font-ibm-mono text-[14px] text-[var(--portal-text-soft)]">No billing account linked yet.</p>
          <p className="mt-2 font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">
            Invoices will appear here once your account is set up.
          </p>
        </div>
      )}

      {accountId && (
        <>
          <h2 className="mb-4 font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-text-muted)]">INVOICE HISTORY</h2>
          <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)]">
            <div className="grid grid-cols-[1fr_100px_100px_100px_140px] gap-4 border-b border-[var(--portal-border)] px-5 py-3">
              {["Description", "Amount", "Issued", "Due", "Status"].map((h) => (
                <span key={h} className="font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-text-dim)]">{h}</span>
              ))}
            </div>

            {invoices.map((inv) => {
              const sc = statusColors[inv.status] ?? { bg: "var(--portal-muted-soft)", text: "var(--portal-text-soft)" };
              return (
                <div
                  key={inv.id}
                  className="grid grid-cols-[1fr_100px_100px_100px_140px] gap-4 items-center border-b border-[var(--portal-border)] px-5 py-4 transition-colors hover:bg-[var(--portal-surface-alt)]"
                >
                  <div>
                    <p className="font-ibm-mono text-[14px] text-[var(--portal-text)]">{inv.title}</p>
                    <p className="mt-0.5 font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">{inv.id.slice(0, 8)}</p>
                  </div>
                  <span className="font-grotesk text-[14px] font-normal text-[var(--portal-text)]">
                    £{toNumber(inv.amount_gbp).toLocaleString()}
                  </span>
                  <span className="font-ibm-mono text-[14px] text-[var(--portal-text-muted)]">
                    {new Date(inv.created_at).toLocaleDateString("en-GB")}
                  </span>
                  <span className="font-ibm-mono text-[14px] text-[var(--portal-text-muted)]">
                    {inv.due_date ? new Date(inv.due_date).toLocaleDateString("en-GB") : "—"}
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className="px-2 py-1 font-ibm-mono text-[14px] tracking-[1px]"
                      style={{ background: sc.bg, color: sc.text }}
                    >
                      {inv.status.toUpperCase()}
                    </span>
                    {inv.pdf_url && (
                      <a
                        href={inv.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-ibm-mono text-[14px] tracking-[1px] text-[var(--portal-text-dim)] transition-colors hover:text-[var(--portal-text-soft)]"
                      >
                        ↓ PDF
                      </a>
                    )}
                  </div>
                </div>
              );
            })}

            {invoices.length === 0 && (
              <div className="px-5 py-12">
                <p className="font-ibm-mono text-[14px] text-[var(--portal-text-soft)]">No invoices yet.</p>
                <p className="mt-2 font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">
                  Invoices will appear here once they are raised by your Vazgro team.
                </p>
              </div>
            )}
          </div>
        </>
      )}

      <p className="mt-6 text-center font-ibm-mono text-[14px] tracking-[0.5px] text-[var(--portal-text-faint)]">
        For billing queries contact{" "}
        <a href="mailto:billing@vazgro.com" className="text-[var(--portal-accent)] hover:opacity-80">
          billing@vazgro.com
        </a>
      </p>
    </div>
  );
}
