"use client";

const partners = [
  {
    id: "PTR-001",
    name: "James H.",
    email: "james@jamesholmes.co.uk",
    tier: "Tier 2",
    tierColor: "#FF6B35",
    monthlyRevenue: 12500,
    totalClosed: 3,
    activeLeads: 4,
    commissionRate: 20,
    status: "Active",
    joinDate: "Jan 2026",
    stripe: "Connected",
  },
  {
    id: "PTR-002",
    name: "Sara M.",
    email: "sara@marketingedge.io",
    tier: "Tier 1",
    tierColor: "#D6E264",
    monthlyRevenue: 4500,
    totalClosed: 2,
    activeLeads: 2,
    commissionRate: 15,
    status: "Active",
    joinDate: "Feb 2026",
    stripe: "Connected",
  },
  {
    id: "PTR-003",
    name: "Lena D.",
    email: "lena@designflow.studio",
    tier: "Tier 1",
    tierColor: "#D6E264",
    monthlyRevenue: 0,
    totalClosed: 0,
    activeLeads: 1,
    commissionRate: 15,
    status: "Pending",
    joinDate: "Mar 2026",
    stripe: "Not Connected",
  },
];

const tierThresholds = [
  { tier: "Tier 1", range: "£0 – £9,999/mo", rate: "15%", color: "#D6E264" },
  { tier: "Tier 2", range: "£10,000 – £24,999/mo", rate: "20%", color: "#FF6B35" },
  { tier: "Tier 3", range: "£25,000+/mo", rate: "25%", color: "#FFFFFF" },
];

export default function PartnersPage() {
  return (
    <div className="p-8">
      <div className="mb-8 border-b border-[#1D1D1D] pb-6 flex items-end justify-between">
        <div>
          <span className="font-ibm-mono text-[10px] text-[#D6E264] tracking-[3px]">// PARTNERS</span>
          <h1 className="font-grotesk text-[32px] font-bold text-[#F5F5F0] tracking-[-1px] mt-1">Partner Programme</h1>
          <p className="font-ibm-mono text-[12px] text-[#888] tracking-[0.5px] mt-1">{partners.length} partners · {partners.filter(p => p.status === "Active").length} active</p>
        </div>
        <button className="px-5 py-2.5 bg-[#D6E264] hover:bg-[#c9d64f] font-ibm-mono text-[10px] text-[#0A0A0A] tracking-[2px] transition-colors cursor-pointer border-none">
          + INVITE PARTNER
        </button>
      </div>

      {/* Tier reference */}
      <div className="border border-[#1D1D1D] bg-[#0F0F0F] p-5 mb-8">
        <p className="font-ibm-mono text-[10px] text-[#AAAAAA] tracking-[2px] mb-4">COMMISSION TIERS (MONTHLY CLOSED REVENUE)</p>
        <div className="grid grid-cols-3 gap-4">
          {tierThresholds.map((t) => (
            <div key={t.tier} className="border border-[#1D1D1D] p-4">
              <p className="font-ibm-mono text-[10px] tracking-[2px] mb-1" style={{ color: t.color }}>{t.tier.toUpperCase()}</p>
              <p className="font-grotesk text-[20px] font-bold" style={{ color: t.color }}>{t.rate}</p>
              <p className="font-ibm-mono text-[10px] text-[#666] mt-1">{t.range}</p>
            </div>
          ))}
        </div>
        <p className="font-ibm-mono text-[10px] text-[#444] mt-4">GROW commissions taper: 100% m1, 50% m2–6, 25% m7–12, 0% after 12 months.</p>
      </div>

      {/* Partner cards */}
      <div className="grid grid-cols-2 gap-5">
        {partners.map((p) => (
          <div key={p.id} className="border border-[#1D1D1D] bg-[#0F0F0F] p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-ibm-mono text-[9px] tracking-[2px] px-2 py-0.5" style={{ background: p.tierColor + "20", color: p.tierColor }}>
                    {p.tier.toUpperCase()}
                  </span>
                  <span className="font-ibm-mono text-[9px] text-[#555]">{p.id}</span>
                </div>
                <h3 className="font-grotesk text-[18px] font-bold text-[#F5F5F0]">{p.name}</h3>
                <p className="font-ibm-mono text-[11px] text-[#777] mt-0.5">{p.email}</p>
              </div>
              <span
                className="font-ibm-mono text-[9px] tracking-[1px] px-2 py-1"
                style={{
                  background: p.status === "Active" ? "#D6E26420" : "#FF6B3520",
                  color: p.status === "Active" ? "#D6E264" : "#FF6B35",
                }}
              >
                {p.status.toUpperCase()}
              </span>
            </div>
            <div className="border-t border-[#1D1D1D] pt-4 grid grid-cols-2 gap-3">
              {[
                { label: "Commission Rate", value: `${p.commissionRate}%` },
                { label: "Monthly Revenue", value: `£${p.monthlyRevenue.toLocaleString()}` },
                { label: "Deals Closed", value: p.totalClosed },
                { label: "Active Leads", value: p.activeLeads },
                { label: "Stripe", value: p.stripe },
                { label: "Joined", value: p.joinDate },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="font-ibm-mono text-[9px] text-[#555] tracking-[1px]">{label.toUpperCase()}</p>
                  <p className="font-ibm-mono text-[11px] text-[#CCCCCC] mt-0.5">{value}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
