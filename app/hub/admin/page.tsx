"use client";

import { useState } from "react";

const settings = [
  { key: "commission_tiers", label: "Commission Tiers", value: "tier1=15%, tier2=20%, tier3=25%", description: "Monthly revenue thresholds for partner tier promotion." },
  { key: "tier2_threshold", label: "Tier 2 Threshold", value: "10000", description: "Monthly closed revenue (£) to qualify for Tier 2." },
  { key: "tier3_threshold", label: "Tier 3 Threshold", value: "25000", description: "Monthly closed revenue (£) to qualify for Tier 3." },
  { key: "grow_taper_m2_6", label: "GROW Taper M2–6", value: "50", description: "Commission % of base rate for GROW months 2–6." },
  { key: "grow_taper_m7_12", label: "GROW Taper M7–12", value: "25", description: "Commission % of base rate for GROW months 7–12." },
  { key: "sla_new_lead_hours", label: "SLA: New Lead Response", value: "72", description: "Hours to make first contact on a new lead." },
  { key: "sla_proposal_hours", label: "SLA: Proposal Delivery", value: "120", description: "Hours to deliver a proposal from discovery completion." },
  { key: "concurrent_leads_cap", label: "Concurrent Lead Cap", value: "5", description: "Max concurrent active leads per partner." },
  { key: "claw_back_window_days", label: "Clawback Window", value: "30", description: "Days after payout that commission can be clawed back on refund." },
];

const team = [
  { name: "Rohith M.", email: "rohith@vazgro.com", role: "admin" },
  { name: "Priya K.", email: "priya@vazgro.com", role: "staff" },
  { name: "Aisha B.", email: "aisha@vazgro.com", role: "staff" },
  { name: "Tom W.", email: "tom@vazgro.com", role: "staff" },
];

export default function AdminPage() {
  const [editKey, setEditKey] = useState<string | null>(null);
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(settings.map((s) => [s.key, s.value]))
  );
  const [saved, setSaved] = useState<string | null>(null);

  function save(key: string) {
    setSaved(key);
    setEditKey(null);
    setTimeout(() => setSaved(null), 2000);
  }

  return (
    <div className="p-8">
      <div className="mb-8 border-b border-[#1D1D1D] pb-6">
        <span className="font-ibm-mono text-[10px] text-[#D6E264] tracking-[3px]">// ADMIN</span>
        <h1 className="font-grotesk text-[32px] font-bold text-[#F5F5F0] tracking-[-1px] mt-1">Admin Dashboard</h1>
        <p className="font-ibm-mono text-[12px] text-[#888] tracking-[0.5px] mt-1">Business rules, team management, and system configuration.</p>
      </div>

      <div className="grid grid-cols-[1fr_320px] gap-8 items-start">
        {/* Hub settings */}
        <div>
          <div className="border border-[#1D1D1D] bg-[#0F0F0F] mb-6">
            <div className="px-6 py-4 border-b border-[#1D1D1D]">
              <p className="font-ibm-mono text-[10px] text-[#AAAAAA] tracking-[2px]">HUB SETTINGS</p>
              <p className="font-ibm-mono text-[10px] text-[#444] mt-1">All business rules are configurable without code changes.</p>
            </div>
            <div className="divide-y divide-[#1D1D1D]">
              {settings.map((s) => (
                <div key={s.key} className="px-6 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-ibm-mono text-[11px] text-[#CCCCCC] font-bold">{s.label}</p>
                      <p className="font-ibm-mono text-[10px] text-[#555] mt-0.5 leading-[1.5]">{s.description}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {editKey === s.key ? (
                        <>
                          <input
                            value={values[s.key]}
                            onChange={(e) => setValues({ ...values, [s.key]: e.target.value })}
                            className="bg-[#0A0A0A] border border-[#D6E264] text-[#F5F5F0] font-ibm-mono text-[12px] px-3 py-1.5 focus:outline-none w-40"
                          />
                          <button onClick={() => save(s.key)} className="font-ibm-mono text-[10px] text-[#D6E264] cursor-pointer bg-transparent border-none tracking-[1px]">SAVE</button>
                          <button onClick={() => setEditKey(null)} className="font-ibm-mono text-[10px] text-[#555] cursor-pointer bg-transparent border-none">CANCEL</button>
                        </>
                      ) : (
                        <>
                          <span className="font-ibm-mono text-[12px] text-[#F5F5F0]">{values[s.key]}{saved === s.key ? " ✓" : ""}</span>
                          <button onClick={() => setEditKey(s.key)} className="font-ibm-mono text-[10px] text-[#555] hover:text-[#D6E264] cursor-pointer bg-transparent border-none tracking-[1px] transition-colors">EDIT</button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — team */}
        <div className="flex flex-col gap-4">
          <div className="border border-[#1D1D1D] bg-[#0F0F0F]">
            <div className="px-5 py-4 border-b border-[#1D1D1D] flex items-center justify-between">
              <span className="font-ibm-mono text-[10px] text-[#AAAAAA] tracking-[2px]">TEAM MEMBERS</span>
              <button className="font-ibm-mono text-[9px] text-[#D6E264] cursor-pointer bg-transparent border-none tracking-[1px]">+ INVITE</button>
            </div>
            <div className="divide-y divide-[#1D1D1D]">
              {team.map((member) => (
                <div key={member.email} className="px-5 py-4 flex items-center justify-between">
                  <div>
                    <p className="font-ibm-mono text-[11px] text-[#CCCCCC]">{member.name}</p>
                    <p className="font-ibm-mono text-[10px] text-[#555] mt-0.5">{member.email}</p>
                  </div>
                  <span
                    className="font-ibm-mono text-[9px] tracking-[1px] px-2 py-0.5"
                    style={{ background: member.role === "admin" ? "#D6E26420" : "#FFFFFF10", color: member.role === "admin" ? "#D6E264" : "#666" }}
                  >
                    {member.role.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* System status */}
          <div className="border border-[#1D1D1D] bg-[#0F0F0F] p-5">
            <p className="font-ibm-mono text-[10px] text-[#AAAAAA] tracking-[2px] mb-4">SYSTEM STATUS</p>
            <div className="flex flex-col gap-2">
              {[
                { label: "Supabase", status: "Operational" },
                { label: "Stripe Connect", status: "Operational" },
                { label: "Email (OTP)", status: "Operational" },
                { label: "SLA Monitor", status: "Operational" },
              ].map(({ label, status }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="font-ibm-mono text-[11px] text-[#888]">{label}</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#D6E264]" />
                    <span className="font-ibm-mono text-[10px] text-[#D6E264]">{status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
