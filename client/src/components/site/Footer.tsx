import { Link } from "@tanstack/react-router";
import { Compass, Github } from "lucide-react";
import { motion } from "framer-motion";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border bg-surface">
      <div className="pointer-events-none absolute inset-0 -z-0 halo opacity-30" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[var(--color-accent)]" />

      {/* big wordmark — SVG so it always spans the full footer width */}
      <motion.div
        className="w-full px-6 pt-14"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <svg
          viewBox="0 0 1000 160"
          preserveAspectRatio="xMidYMid meet"
          className="chroma-text block w-full select-none overflow-visible"
          aria-label="OpenSource Scout"
        >
          <text
            x="500"
            y="130"
            textAnchor="middle"
            textLength="980"
            lengthAdjust="spacingAndGlyphs"
            fontFamily="Fraunces, serif"
            fontWeight={500}
            fontSize={150}
            fill="currentColor"
            fontStyle="italic"
          >
            OpenSource Scout
          </text>
        </svg>
      </motion.div>

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
            A maximalist discovery surface for open source. Built for developers who want to ship
            their first meaningful contribution — and keep going.
          </p>
          <div className="mt-5 flex items-center gap-2">
            <a
              href="https://github.com/KrrishSR4/OpenSourceScout"
              target="_blank"
              rel="noopener noreferrer"
              className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-ink hover:text-ink"
            >
              <Github className="h-4 w-4" />
            </a>
          </div>
        </div>
        <div>
          <h4 className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
            / Product
          </h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link to="/explore" className="story-link text-muted-foreground hover:text-ink">
                Explore
              </Link>
            </li>
            <li>
              <Link to="/features" className="story-link text-muted-foreground hover:text-ink">
                Features
              </Link>
            </li>
            <li>
              <Link to="/docs" className="story-link text-muted-foreground hover:text-ink">
                Docs
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-accent-2)]">
            / Company
          </h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link to="/about" className="story-link text-muted-foreground hover:text-ink">
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className="story-link text-muted-foreground hover:text-ink">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-4 px-6 py-5 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} OpenSource Scout. Crafted for contributors.</span>
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/KrrishSR4"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1 text-ink transition-all hover:-translate-y-0.5 hover:border-ink"
            >
              <Github className="h-3.5 w-3.5" />
              <span className="font-medium">KrrishSR4</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
