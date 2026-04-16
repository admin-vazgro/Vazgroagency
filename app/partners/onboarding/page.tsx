import Link from "next/link";
import { firstParam, getPartnerContext, type PartnerSearchParams } from "@/app/partners/lib";
import { saveTaxFormAction } from "@/app/partners/actions";

const inputClass =
  "w-full border border-[var(--portal-border-strong)] bg-[var(--portal-bg)] px-4 py-3 font-ibm-mono text-[14px] text-[var(--portal-text)] focus:border-[var(--portal-accent)] focus:outline-none";
const labelClass = "mb-2 block font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-text-soft)]";

export default async function OnboardingPage(props: {
  searchParams?: Promise<PartnerSearchParams>;
}) {
  const { partner, profile } = await getPartnerContext();
  const searchParams = props.searchParams ? await props.searchParams : {};
  const statusMessage = firstParam(searchParams.status);
  const errorMessage = firstParam(searchParams.error);

  const steps = [
    {
      key: "account",
      label: "Account approved",
      done: partner.status === "active",
      detail: partner.status === "active"
        ? "Your account has been approved by Vazgro."
        : `Status: ${partner.status}. Vazgro will review and approve your application.`,
    },
    {
      key: "business",
      label: "Business details submitted",
      done: !!partner.company_name,
      detail: partner.company_name
        ? `Registered as: ${partner.company_name}`
        : "Fill in your company information below.",
    },
    {
      key: "tax",
      label: "Tax form uploaded",
      done: !!partner.tax_form_url,
      detail: partner.tax_form_url
        ? "Tax form on file."
        : "Upload your signed tax declaration (W-8/W-9 or self-assessment form).",
    },
    {
      key: "kyc",
      label: "KYC verified",
      done: !!partner.kyc_verified,
      detail: partner.kyc_verified
        ? "Identity verified."
        : "Vazgro verifies identity once business details and tax form are submitted.",
    },
  ];

  const allDone = steps.every((s) => s.done);
  const completedCount = steps.filter((s) => s.done).length;

  return (
    <div className="p-8">
      <div className="mb-8 border-b border-[var(--portal-border)] pb-6">
        <span className="font-ibm-mono text-[14px] text-[var(--portal-accent)] tracking-[3px]">// ONBOARDING</span>
        <h1 className="mt-1 font-grotesk text-[32px] font-normal tracking-[-1px] text-[var(--portal-text)]">
          Complete Your Setup
        </h1>
        <p className="mt-1 font-ibm-mono text-[14px] tracking-[0.5px] text-[var(--portal-text-soft)]">
          {completedCount} of {steps.length} steps complete
          {allDone ? " · Full portal access unlocked." : " · Complete all steps to unlock lead pool access and commission payouts."}
        </p>
      </div>

      {statusMessage && (
        <div className="mb-6 border border-[var(--portal-accent)] bg-[var(--portal-accent-soft)] px-4 py-3">
          <p className="font-ibm-mono text-[14px] text-[var(--portal-accent)]">{statusMessage}</p>
        </div>
      )}
      {errorMessage && (
        <div className="mb-6 border border-[var(--portal-warning)] bg-[var(--portal-warning-soft)] px-4 py-3">
          <p className="font-ibm-mono text-[14px] text-[var(--portal-warning)]">{errorMessage}</p>
        </div>
      )}

      {/* Progress steps */}
      <div className="mb-8 grid grid-cols-1 gap-3 lg:grid-cols-4">
        {steps.map((step, i) => (
          <div
            key={step.key}
            className="border p-4"
            style={{
              borderColor: step.done ? "var(--portal-accent)" : "var(--portal-border)",
              background: step.done ? "var(--portal-accent-soft)" : "var(--portal-surface)",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-5 h-5 flex items-center justify-center font-ibm-mono text-[14px]"
                style={{
                  background: step.done ? "var(--portal-accent)" : "var(--portal-border-strong)",
                  color: step.done ? "var(--portal-accent-contrast)" : "var(--portal-text-dim)",
                }}
              >
                {step.done ? "✓" : i + 1}
              </div>
              <span
                className="font-ibm-mono text-[14px] tracking-[1px]"
                style={{ color: step.done ? "var(--portal-accent)" : "var(--portal-text-soft)" }}
              >
                {step.done ? "DONE" : "PENDING"}
              </span>
            </div>
            <p
              className="font-ibm-mono text-[14px] mb-1"
              style={{ color: step.done ? "var(--portal-text)" : "var(--portal-text-muted)" }}
            >
              {step.label}
            </p>
            <p className="font-ibm-mono text-[14px] text-[var(--portal-text-dim)] leading-[1.5]">{step.detail}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        {/* Main form */}
        <form action={saveTaxFormAction} className="border border-[var(--portal-border)] bg-[var(--portal-surface)]">
          <div className="px-6 py-4 border-b border-[var(--portal-border)]">
            <p className="font-ibm-mono text-[14px] text-[var(--portal-text)] tracking-[2px]">BUSINESS DETAILS</p>
            <p className="font-ibm-mono text-[14px] text-[var(--portal-text-dim)] mt-1">Required for commission payouts and compliance.</p>
          </div>
          <div className="p-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div>
              <label className={labelClass}>COMPANY / TRADING NAME *</label>
              <input
                name="company_name"
                defaultValue={partner.company_name ?? ""}
                required
                className={inputClass}
                placeholder="Acme Ltd"
              />
            </div>
            <div>
              <label className={labelClass}>COMPANY REGISTRATION NUMBER</label>
              <input
                name="company_number"
                className={inputClass}
                placeholder="12345678"
              />
            </div>
            <div>
              <label className={labelClass}>VAT NUMBER (IF APPLICABLE)</label>
              <input
                name="vat_number"
                className={inputClass}
                placeholder="GB123456789"
              />
            </div>
            <div>
              <label className={labelClass}>TAX FORM URL</label>
              <input
                name="tax_form_url"
                type="url"
                defaultValue={partner.tax_form_url ?? ""}
                className={inputClass}
                placeholder="https://drive.google.com/..."
              />
              <p className="mt-1.5 font-ibm-mono text-[14px] text-[var(--portal-text-dim)] leading-[1.5]">
                Upload your completed tax declaration to Google Drive or Dropbox and paste the link here.
              </p>
            </div>

            <div className="lg:col-span-2 border-t border-[var(--portal-border)] pt-4">
              <p className="font-ibm-mono text-[14px] text-[var(--portal-text)] tracking-[2px] mb-4">BANK DETAILS (FOR PAYOUTS)</p>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div>
                  <label className={labelClass}>ACCOUNT NAME</label>
                  <input name="bank_account_name" className={inputClass} placeholder="John Smith" />
                </div>
                <div>
                  <label className={labelClass}>SORT CODE</label>
                  <input name="bank_sort_code" className={inputClass} placeholder="00-00-00" />
                </div>
                <div>
                  <label className={labelClass}>ACCOUNT NUMBER</label>
                  <input name="bank_account_number" className={inputClass} placeholder="12345678" />
                </div>
              </div>
              <p className="mt-3 font-ibm-mono text-[14px] text-[var(--portal-text-dim)] leading-[1.5]">
                Bank details are stored securely and used only for commission payouts via Stripe Connect.
              </p>
            </div>
          </div>
          <div className="px-6 pb-6 flex gap-3">
            <button
              type="submit"
              className="bg-[var(--portal-accent)] px-6 py-3 font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-accent-contrast)] hover:bg-[var(--portal-accent-hover)] transition-colors border-none cursor-pointer"
            >
              SAVE & SUBMIT →
            </button>
            <Link
              href="/partners"
              className="border border-[var(--portal-border-strong)] px-6 py-3 font-ibm-mono text-[14px] tracking-[2px] text-[var(--portal-text-soft)] hover:text-[var(--portal-text)] transition-colors"
            >
              BACK TO DASHBOARD
            </Link>
          </div>
        </form>

        {/* Right panel */}
        <div className="flex flex-col gap-4">
          {/* What happens next */}
          <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)] p-5">
            <p className="font-ibm-mono text-[14px] text-[var(--portal-text)] tracking-[2px] mb-4">WHAT HAPPENS NEXT</p>
            <div className="flex flex-col gap-3">
              {[
                { step: "1", text: "Submit your business details and tax form link above." },
                { step: "2", text: "Vazgro reviews your submission — usually within 1 business day." },
                { step: "3", text: "We verify your identity and bank details via Stripe Connect." },
                { step: "4", text: "KYC confirmed — lead pool access and commission payouts unlocked." },
              ].map(({ step, text }) => (
                <div key={step} className="flex gap-3">
                  <div
                    className="w-5 h-5 flex items-center justify-center font-ibm-mono text-[14px] shrink-0 mt-0.5"
                    style={{ background: "var(--portal-border-strong)", color: "var(--portal-text-dim)" }}
                  >
                    {step}
                  </div>
                  <p className="font-ibm-mono text-[14px] text-[var(--portal-text-soft)] leading-[1.6]">{text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Account status */}
          <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)] p-5">
            <p className="font-ibm-mono text-[14px] text-[var(--portal-text)] tracking-[2px] mb-4">YOUR ACCOUNT</p>
            <div className="flex flex-col gap-2">
              {[
                { label: "Name", value: [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") || "—" },
                { label: "Email", value: profile?.email || "—" },
                { label: "Partner type", value: partner.type?.replace(/_/g, " ") || "—" },
                { label: "Account status", value: partner.status },
                {
                  label: "KYC",
                  value: partner.kyc_verified ? "Verified" : "Pending",
                  highlight: !partner.kyc_verified,
                },
              ].map(({ label, value, highlight }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="font-ibm-mono text-[14px] text-[var(--portal-text-dim)]">{label}</span>
                  <span
                    className="font-ibm-mono text-[14px]"
                    style={{ color: highlight ? "var(--portal-warning)" : "var(--portal-text-muted)" }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Help */}
          <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)] p-5">
            <p className="font-ibm-mono text-[14px] text-[var(--portal-text)] tracking-[2px] mb-2">NEED HELP?</p>
            <p className="font-ibm-mono text-[14px] text-[var(--portal-text-dim)] leading-[1.7]">
              Email{" "}
              <a href="mailto:partners@vazgro.com" className="text-[var(--portal-accent)] hover:opacity-80 transition-opacity">
                partners@vazgro.com
              </a>{" "}
              or message your account contact for assistance with onboarding.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
