"use client";

import { useState } from "react";
import LaunchModal, { Package } from "@/components/LaunchModal";

const packages: Package[] = [
  {
    id: "landing-page",
    icon: "🏠",
    category: "Web & Digital",
    name: "Landing Page",
    description: "High-converting single page, 3-day delivery",
    price: 1,
    deliveryDays: 3,
    popular: false,
    features: ["Single conversion page", "Headline, benefits, social proof, CTA", "Form or booking integration", "Mobile optimised", "1 round of revisions"],
    whatsIncluded: ["1 fully designed landing page", "Form or Calendly/booking integration", "Mobile optimised", "1 round of revisions"],
    requiresFrom: [
      { label: "Goal of this page", type: "select", options: ["Capture email leads", "Book a call/demo", "Sell a product", "Event sign-up", "Other"], required: true },
      { label: "Copy (headlines, body text)", type: "textarea", placeholder: "Paste your copy here, or describe what you want and we can draft it", required: false },
      { label: "Form/booking tool", type: "select", options: ["HubSpot form", "Calendly embed", "Stripe payment", "Custom form", "Other"], required: true },
      { label: "Design inspiration", type: "textarea", placeholder: "Websites you like the look of", required: false },
    ],
  },
  {
    id: "starter-site",
    icon: "🚀",
    category: "Web & Digital",
    name: "Starter Site",
    description: "5-page brochure website for new businesses",
    price: 1,
    deliveryDays: 7,
    popular: false,
    features: ["5-page brochure website", "Mobile responsive", "Contact form", "Basic SEO setup", "Google Analytics 4", "1 round of revisions"],
    whatsIncluded: ["Homepage + 4 supporting pages", "Custom layout to your brand", "Google Analytics 4 setup", "Privacy policy & cookie notice", "1 round of revisions", "Hosting setup guidance"],
    requiresFrom: [
      { label: "Pages needed (e.g. Home, About, Services, Contact)", type: "textarea", placeholder: "List the 5 pages you need and brief copy notes for each", required: true },
      { label: "Tone of voice", type: "select", options: ["Professional & formal", "Friendly & approachable", "Bold & modern", "Other — I will describe in notes"], required: true },
      { label: "Any websites you like the style of", type: "textarea", placeholder: "Paste URLs for design inspiration", required: false },
      { label: "Additional notes", type: "textarea", placeholder: "Anything else we should know?", required: false },
    ],
  },
  {
    id: "brand-starter",
    icon: "✏️",
    category: "Brand & Design",
    name: "Brand Starter Kit",
    description: "Logo, colours, typography & brand guidelines",
    price: 1,
    deliveryDays: 7,
    popular: false,
    features: ["3 logo concepts", "Brand colour palette", "Typography selection", "12-page brand guidelines PDF", "SVG + PNG logo files"],
    whatsIncluded: ["3 logo concepts on mood board", "2 rounds of revisions on chosen concept", "Primary + secondary colour palette", "Font pairing for headings + body", "Logo files: SVG, PNG (light + dark)"],
    requiresFrom: [
      { label: "Business name to use on logo", type: "text", placeholder: "Exact name as it should appear", required: true },
      { label: "Industry / what you do", type: "textarea", placeholder: "Brief description of your business", required: true },
      { label: "Tone / personality", type: "select", options: ["Premium & luxury", "Friendly & approachable", "Bold & modern", "Technical & professional", "Other"], required: true },
      { label: "Colours you like (or want to avoid)", type: "textarea", placeholder: "E.g. \"I like dark navy and gold\" or \"No red please\"", required: false },
      { label: "Brand inspiration (logos/companies you like)", type: "textarea", placeholder: "URLs or names of brands whose visual identity you admire", required: false },
    ],
  },
  {
    id: "business-site",
    icon: "💼",
    category: "Web & Digital",
    name: "Business Site",
    description: "Up to 10 pages with CMS, blog & full SEO",
    price: 1,
    deliveryDays: 14,
    popular: true,
    features: ["Up to 10 pages", "CMS & blog", "Full SEO optimisation", "90+ Lighthouse score target", "Custom forms", "2 rounds of revisions"],
    whatsIncluded: ["Up to 10 custom pages", "WordPress or Webflow CMS", "On-page SEO for all pages", "90+ Lighthouse score target", "Custom forms with email notifications", "Social OG meta tags", "2 rounds of revisions + 2 weeks support"],
    requiresFrom: [
      { label: "Pages needed", type: "textarea", placeholder: "List up to 10 pages with brief notes on content for each", required: true },
      { label: "CMS preference", type: "select", options: ["WordPress", "Webflow", "No preference"], required: true },
      { label: "Tone of voice", type: "select", options: ["Professional & formal", "Friendly & approachable", "Bold & modern", "Other"], required: true },
      { label: "Copy (written content)", type: "select", options: ["I will provide all copy", "I need copywriting help (additional cost)", "Mix — some pages I have copy for"], required: true },
      { label: "Design inspiration (URLs)", type: "textarea", placeholder: "Websites you like the look of", required: false },
      { label: "Additional notes", type: "textarea", required: false },
    ],
  },
  {
    id: "ai-audit",
    icon: "🔍",
    category: "AI & Tech",
    name: "AI Readiness Audit",
    description: "15–20 page report on AI opportunities in your business",
    price: 1,
    deliveryDays: 5,
    popular: false,
    features: ["15–20 page written report", "Top 5–8 AI opportunities", "Priority-ranked roadmap", "1-hour strategy call walkthrough", "Vendor recommendations"],
    whatsIncluded: ["1-hour discovery interview", "Analysis of tools, data & workflows", "Top AI use cases identified", "Effort vs impact matrix", "Vendor recommendations", "12-month implementation roadmap"],
    requiresFrom: [
      { label: "Industry", type: "text", required: true },
      { label: "Number of employees", type: "select", options: ["1–5", "6–20", "21–50", "51–200", "200+"], required: true },
      { label: "Current tools/software used", type: "textarea", placeholder: "List the main tools your team uses day to day", required: true },
      { label: "Biggest time-wasting processes", type: "textarea", placeholder: "What repetitive tasks does your team do that you wish were automated?", required: true },
      { label: "What AI tools do you currently use?", type: "textarea", placeholder: "None, or list them", required: false },
    ],
  },
  {
    id: "brand-pro",
    icon: "📐",
    category: "Brand & Design",
    name: "Brand Pro Kit",
    description: "Full brand system including all collateral",
    price: 1,
    deliveryDays: 10,
    popular: true,
    features: ["Everything in Brand Starter", "Business card (print-ready)", "Email signature", "Social assets (5 platforms)", "Letterhead template", "All source files in Figma"],
    whatsIncluded: ["All Brand Starter Kit deliverables", "Business card front + back, print-ready", "HTML + image email signature", "Profile covers + avatars for 5 platforms", "Letterhead template (Word + PDF)", "All source files in Figma"],
    requiresFrom: [
      { label: "Business name", type: "text", required: true },
      { label: "Industry / what you do", type: "textarea", required: true },
      { label: "Tone / personality", type: "select", options: ["Premium & luxury", "Friendly & approachable", "Bold & modern", "Technical & professional", "Other"], required: true },
      { label: "Tagline (if you have one)", type: "text", placeholder: "Your tagline or leave blank", required: false },
      { label: "Contact details for business card", type: "textarea", placeholder: "Name, title, phone, email, website", required: true },
      { label: "Social platforms for assets", type: "textarea", placeholder: "e.g. LinkedIn, Instagram, X, Facebook, YouTube", required: true },
    ],
  },
  {
    id: "automation-quickwin",
    icon: "⚡",
    category: "AI & Tech",
    name: "Automation Quick-Win",
    description: "One process automated end-to-end",
    price: 1,
    deliveryDays: 5,
    popular: false,
    features: ["One process automated end-to-end", "Make, Zapier, or custom code", "Error handling & fallback logic", "Full documentation", "1 week post-handover support"],
    whatsIncluded: ["Discovery call to select highest-impact automation", "Full workflow mapping", "Build and test in your existing tools", "Error handling and fallback logic", "30-min walkthrough training session"],
    requiresFrom: [
      { label: "Describe the manual process to automate", type: "textarea", placeholder: "Walk us through step by step what currently happens manually", required: true },
      { label: "Tools involved in this process", type: "textarea", placeholder: "e.g. Gmail, HubSpot, Airtable, Slack, Google Sheets", required: true },
      { label: "How often does this process run?", type: "select", options: ["Multiple times daily", "Daily", "Weekly", "On-demand / triggered"], required: true },
      { label: "Access to existing tools", type: "select", options: ["Yes I can provide API access", "Some tools — will need help", "Not sure — let us discuss on call"], required: true },
    ],
  },
  {
    id: "ai-chatbot",
    icon: "💬",
    category: "AI & Tech",
    name: "AI Chatbot Setup",
    description: "Custom AI chatbot trained on your content",
    price: 1,
    deliveryDays: 7,
    popular: true,
    features: ["Trained on your content & FAQs", "Lead capture integration", "Deployed to your website", "Conversation analytics dashboard", "2 weeks post-launch support"],
    whatsIncluded: ["Data ingestion from website, PDFs, FAQs", "Custom personality and tone of voice", "Lead capture + CRM handoff", "Embedded widget deployed to your site", "Conversation analytics dashboard", "Full handover docs + re-training guide"],
    requiresFrom: [
      { label: "Your website URL", type: "url", required: true },
      { label: "What should the chatbot do?", type: "select", options: ["Answer FAQs only", "Capture leads", "Book appointments/calls", "Handle support queries", "All of the above"], required: true },
      { label: "Chatbot name / persona", type: "text", placeholder: "e.g. \"Max\" or leave blank to use company name", required: false },
      { label: "CRM to send leads to", type: "select", options: ["HubSpot", "Email notification", "Salesforce", "None needed", "Other"], required: true },
      { label: "Topics the chatbot must NOT discuss", type: "textarea", placeholder: "e.g. competitor pricing, legal advice, etc.", required: false },
    ],
  },
  {
    id: "ecommerce-starter",
    icon: "🛒",
    category: "Web & Digital",
    name: "E-Commerce Starter",
    description: "Shopify or WooCommerce with up to 50 products",
    price: 1,
    deliveryDays: 21,
    popular: false,
    features: ["Shopify or WooCommerce", "Up to 50 products loaded", "Payment gateway setup", "Mobile checkout optimised", "Abandoned cart setup", "2 rounds of revisions"],
    whatsIncluded: ["Custom Shopify or WooCommerce theme", "Up to 50 products with descriptions, images, variants", "Stripe and PayPal integration", "Shipping zones and tax configuration", "Abandoned cart email automation", "Returns, T&C, privacy pages", "2 rounds of revisions + 2 weeks support"],
    requiresFrom: [
      { label: "Platform preference", type: "select", options: ["Shopify", "WooCommerce (WordPress)", "No preference"], required: true },
      { label: "Number of products", type: "select", options: ["1–10", "11–25", "26–50"], required: true },
      { label: "Shipping & delivery details", type: "textarea", placeholder: "Where do you ship? Any weight/size rules? Free shipping threshold?", required: true },
      { label: "Payment methods needed", type: "select", options: ["Stripe + PayPal", "Stripe only", "PayPal only", "Other"], required: true },
      { label: "Design inspiration", type: "textarea", required: false },
    ],
  },
];

