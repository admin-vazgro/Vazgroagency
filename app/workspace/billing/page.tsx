"use client";

const invoices: Array<{ id: string; description: string; amount: number; currency: string; status: string; due: string; issued: string }> = [];

const statusColors = {
  Due: { bg: "var(--portal-warning-strong-soft)", text: "var(--portal-warning)" },
  Paid: { bg: "var(--portal-accent-strong-soft)", text: "var(--portal-accent)" },
  Overdue: { bg: "var(--portal-danger-soft)", text: "var(--portal-danger)" },
};

export default function BillingPage() {
  const totalPaid = invoices.filter((i) => i.status === "Paid").reduce((s, i) => s + i.amount, 0);
  const totalDue = invoices.filter((i) => i.status === "Due").reduce((s, i) => s + i.amount, 0);

  return (
    <div className="p-8">
      <div className="mb-8 border-b border-[var(--portal-border)] pb-6">
        <span className="font-ibm-mono text-[10px] text-[var(--portal-accent)] tracking-[3px]">// BILLING</span>
        <h1 className="font-grotesk text-[32px] font-bold text-[var(--portal-text)] tracking-[-1px] mt-1">Billing & Invoices</h1>
        <p className="font-ibm-mono text-[12px] text-[var(--portal-text-soft)] tracking-[0.5px] mt-1">View, download, and pay your invoices.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)] p-5">
          <p className="font-ibm-mono text-[10px] text-[var(--portal-text-muted)] tracking-[1px] mb-2">TOTAL PAID</p>
          <p className="font-grotesk text-[28px] font-bold text-[var(--portal-accent)]">£{totalPaid.toLocaleString()}</p>
          <p className="font-ibm-mono text-[10px] text-[var(--portal-text-dim)] mt-1">{invoices.filter((i) => i.status === "Paid").length} invoices</p>
        </div>
        <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)] p-5">
          <p className="font-ibm-mono text-[10px] text-[var(--portal-text-muted)] tracking-[1px] mb-2">OUTSTANDING</p>
          <p className="font-grotesk text-[28px] font-bold text-[var(--portal-warning)]">£{totalDue.toLocaleString()}</p>
          <p className="font-ibm-mono text-[10px] text-[var(--portal-text-dim)] mt-1">{invoices.filter((i) => i.status === "Due").length} invoice due</p>
        </div>
        <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)] p-5">
          <p className="font-ibm-mono text-[10px] text-[var(--portal-text-muted)] tracking-[1px] mb-2">NEXT DUE DATE</p>
          <p className="font-grotesk text-[28px] font-bold text-[var(--portal-text)]">—</p>
          <p className="font-ibm-mono text-[10px] text-[var(--portal-text-dim)] mt-1">No upcoming invoice</p>
        </div>
      </div>

      {/* Pay now banner */}
      {totalDue > 0 && (
        <div className="border border-[var(--portal-warning)] bg-[var(--portal-warning-soft)] px-6 py-4 flex items-center justify-between mb-6">
          <div>
            <p className="font-ibm-mono text-[11px] text-[var(--portal-warning)] tracking-[1px]">PAYMENT DUE</p>
            <p className="font-ibm-mono text-[12px] text-[var(--portal-text-muted)] mt-1">Invoice INV-2026-004 for £{totalDue.toLocaleString()} is due on 30 Apr 2026.</p>
          </div>
          <button className="bg-[var(--portal-warning)] hover:bg-[var(--portal-warning-hover)] text-[var(--portal-accent-contrast)] font-ibm-mono text-[11px] font-bold tracking-[2px] px-6 py-3 transition-colors cursor-pointer border-none">
            PAY NOW →
          </button>
        </div>
      )}

      {/* Invoice table */}
      <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)]">
        <div className="grid grid-cols-[120px_1fr_100px_100px_100px_100px] gap-4 px-5 py-3 border-b border-[var(--portal-border)]">
          {["Invoice", "Description", "Amount", "Issued", "Due", "Status"].map((h) => (
            <span key={h} className="font-ibm-mono text-[9px] text-[var(--portal-text-dim)] tracking-[2px]">{h}</span>
          ))}
        </div>
        {invoices.map((inv) => {
          const sc = statusColors[inv.status as keyof typeof statusColors] ?? { bg: "var(--portal-muted-soft)", text: "var(--portal-text-soft)" };
          return (
            <div key={inv.id} className="grid grid-cols-[120px_1fr_100px_100px_100px_100px] gap-4 px-5 py-4 border-b border-[var(--portal-border)] hover:bg-[var(--portal-surface-alt)] transition-colors items-center">
              <span className="font-ibm-mono text-[10px] text-[var(--portal-text-soft)]">{inv.id}</span>
              <span className="font-ibm-mono text-[11px] text-[var(--portal-text-muted)]">{inv.description}</span>
              <span className="font-grotesk text-[14px] font-bold text-[var(--portal-text)]">£{inv.amount.toLocaleString()}</span>
              <span className="font-ibm-mono text-[10px] text-[var(--portal-text-muted)]">{inv.issued}</span>
              <span className="font-ibm-mono text-[10px] text-[var(--portal-text-muted)]">{inv.due}</span>
              <div className="flex items-center gap-2">
                <span className="font-ibm-mono text-[9px] tracking-[1px] px-2 py-1" style={{ background: sc.bg, color: sc.text }}>
                  {inv.status.toUpperCase()}
                </span>
                {inv.status === "Paid" && (
                  <button className="font-ibm-mono text-[9px] text-[var(--portal-text-dim)] hover:text-[var(--portal-text-soft)] cursor-pointer bg-transparent border-none tracking-[1px]">↓ PDF</button>
                )}
              </div>
            </div>
          );
        })}
        {invoices.length === 0 && (
          <div className="px-5 py-12">
            <p className="font-ibm-mono text-[11px] text-[var(--portal-text-soft)]">No invoices yet.</p>
          </div>
        )}
      </div>

      <p className="font-ibm-mono text-[10px] text-[var(--portal-text-faint)] mt-6 text-center tracking-[0.5px]">
        Payments are processed securely via Stripe. For billing queries contact{" "}
        <a href="mailto:billing@vazgro.com" className="text-[var(--portal-accent)] hover:opacity-80">billing@vazgro.com</a>
      </p>
    </div>
  );
}
