"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    firstName: "Alex",
    lastName: "Chen",
    email: "alex@company.com",
    company: "Acme Corp",
    website: "https://acme.com",
    phone: "+44 7700 900000",
  });

  const [notifs, setNotifs] = useState({
    newDeliverable: true,
    requestUpdates: true,
    invoiceDue: true,
    milestoneComplete: true,
    weeklyDigest: false,
  });

  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const inputClass = "w-full bg-[#0A0A0A] border border-[#2D2D2D] text-[#F5F5F0] font-ibm-mono text-[12px] px-4 py-3 focus:outline-none focus:border-[#D6E264] transition-colors placeholder:text-[#444]";

  return (
    <div className="p-8">
      <div className="mb-8 border-b border-[#1D1D1D] pb-6">
        <span className="font-ibm-mono text-[10px] text-[#D6E264] tracking-[3px]">// SETTINGS</span>
        <h1 className="font-grotesk text-[32px] font-bold text-[#F5F5F0] tracking-[-1px] mt-1">Settings</h1>
        <p className="font-ibm-mono text-[12px] text-[#888] tracking-[0.5px] mt-1">Manage your profile, notifications, and account preferences.</p>
      </div>

      <div className="grid grid-cols-[1fr_320px] gap-8 items-start">
        <div className="flex flex-col gap-6">
          {/* Profile */}
          <div className="border border-[#1D1D1D] bg-[#0F0F0F]">
            <div className="px-6 py-4 border-b border-[#1D1D1D]">
              <span className="font-ibm-mono text-[10px] text-[#AAAAAA] tracking-[2px]">PROFILE INFORMATION</span>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              <div>
                <label className="font-ibm-mono text-[10px] text-[#888] tracking-[2px] block mb-2">FIRST NAME</label>
                <input className={inputClass} value={profile.firstName} onChange={(e) => setProfile({ ...profile, firstName: e.target.value })} />
              </div>
              <div>
                <label className="font-ibm-mono text-[10px] text-[#888] tracking-[2px] block mb-2">LAST NAME</label>
                <input className={inputClass} value={profile.lastName} onChange={(e) => setProfile({ ...profile, lastName: e.target.value })} />
              </div>
              <div>
                <label className="font-ibm-mono text-[10px] text-[#888] tracking-[2px] block mb-2">EMAIL ADDRESS</label>
                <input className={inputClass} type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
              </div>
              <div>
                <label className="font-ibm-mono text-[10px] text-[#888] tracking-[2px] block mb-2">PHONE</label>
                <input className={inputClass} value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
              </div>
              <div>
                <label className="font-ibm-mono text-[10px] text-[#888] tracking-[2px] block mb-2">COMPANY</label>
                <input className={inputClass} value={profile.company} onChange={(e) => setProfile({ ...profile, company: e.target.value })} />
              </div>
              <div>
                <label className="font-ibm-mono text-[10px] text-[#888] tracking-[2px] block mb-2">WEBSITE</label>
                <input className={inputClass} value={profile.website} onChange={(e) => setProfile({ ...profile, website: e.target.value })} />
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="border border-[#1D1D1D] bg-[#0F0F0F]">
            <div className="px-6 py-4 border-b border-[#1D1D1D]">
              <span className="font-ibm-mono text-[10px] text-[#AAAAAA] tracking-[2px]">EMAIL NOTIFICATIONS</span>
            </div>
            <div className="divide-y divide-[#1D1D1D]">
              {(Object.entries(notifs) as [keyof typeof notifs, boolean][]).map(([key, val]) => {
                const labels: Record<keyof typeof notifs, string> = {
                  newDeliverable: "New deliverable uploaded",
                  requestUpdates: "Request status updates",
                  invoiceDue: "Invoice due reminders",
                  milestoneComplete: "Milestone completed",
                  weeklyDigest: "Weekly progress digest",
                };
                return (
                  <div key={key} className="px-6 py-4 flex items-center justify-between">
                    <span className="font-ibm-mono text-[12px] text-[#CCCCCC]">{labels[key]}</span>
                    <button
                      onClick={() => setNotifs({ ...notifs, [key]: !val })}
                      className="w-10 h-5 relative cursor-pointer border-none p-0 transition-colors"
                      style={{ background: val ? "#D6E264" : "#2D2D2D" }}
                    >
                      <span
                        className="absolute top-0.5 w-4 h-4 bg-[#0A0A0A] transition-all"
                        style={{ left: val ? "calc(100% - 18px)" : "2px" }}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={handleSave}
            className="w-full h-[52px] font-grotesk text-[12px] font-bold tracking-[2px] transition-colors cursor-pointer border-none"
            style={{ background: saved ? "#1A2A0A" : "#D6E264", color: saved ? "#D6E264" : "#0A0A0A" }}
          >
            {saved ? "SAVED ✓" : "SAVE CHANGES →"}
          </button>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          {/* Security */}
          <div className="border border-[#1D1D1D] bg-[#0F0F0F] p-5">
            <p className="font-ibm-mono text-[10px] text-[#AAAAAA] tracking-[2px] mb-4">SECURITY</p>
            <button className="w-full py-3 border border-[#2D2D2D] font-ibm-mono text-[10px] text-[#888] tracking-[2px] hover:text-[#CCCCCC] hover:border-[#555] transition-colors cursor-pointer bg-transparent mb-3">
              SEND MAGIC LINK
            </button>
            <button className="w-full py-3 border border-[#2D2D2D] font-ibm-mono text-[10px] text-[#888] tracking-[2px] hover:text-[#CCCCCC] hover:border-[#555] transition-colors cursor-pointer bg-transparent">
              CHANGE PASSWORD
            </button>
            <p className="font-ibm-mono text-[10px] text-[#444] mt-4 leading-[1.6]">
              We recommend using magic link — no password to remember or lose.
            </p>
          </div>

          {/* Danger zone */}
          <div className="border border-[#FF6B3540] bg-[#0F0F0F] p-5">
            <p className="font-ibm-mono text-[10px] text-[#FF6B35] tracking-[2px] mb-4">DANGER ZONE</p>
            <button className="w-full py-3 border border-[#FF6B3540] font-ibm-mono text-[10px] text-[#FF6B35] tracking-[2px] hover:bg-[#FF6B3510] transition-colors cursor-pointer bg-transparent">
              DELETE ACCOUNT
            </button>
            <p className="font-ibm-mono text-[10px] text-[#444] mt-3 leading-[1.6]">
              This will permanently remove your account and all data. This action cannot be undone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
