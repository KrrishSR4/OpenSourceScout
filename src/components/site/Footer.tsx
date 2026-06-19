import { Link } from "@tanstack/react-router";
import { Compass } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-[var(--color-accent)] via-[var(--color-accent-2)] to-[var(--color-accent-3)] text-white">
              <Compass className="h-4 w-4" />
            </span>
            <span className="text-[15px] font-semibold tracking-tight">
              OpenSource <span className="font-display italic text-muted-foreground">Scout</span>
            </span>
          </div>
          <p className="mt-4 max-w-md text-sm text-muted-foreground">
            A premium discovery surface for open source. Built for developers who want to ship
            their first meaningful contribution — and keep going.
          </p>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Product</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/explore" className="hover:text-ink text-muted-foreground">Explore</Link></li>
            <li><Link to="/features" className="hover:text-ink text-muted-foreground">Features</Link></li>
            <li><Link to="/docs" className="hover:text-ink text-muted-foreground">Docs</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Company</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-ink text-muted-foreground">About</Link></li>
            <li><Link to="/contact" className="hover:text-ink text-muted-foreground">Contact</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} OpenSource Scout. Crafted for makers.</span>
          <span className="font-mono">v1.0 · live</span>
        </div>
      </div>
    </footer>
  );
}
