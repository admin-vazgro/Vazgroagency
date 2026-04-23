"use client";

import { useState } from "react";
import Link from "next/link";

const plans = [
  // Design
  { id: "design-starter", track: "Design", icon: "🎨", name: "Design Starter", capacity: "2 active requests · 48hr turnaround", price: 1, minMonths: 3, popular: false, features: ["2 active requests at a time", "Social graphics & banners", "Print & digital assets", "Unlimited revisions", "48hr avg turnaround"] },
  { id: "design-pro", track: "Design", icon: "🎨", name: "Design Pro", capacity: "4 active requests · Priority queue", price: 1, minMonths: 3, popular: true, features: ["4 active requests at a time", "Custom illustrations", "UI mockups & wireframes", "Basic motion & GIFs", "Priority queue", "Monthly strategy call"] },
  { id: "design-studio", track: "Design", icon: "🎨", name: "Design Studio", capacity: "6 active requests · 24hr turnaround", price: 1, minMonths: 3, popular: false, features: ["6 active requests at a time", "Video editing & short-form", "Full UI/UX design", "24hr priority turnaround", "Bi-weekly strategy calls"] },
  // Dev
  { id: "dev-essentials", track: "Dev", icon: "💻", name: "Dev Essentials", capacity: "~10 hrs/week", price: 1, minMonths: 3, popular: false, features: ["~10 hrs/week capacity", "Bug fixes & updates", "Performance improvements", "Monthly progress report"] },
  { id: "dev-growth", track: "Dev", icon: "💻", name: "Dev Growth", capacity: "~20 hrs/week", price: 1, minMonths: 3, popular: true, features: ["~20 hrs/week capacity", "Feature development", "API & integrations", "Staging environment", "Monthly strategy call"] },
  { id: "dev-scale", track: "Dev", icon: "💻", name: "Dev Scale", capacity: "~40 hrs/week dedicated", price: 1, minMonths: 3, popular: false, features: ["~40 hrs/week dedicated dev", "Sprint-based delivery", "Full-stack development", "Weekly sync calls"] },
  // Social
  { id: "social-starter", track: "Social", icon: "📱", name: "Social Starter", capacity: "3 platforms · 12 posts/mo", price: 1, minMonths: 3, popular: false, features: ["3 platforms", "12 posts per month", "Scheduling & community replies", "Monthly performance report"] },
  { id: "social-growth", track: "Social", icon: "📱", name: "Social Growth", capacity: "4 platforms · 20 posts/mo", price: 1, minMonths: 3, popular: true, features: ["4 platforms", "20 posts per month", "Ad management (£500 budget)", "Competitor analysis", "Monthly strategy call"] },
  { id: "social-scale", track: "Social", icon: "📱", name: "Social Scale", capacity: "All platforms · Unlimited posts", price: 1, minMonths: 3, popular: false, features: ["All platforms", "Unlimited posts", "Full SEO management", "Email marketing (monthly)", "Ads up to £2k budget"] },
];

const tracks = ["Design", "Dev", "Social"] as const;
type Track = (typeof tracks)[number];

const trackColors: Record<Track, string> = {
  Design: "#D6E264",
  Dev: "#FF6B35",
  Social: "#888888",
};

const includes = [
  { ico: "👤", t: "Dedicated PM", d: "One point of contact who knows your business, priorities, and deadlines." },
  { ico: "💬", t: "Slack Access", d: "Direct communication with your delivery team. No ticket queues or black boxes." },
  { ico: "♾️", t: "Unlimited Revisions", d: "We iterate until the work is right — not until an arbitrary revision count is reached." },
  { ico: "📊", t: "Monthly Reports", d: "Clear visibility into output, performance, and what is shipping next." },
];

