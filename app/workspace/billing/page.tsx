"use client";

const invoices = [
  {
    id: "INV-2026-004",
    description: "Social Media Management — Month 2",
    amount: 699,
    currency: "GBP",
    status: "Due",
    due: "30 Apr 2026",
    issued: "01 Apr 2026",
  },
  {
    id: "INV-2026-003",
    description: "Brand & Website Package — Milestone 2",
    amount: 750,
    currency: "GBP",
    status: "Paid",
    due: "28 Mar 2026",
    issued: "14 Mar 2026",
  },
  {
    id: "INV-2026-002",
    description: "Social Media Management — Month 1",
    amount: 699,
    currency: "GBP",
    status: "Paid",
    due: "31 Mar 2026",
    issued: "01 Mar 2026",
  },
  {
    id: "INV-2026-001",
    description: "Brand & Website Package — Deposit (50%)",
    amount: 750,
    currency: "GBP",
    status: "Paid",
    due: "10 Mar 2026",
    issued: "28 Feb 2026",
  },
];

const statusColors = {
  Due: { bg: "#FF6B3520", text: "#FF6B35" },
  Paid: { bg: "#D6E26420", text: "#D6E264" },
  Overdue: { bg: "#FF000020", text: "#FF4444" },
};

export default function BillingPage() {
  const totalPaid = invoices.filter((i) => i.status === "Paid").reduce((s, i) => s + i.amount, 0);
  const totalDue = invoices.filter((i) => i.status === "Due").reduce((s, i) => s + i.amount, 0);

  return (
    <div className="p-8">
      <div className="mb-8 border-b border-[#1D1D1D] pb-6">
        <span className="font-ibm-mono text-[10px] text-[#D6E264] tracking-[3px]">// BILLING</span>
        <h1 className="font-grotesk text-[32px] font-bold text-[#F5F5F0] tracking-[-1px] mt-1">Billing & Invoices</h1>
        <p className="font-ibm-mono text-[12px] text-[#888] tracking-[0.5px] mt-1">View, download, and pay your invoices.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="border border-[#1D1D1D] bg-[#0F0F0F] p-5">
          <p className="font-ibm-mono text-[10px] text-[#666] tracking-[1px] mb-2">TOTAL PAID</p>
          <p className="font-grotesk text-[28px] font-bold text-[#D6E264]">£{totalPaid.toLocaleString()}</p>
          <p className="font-ibm-mono text-[10px] text-[#555] mt-1">{invoices.filter((i) => i.status === "Paid").length} invoices</p>
        </div>
        <div className="border border-[#1D1D1D] bg-[#0F0F0F] p-5">
          <p className="font-ibm-mono text-[10px] text-[#666] tracking-[1px] mb-2">OUTSTANDING</p>
          <p className="font-grotesk text-[28px] font-bold text-[#FF6B35]">£{totalDue.toLocaleString()}</p>
          <p className="font-ibm-mono text-[10px] text-[#555] mt-1">{invoices.filter((i) => i.status === "Due").length} invoice due</p>
        </div>
        <div className="border border-[#1D1D1D] bg-[#0F0F0F] p-5">
          <p className="font-ibm-mono text-[10px] text-[#666] tracking-[1px] mb-2">NEXT DUE DATE</p>
          <p className="font-grotesk text-[28px] font-bold text-[#F5F5F0]">30 Apr</p>
          <p className="font-ibm-mono text-[10px] text-[#555] mt-1">INV-2026-004</p>
        </div>
      </div>

      {/* Pay now banner */}
      {totalDue > 0 && (
        <div className="border border-[#FF6B35] bg-[#FF6B3510] px-6 py-4 flex items-center justify-between mb-6">
          <div>
            <p className="font-ibm-mono text-[11px] text-[#FF6B35] tracking-[1px]">PAYMENT DUE</p>
            <p className="font-ibm-mono text-[12px] text-[#CCCCCC] mt-1">Invoice INV-2026-004 for £{totalDue.toLocaleString()} is due on 30 Apr 2026.</p>
          </div>
          <button className="bg-[#FF6B35] hover:bg-[#e55a24] text-[#0A0A0A] font-ibm-mono text-[11px] font-bold tracking-[2px] px-6 py-3 transition-colors cursor-pointer border-none">
            PAY NOW →
          </button>
        </div>
      )}

      {/* Invoice table */}
      <div className="border border-[#1D1D1D] bg-[#0F0F0F]">
        <div className="grid grid-cols-[120px_1fr_100px_100px_100px_100px] gap-4 px-5 py-3 border-b border-[#1D1D1D]">
          {["Invoice", "Description", "Amount", "Issued", "Due", "Status"].map((h) => (
            <span key={h} className="font-ibm-mono text-[9px] text-[#555] tracking-[2px]">{h}</span>
          ))}
        </div>
        {invoices.map((inv) => {
          const sc = statusColors[inv.status as keyof typeof statusColors] ?? { bg: "#FFFFFF10", text: "#888" };
          return (
            <div key={inv.id} className="grid grid-cols-[120px_1fr_100px_100px_100px_100px] gap-4 px-5 py-4 border-b border-[#1D1D1D] hover:bg-[#111] transition-colors items-center">
              <span className="font-ibm-mono text-[10px] text-[#888]">{inv.id}</span>
              <span className="font-ibm-mono text-[11px] text-[#CCCCCC]">{inv.description}</span>
              <span className="font-grotesk text-[14px] font-bold text-[#F5F5F0]">£{inv.amount.toLocaleString()}</span>
              <span className="font-ibm-mono text-[10px] text-[#666]">{inv.issued}</span>
              <span className="font-ibm-mono text-[10px] text-[#666]">{inv.due}</span>
              <div className="flex items-center gap-2">
                <span className="font-ibm-mono text-[9px] tracking-[1px] px-2 py-1" style={{ background: sc.bg, color: sc.text }}>
                  {inv.status.toUpperCase()}
                </span>
                {inv.status === "Paid" && (
                  <button className="font-ibm-mono text-[9px] text-[#555] hover:text-[#888] cursor-pointer bg-transparent border-none tracking-[1px]">↓ PDF</button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="font-ibm-mono text-[10px] text-[#444] mt-6 text-center tracking-[0.5px]">
        Payments are processed securely via Stripe. For billing queries contact{" "}
        <a href="mailto:billing@vazgro.com" className="text-[#D6E264] hover:opacity-80">billing@vazgro.com</a>
      </p>
    </div>
  );
}
