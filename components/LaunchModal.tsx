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
  "w-full bg-[#0A0A0A] border border-[#2D2D2D] text-[#F5F5F0] font-ibm-mono text-[14px] tracking-[0.5px] px-4 py-3 focus:outline-none focus:border-[#D6E264] transition-colors placeholder:text-[#777777]";

const labelClass = "font-ibm-mono text-[14px] font-bold text-[#AAAAAA] tracking-[1.5px] md:tracking-[2px] block mb-2";

export default function LaunchModal({ pkg, onClose }: Props) {
  const [step, setStep] = useState<Step>(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [s1, setS1] = useState({
    firstName: "", lastName: "", email: "", phone: "", company: "", website: "",
  });
  const [s2, setS2] = useState<Record<string, string>>({});
  const [leadId, setLeadId] = useState<string | null>(null);

  // lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const s1Valid = s1.firstName.trim() !== "" && s1.email.trim() !== "";

  // Step 1 → Step 2: create lead in DB
  async function handleStep1Next() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: s1.firstName,
          last_name: s1.lastName || undefined,
          email: s1.email,
          phone: s1.phone || undefined,
          company: s1.company || undefined,
          website: s1.website || undefined,
          pillar: "LAUNCH",
          source: "website",
          package_id: pkg.id,
          package_name: pkg.name,
          package_price: pkg.price,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save details");
      setLeadId(data.id);
      setStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // Step 2 → Step 3: patch lead with requirements
  async function handleStep2Next() {
    setSubmitting(true);
    setError(null);
    try {
      if (leadId) {
        const requirements = pkg.requiresFrom.reduce<Record<string, string>>((acc, f) => {
          if (s2[f.label]) acc[f.label] = s2[f.label];
          return acc;
        }, {});
        await fetch(`/api/leads?id=${leadId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stage: "qualified", requirements }),
        });
      }
      setStep(3);
    } catch {
      // Non-fatal — still advance
      setStep(3);
    } finally {
      setSubmitting(false);
    }
  }

  // Step 3: create Stripe Checkout Session and redirect
  async function handleCheckout() {
    if (!leadId) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lead_id: leadId,
          mode: "payment",
          pillar: "LAUNCH",
          package_id: pkg.id,
          package_name: pkg.name,
          package_price: pkg.price,
          email: s1.email,
          name: [s1.firstName, s1.lastName].filter(Boolean).join(" "),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create checkout session");
      if (data.url) window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to open checkout. Please try again.");
      setSubmitting(false);
    }
  }

  const steps = [
    { n: 1, label: "YOUR DETAILS" },
    { n: 2, label: "REQUIREMENTS" },
    { n: 3, label: "REVIEW & PAY" },
  ];

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-6"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="flex max-h-[95dvh] w-full flex-col overflow-hidden border border-[#2D2D2D] bg-[#0F0F0F] sm:max-w-[560px]">

        {/* Header */}
        <div className="shrink-0 border-b border-[#1D1D1D] px-4 py-4 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <span className="font-ibm-mono text-[14px] text-[#999999] tracking-[1.5px] md:tracking-[2px] break-words">⚡ LAUNCH · {pkg.name.toUpperCase()}</span>
              <div className="mt-1 flex flex-wrap items-center gap-3">
                <span className="font-grotesk text-[24px] sm:text-[28px] font-bold text-[#F5F5F0] tracking-[-1px] leading-none">
                  £{pkg.price.toLocaleString()}
                </span>
                <span className="font-ibm-mono text-[14px] text-[#AAAAAA] tracking-[1px] border border-[#2D2D2D] px-2 py-1">
                  ⏱ {pkg.deliveryDays} DAYS
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center border border-[#2D2D2D] hover:border-[#555] text-[#AAAAAA] hover:text-[#F5F5F0] transition-colors cursor-pointer bg-transparent"
              aria-label="Close"
            >
              <span className="font-ibm-mono text-[14px]">✕</span>
            </button>
          </div>
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
                className="font-ibm-mono text-[14px] font-bold tracking-[1px] md:tracking-[2px]"
                style={{ color: step === s.n ? "#0A0A0A" : step > s.n ? "#D6E264" : "#333" }}
              >
                {step > s.n ? "✓ " : ""}{s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Error banner */}
        {error && (
          <div className="shrink-0 border-b border-[#FF4444] bg-[#1A0000] px-5 py-3">
            <p className="font-ibm-mono text-[14px] text-[#FF6666]">{error}</p>
          </div>
        )}

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">

          {/* Step 1 — Details */}
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <h3 className="font-grotesk text-[18px] font-bold text-[#F5F5F0] tracking-[-0.5px]">
                Let&apos;s start with your details
              </h3>
              <div className="grid grid-cols-1 gap-[2px] sm:grid-cols-2">
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
                onClick={handleStep1Next}
                disabled={!s1Valid || submitting}
                className="mt-2 h-[52px] w-full border-none bg-[#D6E264] font-grotesk text-[14px] font-bold text-[#0A0A0A] tracking-[1.5px] md:tracking-[2px] transition-colors cursor-pointer hover:bg-[#c9d64f] disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {submitting ? "SAVING..." : "NEXT: PROJECT REQUIREMENTS →"}
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
                <p className="font-ibm-mono text-[14px] text-[#AAAAAA] tracking-[0.5px] mt-1">
                  Review the package, then fill in what you can provide.
                </p>
              </div>

              {/* What's included */}
              <div className="flex flex-col gap-2 p-4 border border-[#D6E264] bg-[#0A0A0A]">
                <span className="font-ibm-mono text-[14px] font-bold text-[#D6E264] tracking-[1px] md:tracking-[2px]">WHAT&apos;S INCLUDED</span>
                {pkg.whatsIncluded.map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <span className="font-ibm-mono text-[14px] text-[#D6E264] mt-0.5 shrink-0">✓</span>
                    <span className="font-ibm-mono text-[14px] text-[#CCCCCC] tracking-[0.5px] leading-[1.5]">{item}</span>
                  </div>
                ))}
              </div>

              {/* Fields */}
              <span className="font-ibm-mono text-[14px] font-bold text-[#999999] tracking-[1px] md:tracking-[2px]">WHAT WE NEED FROM YOU</span>
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

              <div className="mt-2 flex flex-col gap-[2px] sm:flex-row">
                <button
                  onClick={() => setStep(1)}
                  disabled={submitting}
                  className="h-[52px] border border-[#2D2D2D] bg-[#111111] px-6 font-ibm-mono text-[14px] text-[#AAAAAA] tracking-[1.5px] md:tracking-[2px] transition-colors cursor-pointer border-none hover:border-[#555]"
                >
                  ← BACK
                </button>
                <button
                  onClick={handleStep2Next}
                  disabled={submitting}
                  className="h-[52px] flex-1 border-none bg-[#D6E264] font-grotesk text-[14px] font-bold text-[#0A0A0A] tracking-[1.5px] md:tracking-[2px] transition-colors cursor-pointer hover:bg-[#c9d64f] disabled:opacity-40"
                >
                  {submitting ? "SAVING..." : "NEXT: REVIEW & PAY →"}
                </button>
              </div>
            </div>
          )}

          {/* Step 3 — Review & Pay */}
          {step === 3 && (
            <div className="flex flex-col gap-4">
              <h3 className="font-grotesk text-[18px] font-bold text-[#F5F5F0] tracking-[-0.5px]">
                Review your order
              </h3>

              {/* Order summary */}
              <div className="flex flex-col gap-3 p-5 bg-[#0A0A0A] border border-[#2D2D2D]">
                <div className="flex items-start justify-between pb-3 border-b border-[#1D1D1D]">
                  <div>
                    <span className="font-grotesk text-[16px] font-bold text-[#F5F5F0]">{pkg.icon} {pkg.name}</span>
                    <p className="font-ibm-mono text-[14px] text-[#AAAAAA] tracking-[1px] mt-1">DELIVERED IN {pkg.deliveryDays} DAYS</p>
                  </div>
                  <span className="shrink-0 font-grotesk text-[20px] sm:text-[22px] font-bold text-[#D6E264] tracking-[-1px]">£{pkg.price.toLocaleString()}</span>
                </div>
                <div>
                  <span className="font-ibm-mono text-[14px] text-[#999999] tracking-[2px]">ORDER FOR</span>
                  <p className="font-ibm-mono text-[14px] text-[#CCCCCC] mt-1">{s1.firstName} {s1.lastName}</p>
                  <p className="font-ibm-mono text-[14px] text-[#AAAAAA]">{s1.email}{s1.company ? ` · ${s1.company}` : ""}</p>
                </div>
              </div>

              {/* What happens next */}
              <div className="flex flex-col gap-2 p-4 bg-[#0A0A0A] border border-[#1D1D1D]">
                <span className="font-ibm-mono text-[14px] font-bold text-[#D6E264] tracking-[1px] md:tracking-[2px]">WHAT HAPPENS NEXT</span>
                {[
                  "Pay securely via Stripe — card or bank transfer",
                  "Your workspace is created automatically on payment",
                  "You receive a magic link to your portal within 30 seconds",
                  "Your dedicated PM contacts you within 2 business hours",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="font-ibm-mono text-[14px] text-[#D6E264] shrink-0 mt-0.5">{`0${i + 1}`}</span>
                    <span className="font-ibm-mono text-[14px] text-[#BBBBBB] tracking-[0.5px] leading-[1.5]">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-2 flex flex-col gap-[2px] sm:flex-row">
                <button
                  onClick={() => setStep(2)}
                  disabled={submitting}
                  className="h-[52px] border border-[#2D2D2D] bg-[#111111] px-6 font-ibm-mono text-[14px] text-[#AAAAAA] tracking-[1.5px] md:tracking-[2px] transition-colors cursor-pointer border-none hover:border-[#555]"
                >
                  ← BACK
                </button>
                <button
                  onClick={handleCheckout}
                  disabled={submitting || !leadId}
                  className="h-[52px] flex-1 border-none bg-[#D6E264] font-grotesk text-[14px] font-bold text-[#0A0A0A] tracking-[1.5px] md:tracking-[2px] transition-colors cursor-pointer hover:bg-[#c9d64f] disabled:opacity-40"
                >
                  {submitting ? "OPENING CHECKOUT..." : `PAY £${pkg.price.toLocaleString()} SECURELY →`}
                </button>
              </div>
              <p className="font-ibm-mono text-[14px] text-[#777777] text-center tracking-[1px]">
                POWERED BY STRIPE · SSL ENCRYPTED · NO CARD STORED
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
