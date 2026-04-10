"use client";

import { useState, useEffect } from "react";

export interface Package {
  id: string;
  icon: string;
  category: string;
  name: string;
  description: string;
  price: number;
  deliveryDays: number;
  popular?: boolean;
  features: string[];
  whatsIncluded: string[];
  requiresFrom: {
    label: string;
    type: "text" | "email" | "url" | "textarea" | "select";
    placeholder?: string;
    options?: string[];
    required: boolean;
  }[];
}

interface Props {
  pkg: Package;
  onClose: () => void;
}

type Step = 1 | 2 | 3;

const inputClass =
  "w-full bg-[#0A0A0A] border border-[#2D2D2D] text-[#F5F5F0] font-ibm-mono text-[12px] tracking-[0.5px] px-4 py-3 focus:outline-none focus:border-[#D6E264] transition-colors placeholder:text-[#777777]";

const labelClass = "font-ibm-mono text-[10px] font-bold text-[#AAAAAA] tracking-[2px] block mb-2";

export default function LaunchModal({ pkg, onClose }: Props) {
  const [step, setStep] = useState<Step>(1);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const [s1, setS1] = useState({
    firstName: "", lastName: "", email: "", phone: "", company: "", website: "",
  });
  const [s2, setS2] = useState<Record<string, string>>({});

  // lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const s1Valid = s1.firstName.trim() !== "" && s1.email.trim() !== "";

  function handleSubmit() {
    setSubmitting(true);
    // Build mailto with all collected data
    const requirements = pkg.requiresFrom
      .map((f) => `${f.label}: ${s2[f.label] || "(not provided)"}`)
      .join("\n");

    const body = encodeURIComponent(
      `PACKAGE: ${pkg.icon} ${pkg.name} — £${pkg.price.toLocaleString()} (${pkg.deliveryDays} days)\n\n` +
      `--- CUSTOMER DETAILS ---\n` +
      `Name: ${s1.firstName} ${s1.lastName}\n` +
      `Email: ${s1.email}\n` +
      `Phone: ${s1.phone || "—"}\n` +
      `Company: ${s1.company || "—"}\n` +
      `Website: ${s1.website || "—"}\n\n` +
      `--- PROJECT REQUIREMENTS ---\n${requirements}`
    );

    const subject = encodeURIComponent(`New LAUNCH Order — ${pkg.name} — ${s1.firstName} ${s1.lastName}`);
    window.location.href = `mailto:hello@vazgro.com?subject=${subject}&body=${body}`;
    setTimeout(() => {
      setSubmitting(false);
      setDone(true);
    }, 800);
  }

  const steps = [
    { n: 1, label: "YOUR DETAILS" },
    { n: 2, label: "REQUIREMENTS" },
    { n: 3, label: "CONFIRM" },
  ];

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-6"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-[#0F0F0F] border border-[#2D2D2D] w-full sm:max-w-[560px] flex flex-col max-h-[95dvh] overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1D1D1D] shrink-0">
          <div>
            <span className="font-ibm-mono text-[10px] text-[#999999] tracking-[2px]">⚡ LAUNCH · {pkg.name.toUpperCase()}</span>
            <div className="flex items-center gap-3 mt-1">
              <span className="font-grotesk text-[28px] font-bold text-[#F5F5F0] tracking-[-1px] leading-none">
                £{pkg.price.toLocaleString()}
              </span>
              <span className="font-ibm-mono text-[10px] text-[#AAAAAA] tracking-[1px] border border-[#2D2D2D] px-2 py-1">
                ⏱ {pkg.deliveryDays} DAYS
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center border border-[#2D2D2D] hover:border-[#555] text-[#AAAAAA] hover:text-[#F5F5F0] transition-colors cursor-pointer bg-transparent"
            aria-label="Close"
          >
            <span className="font-ibm-mono text-[12px]">✕</span>
          </button>
        </div>

        {/* Step bar */}
        <div className="flex border-b border-[#1D1D1D] shrink-0">
          {steps.map((s) => (
            <div
              key={s.n}
              className="flex-1 py-3 text-center border-r last:border-r-0 border-[#1D1D1D] transition-colors"
              style={{
                background: step === s.n ? "#D6E264" : step > s.n ? "#0F0F0F" : "#0A0A0A",
              }}
            >
              <span
                className="font-ibm-mono text-[9px] font-bold tracking-[2px]"
                style={{ color: step === s.n ? "#0A0A0A" : step > s.n ? "#D6E264" : "#333" }}
              >
                {step > s.n ? "✓ " : ""}{s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-6">

          {/* Step 1 — Details */}
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <h3 className="font-grotesk text-[18px] font-bold text-[#F5F5F0] tracking-[-0.5px]">
                Let&apos;s start with your details
              </h3>
              <div className="grid grid-cols-2 gap-[2px]">
                <div>
                  <label className={labelClass}>FIRST NAME *</label>
                  <input className={inputClass} placeholder="Marcus" value={s1.firstName} onChange={(e) => setS1((p) => ({ ...p, firstName: e.target.value }))} />
                </div>
                <div>
                  <label className={labelClass}>LAST NAME</label>
                  <input className={inputClass} placeholder="Harrison" value={s1.lastName} onChange={(e) => setS1((p) => ({ ...p, lastName: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className={labelClass}>EMAIL ADDRESS *</label>
                <input type="email" className={inputClass} placeholder="you@company.co.uk" value={s1.email} onChange={(e) => setS1((p) => ({ ...p, email: e.target.value }))} />
              </div>
              <div>
                <label className={labelClass}>PHONE</label>
                <input className={inputClass} placeholder="+44 07..." value={s1.phone} onChange={(e) => setS1((p) => ({ ...p, phone: e.target.value }))} />
              </div>
              <div>
                <label className={labelClass}>COMPANY</label>
                <input className={inputClass} placeholder="Your company" value={s1.company} onChange={(e) => setS1((p) => ({ ...p, company: e.target.value }))} />
              </div>
              <div>
                <label className={labelClass}>CURRENT WEBSITE <span className="font-normal text-[#777777]">(OPTIONAL)</span></label>
                <input className={inputClass} placeholder="https://..." value={s1.website} onChange={(e) => setS1((p) => ({ ...p, website: e.target.value }))} />
              </div>
              <button
                onClick={() => setStep(2)}
                disabled={!s1Valid}
                className="w-full h-[52px] bg-[#D6E264] hover:bg-[#c9d64f] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer border-none font-grotesk text-[12px] font-bold text-[#0A0A0A] tracking-[2px] mt-2"
              >
                NEXT: PROJECT REQUIREMENTS →
              </button>
            </div>
          )}

          {/* Step 2 — Requirements */}
          {step === 2 && (
            <div className="flex flex-col gap-4">
              <div>
                <h3 className="font-grotesk text-[18px] font-bold text-[#F5F5F0] tracking-[-0.5px]">
                  What&apos;s included & what we need
                </h3>
                <p className="font-ibm-mono text-[11px] text-[#AAAAAA] tracking-[0.5px] mt-1">
                  Review the package, then fill in what you can provide.
                </p>
              </div>

              {/* What's included */}
              <div className="flex flex-col gap-2 p-4 border border-[#D6E264] bg-[#0A0A0A]">
                <span className="font-ibm-mono text-[9px] font-bold text-[#D6E264] tracking-[2px]">WHAT&apos;S INCLUDED</span>
                {pkg.whatsIncluded.map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <span className="font-ibm-mono text-[10px] text-[#D6E264] mt-0.5 shrink-0">✓</span>
                    <span className="font-ibm-mono text-[11px] text-[#CCCCCC] tracking-[0.5px] leading-[1.5]">{item}</span>
                  </div>
                ))}
              </div>

              {/* Fields */}
              <span className="font-ibm-mono text-[9px] font-bold text-[#999999] tracking-[2px]">WHAT WE NEED FROM YOU</span>
              {pkg.requiresFrom.map((field) => (
                <div key={field.label}>
                  <label className={labelClass}>
                    {field.label.toUpperCase()}
                    {field.required ? " *" : <span className="font-normal text-[#777777]"> (OPTIONAL)</span>}
                  </label>
                  {field.type === "textarea" ? (
                    <textarea
                      className={`${inputClass} min-h-[80px] resize-none`}
                      placeholder={field.placeholder}
                      value={s2[field.label] || ""}
                      onChange={(e) => setS2((p) => ({ ...p, [field.label]: e.target.value }))}
                    />
                  ) : field.type === "select" ? (
                    <select
                      className={`${inputClass} cursor-pointer`}
                      value={s2[field.label] || ""}
                      onChange={(e) => setS2((p) => ({ ...p, [field.label]: e.target.value }))}
                    >
                      <option value="">Select...</option>
                      {field.options?.map((opt) => <option key={opt}>{opt}</option>)}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      className={inputClass}
                      placeholder={field.placeholder}
                      value={s2[field.label] || ""}
                      onChange={(e) => setS2((p) => ({ ...p, [field.label]: e.target.value }))}
                    />
                  )}
                </div>
              ))}

              <div className="flex gap-[2px] mt-2">
                <button
                  onClick={() => setStep(1)}
                  className="h-[52px] px-6 bg-[#111111] border border-[#2D2D2D] hover:border-[#555] transition-colors cursor-pointer border-none font-ibm-mono text-[10px] text-[#AAAAAA] tracking-[2px]"
                >
                  ← BACK
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 h-[52px] bg-[#D6E264] hover:bg-[#c9d64f] transition-colors cursor-pointer border-none font-grotesk text-[12px] font-bold text-[#0A0A0A] tracking-[2px]"
                >
                  NEXT: REVIEW & CONFIRM →
                </button>
              </div>
            </div>
          )}

          {/* Step 3 — Confirm */}
          {step === 3 && !done && (
            <div className="flex flex-col gap-4">
              <h3 className="font-grotesk text-[18px] font-bold text-[#F5F5F0] tracking-[-0.5px]">
                Review your order
              </h3>

              {/* Order summary */}
              <div className="flex flex-col gap-3 p-5 bg-[#0A0A0A] border border-[#2D2D2D]">
                <div className="flex items-start justify-between pb-3 border-b border-[#1D1D1D]">
                  <div>
                    <span className="font-grotesk text-[16px] font-bold text-[#F5F5F0]">{pkg.icon} {pkg.name}</span>
                    <p className="font-ibm-mono text-[10px] text-[#AAAAAA] tracking-[1px] mt-1">DELIVERED IN {pkg.deliveryDays} DAYS</p>
                  </div>
                  <span className="font-grotesk text-[22px] font-bold text-[#D6E264] tracking-[-1px]">£{pkg.price.toLocaleString()}</span>
                </div>
                <div>
                  <span className="font-ibm-mono text-[9px] text-[#999999] tracking-[2px]">ORDER FOR</span>
                  <p className="font-ibm-mono text-[12px] text-[#CCCCCC] mt-1">{s1.firstName} {s1.lastName}</p>
                  <p className="font-ibm-mono text-[11px] text-[#AAAAAA]">{s1.email}{s1.company ? ` · ${s1.company}` : ""}</p>
                </div>
              </div>

              {/* What happens next */}
              <div className="flex flex-col gap-2 p-4 bg-[#0A0A0A] border border-[#1D1D1D]">
                <span className="font-ibm-mono text-[9px] font-bold text-[#D6E264] tracking-[2px]">WHAT HAPPENS NEXT</span>
                {[
                  "Your request is sent directly to our team",
                  "Your dedicated PM contacts you within 2 business hours",
                  "We confirm scope, send invoice, and kick off your project",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="font-ibm-mono text-[10px] text-[#D6E264] shrink-0 mt-0.5">{`0${i + 1}`}</span>
                    <span className="font-ibm-mono text-[11px] text-[#BBBBBB] tracking-[0.5px] leading-[1.5]">{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-[2px] mt-2">
                <button
                  onClick={() => setStep(2)}
                  className="h-[52px] px-6 bg-[#111111] border border-[#2D2D2D] hover:border-[#555] transition-colors cursor-pointer border-none font-ibm-mono text-[10px] text-[#AAAAAA] tracking-[2px]"
                >
                  ← BACK
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 h-[52px] bg-[#D6E264] hover:bg-[#c9d64f] disabled:opacity-40 transition-colors cursor-pointer border-none font-grotesk text-[12px] font-bold text-[#0A0A0A] tracking-[2px]"
                >
                  {submitting ? "OPENING EMAIL..." : `SUBMIT REQUEST — £${pkg.price.toLocaleString()} →`}
                </button>
              </div>
              <p className="font-ibm-mono text-[10px] text-[#777777] text-center tracking-[1px]">
                OPENS YOUR EMAIL CLIENT · NO CARD REQUIRED YET
              </p>
            </div>
          )}

          {/* Done */}
          {done && (
            <div className="flex flex-col items-center text-center gap-5 py-6">
              <div className="w-[64px] h-[64px] bg-[#D6E264] flex items-center justify-center">
                <span className="text-[28px]">✓</span>
              </div>
              <div>
                <h3 className="font-grotesk text-[22px] font-bold text-[#F5F5F0] tracking-[-1px]">Request sent!</h3>
                <p className="font-ibm-mono text-[12px] text-[#AAAAAA] tracking-[0.5px] leading-[1.7] mt-2 max-w-[360px]">
                  Check your email client — your order details have been pre-filled. We&apos;ll reply within 2 business hours to confirm and kick off your project.
                </p>
              </div>
              <button
                onClick={onClose}
                className="h-[48px] px-8 bg-[#1A1A1A] border border-[#2D2D2D] hover:border-[#D6E264] transition-colors cursor-pointer border-none font-grotesk text-[11px] font-bold text-[#F5F5F0] tracking-[2px]"
              >
                CLOSE
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
