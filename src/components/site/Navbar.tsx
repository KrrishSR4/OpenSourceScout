import { Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { Compass, ArrowUpRight } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/features", label: "Features" },
  { to: "/docs", label: "Docs" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const { scrollY } = useScroll();
  const bg = useTransform(scrollY, [0, 120], ["rgba(20,12,8,0.35)", "rgba(20,12,8,0.78)"]);
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
        <Link to="/" className="group flex items-center gap-2.5">
          <motion.span
            whileHover={{ rotate: 90, scale: 1.08 }}
            transition={{ type: "spring", stiffness: 220, damping: 12 }}
            className="relative grid h-9 w-9 place-items-center rounded-xl text-[var(--color-background)] border-2 border-ink"
            style={{ background: "var(--color-accent)" }}
          >
            <Compass className="h-4 w-4" strokeWidth={2.6} />
            <span className="pointer-events-none absolute -inset-0.5 rounded-xl opacity-0 transition-opacity group-hover:opacity-100" style={{ boxShadow: "0 0 0 2px var(--color-accent-2)" }} />
          </motion.span>
          <span className="text-[15px] font-semibold tracking-tight text-ink">
            OpenSource <span className="font-display italic text-muted-foreground">Scout</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="group relative rounded-full px-3.5 py-1.5 text-sm text-muted-foreground transition-colors hover:text-ink"
              activeProps={{ className: "rounded-full px-3.5 py-1.5 text-sm text-ink bg-secondary" }}
              activeOptions={{ exact: true }}
            >
              <span className="relative z-10">{l.label}</span>
              <span className="pointer-events-none absolute inset-x-3 -bottom-0.5 h-px origin-left scale-x-0 bg-[var(--color-accent)] transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>

        <Link
          to="/explore"
          className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border-2 border-ink bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-[var(--color-background)] transition-transform hover:-translate-y-0.5 hover:rotate-[-1deg]"
          style={{ boxShadow: "3px 3px 0 0 var(--color-ink)" }}
        >
          <span className="relative z-10">Explore Repositories</span>
          <ArrowUpRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2.5} />
        </Link>
      </div>
    </motion.header>
  );
}
