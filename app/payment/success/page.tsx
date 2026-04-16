import Link from "next/link";

export default async function PaymentSuccessPage(props: {
  searchParams?: Promise<{ session_id?: string; pillar?: string }>;
}) {
  const searchParams = props.searchParams ? await props.searchParams : {};
  const pillar = searchParams.pillar || "LAUNCH";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#0A0A0A] px-6 py-16">
      <div className="w-full max-w-[520px] border border-[#2D2D2D] bg-[#0F0F0F] p-10 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center bg-[#D6E264]">
          <span className="text-[28px]">✓</span>
        </div>

        <span className="font-ibm-mono text-[14px] tracking-[3px] text-[#D6E264]">
          // PAYMENT CONFIRMED
        </span>

        <h1 className="mt-3 font-grotesk text-[32px] font-bold tracking-[-1.5px] text-[#F5F5F0]">
          You&apos;re in.
        </h1>

        <p className="mt-4 font-ibm-mono text-[14px] leading-[1.8] tracking-[0.5px] text-[#BBBBBB]">
          Your {pillar} package is confirmed. Check your inbox — we&apos;ve sent a magic
          link to your workspace. Click it to get started.
        </p>

        <div className="mt-8 flex flex-col gap-[2px]">
          {[
            ["01", "Payment received & confirmed"],
            ["02", "Your workspace is being set up"],
            ["03", "Magic link sent to your email"],
            ["04", "Click the link to access your project"],
          ].map(([n, text]) => (
            <div key={n} className="flex items-center gap-3 p-4 bg-[#0A0A0A] border border-[#1D1D1D]">
              <span className="font-ibm-mono text-[14px] text-[#D6E264] shrink-0">{n}</span>
              <span className="font-ibm-mono text-[14px] text-[#CCCCCC] tracking-[0.3px]">{text}</span>
            </div>
          ))}
        </div>

        <p className="mt-6 font-ibm-mono text-[14px] text-[#AAAAAA] leading-[1.7]">
          Didn&apos;t receive an email?{" "}
          <a href="mailto:hello@vazgro.com" className="text-[#D6E264] hover:opacity-80 transition-opacity">
            Contact us
          </a>{" "}
          and we&apos;ll get it sorted within minutes.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/login"
            className="flex-1 flex items-center justify-center h-[48px] bg-[#D6E264] hover:bg-[#c9d64f] transition-colors font-grotesk text-[14px] font-bold text-[#0A0A0A] tracking-[2px]"
          >
            SIGN IN TO WORKSPACE
          </Link>
          <Link
            href="/"
            className="flex-1 flex items-center justify-center h-[48px] border border-[#2D2D2D] bg-[#111111] hover:border-[#555] transition-colors font-ibm-mono text-[14px] text-[#AAAAAA] tracking-[1.5px]"
          >
            BACK TO HOME
          </Link>
        </div>
      </div>
    </main>
  );
}
