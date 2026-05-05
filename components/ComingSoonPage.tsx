import Link from "next/link";

interface ComingSoonPageProps {
  eyebrow: string;
  title: string;
  description: string;
}

export default function ComingSoonPage({
  eyebrow,
  title,
  description,
}: ComingSoonPageProps) {
  return (
    <main className="flex flex-col w-full bg-white pt-[60px]">
      <section className="flex flex-col items-start w-full px-6 py-16 md:px-[120px] md:py-[100px]">
        <span className="font-ibm-mono text-[14px] font-normal text-[#6B7800] tracking-[3px]">
          {eyebrow}
        </span>
        <div className="h-5" />
        <h1 className="font-grotesk text-[40px] md:text-[72px] font-normal text-[#0A0A0A] tracking-[-3px] leading-[0.95]">
          {title}
        </h1>
        <div className="h-6" />
        <p className="max-w-[640px] font-ibm-mono text-[14px] md:text-[14px] text-[#555555] tracking-[0.5px] leading-[1.8]">
          {description}
        </p>
        <div className="h-10" />
        <div className="flex flex-col gap-[2px] w-full max-w-[720px]">
          {[
            "We’re still shaping the structure and content for this page.",
            "If you want access first, email us and we’ll send details as soon as it’s live.",
          ].map((line) => (
            <div key={line} className="border border-[#E5E5E5] bg-[#F5F5F5] px-5 py-4">
              <p className="font-ibm-mono text-[14px] md:text-[14px] text-[#444444] tracking-[0.5px] leading-[1.7]">
                {line}
              </p>
            </div>
          ))}
        </div>
        <div className="h-10" />
        <div className="flex flex-col gap-[2px] w-full sm:w-auto sm:flex-row">
          <a
            href="mailto:hello@vazgro.com"
            className="flex items-center justify-center h-[56px] px-8 bg-[#D6E264] text-[#0A0A0A] no-underline hover:bg-[#c9d64f] transition-colors font-grotesk text-[14px] tracking-[2px]"
          >
            EMAIL VAZGRO
          </a>
          <Link
            href="/"
            className="flex items-center justify-center h-[56px] px-8 bg-[#F0F0F0] border border-[#D8D8D8] text-[#0A0A0A] no-underline hover:border-[#888888] transition-colors font-grotesk text-[14px] tracking-[2px]"
          >
            BACK TO HOME
          </Link>
        </div>
      </section>
    </main>
  );
}
