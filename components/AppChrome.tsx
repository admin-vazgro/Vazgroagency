"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const INTERNAL_PREFIXES = ["/hub", "/workspace"];
const CHROMELESS_PATHS = ["/login"];

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideChrome =
    CHROMELESS_PATHS.includes(pathname) ||
    INTERNAL_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (hideChrome) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
