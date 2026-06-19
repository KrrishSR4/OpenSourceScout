import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { LenisProvider } from "./Lenis";

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <LenisProvider />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
