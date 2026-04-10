export default function ReportsPage() {
  const months: string[] = [];
  const revenue: number[] = [];
  const maxRev = revenue.length ? Math.max(...revenue) : 0;

  const pillarBreakdown: Array<{ pillar: string; revenue: number; deals: number; color: string }> = [];

  const topPartners: Array<{ name: string; closed: number; revenue: number; commission: number }> = [];

  return (
    <div className="p-8">
      <div className="mb-8 border-b border-[var(--portal-border)] pb-6">
        <span className="font-ibm-mono text-[10px] text-[var(--portal-accent)] tracking-[3px]">// REPORTS</span>
        <h1 className="font-grotesk text-[32px] font-bold text-[var(--portal-text)] tracking-[-1px] mt-1">Reports & Analytics</h1>
        <p className="font-ibm-mono text-[12px] text-[var(--portal-text-soft)] tracking-[0.5px] mt-1">Rolling 6-month view · Last updated 10 Apr 2026</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "MRR", value: "£0", delta: "No live reporting data yet" },
          { label: "Total Revenue (6mo)", value: "£0", delta: "No live reporting data yet" },
          { label: "Deals Closed (6mo)", value: "0", delta: "No live reporting data yet" },
          { label: "Churn Rate", value: "0%", delta: "No live reporting data yet" },
        ].map(({ label, value, delta }) => (
          <div key={label} className="border border-[var(--portal-border)] bg-[var(--portal-surface)] p-5">
            <p className="font-ibm-mono text-[10px] text-[var(--portal-text-muted)] tracking-[1px] mb-2">{label.toUpperCase()}</p>
            <p className="font-grotesk text-[26px] font-bold text-[var(--portal-accent)]">{value}</p>
            <p className="font-ibm-mono text-[10px] text-[var(--portal-text-dim)] mt-1">{delta}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-[1fr_280px] gap-6 mb-6">
        {/* Revenue chart (bar) */}
        <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)] p-6">
          <p className="font-ibm-mono text-[10px] text-[var(--portal-text)] tracking-[2px] mb-6">MONTHLY REVENUE</p>
          {months.length ? (
            <div className="flex items-end gap-4 h-40">
              {months.map((m, i) => (
              <div key={m} className="flex-1 flex flex-col items-center gap-2">
                <span className="font-ibm-mono text-[9px] text-[var(--portal-text-soft)]">£{(revenue[i] / 1000).toFixed(1)}k</span>
                <div
                  className="w-full transition-all"
                  style={{
                    height: `${(revenue[i] / maxRev) * 120}px`,
                    background: i === months.length - 1 ? "var(--portal-accent)" : "var(--portal-border-strong)",
                  }}
                />
                <span className="font-ibm-mono text-[9px] text-[var(--portal-text-dim)]">{m}</span>
              </div>
              ))}
            </div>
          ) : (
            <div className="py-12">
              <p className="font-ibm-mono text-[11px] text-[var(--portal-text-soft)]">No revenue data yet.</p>
            </div>
          )}
        </div>

        {/* Pillar breakdown */}
        <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)] p-6">
          <p className="font-ibm-mono text-[10px] text-[var(--portal-text)] tracking-[2px] mb-6">PILLAR BREAKDOWN (6MO)</p>
          <div className="flex flex-col gap-4">
            {pillarBreakdown.length ? pillarBreakdown.map((p) => {
              const pct = Math.round((p.revenue / pillarBreakdown.reduce((s, b) => s + b.revenue, 0)) * 100);
              return (
                <div key={p.pillar}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-ibm-mono text-[10px]" style={{ color: p.color }}>{p.pillar}</span>
                    <span className="font-ibm-mono text-[10px] text-[var(--portal-text-muted)]">£{p.revenue.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-[var(--portal-border)] h-2">
                    <div className="h-2" style={{ width: `${pct}%`, background: p.color }} />
                  </div>
                  <p className="font-ibm-mono text-[9px] text-[var(--portal-text-dim)] mt-1">{p.deals} deals · {pct}%</p>
                </div>
              );
            }) : (
              <p className="font-ibm-mono text-[11px] text-[var(--portal-text-soft)]">No pillar data yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Partner performance */}
      <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)]">
        <div className="px-6 py-4 border-b border-[var(--portal-border)]">
          <span className="font-ibm-mono text-[10px] text-[var(--portal-text)] tracking-[2px]">PARTNER PERFORMANCE (6MO)</span>
        </div>
        <div className="grid grid-cols-[1fr_80px_120px_120px] gap-4 px-5 py-3 border-b border-[var(--portal-border)]">
          {["Partner", "Closed", "Revenue", "Commission Paid"].map((h) => (
            <span key={h} className="font-ibm-mono text-[9px] text-[var(--portal-text-dim)] tracking-[2px]">{h}</span>
          ))}
        </div>
        {topPartners.map((p) => (
          <div key={p.name} className="grid grid-cols-[1fr_80px_120px_120px] gap-4 px-5 py-4 border-b border-[var(--portal-border)] hover:bg-[var(--portal-surface-alt)] transition-colors">
            <span className="font-ibm-mono text-[11px] text-[var(--portal-text-muted)]">{p.name}</span>
            <span className="font-ibm-mono text-[11px] text-[var(--portal-text-muted)]">{p.closed}</span>
            <span className="font-ibm-mono text-[11px] text-[var(--portal-text-muted)]">£{p.revenue.toLocaleString()}</span>
            <span className="font-ibm-mono text-[11px] text-[var(--portal-accent)]">£{p.commission.toLocaleString()}</span>
          </div>
        ))}
        {topPartners.length === 0 && (
          <div className="px-5 py-12">
            <p className="font-ibm-mono text-[11px] text-[var(--portal-text-soft)]">No partner performance data yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
