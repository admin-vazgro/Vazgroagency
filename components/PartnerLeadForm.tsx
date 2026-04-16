"use client";

import { useState, useMemo } from "react";

// ─── Pricing catalogue ─────────────────────────────────────────────────────────
// Prices reflect the public services pages (£). null = custom BUILD pricing.
const PILLAR_SERVICES: Record<string, { label: string; price: number | null }[]> = {
  LAUNCH: [
    { label: "Landing Page", price: 149 },
    { label: "Starter Website", price: 199 },
    { label: "Business Website", price: 499 },
    { label: "E-Commerce Store", price: 999 },
    { label: "Brand Starter Kit", price: 299 },
    { label: "AI Chatbot Setup", price: 799 },
    { label: "Automation Quick-Win", price: 599 },
  ],
  GROW: [
    { label: "Design Retainer (£349/mo)", price: 349 },
    { label: "Development Retainer (£799/mo)", price: 799 },
    { label: "Social Media Management (£399/mo)", price: 399 },
  ],
  BUILD: [
    { label: "MVP Development (custom)", price: null },
    { label: "AI Product (custom)", price: null },
    { label: "Custom Platform (custom)", price: null },
    { label: "Sprint Retainer (custom)", price: null },
  ],
};

const PILLAR_HINT: Record<string, string> = {
  LAUNCH: "One-time project fees · £149–£999",
  GROW: "Monthly retainers from £349/mo · 3-month minimum",
  BUILD: "Custom scoped projects · £3,999–£25,000+",
};

const inputClass =
  "w-full border border-[var(--portal-border-strong)] bg-[var(--portal-bg)] px-4 py-3 font-ibm-mono text-[14px] text-[var(--portal-text)] focus:border-[var(--portal-accent)] focus:outline-none";
const labelClass =
  "mb-2 block font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-text-soft)]";

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  closerRate: number;
  cancelHref: string;
};

