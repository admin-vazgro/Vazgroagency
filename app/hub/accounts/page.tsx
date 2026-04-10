"use client";

const accounts = [
  { id: "ACC-001", name: "Acme Corp", contact: "Alex Chen", email: "alex@acme.com", country: "GB", pillar: "LAUNCH + GROW", activeEngagements: 2, totalRevenue: 8898, status: "Active" },
  { id: "ACC-002", name: "Pixel & Co", contact: "Dan Walsh", email: "dan@pixelco.com", country: "GB", pillar: "LAUNCH", activeEngagements: 1, totalRevenue: 2499, status: "Active" },
  { id: "ACC-003", name: "Nova Analytics", contact: "Sophie Chen", email: "sophie@nova.ai", country: "IE", pillar: "BUILD", activeEngagements: 1, totalRevenue: 15000, status: "Prospect" },
  { id: "ACC-004", name: "UrbanNest", contact: "Mark Liu", email: "mark@urbannest.co", country: "GB", pillar: "GROW", activeEngagements: 0, totalRevenue: 4194, status: "Active" },
  { id: "ACC-005", name: "Solarise Energy", contact: "Fiona Nash", email: "fiona@solarise.com", country: "GB", pillar: "GROW", activeEngagements: 0, totalRevenue: 0, status: "Churned" },
];

const statusColors = {
  Active: { bg: "#D6E26420", text: "#D6E264" },
  Prospect: { bg: "#FFFFFF10", text: "#888" },
  Churned: { bg: "#FF6B3520", text: "#FF6B35" },
};

export default function AccountsPage() {
  return (
    <div className="p-8">
      <div className="mb-8 border-b border-[#1D1D1D] pb-6 flex items-end justify-between">
        <div>
          <span className="font-ibm-mono text-[10px] text-[#D6E264] tracking-[3px]">// ACCOUNTS</span>
          <h1 className="font-grotesk text-[32px] font-bold text-[#F5F5F0] tracking-[-1px] mt-1">Accounts</h1>
          <p className="font-ibm-mono text-[12px] text-[#888] tracking-[0.5px] mt-1">{accounts.length} accounts · {accounts.filter(a => a.status === "Active").length} active clients</p>
        </div>
        <button className="px-5 py-2.5 bg-[#D6E264] hover:bg-[#c9d64f] font-ibm-mono text-[10px] text-[#0A0A0A] tracking-[2px] transition-colors cursor-pointer border-none">
          + NEW ACCOUNT
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="border border-[#1D1D1D] bg-[#0F0F0F] p-5">
          <p className="font-ibm-mono text-[10px] text-[#666] tracking-[1px] mb-2">TOTAL REVENUE</p>
          <p className="font-grotesk text-[28px] font-bold text-[#D6E264]">£{accounts.reduce((s, a) => s + a.totalRevenue, 0).toLocaleString()}</p>
        </div>
        <div className="border border-[#1D1D1D] bg-[#0F0F0F] p-5">
          <p className="font-ibm-mono text-[10px] text-[#666] tracking-[1px] mb-2">ACTIVE CLIENTS</p>
          <p className="font-grotesk text-[28px] font-bold text-[#F5F5F0]">{accounts.filter(a => a.status === "Active").length}</p>
        </div>
        <div className="border border-[#1D1D1D] bg-[#0F0F0F] p-5">
          <p className="font-ibm-mono text-[10px] text-[#666] tracking-[1px] mb-2">ACTIVE ENGAGEMENTS</p>
          <p className="font-grotesk text-[28px] font-bold text-[#F5F5F0]">{accounts.reduce((s, a) => s + a.activeEngagements, 0)}</p>
        </div>
      </div>

      <div className="border border-[#1D1D1D] bg-[#0F0F0F]">
        <div className="grid grid-cols-[80px_1fr_160px_80px_80px_120px_80px] gap-4 px-5 py-3 border-b border-[#1D1D1D]">
          {["ID", "Account", "Email", "Country", "Pillar", "Revenue", "Status"].map((h) => (
            <span key={h} className="font-ibm-mono text-[9px] text-[#555] tracking-[2px]">{h}</span>
          ))}
        </div>
        {accounts.map((acc) => {
          const sc = statusColors[acc.status as keyof typeof statusColors];
          return (
            <div key={acc.id} className="grid grid-cols-[80px_1fr_160px_80px_80px_120px_80px] gap-4 px-5 py-4 border-b border-[#1D1D1D] hover:bg-[#111] transition-colors items-center">
              <span className="font-ibm-mono text-[10px] text-[#777]">{acc.id}</span>
              <div>
                <p className="font-ibm-mono text-[11px] text-[#CCCCCC] font-bold">{acc.name}</p>
                <p className="font-ibm-mono text-[10px] text-[#555] mt-0.5">{acc.contact}</p>
              </div>
              <span className="font-ibm-mono text-[10px] text-[#777]">{acc.email}</span>
              <span className="font-ibm-mono text-[10px] text-[#777]">{acc.country}</span>
              <span className="font-ibm-mono text-[10px] text-[#888]">{acc.pillar}</span>
              <span className="font-ibm-mono text-[11px] text-[#CCCCCC]">£{acc.totalRevenue.toLocaleString()}</span>
              <span className="font-ibm-mono text-[9px] tracking-[1px] px-2 py-1 w-fit" style={{ background: sc.bg, color: sc.text }}>
                {acc.status.toUpperCase()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
