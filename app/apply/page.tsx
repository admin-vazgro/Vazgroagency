import Link from "next/link";
import { submitApplicationAction } from "./actions";

const inputClass =
  "w-full border border-gray-300 bg-white px-4 py-3 font-ibm-mono text-[13px] text-gray-900 focus:border-gray-900 focus:outline-none placeholder:text-gray-400";
const labelClass = "mb-2 block font-ibm-mono text-[10px] tracking-[2px] text-gray-500";

export default async function ApplyPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string; submitted?: string }>;
}) {
  const params = searchParams ? await searchParams : {};
  const submitted = params.submitted === "1";
  const error = params.error;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 px-8 py-5 flex items-center justify-between">
        <Link href="/" className="font-grotesk text-[20px] font-normal tracking-[-0.5px] text-gray-900">
          Vazgro
        </Link>
        <Link
          href="/login"
          className="font-ibm-mono text-[10px] tracking-[2px] text-gray-500 hover:text-gray-900 transition-colors"
        >
          Partner Login →
        </Link>
      </header>

      <main className="mx-auto max-w-[640px] px-8 py-16">
        {submitted ? (
          <div className="text-center">
            <div className="mb-6 inline-block border border-green-600 bg-green-50 px-6 py-4">
              <p className="font-ibm-mono text-[12px] text-green-700">Application received.</p>
            </div>
            <h1 className="font-grotesk text-[32px] font-normal tracking-[-1px] text-gray-900">
              Thanks for applying.
            </h1>
            <p className="mt-4 font-ibm-mono text-[12px] leading-[1.8] text-gray-500">
              We review every application and aim to respond within 1–2 business days.
              You'll receive an email with your login details once approved.
            </p>
            <p className="mt-6 font-ibm-mono text-[11px] text-gray-400">
              Questions?{" "}
              <a href="mailto:partners@vazgro.com" className="text-gray-700 hover:underline">
                partners@vazgro.com
              </a>
            </p>
          </div>
        ) : (
          <>
            <div className="mb-10 border-b border-gray-200 pb-8">
              <span className="font-ibm-mono text-[10px] tracking-[3px] text-gray-400">// PARTNER PROGRAMME</span>
              <h1 className="mt-2 font-grotesk text-[40px] font-normal tracking-[-1.5px] text-gray-900">
                Join as a Partner
              </h1>
              <p className="mt-3 font-ibm-mono text-[13px] leading-[1.8] text-gray-500">
                Refer clients or actively close deals — earn commissions on every client you bring to Vazgro.
                Tier 1 to Tier 3 based on your monthly revenue performance.
              </p>

              {/* Programme benefits */}
              <div className="mt-6 grid grid-cols-3 gap-4">
                {[
                  { label: "Tier 1", detail: "10% closer · 5% referrer" },
                  { label: "Tier 2", detail: "12% closer · 6% referrer" },
                  { label: "Tier 3", detail: "15% closer · 7% referrer" },
                ].map((tier) => (
                  <div key={tier.label} className="border border-gray-200 p-3">
                    <p className="font-ibm-mono text-[10px] tracking-[1px] text-gray-900">{tier.label}</p>
                    <p className="mt-0.5 font-ibm-mono text-[10px] text-gray-400">{tier.detail}</p>
                  </div>
                ))}
              </div>
              <p className="mt-3 font-ibm-mono text-[10px] text-gray-400 leading-[1.7]">
                Tiers are calculated automatically based on your total closed revenue each calendar month.
                Everyone starts at Tier 1 and upgrades as you close more business.
              </p>
            </div>

            {error && (
              <div className="mb-6 border border-red-300 bg-red-50 px-4 py-3">
                <p className="font-ibm-mono text-[11px] text-red-700">{decodeURIComponent(error)}</p>
              </div>
            )}

            <form action={submitApplicationAction} className="flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>FIRST NAME *</label>
                  <input name="first_name" required className={inputClass} placeholder="Alex" />
                </div>
                <div>
                  <label className={labelClass}>LAST NAME</label>
                  <input name="last_name" className={inputClass} placeholder="Smith" />
                </div>
              </div>

              <div>
                <label className={labelClass}>EMAIL ADDRESS *</label>
                <input type="email" name="email" required className={inputClass} placeholder="alex@company.com" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>PHONE</label>
                  <input name="phone" className={inputClass} placeholder="+44 7700 000000" />
                </div>
                <div>
                  <label className={labelClass}>COMPANY / TRADING NAME</label>
                  <input name="company_name" className={inputClass} placeholder="Smith Consulting Ltd" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>WEBSITE</label>
                  <input name="website" className={inputClass} placeholder="https://yoursite.com" />
                </div>
                <div>
                  <label className={labelClass}>LINKEDIN</label>
                  <input name="linkedin_url" className={inputClass} placeholder="https://linkedin.com/in/..." />
                </div>
              </div>

              <div>
                <label className={labelClass}>HOW DO YOU PLAN TO BRING CLIENTS? *</label>
                <textarea
                  name="description"
                  required
                  rows={4}
                  className="w-full border border-gray-300 bg-white px-4 py-3 font-ibm-mono text-[13px] text-gray-900 focus:border-gray-900 focus:outline-none placeholder:text-gray-400 resize-y"
                  placeholder="Tell us about your network, how you generate leads, or what kind of clients you typically work with..."
                />
              </div>

              <div>
                <label className={labelClass}>HOW DID YOU HEAR ABOUT THE PROGRAMME?</label>
                <select name="how_heard" className={inputClass}>
                  <option value="">Select an option</option>
                  <option value="referral">Referred by another partner</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="website">Vazgro website</option>
                  <option value="google">Google search</option>
                  <option value="event">Event or networking</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="border-t border-gray-200 pt-5">
                <button
                  type="submit"
                  className="w-full bg-gray-900 px-6 py-4 font-ibm-mono text-[11px] tracking-[3px] text-white hover:bg-gray-700 transition-colors"
                >
                  SUBMIT APPLICATION →
                </button>
                <p className="mt-3 font-ibm-mono text-[10px] text-center text-gray-400 leading-[1.7]">
                  By applying you agree to the{" "}
                  <Link href="/terms" className="underline hover:text-gray-700">
                    Partner Terms
                  </Link>
                  . We'll review your application and email you within 1–2 business days.
                </p>
              </div>
            </form>
          </>
        )}
      </main>
    </div>
  );
}
