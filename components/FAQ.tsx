"use client";

import { useState } from "react";
import SectionHeader from "./SectionHeader";

const faqs = [
  {
    question: "HOW QUICKLY CAN YOU DELIVER?",
    answer:
      "LAUNCH PACKAGES DELIVER IN 3–21 DAYS DEPENDING ON THE PACKAGE. A LANDING PAGE IS 3 DAYS. A BUSINESS SITE IS 14 DAYS. OUR AVERAGE LAUNCH DELIVERY IS 7 DAYS. GROW SUBSCRIPTIONS START WITHIN 48 HOURS OF ONBOARDING.",
    defaultOpen: true,
  },
  { question: "WHAT'S INCLUDED IN A FIXED-PRICE PACKAGE?", answer: "EVERYTHING IS LISTED UPFRONT — NO HIDDEN EXTRAS. YOU GET THE DELIVERABLES, SOURCE FILES, AND FULL IP TRANSFER. LAUNCH PACKAGES INCLUDE A DEFINED NUMBER OF REVISIONS AND POST-LAUNCH SUPPORT PERIOD." },
  { question: "CAN I CANCEL MY GROW SUBSCRIPTION?", answer: "YES. ALL GROW SUBSCRIPTIONS HAVE A 3-MONTH MINIMUM COMMITMENT, AFTER WHICH YOU CAN CANCEL ANYTIME WITH NO PENALTIES. THERE ARE NO LOCK-IN CONTRACTS OR CANCELLATION FEES." },
  { question: "DO YOU WORK WITH INTERNATIONAL CLIENTS?", answer: "YES. WE WORK WITH CLIENTS WORLDWIDE. PAYMENTS ARE PROCESSED VIA STRIPE (UK, EU, AND US) AND RAZORPAY (INDIA). COMMUNICATION IS IN ENGLISH AND WE OPERATE ACROSS TIME ZONES." },
  { question: "WHAT IF I'M NOT HAPPY WITH THE WORK?", answer: "ALL PACKAGES INCLUDE REVISION ROUNDS. IF AFTER REVISIONS YOU'RE STILL NOT SATISFIED, WE WILL WORK WITH YOU UNTIL YOU ARE. OUR 4.9/5 RATING AND 94% CLIENT RETENTION RATE SPEAKS FOR ITSELF." },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
      <section id="faq" className="flex flex-col w-full bg-[#060606] py-16 px-6 md:py-[100px] md:px-8 lg:px-[120px]">
      <div className="w-full max-w-[480px]">
        <SectionHeader
          label="[08] // FAQ"
          title={"GOT\nQUESTIONS?"}
          subtitle="EVERYTHING YOU NEED TO KNOW BEFORE GETTING STARTED WITH VAZGRO."
          titleWidth="w-full"
          subtitleWidth="w-full"
        />
      </div>

      <div className="h-10 md:h-[64px]" />

      {/* FAQ items */}
      <div className="flex flex-col w-full">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={i} className="flex flex-col w-full border-t border-t-[#1D1D1D]">
              <button
                className="flex items-center justify-between w-full py-5 md:h-[72px] text-left gap-4"
                onClick={() => setOpenIndex(isOpen ? -1 : i)}
              >
                <span className="font-grotesk text-[14px] md:text-[16px] font-normal text-[#F5F5F0] tracking-[1px]">
                  {faq.question}
                </span>
                <div
                  className="flex items-center justify-center w-[32px] h-[32px] shrink-0"
                  style={{ backgroundColor: isOpen ? "#D6E264" : "#1A1A1A", border: isOpen ? "none" : "1px solid #3D3D3D" }}
                >
                  <span
                    className="font-ibm-mono text-[14px] font-normal"
                    style={{ color: isOpen ? "#0A0A0A" : "#FFFFFF" }}
                  >
                    {isOpen ? "—" : "+"}
                  </span>
                </div>
              </button>
              {isOpen && faq.answer && (
                <div className="pb-8">
                  <p className="font-ibm-mono text-[12px] md:text-[13px] text-[#FFFFFF] tracking-[1px] leading-[1.6]">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          );
        })}
        <div className="border-t border-t-[#1D1D1D]" />
      </div>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-[16px] pt-10 md:pt-[48px]">
        <span className="font-ibm-mono text-[13px] text-[#AAAAAA] tracking-[1px]">
          STILL HAVE QUESTIONS?
        </span>
        <a href="mailto:hello@vazgro.com" className="font-ibm-mono text-[13px] font-normal text-[#D6E264] tracking-[1px] cursor-pointer hover:underline no-underline">
          EMAIL US AT HELLO@VAZGRO.COM &gt;
        </a>
      </div>
    </section>
  );
}
