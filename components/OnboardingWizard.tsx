"use client";

import { useState } from "react";

interface Props {
  profileName: string;
  onDismiss: () => void;
}

type Step = 1 | 2 | 3 | 4 | 5 | 6;

const inputClass =
  "w-full border border-[var(--portal-border-strong)] bg-[var(--portal-bg)] px-4 py-3 font-ibm-mono text-[12px] text-[var(--portal-text)] focus:border-[var(--portal-accent)] focus:outline-none placeholder:text-[var(--portal-text-dim)]";
const labelClass = "block font-ibm-mono text-[9px] tracking-[1.5px] text-[var(--portal-text-dim)] mb-1.5";

export default function OnboardingWizard({ profileName, onDismiss }: Props) {
  const [step, setStep] = useState<Step>(1);
  const [submitting, setSubmitting] = useState(false);

  const [brand, setBrand] = useState({ name: "", website: "", what_you_do: "", audience: "", tone: "" });
  const [inviteEmail, setInviteEmail] = useState("");
  const [notifEmail, setNotifEmail] = useState(true);

  const steps = [
    { n: 1, label: "Welcome" },
    { n: 2, label: "Your Brand" },
    { n: 3, label: "Upload Assets" },
    { n: 4, label: "Invite Team" },
    { n: 5, label: "Notifications" },
    { n: 6, label: "Done" },
  ];

  async function handleStep4Invite() {
    if (!inviteEmail.trim()) {
      setStep(5);
      return;
    }
    setSubmitting(true);
    try {
      await fetch("/api/workspace/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail.trim(), role: "member" }),
      });
    } catch { /* non-fatal */ }
    setSubmitting(false);
    setStep(5);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}>
      <div className="w-full max-w-[560px] border border-[var(--portal-border)] bg-[var(--portal-surface)]">

        {/* Header */}
        <div className="border-b border-[var(--portal-border)] px-6 py-4">
          <div className="flex items-center justify-between">
            <span className="font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-accent)]">// WELCOME TO YOUR WORKSPACE</span>
            <button onClick={onDismiss} className="font-ibm-mono text-[10px] text-[var(--portal-text-dim)] hover:text-[var(--portal-text-soft)] bg-transparent border-none cursor-pointer">
              SKIP
            </button>
          </div>
          {/* Progress bar */}
          <div className="mt-3 h-1 w-full bg-[var(--portal-border)]">
            <div
              className="h-1 bg-[var(--portal-accent)] transition-all duration-500"
              style={{ width: `${((step - 1) / 5) * 100}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between">
            {steps.map((s) => (
              <span
                key={s.n}
                className="font-ibm-mono text-[9px]"
                style={{ color: step === s.n ? "var(--portal-accent)" : step > s.n ? "var(--portal-text-soft)" : "var(--portal-text-dim)" }}
              >
                {step > s.n ? "✓" : s.n}
              </span>
            ))}
          </div>
        </div>

        {/* Step content */}
        <div className="p-6">

          {step === 1 && (
            <div className="flex flex-col gap-5">
              <div>
                <h2 className="font-grotesk text-[24px] font-normal tracking-[-1px] text-[var(--portal-text)]">Welcome, {profileName}.</h2>
                <p className="mt-2 font-ibm-mono text-[12px] leading-[1.8] text-[var(--portal-text-soft)]">
                  Your workspace is ready. This quick setup takes 2 minutes and helps your Vazgro team start work immediately.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                {["Tell us about your brand", "Upload logos or guidelines (optional)", "Invite your team (optional)", "Set notification preferences", "You're ready to go"].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="font-ibm-mono text-[10px] text-[var(--portal-accent)]">0{i + 1}</span>
                    <span className="font-ibm-mono text-[11px] text-[var(--portal-text-soft)]">{item}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setStep(2)}
                className="h-[48px] w-full border-none bg-[var(--portal-accent)] hover:bg-[var(--portal-accent-hover)] font-grotesk text-[11px] font-bold text-[var(--portal-accent-contrast)] tracking-[1.5px] transition-colors cursor-pointer"
              >
                GET STARTED →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-4">
              <h2 className="font-grotesk text-[20px] font-normal tracking-[-0.5px] text-[var(--portal-text)]">Tell us about your brand</h2>
              <div>
                <label className={labelClass}>BRAND / COMPANY NAME</label>
                <input className={inputClass} placeholder="Acme Ltd" value={brand.name} onChange={(e) => setBrand(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div>
                <label className={labelClass}>WEBSITE</label>
                <input className={inputClass} placeholder="https://yoursite.com" value={brand.website} onChange={(e) => setBrand(p => ({ ...p, website: e.target.value }))} />
              </div>
              <div>
                <label className={labelClass}>WHAT DO YOU DO?</label>
                <textarea className={`${inputClass} min-h-[70px] resize-none`} placeholder="Brief description of your business" value={brand.what_you_do} onChange={(e) => setBrand(p => ({ ...p, what_you_do: e.target.value }))} />
              </div>
              <div>
                <label className={labelClass}>TARGET AUDIENCE</label>
                <input className={inputClass} placeholder="e.g. UK SMEs in finance" value={brand.audience} onChange={(e) => setBrand(p => ({ ...p, audience: e.target.value }))} />
              </div>
              <div>
                <label className={labelClass}>TONE OF VOICE</label>
                <select className={inputClass} value={brand.tone} onChange={(e) => setBrand(p => ({ ...p, tone: e.target.value }))}>
                  <option value="">Select...</option>
                  <option>Professional & formal</option>
                  <option>Friendly & approachable</option>
                  <option>Bold & modern</option>
                  <option>Technical & precise</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="h-[44px] px-5 border border-[var(--portal-border)] bg-transparent font-ibm-mono text-[10px] text-[var(--portal-text-muted)] cursor-pointer">← BACK</button>
                <button onClick={() => setStep(3)} className="h-[44px] flex-1 border-none bg-[var(--portal-accent)] hover:bg-[var(--portal-accent-hover)] font-ibm-mono text-[10px] tracking-[1.5px] text-[var(--portal-accent-contrast)] cursor-pointer">
                  NEXT →
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-5">
              <h2 className="font-grotesk text-[20px] font-normal tracking-[-0.5px] text-[var(--portal-text)]">Upload brand basics</h2>
              <p className="font-ibm-mono text-[11px] leading-[1.7] text-[var(--portal-text-soft)]">
                Upload your logos and brand guidelines so your team can start without waiting. This is optional — you can do it any time from Brand Hub.
              </p>
              <div className="border border-dashed border-[var(--portal-border-strong)] p-8 text-center">
                <p className="font-ibm-mono text-[11px] text-[var(--portal-text-soft)]">File uploads go to Brand Hub → Brand Library</p>
                <p className="mt-2 font-ibm-mono text-[10px] text-[var(--portal-text-dim)]">Upload via Brand Hub after setup</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="h-[44px] px-5 border border-[var(--portal-border)] bg-transparent font-ibm-mono text-[10px] text-[var(--portal-text-muted)] cursor-pointer">← BACK</button>
                <button onClick={() => setStep(4)} className="h-[44px] flex-1 border-none bg-[var(--portal-accent)] hover:bg-[var(--portal-accent-hover)] font-ibm-mono text-[10px] tracking-[1.5px] text-[var(--portal-accent-contrast)] cursor-pointer">
                  NEXT → <span className="opacity-60">(skip)</span>
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="flex flex-col gap-5">
              <h2 className="font-grotesk text-[20px] font-normal tracking-[-0.5px] text-[var(--portal-text)]">Invite your team</h2>
              <p className="font-ibm-mono text-[11px] leading-[1.7] text-[var(--portal-text-soft)]">
                Add colleagues to your workspace. They&apos;ll get a magic link via email. This is optional.
              </p>
              <div>
                <label className={labelClass}>COLLEAGUE EMAIL</label>
                <input
                  type="email"
                  className={inputClass}
                  placeholder="colleague@company.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(3)} className="h-[44px] px-5 border border-[var(--portal-border)] bg-transparent font-ibm-mono text-[10px] text-[var(--portal-text-muted)] cursor-pointer">← BACK</button>
                <button onClick={handleStep4Invite} disabled={submitting} className="h-[44px] flex-1 border-none bg-[var(--portal-accent)] hover:bg-[var(--portal-accent-hover)] font-ibm-mono text-[10px] tracking-[1.5px] text-[var(--portal-accent-contrast)] cursor-pointer disabled:opacity-50">
                  {submitting ? "INVITING..." : inviteEmail ? "INVITE & CONTINUE →" : "SKIP →"}
                </button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="flex flex-col gap-5">
              <h2 className="font-grotesk text-[20px] font-normal tracking-[-0.5px] text-[var(--portal-text)]">Notification preferences</h2>
              <div className="flex flex-col gap-3">
                {[
                  { label: "Email notifications", desc: "Deliverable ready, request updates, team messages", state: notifEmail, set: setNotifEmail },
                ].map((item) => (
                  <label key={item.label} className="flex items-start gap-4 cursor-pointer border border-[var(--portal-border)] bg-[var(--portal-bg)] p-4">
                    <div
                      className="mt-0.5 h-5 w-5 flex-shrink-0 border-2 flex items-center justify-center transition-colors"
                      style={{
                        background: item.state ? "var(--portal-accent)" : "transparent",
                        borderColor: item.state ? "var(--portal-accent)" : "var(--portal-border-strong)",
                      }}
                      onClick={() => item.set(!item.state)}
                    >
                      {item.state && <span className="font-ibm-mono text-[10px] text-[var(--portal-accent-contrast)]">✓</span>}
                    </div>
                    <div>
                      <p className="font-ibm-mono text-[11px] text-[var(--portal-text)]">{item.label}</p>
                      <p className="mt-0.5 font-ibm-mono text-[10px] text-[var(--portal-text-dim)]">{item.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(4)} className="h-[44px] px-5 border border-[var(--portal-border)] bg-transparent font-ibm-mono text-[10px] text-[var(--portal-text-muted)] cursor-pointer">← BACK</button>
                <button onClick={() => setStep(6)} className="h-[44px] flex-1 border-none bg-[var(--portal-accent)] hover:bg-[var(--portal-accent-hover)] font-ibm-mono text-[10px] tracking-[1.5px] text-[var(--portal-accent-contrast)] cursor-pointer">
                  SAVE & CONTINUE →
                </button>
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="flex flex-col items-center text-center gap-5 py-4">
              <div className="h-16 w-16 bg-[var(--portal-accent)] flex items-center justify-center">
                <span className="text-[28px]">✓</span>
              </div>
              <div>
                <h2 className="font-grotesk text-[24px] font-normal tracking-[-1px] text-[var(--portal-text)]">You&apos;re all set.</h2>
                <p className="mt-2 font-ibm-mono text-[12px] leading-[1.8] text-[var(--portal-text-soft)]">
                  Your workspace is ready. Your first request has been added to the kanban so you can try it out.
                </p>
              </div>
              <button
                onClick={onDismiss}
                className="h-[48px] w-full border-none bg-[var(--portal-accent)] hover:bg-[var(--portal-accent-hover)] font-grotesk text-[11px] font-bold text-[var(--portal-accent-contrast)] tracking-[1.5px] transition-colors cursor-pointer"
              >
                GO TO MY WORKSPACE →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
