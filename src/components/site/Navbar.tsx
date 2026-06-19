import { Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { Compass } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/features", label: "Features" },
  { to: "/docs", label: "Docs" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const { scrollY } = useScroll();
  const bg = useTransform(scrollY, [0, 120], ["rgba(255,255,255,0.55)", "rgba(255,255,255,0.82)"]);
  const borderOpacity = useTransform(scrollY, [0, 120], [0, 1]);

  return (
    <motion.header
      style={{ backgroundColor: bg }}
      className="sticky top-0 z-50 w-full backdrop-blur-xl"
    >
      <motion.div
        style={{ opacity: borderOpacity }}
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-border"
      />
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="group flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-[var(--color-accent)] via-[var(--color-accent-2)] to-[var(--color-accent-3)] text-white shadow-[var(--shadow-elegant)]">
            <Compass className="h-4 w-4" />
          </span>
          <span className="text-[15px] font-semibold tracking-tight text-ink">
            OpenSource <span className="font-display italic text-muted-foreground">Scout</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-full px-3.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-ink"
              activeProps={{ className: "rounded-full px-3.5 py-1.5 text-sm text-ink bg-secondary" }}
              activeOptions={{ exact: true }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <Link
          to="/explore"
          className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-ink px-4 py-2 text-sm font-medium text-white transition-transform hover:scale-[1.02]"
        >
          <span className="relative z-10">Explore Repositories</span>
          <span className="relative z-10 transition-transform group-hover:translate-x-0.5">→</span>
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-[var(--color-accent)] via-[var(--color-accent-2)] to-[var(--color-accent-3)] opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100" />
        </Link>
      </div>
    </motion.header>
  );
}
