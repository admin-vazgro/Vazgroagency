"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    website: "",
    phone: "",
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

  const inputClass = "w-full bg-[var(--portal-bg)] border border-[var(--portal-border-strong)] text-[var(--portal-text)] font-ibm-mono text-[12px] px-4 py-3 focus:outline-none focus:border-[var(--portal-accent)] transition-colors placeholder:text-[var(--portal-text-faint)]";

  return (
    <div className="p-8">
      <div className="mb-8 border-b border-[var(--portal-border)] pb-6">
        <span className="font-ibm-mono text-[10px] text-[var(--portal-accent)] tracking-[3px]">// SETTINGS</span>
        <h1 className="font-grotesk text-[32px] font-bold text-[var(--portal-text)] tracking-[-1px] mt-1">Settings</h1>
        <p className="font-ibm-mono text-[12px] text-[var(--portal-text-soft)] tracking-[0.5px] mt-1">Manage your profile, notifications, and account preferences.</p>
      </div>

      <div className="grid grid-cols-[1fr_320px] gap-8 items-start">
        <div className="flex flex-col gap-6">
          {/* Profile */}
          <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)]">
            <div className="px-6 py-4 border-b border-[var(--portal-border)]">
              <span className="font-ibm-mono text-[10px] text-[var(--portal-text)] tracking-[2px]">PROFILE INFORMATION</span>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              <div>
                <label className="font-ibm-mono text-[10px] text-[var(--portal-text-soft)] tracking-[2px] block mb-2">FIRST NAME</label>
                <input className={inputClass} value={profile.firstName} onChange={(e) => setProfile({ ...profile, firstName: e.target.value })} />
              </div>
              <div>
                <label className="font-ibm-mono text-[10px] text-[var(--portal-text-soft)] tracking-[2px] block mb-2">LAST NAME</label>
                <input className={inputClass} value={profile.lastName} onChange={(e) => setProfile({ ...profile, lastName: e.target.value })} />
              </div>
              <div>
                <label className="font-ibm-mono text-[10px] text-[var(--portal-text-soft)] tracking-[2px] block mb-2">EMAIL ADDRESS</label>
                <input className={inputClass} type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
              </div>
              <div>
                <label className="font-ibm-mono text-[10px] text-[var(--portal-text-soft)] tracking-[2px] block mb-2">PHONE</label>
                <input className={inputClass} value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
              </div>
              <div>
                <label className="font-ibm-mono text-[10px] text-[var(--portal-text-soft)] tracking-[2px] block mb-2">COMPANY</label>
                <input className={inputClass} value={profile.company} onChange={(e) => setProfile({ ...profile, company: e.target.value })} />
              </div>
              <div>
                <label className="font-ibm-mono text-[10px] text-[var(--portal-text-soft)] tracking-[2px] block mb-2">WEBSITE</label>
                <input className={inputClass} value={profile.website} onChange={(e) => setProfile({ ...profile, website: e.target.value })} />
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)]">
            <div className="px-6 py-4 border-b border-[var(--portal-border)]">
              <span className="font-ibm-mono text-[10px] text-[var(--portal-text)] tracking-[2px]">EMAIL NOTIFICATIONS</span>
            </div>
            <div className="divide-y divide-[var(--portal-border)]">
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
                    <span className="font-ibm-mono text-[12px] text-[var(--portal-text-muted)]">{labels[key]}</span>
                    <button
                      onClick={() => setNotifs({ ...notifs, [key]: !val })}
                      className="w-10 h-5 relative cursor-pointer border-none p-0 transition-colors"
                      style={{ background: val ? "var(--portal-accent)" : "var(--portal-border-strong)" }}
                    >
                      <span
                        className="absolute top-0.5 w-4 h-4 bg-[var(--portal-bg)] transition-all"
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
            style={{ background: saved ? "var(--portal-success-tint)" : "var(--portal-accent)", color: saved ? "var(--portal-accent)" : "var(--portal-accent-contrast)" }}
          >
            {saved ? "SAVED ✓" : "SAVE CHANGES →"}
          </button>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          {/* Security */}
          <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)] p-5">
            <p className="font-ibm-mono text-[10px] text-[var(--portal-text)] tracking-[2px] mb-4">SECURITY</p>
            <button className="w-full py-3 border border-[var(--portal-border-strong)] font-ibm-mono text-[10px] text-[var(--portal-text-soft)] tracking-[2px] hover:text-[var(--portal-text-muted)] hover:border-[var(--portal-border-strong)] transition-colors cursor-pointer bg-transparent mb-3">
              SEND MAGIC LINK
            </button>
            <button className="w-full py-3 border border-[var(--portal-border-strong)] font-ibm-mono text-[10px] text-[var(--portal-text-soft)] tracking-[2px] hover:text-[var(--portal-text-muted)] hover:border-[var(--portal-border-strong)] transition-colors cursor-pointer bg-transparent">
              CHANGE PASSWORD
            </button>
            <p className="font-ibm-mono text-[10px] text-[var(--portal-text-faint)] mt-4 leading-[1.6]">
              We recommend using magic link — no password to remember or lose.
            </p>
          </div>

          {/* Danger zone */}
          <div className="border border-[var(--portal-warning-strong-soft)] bg-[var(--portal-surface)] p-5">
            <p className="font-ibm-mono text-[10px] text-[var(--portal-warning)] tracking-[2px] mb-4">DANGER ZONE</p>
            <button className="w-full py-3 border border-[var(--portal-warning-strong-soft)] font-ibm-mono text-[10px] text-[var(--portal-warning)] tracking-[2px] hover:bg-[var(--portal-warning-soft)] transition-colors cursor-pointer bg-transparent">
              DELETE ACCOUNT
            </button>
            <p className="font-ibm-mono text-[10px] text-[var(--portal-text-faint)] mt-3 leading-[1.6]">
              This will permanently remove your account and all data. This action cannot be undone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
