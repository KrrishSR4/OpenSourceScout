import { Link } from "@tanstack/react-router";
import { Compass, Github, Twitter, Globe } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border bg-surface">
      <div className="pointer-events-none absolute inset-0 -z-0 halo opacity-30" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[var(--color-accent)]" />

      {/* big wordmark — single line, fits the container */}
      <div className="mx-auto max-w-7xl px-6 pt-14">
        <div className="flex w-full items-baseline whitespace-nowrap font-display font-medium leading-[0.85] tracking-[-0.05em] text-ink/90" style={{ fontSize: "clamp(2rem, 8.4vw, 7.5rem)" }}>
          OpenSource&nbsp;<span className="chroma-text italic">Scout</span>
        </div>
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span
              className="grid h-9 w-9 place-items-center rounded-xl border-2 border-ink text-[var(--color-background)]"
              style={{ background: "var(--color-accent)" }}
            >
              <Compass className="h-4 w-4" strokeWidth={2.6} />
            </span>
            <span className="text-[15px] font-semibold tracking-tight">
              OpenSource <span className="font-display italic text-muted-foreground">Scout</span>
            </span>
          </div>
          <p className="mt-4 max-w-md text-sm text-muted-foreground">
            A maximalist discovery surface for open source. Built for developers
            who want to ship their first meaningful contribution — and keep going.
          </p>
          <div className="mt-5 flex items-center gap-2">
            {[Github, Twitter, Globe].map((Icon, i) => (
              <a key={i} href="#" className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-ink hover:text-ink">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">/ Product</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/explore" className="story-link text-muted-foreground hover:text-ink">Explore</Link></li>
            <li><Link to="/features" className="story-link text-muted-foreground hover:text-ink">Features</Link></li>
            <li><Link to="/docs" className="story-link text-muted-foreground hover:text-ink">Docs</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-accent-2)]">/ Company</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/about" className="story-link text-muted-foreground hover:text-ink">About</Link></li>
            <li><Link to="/contact" className="story-link text-muted-foreground hover:text-ink">Contact</Link></li>
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
