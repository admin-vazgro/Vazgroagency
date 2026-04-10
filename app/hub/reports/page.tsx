export default function ReportsPage() {
  const months = ["Oct 25", "Nov 25", "Dec 25", "Jan 26", "Feb 26", "Mar 26"];
  const revenue = [4200, 6800, 5100, 9300, 11200, 13800];
  const maxRev = Math.max(...revenue);

  const pillarBreakdown = [
    { pillar: "LAUNCH", revenue: 8200, deals: 4, color: "#D6E264" },
    { pillar: "GROW", revenue: 3600, deals: 3, color: "#FF6B35" },
    { pillar: "BUILD", revenue: 2000, deals: 1, color: "#888" },
  ];

  const topPartners = [
    { name: "James H.", closed: 3, revenue: 12500, commission: 2500 },
    { name: "Sara M.", closed: 2, revenue: 4500, commission: 675 },
  ];

  return (
    <div className="p-8">
      <div className="mb-8 border-b border-[#1D1D1D] pb-6">
        <span className="font-ibm-mono text-[10px] text-[#D6E264] tracking-[3px]">// REPORTS</span>
        <h1 className="font-grotesk text-[32px] font-bold text-[#F5F5F0] tracking-[-1px] mt-1">Reports & Analytics</h1>
        <p className="font-ibm-mono text-[12px] text-[#888] tracking-[0.5px] mt-1">Rolling 6-month view · Last updated 10 Apr 2026</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "MRR", value: "£13,800", delta: "↑ 23% vs last month" },
          { label: "Total Revenue (6mo)", value: "£50,400", delta: "£8,400 avg/mo" },
          { label: "Deals Closed (6mo)", value: "11", delta: "Avg £4,582/deal" },
          { label: "Churn Rate", value: "0%", delta: "0 clients lost" },
        ].map(({ label, value, delta }) => (
          <div key={label} className="border border-[#1D1D1D] bg-[#0F0F0F] p-5">
            <p className="font-ibm-mono text-[10px] text-[#666] tracking-[1px] mb-2">{label.toUpperCase()}</p>
            <p className="font-grotesk text-[26px] font-bold text-[#D6E264]">{value}</p>
            <p className="font-ibm-mono text-[10px] text-[#555] mt-1">{delta}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-[1fr_280px] gap-6 mb-6">
        {/* Revenue chart (bar) */}
        <div className="border border-[#1D1D1D] bg-[#0F0F0F] p-6">
          <p className="font-ibm-mono text-[10px] text-[#AAAAAA] tracking-[2px] mb-6">MONTHLY REVENUE</p>
          <div className="flex items-end gap-4 h-40">
            {months.map((m, i) => (
              <div key={m} className="flex-1 flex flex-col items-center gap-2">
                <span className="font-ibm-mono text-[9px] text-[#777]">£{(revenue[i] / 1000).toFixed(1)}k</span>
                <div
                  className="w-full transition-all"
                  style={{
                    height: `${(revenue[i] / maxRev) * 120}px`,
                    background: i === months.length - 1 ? "#D6E264" : "#2D2D2D",
                  }}
                />
                <span className="font-ibm-mono text-[9px] text-[#555]">{m}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pillar breakdown */}
        <div className="border border-[#1D1D1D] bg-[#0F0F0F] p-6">
          <p className="font-ibm-mono text-[10px] text-[#AAAAAA] tracking-[2px] mb-6">PILLAR BREAKDOWN (6MO)</p>
          <div className="flex flex-col gap-4">
            {pillarBreakdown.map((p) => {
              const pct = Math.round((p.revenue / pillarBreakdown.reduce((s, b) => s + b.revenue, 0)) * 100);
              return (
                <div key={p.pillar}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-ibm-mono text-[10px]" style={{ color: p.color }}>{p.pillar}</span>
                    <span className="font-ibm-mono text-[10px] text-[#CCCCCC]">£{p.revenue.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-[#1D1D1D] h-2">
                    <div className="h-2" style={{ width: `${pct}%`, background: p.color }} />
                  </div>
                  <p className="font-ibm-mono text-[9px] text-[#555] mt-1">{p.deals} deals · {pct}%</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Partner performance */}
      <div className="border border-[#1D1D1D] bg-[#0F0F0F]">
        <div className="px-6 py-4 border-b border-[#1D1D1D]">
          <span className="font-ibm-mono text-[10px] text-[#AAAAAA] tracking-[2px]">PARTNER PERFORMANCE (6MO)</span>
        </div>
        <div className="grid grid-cols-[1fr_80px_120px_120px] gap-4 px-5 py-3 border-b border-[#1D1D1D]">
          {["Partner", "Closed", "Revenue", "Commission Paid"].map((h) => (
            <span key={h} className="font-ibm-mono text-[9px] text-[#555] tracking-[2px]">{h}</span>
          ))}
        </div>
        {topPartners.map((p) => (
          <div key={p.name} className="grid grid-cols-[1fr_80px_120px_120px] gap-4 px-5 py-4 border-b border-[#1D1D1D] hover:bg-[#111] transition-colors">
            <span className="font-ibm-mono text-[11px] text-[#CCCCCC]">{p.name}</span>
            <span className="font-ibm-mono text-[11px] text-[#CCCCCC]">{p.closed}</span>
            <span className="font-ibm-mono text-[11px] text-[#CCCCCC]">£{p.revenue.toLocaleString()}</span>
            <span className="font-ibm-mono text-[11px] text-[#D6E264]">£{p.commission.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
