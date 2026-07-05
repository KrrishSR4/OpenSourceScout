import { Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Compass, ArrowUpRight, Menu, X } from "lucide-react";
import { useState } from "react";

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
  const [isOpen, setIsOpen] = useState(false);

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
        <Link to="/" className="group flex items-center" onClick={() => setIsOpen(false)}>
          <span className="text-xl sm:text-2xl font-semibold tracking-tight font-sans text-ink">
            OpenSource
            <span className="ml-1.5 font-display font-semibold italic text-accent transition-colors duration-300 group-hover:text-accent-2">
              Scout
            </span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="group relative rounded-full px-3.5 py-1.5 text-sm text-muted-foreground transition-colors hover:text-ink"
              activeProps={{
                className: "rounded-full px-3.5 py-1.5 text-sm text-ink bg-secondary",
              }}
              activeOptions={{ exact: true }}
            >
              <span className="relative z-10">{l.label}</span>
              <span className="pointer-events-none absolute inset-x-3 -bottom-0.5 h-px origin-left scale-x-0 bg-[var(--color-accent)] transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>

        {/* Explore Repositories button - Hidden on mobile/tablets (< md) */}
        <Link
          to="/explore"
          className="group relative hidden md:inline-flex items-center gap-2 overflow-hidden rounded-full border-2 border-ink bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-[var(--color-background)] transition-transform hover:-translate-y-0.5 hover:rotate-[-1deg]"
          style={{ boxShadow: "3px 3px 0 0 var(--color-ink)" }}
        >
          <span className="relative z-10">Explore Repositories</span>
          <ArrowUpRight
            className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            strokeWidth={2.5}
          />
        </Link>

        {/* Hamburger Menu Button - Visible on mobile/tablets (< md) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-ink bg-surface text-ink md:hidden transition-transform active:scale-95"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer Navigation overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="absolute left-0 right-0 top-16 overflow-hidden border-b border-border bg-[var(--color-background)]/98 backdrop-blur-2xl md:hidden"
          >
            <div className="flex flex-col gap-4 px-6 py-6 border-t border-border/50">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setIsOpen(false)}
                  className="text-base font-semibold text-muted-foreground transition-colors hover:text-ink py-1"
                  activeProps={{
                    className: "text-base font-bold text-[var(--color-accent-2)] py-1",
                  }}
                  activeOptions={{ exact: true }}
                >
                  {l.label}
                </Link>
              ))}
              <div className="my-2 h-px bg-border/50" />
              <Link
                to="/explore"
                onClick={() => setIsOpen(false)}
                className="group relative flex items-center justify-center gap-2 rounded-xl border-2 border-ink bg-[var(--color-accent)] py-3 text-sm font-bold text-[var(--color-background)] shadow-[4px_4px_0_0_var(--color-ink)]"
              >
                <span>Explore Repositories</span>
                <ArrowUpRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  strokeWidth={2.5}
                />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
