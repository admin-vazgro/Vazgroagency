const logos = ["PROGRIZE", "DASHMETRIC", "BRIEFLY AI", "TRACK TAXI", "VAZGRO LABS"];

export default function Logos() {
  return (
    <section className="flex flex-col items-center w-full bg-[#0F0F0F] py-[48px] px-6 md:px-8 lg:px-[120px] gap-[32px]">
      <span className="font-ibm-mono text-[11px] text-[#BBBBBB] tracking-[3px]">
        PRODUCTS &amp; CLIENTS WE&apos;VE BUILT FOR
      </span>
      <div className="flex flex-wrap items-center justify-center gap-8 md:gap-[64px] w-full">
        {logos.map((logo) => (
          <span
            key={logo}
            className="font-grotesk text-[13px] md:text-[14px] font-normal text-[#CCCCCC] tracking-[2px]"
          >
            {logo}
          </span>
        ))}
      </div>
    </section>
  );
}