export default function GrowPage() {
  const [activeTrack, setActiveTrack] = useState<Track>("Design");
  const visible = plans.filter((p) => p.track === activeTrack);
  const accent = trackColors[activeTrack];

  return (
    <main className="flex flex-col w-full bg-[#0A0A0A] pt-[60px]">
      {/* Header */}
      <section className="flex flex-col w-full py-16 px-6 md:py-[100px] md:px-[120px] border-b border-[#1D1D1D]">
        <span className="font-ibm-mono text-[14px] font-normal text-[#D6E264] tracking-[3px]">
          // YOUR ALWAYS-ON DIGITAL TEAM
        </span>
        <div className="h-5" />
        <h1 className="font-grotesk text-[48px] md:text-[80px] font-normal text-[#F5F5F0] tracking-[-3px] leading-none">
          📈 GROW
        </h1>
        <div className="h-4" />
        <p className="font-ibm-mono text-[14px] text-[#BBBBBB] tracking-[1px] leading-[1.6] max-w-[560px]">
          DESIGN, DEVELOPMENT, AND MARKETING DELIVERED ON SUBSCRIPTION. FAST TURNAROUND, DEDICATED TEAM, FULL TRANSPARENCY.
        </p>
        <div className="h-10" />
        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-[2px]">
          {[
            ["FROM £349", "PER MONTH"],
            ["3 MONTHS", "MINIMUM TERM"],
            ["UNLIMITED", "REVISIONS INCLUDED"],
            ["DEDICATED PM", "SLACK ACCESS"],
          ].map(([val, label]) => (
            <div key={label} className="flex flex-col gap-2 p-6 bg-[#111111] border border-[#2D2D2D]">
              <span className="font-grotesk text-[28px] md:text-[36px] font-normal text-[#D6E264] tracking-[-2px] leading-none">
                {val}
              </span>
              <span className="font-ibm-mono text-[14px] text-[#AAAAAA] tracking-[2px]">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Plans */}
      <section className="flex flex-col w-full px-6 md:px-[120px] py-16 md:py-[80px]">
        {/* Track tabs */}
        <div className="flex gap-[2px] mb-10">
          {tracks.map((track) => (
            <button
              key={track}
              onClick={() => setActiveTrack(track)}
              className="font-ibm-mono text-[14px] tracking-[2px] px-5 py-2.5 border transition-colors cursor-pointer"
              style={{
                background: activeTrack === track ? trackColors[track] : "#111111",
                color: activeTrack === track ? "#0A0A0A" : "#555",
                borderColor: activeTrack === track ? trackColors[track] : "#2D2D2D",
              }}
            >
              {track.toUpperCase()} TRACK
            </button>
          ))}
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[2px]">
          {visible.map((plan) => (
            <div
              key={plan.id}
              className="flex flex-col gap-5 p-8 border relative"
              style={{
                background: plan.popular ? "#0F0F0A" : "#0F0F0F",
                borderColor: plan.popular ? accent : "#2D2D2D",
              }}
            >
              {plan.popular && (
                <span
                  className="absolute top-4 right-4 font-ibm-mono text-[14px] font-normal tracking-[2px] px-3 py-1"
                  style={{ background: accent, color: "#0A0A0A" }}
                >
                  POPULAR
                </span>
              )}
              <div className="text-[28px]">{plan.icon}</div>
              <div>
                <span className="font-ibm-mono text-[14px] text-[#999999] tracking-[2px]">{plan.track.toUpperCase()} TRACK</span>
                <h2 className="font-grotesk text-[28px] font-normal text-[#F5F5F0] tracking-[-1px] leading-none mt-1">
                  {plan.name}
                </h2>
                <p className="font-ibm-mono text-[14px] text-[#BBBBBB] tracking-[1px] mt-2">{plan.capacity}</p>
              </div>

              <div className="flex items-end gap-2">
                <span className="font-grotesk text-[40px] font-normal text-[#F5F5F0] tracking-[-2px] leading-none">
                  £{plan.price.toLocaleString()}
                </span>
                <span className="font-ibm-mono text-[14px] text-[#AAAAAA] tracking-[1px] pb-1">/MO</span>
              </div>

              <div className="flex flex-col gap-2">
                {plan.features.map((f) => (
                  <div key={f} className="flex items-start gap-2">
                    <span className="font-ibm-mono text-[14px] mt-0.5" style={{ color: accent }}>+</span>
                    <span className="font-ibm-mono text-[14px] text-[#CCCCCC] tracking-[0.5px] leading-[1.5]">{f}</span>
                  </div>
                ))}
              </div>

              <p className="font-ibm-mono text-[14px] text-[#999999] tracking-[1px] mt-1">
                MIN. {plan.minMonths} MONTH COMMITMENT
              </p>

              <a
                href="mailto:hello@vazgro.com"
                className="mt-auto flex items-center justify-center h-[48px] bg-[#1A1A1A] border border-[#2D2D2D] hover:border-[#D6E264] hover:bg-[#D6E264] hover:text-[#0A0A0A] transition-all no-underline group"
              >
                <span className="font-grotesk text-[14px] font-normal text-[#F5F5F0] tracking-[2px] group-hover:text-[#0A0A0A] transition-colors">
                  BOOK DISCOVERY CALL →
                </span>
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* What's included */}
      <section className="flex flex-col w-full px-6 md:px-[120px] py-16 md:py-[80px] border-t border-[#1D1D1D]">
        <span className="font-ibm-mono text-[14px] font-normal text-[#D6E264] tracking-[3px] mb-4">// EVERY GROW PLAN INCLUDES</span>
        <h2 className="font-grotesk text-[32px] md:text-[48px] font-normal text-[#F5F5F0] tracking-[-2px] leading-none mb-10">
          BUILT FOR SERIOUS<br />BUSINESSES.
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[2px]">
          {includes.map((item) => (
            <div key={item.t} className="flex flex-col gap-3 p-8 bg-[#0F0F0F] border border-[#2D2D2D]">
              <span className="text-[24px]">{item.ico}</span>
              <h3 className="font-grotesk text-[18px] font-normal text-[#F5F5F0] tracking-[-0.5px]">{item.t}</h3>
              <p className="font-ibm-mono text-[14px] text-[#BBBBBB] tracking-[0.5px] leading-[1.7]">{item.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="flex flex-col items-center text-center w-full px-6 md:px-[120px] py-16 md:py-[80px] border-t border-[#1D1D1D] bg-[#0F0F0F]">
        <span className="font-ibm-mono text-[14px] font-normal text-[#D6E264] tracking-[3px] mb-4">// READY FOR AN ALWAYS-ON TEAM?</span>
        <h2 className="font-grotesk text-[32px] md:text-[52px] font-normal text-[#F5F5F0] tracking-[-2px] leading-none mb-3">
          LET&apos;S MATCH YOU WITH<br />THE RIGHT PLAN.
        </h2>
        <p className="font-ibm-mono text-[14px] text-[#AAAAAA] tracking-[1px] leading-[1.6] mb-8 max-w-[440px]">
          BOOK A FREE DISCOVERY CALL. WE&apos;LL RECOMMEND THE RIGHT TRACK AND PLAN FOR YOUR BUSINESS.
        </p>
        <a
          href="mailto:hello@vazgro.com"
          className="flex items-center justify-center h-[56px] px-10 bg-[#D6E264] hover:bg-[#c9d64f] transition-colors no-underline"
        >
          <span className="font-grotesk text-[14px] font-normal text-[#0A0A0A] tracking-[2px]">
            BOOK YOUR DISCOVERY CALL
          </span>
        </a>
      </section>
    </main>
  );
}
