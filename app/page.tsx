import Hero from "@/components/Hero";
import PixelDivider from "@/components/PixelDivider";
import Logos from "@/components/Logos";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Stats from "@/components/Stats";
import Testimonials from "@/components/Testimonials";
import Bento from "@/components/Bento";
import Comparison from "@/components/Comparison";
import Showcase from "@/components/Showcase";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";

export default function Home() {
  return (
    <main className="flex flex-col w-full bg-white pt-[60px]">
      <Hero />
      <PixelDivider />
      <Logos />
      <Features />
      <HowItWorks />
      <Stats />
      <Testimonials />
      <Bento />
      <Comparison />
      <Showcase />
      <FAQ />
      <FinalCTA />
    </main>
  );
}
