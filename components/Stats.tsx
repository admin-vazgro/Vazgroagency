import Image from "next/image";

const stats = [
  { value: "81%", label: "OF BUYERS RESEARCH ONLINE BEFORE BUYING", border: true },
  { value: "4.2x", label: "HIGHER ROI FROM CONSISTENT SOCIAL MEDIA", border: true },
  { value: "40%", label: "OF ADMIN TIME SAVED WITH AI AUTOMATION", border: true },
  { value: "4 WKS", label: "FROM IDEA TO LIVE PRODUCT", border: false },
];

export default function Stats() {
  return (
    <section className="flex flex-col w-full bg-[#0A0A0A] py-16 px-6 md:py-[100px] md:px-8 lg:px-[120px] gap-12 md:gap-[64px]">
      <div className="flex flex-col gap-3">
        <span className="font-ibm-mono text-[12px] font-normal text-[#D6E264] tracking-[3px]">
          [03] // YOUR NEXT CUSTOMER IS ALREADY ONLINE
        </span>
        <h2 className="font-grotesk text-[36px] md:text-[56px] font-normal text-[#F5F5F0] tracking-[-1px] leading-[1.05] max-w-[700px]">
          ARE YOU<br />READY?
        </h2>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-start">
        {/* Image */}
        <div className="relative w-full overflow-hidden bg-[#111111] border border-[#2D2D2D]" style={{ aspectRatio: "4/3" }}>
          <Image
            src="/are-u-ready.svg"
            alt="Your next customer is already online"
            fill
            className="object-cover object-center"
            sizes="(max-width: 1023px) 100vw, 50vw"
          />
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[2px]">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-3 p-8 bg-[#111111] border border-[#2D2D2D]">
              <span className="font-grotesk text-[52px] md:text-[64px] font-normal text-[#D6E264] tracking-[-3px] leading-none">
                {stat.value}
              </span>
              <span className="font-ibm-mono text-[10px] md:text-[11px] font-normal text-[#FFFFFF] tracking-[2px] leading-[1.6]">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
