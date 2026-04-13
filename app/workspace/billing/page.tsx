import {
  requireWorkspaceAccess,
  getWorkspaceAdminClient,
} from "@/app/workspace/lib";

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

const statusColors: Record<string, { bg: string; text: string }> = {
  draft: { bg: "var(--portal-muted-soft)", text: "var(--portal-text-dim)" },
  sent: { bg: "var(--portal-warning-strong-soft)", text: "var(--portal-warning)" },
  paid: { bg: "var(--portal-accent-strong-soft)", text: "var(--portal-accent)" },
  overdue: { bg: "var(--portal-warning-strong-soft)", text: "var(--portal-warning)" },
  refunded: { bg: "var(--portal-muted-soft)", text: "var(--portal-text-soft)" },
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
  let dataError = "";

  if (accountId) {
    const { data, error } = await admin
      .from("invoices")
      .select("id, title, amount_gbp, currency, status, due_date, paid_at, created_at, pdf_url")
      .eq("account_id", accountId)
      .order("created_at", { ascending: false });

    if (error) {
      dataError = error.message;
    } else {
      invoices = (data ?? []) as InvoiceRow[];
    }
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

  return (
    <div className="p-8">
      <div className="mb-8 border-b border-[var(--portal-border)] pb-6">
        <span className="font-ibm-mono text-[10px] tracking-[3px] text-[var(--portal-accent)]">// SERVICES & BILLING</span>
        <h1 className="mt-1 font-grotesk text-[32px] font-normal tracking-[-1px] text-[var(--portal-text)]">
          Billing & Invoices
        </h1>
        <p className="mt-1 font-ibm-mono text-[12px] tracking-[0.5px] text-[var(--portal-text-soft)]">
          View, download, and manage your invoices.
        </p>
      </div>

      {dataError && (
        <div className="mb-6 border border-[var(--portal-warning)] bg-[var(--portal-warning-soft)] px-4 py-3">
          <p className="font-ibm-mono text-[11px] text-[var(--portal-warning)]">{dataError}</p>
        </div>
      )}

      {/* KPI tiles */}
      <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)] p-5">
          <p className="mb-2 font-ibm-mono text-[10px] tracking-[1px] text-[var(--portal-text-muted)]">TOTAL PAID</p>
          <p className="font-grotesk text-[28px] font-normal text-[var(--portal-accent)]">
            £{totalPaid.toLocaleString()}
          </p>
          <p className="mt-1 font-ibm-mono text-[10px] text-[var(--portal-text-dim)]">
            {invoices.filter((i) => i.status === "paid").length} invoices
          </p>
        </div>
        <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)] p-5">
          <p className="mb-2 font-ibm-mono text-[10px] tracking-[1px] text-[var(--portal-text-muted)]">OUTSTANDING</p>
          <p
            className="font-grotesk text-[28px] font-normal"
            style={{ color: totalOutstanding > 0 ? "var(--portal-warning)" : "var(--portal-text)" }}
          >
            £{totalOutstanding.toLocaleString()}
          </p>
          <p className="mt-1 font-ibm-mono text-[10px] text-[var(--portal-text-dim)]">
            {invoices.filter((i) => ["sent", "overdue"].includes(i.status)).length} invoice{invoices.filter((i) => ["sent", "overdue"].includes(i.status)).length !== 1 ? "s" : ""} due
          </p>
        </div>
        <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)] p-5">
          <p className="mb-2 font-ibm-mono text-[10px] tracking-[1px] text-[var(--portal-text-muted)]">NEXT DUE DATE</p>
          <p className="font-grotesk text-[28px] font-normal text-[var(--portal-text)]">
            {nextDue?.due_date
              ? new Date(nextDue.due_date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })
              : "—"}
          </p>
          <p className="mt-1 font-ibm-mono text-[10px] text-[var(--portal-text-dim)]">
            {nextDue ? `£${toNumber(nextDue.amount_gbp).toLocaleString()}` : "No upcoming invoice"}
          </p>
        </div>
      </div>

      {/* Overdue banner */}
      {overdueInvoices.length > 0 && (
        <div className="mb-6 flex items-center justify-between border border-[var(--portal-warning)] bg-[var(--portal-warning-soft)] px-6 py-4">
          <div>
            <p className="font-ibm-mono text-[11px] tracking-[1px] text-[var(--portal-warning)]">PAYMENT OVERDUE</p>
            <p className="mt-1 font-ibm-mono text-[12px] text-[var(--portal-text-muted)]">
              {overdueInvoices.length} invoice{overdueInvoices.length !== 1 ? "s" : ""} overdue totalling £{overdueInvoices.reduce((s, i) => s + toNumber(i.amount_gbp), 0).toLocaleString()}.
            </p>
          </div>
          <a
            href="mailto:billing@vazgro.com"
            className="border-none bg-[var(--portal-warning)] px-6 py-3 font-ibm-mono text-[11px] tracking-[2px] text-white transition-opacity hover:opacity-80"
          >
            CONTACT BILLING →
          </a>
        </div>
      )}

      {/* Invoice table */}
      {!accountId && !dataError && (
        <div className="border border-dashed border-[var(--portal-border-strong)] p-8">
          <p className="font-ibm-mono text-[11px] text-[var(--portal-text-soft)]">No billing account linked yet.</p>
          <p className="mt-2 font-ibm-mono text-[10px] text-[var(--portal-text-dim)]">
            Invoices will appear here once your account is set up.
          </p>
        </div>
      )}

      {accountId && (
        <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)]">
          <div className="grid grid-cols-[1fr_100px_100px_100px_140px] gap-4 border-b border-[var(--portal-border)] px-5 py-3">
            {["Description", "Amount", "Issued", "Due", "Status"].map((h) => (
              <span key={h} className="font-ibm-mono text-[9px] tracking-[2px] text-[var(--portal-text-dim)]">{h}</span>
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
                  <p className="font-ibm-mono text-[11px] text-[var(--portal-text)]">{inv.title}</p>
                  <p className="mt-0.5 font-ibm-mono text-[10px] text-[var(--portal-text-dim)]">{inv.id.slice(0, 8)}</p>
                </div>
                <span className="font-grotesk text-[14px] font-normal text-[var(--portal-text)]">
                  £{toNumber(inv.amount_gbp).toLocaleString()}
                </span>
                <span className="font-ibm-mono text-[10px] text-[var(--portal-text-muted)]">
                  {new Date(inv.created_at).toLocaleDateString("en-GB")}
                </span>
                <span className="font-ibm-mono text-[10px] text-[var(--portal-text-muted)]">
                  {inv.due_date ? new Date(inv.due_date).toLocaleDateString("en-GB") : "—"}
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className="px-2 py-1 font-ibm-mono text-[9px] tracking-[1px]"
                    style={{ background: sc.bg, color: sc.text }}
                  >
                    {inv.status.toUpperCase()}
                  </span>
                  {inv.pdf_url && (
                    <a
                      href={inv.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-ibm-mono text-[9px] tracking-[1px] text-[var(--portal-text-dim)] transition-colors hover:text-[var(--portal-text-soft)]"
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
              <p className="font-ibm-mono text-[11px] text-[var(--portal-text-soft)]">No invoices yet.</p>
              <p className="mt-2 font-ibm-mono text-[10px] text-[var(--portal-text-dim)]">
                Invoices will appear here once they are raised by your Vazgro team.
              </p>
            </div>
          )}
        </div>
      )}

      <p className="mt-6 text-center font-ibm-mono text-[10px] tracking-[0.5px] text-[var(--portal-text-faint)]">
        For billing queries contact{" "}
        <a href="mailto:billing@vazgro.com" className="text-[var(--portal-accent)] hover:opacity-80">
          billing@vazgro.com
        </a>
      </p>
    </div>
  );
}