export default function PartnerLeadForm({ action, closerRate, cancelHref }: Props) {
  const [pillar, setPillar] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [customValue, setCustomValue] = useState("");

  const services = pillar ? PILLAR_SERVICES[pillar] ?? [] : [];
  const isBuild = pillar === "BUILD";

  // Auto-compute estimated value from selected LAUNCH/GROW services
  const autoValue = useMemo(() => {
    if (isBuild || !pillar) return null;
    const total = selectedServices.reduce((sum, label) => {
      const svc = services.find((s) => s.label === label);
      return sum + (svc?.price ?? 0);
    }, 0);
    return total > 0 ? total : null;
  }, [selectedServices, services, isBuild, pillar]);

  const estimatedValue = isBuild
    ? Number(customValue) || 0
    : autoValue ?? 0;

  const commissionPreview =
    estimatedValue > 0 ? Math.round(estimatedValue * closerRate) / 100 : null;

  function toggleService(label: string) {
    setSelectedServices((prev) =>
      prev.includes(label) ? prev.filter((s) => s !== label) : [...prev, label]
    );
  }

  function handlePillarChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setPillar(e.target.value);
    setSelectedServices([]);
    setCustomValue("");
  }

  return (
    <form action={action} className="mb-8 border border-[var(--portal-border)] bg-[var(--portal-surface)]">
      <div className="px-6 py-4 border-b border-[var(--portal-border)]">
        <p className="font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-text)]">SUBMIT A NEW LEAD</p>
        <p className="font-ibm-mono text-[14px] text-[var(--portal-text-dim)] mt-1">
          Your closer commission: <span className="text-[var(--portal-accent)]">{closerRate}%</span> on closed value.
        </p>
      </div>

      <div className="p-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Contact details */}
        <div>
          <label className={labelClass}>FIRST NAME *</label>
          <input name="first_name" required className={inputClass} placeholder="Alex" />
        </div>
        <div>
          <label className={labelClass}>LAST NAME</label>
          <input name="last_name" className={inputClass} placeholder="Smith" />
        </div>
        <div>
          <label className={labelClass}>EMAIL *</label>
          <input type="email" name="email" required className={inputClass} placeholder="alex@company.com" />
        </div>
        <div>
          <label className={labelClass}>PHONE</label>
          <input name="phone" className={inputClass} placeholder="+44 7700 000000" />
        </div>
        <div>
          <label className={labelClass}>COMPANY</label>
          <input name="company" className={inputClass} placeholder="Company Ltd" />
        </div>
        <div>
          <label className={labelClass}>WEBSITE</label>
          <input name="website" className={inputClass} placeholder="https://..." />
        </div>
        <div>
          <label className={labelClass}>COUNTRY</label>
          <input name="country" defaultValue="GB" className={inputClass} />
        </div>

        {/* Pillar */}
        <div>
          <label className={labelClass}>SERVICE PILLAR</label>
          <select
            name="pillar"
            value={pillar}
            onChange={handlePillarChange}
            className={inputClass}
          >
            <option value="">Select pillar</option>
            <option value="LAUNCH">LAUNCH — One-time projects</option>
            <option value="GROW">GROW — Monthly retainers</option>
            <option value="BUILD">BUILD — Custom scoped</option>
          </select>
          {pillar && (
            <p className="mt-1.5 font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">
              {PILLAR_HINT[pillar]}
            </p>
          )}
        </div>

        {/* Service selector */}
        {pillar && services.length > 0 && (
          <div className="lg:col-span-2">
            <label className={labelClass}>SERVICES INTERESTED IN</label>
            <div className="grid grid-cols-2 gap-2 lg:grid-cols-3">
              {services.map((svc) => {
                const checked = selectedServices.includes(svc.label);
                return (
                  <label
                    key={svc.label}
                    className="flex items-center gap-2 border border-[var(--portal-border)] p-3 cursor-pointer hover:border-[var(--portal-accent)] transition-colors"
                    style={{
                      borderColor: checked ? "var(--portal-accent)" : undefined,
                      background: checked ? "var(--portal-accent-soft)" : undefined,
                    }}
                  >
                    <input
                      type="checkbox"
                      name="services_interested"
                      value={svc.label}
                      checked={checked}
                      onChange={() => toggleService(svc.label)}
                      className="accent-[var(--portal-accent)]"
                    />
                    <div>
                      <span className="font-ibm-mono text-[14px] text-[var(--portal-text)]">{svc.label}</span>
                      {svc.price !== null && (
                        <span className="ml-1.5 font-ibm-mono text-[14px] text-[var(--portal-accent)]">
                          £{svc.price.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* Estimated value */}
        {pillar && (
          <div className="lg:col-span-2">
            <label className={labelClass}>
              ESTIMATED DEAL VALUE (£)
              {!isBuild && " — AUTO-CALCULATED FROM SELECTED SERVICES"}
            </label>
            {isBuild ? (
              <>
                <input
                  name="estimated_value_gbp"
                  type="number"
                  min="0"
                  step="100"
                  value={customValue}
                  onChange={(e) => setCustomValue(e.target.value)}
                  className={inputClass}
                  placeholder="e.g. 8000"
                />
                <p className="mt-1.5 font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">
                  Enter your best estimate. This helps us prioritise and size the opportunity.
                </p>
              </>
            ) : (
              <>
                <input
                  name="estimated_value_gbp"
                  type="hidden"
                  value={autoValue ?? ""}
                />
                <div
                  className="border border-[var(--portal-border)] px-4 py-3 font-ibm-mono text-[14px]"
                  style={{ background: "var(--portal-surface-alt)", color: "var(--portal-text-muted)" }}
                >
                  {autoValue ? `£${autoValue.toLocaleString()}` : "Select services above to calculate"}
                </div>
              </>
            )}

            {/* Commission preview */}
            {commissionPreview !== null && commissionPreview > 0 && (
              <div className="mt-3 border border-[var(--portal-accent)] bg-[var(--portal-accent-soft)] px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="font-ibm-mono text-[14px] tracking-[1px] text-[var(--portal-accent)]">
                    YOUR COMMISSION ESTIMATE
                  </p>
                  <p className="font-ibm-mono text-[14px] text-[var(--portal-text-dim)] mt-0.5">
                    {closerRate}% closer rate × £{estimatedValue.toLocaleString()} deal value
                  </p>
                </div>
                <p className="font-grotesk text-[24px] font-normal text-[var(--portal-accent)]">
                  £{commissionPreview.toLocaleString()}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Notes */}
        <div className="lg:col-span-2">
          <label className={labelClass}>NOTES / CONTEXT</label>
          <textarea
            name="notes"
            rows={4}
            className="w-full resize-y border border-[var(--portal-border-strong)] bg-[var(--portal-bg)] px-4 py-3 font-ibm-mono text-[14px] text-[var(--portal-text)] focus:border-[var(--portal-accent)] focus:outline-none"
            placeholder="Background on the lead, their challenges, timeline, budget signals..."
          />
        </div>

        {/* Actions */}
        <div className="lg:col-span-2 flex gap-3">
          <button
            type="submit"
            className="bg-[var(--portal-accent)] px-5 py-3 font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-accent-contrast)] transition-colors hover:bg-[var(--portal-accent-hover)]"
          >
            SUBMIT LEAD →
          </button>
          <a
            href={cancelHref}
            className="border border-[var(--portal-border-strong)] px-5 py-3 font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-text-soft)] transition-colors hover:text-[var(--portal-text)]"
          >
            CANCEL
          </a>
        </div>
      </div>
    </form>
  );
}