const categories = ["All", "Web & Digital", "Brand & Design", "AI & Tech"];

const faqs = [
  { q: "How long does a LAUNCH package take?", a: "LAUNCH packages are delivered in 3–21 days depending on the package. Landing pages take 3 days, websites 7–14 days, and e-commerce sites up to 21 days." },
  { q: "Are LAUNCH prices fixed?", a: "Yes. Every LAUNCH price is the final price. No hidden costs, no scope creep. You pay upfront and we deliver." },
  { q: "How many revisions are included?", a: "All LAUNCH packages include at least 1 round of revisions at no extra cost. Business Site and E-Commerce packages include 2." },
  { q: "What payment methods do you accept?", a: "We accept card payments via Stripe (UK, EU, US). Payment is required upfront before work begins." },
  { q: "Can I upgrade my package later?", a: "Absolutely. Many clients start with a Starter Site and upgrade once they see initial results. We also offer GROW subscriptions for ongoing work." },
];

export default function LaunchPage() {
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<Package | null>(null);

  const filtered = filter === "All" ? packages : packages.filter((p) => p.category === filter);

  return (
    <main className="flex flex-col w-full bg-white pt-[60px]">
      {/* Header */}
      <section className="flex flex-col w-full py-16 px-6 md:py-[100px] md:px-[120px] border-b border-[#E5E5E5]">
        <span className="font-ibm-mono text-[14px] font-normal text-[#6B7800] tracking-[3px]">
          // FIXED PRICE · FAST DELIVERY
        </span>
        <div className="h-5" />
        <h1 className="font-grotesk text-[48px] md:text-[80px] font-normal text-[#0A0A0A] tracking-[-3px] leading-none">
          ⚡ LAUNCH
        </h1>
        <div className="h-4" />
        <p className="font-ibm-mono text-[14px] text-[#555555] tracking-[1px] leading-[1.6] max-w-[560px]">
          ONE-OFF PACKAGES WITH A FIXED PRICE AND A GUARANTEED DELIVERY DATE. NO HIDDEN COSTS. NO SURPRISES.
        </p>
        <div className="h-10" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-[2px]">
          {[
            ["FROM £149", "STARTING PRICE"],
            ["3–21 DAYS", "DELIVERY WINDOW"],
            ["FIXED PRICE", "NO HIDDEN COSTS"],
            ["2 REVISIONS", "INCLUDED FREE"],
          ].map(([val, label]) => (
            <div key={label} className="flex flex-col gap-2 p-6 bg-[#EFEFEF] border border-[#D8D8D8]">
              <span className="font-grotesk text-[28px] md:text-[36px] font-normal text-[#6B7800] tracking-[-2px] leading-none">
                {val}
              </span>
              <span className="font-ibm-mono text-[14px] text-[#666666] tracking-[2px]">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Filter + Packages */}
      <section className="flex flex-col w-full px-6 md:px-[120px] py-16 md:py-[80px]">
        <div className="flex flex-wrap gap-[2px] mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className="font-ibm-mono text-[14px] tracking-[2px] px-5 py-2.5 border transition-colors cursor-pointer"
              style={{
                background: filter === cat ? "#D6E264" : "#EFEFEF",
                color: filter === cat ? "#0A0A0A" : "#444444",
                borderColor: filter === cat ? "#D6E264" : "#D8D8D8",
              }}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-[2px] md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((pkg) => (
            <div
              key={pkg.id}
              className="relative flex min-w-0 flex-col gap-5 overflow-hidden bg-[#F5F5F5] border border-[#D8D8D8] p-6 md:p-8"
            >
              {pkg.popular && (
                <span className="absolute top-4 right-4 font-ibm-mono text-[14px] font-normal tracking-[2px] px-3 py-1 bg-[#D6E264] text-[#0A0A0A]">
                  POPULAR
                </span>
              )}
              <div className="text-[28px]">{pkg.icon}</div>
              <div>
                <span className="font-ibm-mono text-[14px] text-[#777777] tracking-[2px]">{pkg.category.toUpperCase()}</span>
                <h2 className="font-grotesk text-[28px] font-normal text-[#0A0A0A] tracking-[-1px] leading-none mt-1">
                  {pkg.name}
                </h2>
                <p className="font-ibm-mono text-[14px] text-[#555555] tracking-[1px] leading-[1.6] mt-2">
                  {pkg.description}
                </p>
              </div>

              <div className="flex flex-wrap items-end gap-3">
                <span className="font-grotesk text-[34px] md:text-[40px] font-normal text-[#0A0A0A] tracking-[-2px] leading-none">
                  £{pkg.price.toLocaleString()}
                </span>
                <span className="font-ibm-mono text-[14px] md:text-[14px] text-[#666666] tracking-[1px] pb-1">
                  ⏱ {pkg.deliveryDays} DAYS
                </span>
              </div>

              <div className="flex flex-1 flex-col gap-2">
                {pkg.features.map((f) => (
                  <div key={f} className="flex min-w-0 items-start gap-2">
                    <span className="mt-0.5 font-ibm-mono text-[14px] text-[#6B7800]">+</span>
                    <span className="min-w-0 break-words font-ibm-mono text-[14px] text-[#444444] tracking-[0.4px] leading-[1.5]">{f}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setSelected(pkg)}
                className="mt-auto flex items-center justify-center h-[48px] bg-[#D6E264] hover:bg-[#c9d64f] transition-colors cursor-pointer border-none w-full"
              >
                <span className="text-center font-grotesk text-[14px] md:text-[14px] font-normal text-[#0A0A0A] tracking-[1.5px] md:tracking-[2px]">
                  START THIS PACKAGE →
                </span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="flex flex-col w-full px-6 md:px-[120px] py-16 md:py-[80px] border-t border-[#E5E5E5]">
        <span className="font-ibm-mono text-[14px] font-normal text-[#6B7800] tracking-[3px] mb-4">// FAQ</span>
        <h2 className="font-grotesk text-[32px] md:text-[48px] font-normal text-[#0A0A0A] tracking-[-2px] leading-none mb-10">
          COMMON QUESTIONS
        </h2>
        <div className="flex flex-col gap-[2px] max-w-[820px]">
          {faqs.map((faq) => (
            <div key={faq.q} className="flex flex-col gap-3 p-6 md:p-8 bg-[#F5F5F5] border border-[#D8D8D8]">
              <h3 className="font-grotesk text-[16px] font-normal text-[#0A0A0A] tracking-[-0.5px]">{faq.q}</h3>
              <p className="font-ibm-mono text-[14px] text-[#555555] tracking-[0.5px] leading-[1.7]">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="flex flex-col items-center text-center w-full px-6 md:px-[120px] py-16 md:py-[80px] border-t border-[#E5E5E5] bg-[#F5F5F5]">
        <span className="font-ibm-mono text-[14px] font-normal text-[#6B7800] tracking-[3px] mb-4">// NOT SURE WHICH PACKAGE?</span>
        <h2 className="font-grotesk text-[32px] md:text-[52px] font-normal text-[#0A0A0A] tracking-[-2px] leading-none mb-3">
          LET&apos;S FIND THE RIGHT FIT.
        </h2>
        <p className="font-ibm-mono text-[14px] text-[#666666] tracking-[1px] leading-[1.6] mb-8 max-w-[440px]">
          BOOK A FREE 15-MINUTE CALL AND WE&apos;LL RECOMMEND THE RIGHT PACKAGE FOR YOUR GOALS.
        </p>
        <a
          href="mailto:hello@vazgro.com"
          className="flex items-center justify-center h-[56px] px-10 bg-[#D6E264] hover:bg-[#c9d64f] transition-colors no-underline"
        >
          <span className="font-grotesk text-[14px] font-normal text-[#0A0A0A] tracking-[2px]">
            BOOK A FREE STRATEGY CALL
          </span>
        </a>
      </section>

      {/* Modal */}
      {selected && <LaunchModal pkg={selected} onClose={() => setSelected(null)} />}
    </main>
  );
}
