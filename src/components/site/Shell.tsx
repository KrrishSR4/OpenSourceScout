import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { LenisProvider } from "./Lenis";
import { AnimatedBackground } from "./AnimatedBackground";

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen text-foreground relative">
      <LenisProvider />
      <AnimatedBackground />
      <Navbar />
      <main className="relative z-10">{children}</main>
      <Footer />
    </div>
  );
}
