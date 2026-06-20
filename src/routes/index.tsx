import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import {
  Star, GitFork, CircleDot, Sparkles, Activity, Heart, Layers, Gauge,
  Github, ArrowUpRight, Zap, Flame, Asterisk, Compass, Hexagon,
} from "lucide-react";
import { Shell } from "@/components/site/Shell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OpenSource Scout — Discover repos worth contributing to" },
      {
        name: "description",
        content:
          "Find high-quality GitHub repositories, good-first-issues, and active communities — tailored to your stack.",
      },
      { property: "og:title", content: "OpenSource Scout" },
      {
        property: "og:description",
        content: "Discover the best GitHub repositories to contribute to.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <Shell>
      <Hero />
      <BigMarquee />
      <Manifesto />
      <FeatureSlab />
      <RepoShowcase />
      <HowItWorks />
      <Stats />
      <CTA />
    </Shell>
  );
}

/* ============================== HERO ============================== */
function Hero() {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <section ref={ref} className="relative isolate overflow-hidden bg-background pb-32 pt-10">
      <div className="mx-auto max-w-7xl px-6 pt-10">
        {/* sticker row */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap items-center gap-2"
        >
          <span className="sticker">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full" style={{ background: "var(--color-accent-2)" }} />
              <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: "var(--color-accent-2)" }} />
            </span>
            Live · GitHub indexed
          </span>
          <span className="sticker" style={{ background: "var(--color-accent-3)", color: "var(--color-background)" }}>
            <Flame className="h-3 w-3" /> Top 100 repos
          </span>
          <span className="sticker rotate-[-2deg]">
            <Asterisk className="h-3 w-3" /> no-bullshit search
          </span>
        </motion.div>

        {/* MASSIVE display headline */}
        <div className="mt-10 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="font-display font-medium leading-[0.86] tracking-[-0.05em] text-ink text-balance"
              style={{ fontSize: "clamp(3rem, 9.5vw, 9.5rem)" }}
            >
              ship your
              <br />
              <span className="inline-block">
                <span className="chroma-text italic font-normal">first</span>
                <motion.span
                  aria-hidden
                  animate={{ rotate: [0, 12, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="inline-block align-middle ml-2"
                >
                  <Sparkles className="inline h-12 w-12 md:h-16 md:w-16" style={{ color: "var(--color-accent-2)" }} />
                </motion.span>
              </span>{" "}
              <span className="font-grotesk font-bold">PR.</span>
              <span className="ml-3 inline-block font-display italic text-muted-foreground/80" style={{ fontSize: "0.55em" }}>
                — and the next 100.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mt-8 max-w-xl font-grotesk text-lg leading-relaxed text-muted-foreground"
            >
              A loud, opinionated discovery surface for{" "}
              <span className="text-ink font-semibold">open source.</span>{" "}
              Hand-curated frameworks, live good-first-issues, momentum scores,
              and the kind of repo cards that actually make you want to click.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <Link
                to="/explore"
                className="group relative inline-flex items-center gap-2 rounded-full border-2 border-ink bg-[var(--color-accent)] px-7 py-4 text-base font-semibold text-[var(--color-background)] transition-all hover:-translate-y-1 hover:rotate-[-2deg]"
                style={{ boxShadow: "6px 6px 0 0 var(--color-ink)" }}
              >
                Explore 100 repos
                <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" strokeWidth={2.6} />
              </Link>
              <Link
                to="/features"
                className="group inline-flex items-center gap-2 rounded-full border-2 border-ink bg-transparent px-7 py-4 text-base font-semibold text-ink transition-all hover:bg-ink hover:text-[var(--color-background)]"
              >
                See features
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </Link>
            </motion.div>
          </div>

          {/* sidebar — kinetic card stack */}
          <div className="relative lg:col-span-4">
            <KineticStack />
          </div>
        </div>
      </div>
    </section>
  );
}

function KineticStack() {
  return (
    <div className="relative h-[520px]">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute -right-10 -top-10 h-44 w-44 rounded-full border-2 border-dashed border-[var(--color-accent-2)]/40"
      >
        <Hexagon className="absolute -top-3 left-1/2 h-6 w-6 -translate-x-1/2" style={{ color: "var(--color-accent-2)" }} />
      </motion.div>

      <StackCard
        rotate={-6} top="20px" left="0" name="vercel/next.js" stars="129k"
        tag="TypeScript" tagColor="var(--color-accent-4)" delay={0}
      />
      <StackCard
        rotate={5} top="160px" right="0" name="tiangolo/fastapi" stars="78k"
        tag="Python" tagColor="var(--color-accent-2)" delay={0.15}
      />
      <StackCard
        rotate={-3} top="320px" left="20px" name="rust-lang/rust" stars="97k"
        tag="Rust" tagColor="var(--color-accent-3)" delay={0.3}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
        className="absolute -bottom-2 right-0 rounded-2xl border-2 border-ink bg-surface p-4"
        style={{ boxShadow: "5px 5px 0 0 var(--color-accent)" }}
      >
        <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          velocity / 14d
        </div>
        <div className="grid grid-rows-7 grid-flow-col gap-[3px]">
          {Array.from({ length: 7 * 14 }).map((_, i) => {
            const level = (Math.sin(i * 0.7) + 1) / 2;
            const op = 0.18 + level * 0.82;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: op }}
                transition={{ duration: 0.4, delay: 0.6 + i * 0.005 }}
                whileHover={{ scale: 1.6 }}
                className="h-2 w-2 rounded-[3px]"
                style={{ background: i % 3 === 0 ? "var(--color-accent-2)" : "var(--color-accent)" }}
              />
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

function StackCard({
  rotate, top, left, right, name, stars, tag, tagColor, delay,
}: {
  rotate: number; top: string; left?: string; right?: string;
  name: string; stars: string; tag: string; tagColor: string; delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotate: rotate * 2 }}
      animate={{ opacity: 1, y: 0, rotate }}
      transition={{ duration: 0.7, delay, type: "spring", stiffness: 90 }}
      whileHover={{ rotate: 0, scale: 1.04, y: -6, transition: { duration: 0.25 } }}
      style={{ top, left, right, boxShadow: "5px 5px 0 0 var(--color-ink)" }}
      className="absolute w-[260px] cursor-pointer rounded-2xl border-2 border-ink bg-surface p-4 animate-float"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-ink">
          <Github className="h-4 w-4" />
          <span className="font-mono text-[13px]">{name}</span>
        </div>
        <span
          className="rounded-full border border-ink px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
          style={{ background: tagColor, color: "var(--color-background)" }}
        >
          {tag}
        </span>
      </div>
      <div className="mt-4 flex items-center gap-3 font-mono text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1"><Star className="h-3.5 w-3.5" style={{ color: "var(--color-accent)" }} />{stars}</span>
        <span className="inline-flex items-center gap-1"><GitFork className="h-3.5 w-3.5" />8.2k</span>
        <span className="inline-flex items-center gap-1"><CircleDot className="h-3.5 w-3.5" style={{ color: "var(--color-accent-2)" }} />42 gfi</span>
      </div>
    </motion.div>
  );
}

/* ============================== MARQUEE ============================== */
function BigMarquee() {
  const top = ["RACK UP COMMITS", "SHIP GFIs", "MERGE THE FIRST PR", "BUILD IN PUBLIC", "JOIN MAINTAINERS", "OWN A FEATURE"];
  const bot = ["react", "next.js", "vue", "svelte", "rust", "go", "django", "fastapi", "rails", "laravel", "tauri", "astro"];
  return (
    <section className="relative border-y-2 border-ink bg-[var(--color-accent)] py-6 overflow-hidden">
      <div className="grain-overlay" />
      <div className="marquee-track">
        {[...top, ...top].map((t, i) => (
          <span key={i} className="flex items-center gap-8 px-6 font-display text-5xl font-medium text-[var(--color-background)] md:text-7xl">
            {t}
            <Asterisk className="h-8 w-8 md:h-12 md:w-12" strokeWidth={2.5} />
          </span>
        ))}
      </div>
      <div className="mt-4 marquee-track marquee-reverse marquee-fast">
        {[...bot, ...bot].map((t, i) => (
          <span key={i} className="flex items-center gap-6 px-5 font-mono text-base font-semibold uppercase tracking-widest text-[var(--color-background)]/80">
            {t}
            <span className="text-[var(--color-background)]/40">×</span>
          </span>
        ))}
      </div>
    </section>
  );
}

/* ============================== MANIFESTO ============================== */
function Manifesto() {
  const words = ["good", "first", "issues", "are", "the", "front", "door", "of", "open", "source."];
  return (
    <section className="relative mx-auto max-w-7xl px-6 py-32">
      <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--color-accent)]">/ manifesto — 001</div>
      <h2 className="mt-6 font-display text-4xl leading-[1.02] tracking-tight text-ink md:text-7xl">
        {words.map((w, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0.18, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, delay: i * 0.05 }}
            className="mr-3 inline-block"
          >
            {w === "first" ? <span className="chroma-text italic">{w}</span> : w}
          </motion.span>
        ))}
      </h2>
      <div className="mt-10 grid gap-8 md:grid-cols-3">
        {[
          { k: "01", t: "Find the right repo", d: "Curated frameworks per language. No 'awesome-lists' rabbit holes." },
          { k: "02", t: "Score the opportunity", d: "Difficulty, momentum, friendliness — distilled into one glance." },
          { k: "03", t: "Open the PR", d: "Land on a live good-first-issue and ship before lunch." },
        ].map((it, i) => (
          <motion.div
            key={it.k}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group relative rounded-2xl border-2 border-ink bg-surface p-6 transition-all hover:-translate-y-1 hover:rotate-[-0.5deg]"
            style={{ boxShadow: "5px 5px 0 0 var(--color-ink)" }}
          >
            <div className="font-mono text-xs font-bold text-[var(--color-accent)]">{it.k}</div>
            <h3 className="mt-3 font-display text-2xl text-ink">{it.t}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{it.d}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ============================== FEATURE SLAB ============================== */
function FeatureSlab() {
  const feats = [
    { icon: Sparkles, t: "Good-first-issues, counted live", c: "var(--color-accent)" },
    { icon: Gauge,    t: "Difficulty score — 0 to 100",      c: "var(--color-accent-2)" },
    { icon: Activity, t: "Push velocity, last 14 days",      c: "var(--color-accent-3)" },
    { icon: Heart,    t: "Friendliness from GFI density",    c: "var(--color-accent-4)" },
    { icon: Layers,   t: "Frameworks curated per language",  c: "var(--color-accent)" },
    { icon: Zap,      t: "100 repos per search",             c: "var(--color-accent-2)" },
  ];
  return (
    <section className="relative border-y-2 border-ink bg-surface py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--color-accent-2)]">/ signals we surface</div>
            <h2 className="mt-4 font-display text-5xl leading-none tracking-tight text-ink md:text-7xl">
              every <span className="chroma-text italic">signal</span><br />a contributor needs.
            </h2>
          </div>
          <Link to="/features" className="hidden md:inline-flex items-center gap-1 font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-ink">
            All features <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="mt-12 grid gap-0 border-t border-ink md:grid-cols-3">
          {feats.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ scale: 1.02 }}
              className="group relative flex h-56 flex-col justify-between border-b border-r border-ink p-6 [&:nth-child(3n)]:border-r-0 [&:nth-last-child(-n+3)]:border-b-0"
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ background: `radial-gradient(circle at 30% 20%, ${f.c}, transparent 65%)`, mixBlendMode: "screen" }}
              />
              <f.icon className="h-7 w-7 transition-transform group-hover:rotate-12 group-hover:scale-125" style={{ color: f.c }} strokeWidth={2.2} />
              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">0{i + 1}</div>
                <h3 className="mt-1 font-display text-2xl leading-tight text-ink">{f.t}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================== SHOWCASE ============================== */
function RepoShowcase() {
  const cards = [
    { name: "facebook/react", desc: "A library for web and native UIs.", stars: "224k", gfi: 18, lang: "JavaScript", color: "var(--color-accent-2)" },
    { name: "withastro/astro", desc: "The web framework for content-driven sites.", stars: "47k", gfi: 24, lang: "TypeScript", color: "var(--color-accent-4)" },
    { name: "denoland/deno",  desc: "A secure runtime for JavaScript and TypeScript.", stars: "94k", gfi: 12, lang: "Rust", color: "var(--color-accent-3)" },
    { name: "django/django",  desc: "The web framework for perfectionists with deadlines.", stars: "78k", gfi: 7, lang: "Python", color: "var(--color-accent)" },
  ];
  return (
    <section className="mx-auto max-w-7xl px-6 py-28">
      <div className="mb-12 flex items-end justify-between">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--color-accent-3)]">/ live preview</div>
          <h2 className="mt-4 font-display text-5xl leading-none tracking-tight text-ink md:text-7xl">
            a glimpse of<br /><span className="italic text-muted-foreground/80">what you'll find.</span>
          </h2>
        </div>
        <Link to="/explore" className="sticker hover:-translate-y-0.5 transition-transform">
          Open explorer →
        </Link>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        {cards.map((r, i) => (
          <motion.a
            key={r.name}
            href={`https://github.com/${r.name}`}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -6, rotate: i % 2 === 0 ? -0.6 : 0.6 }}
            className="group relative overflow-hidden rounded-3xl border-2 border-ink bg-surface p-7"
            style={{ boxShadow: "6px 6px 0 0 var(--color-ink)" }}
          >
            <div
              className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full opacity-30 transition-opacity group-hover:opacity-70"
              style={{ background: `radial-gradient(circle, ${r.color} 0%, transparent 70%)` }}
            />
            <div className="relative flex items-start justify-between">
              <div>
                <div className="font-mono text-sm text-muted-foreground">github.com/</div>
                <div className="mt-1 font-display text-3xl tracking-tight text-ink">{r.name}</div>
              </div>
              <span
                className="rounded-full border-2 border-ink px-3 py-1 text-[11px] font-bold uppercase tracking-wider"
                style={{ background: r.color, color: "var(--color-background)" }}
              >
                {r.lang}
              </span>
            </div>
            <p className="relative mt-4 max-w-md text-sm text-muted-foreground">{r.desc}</p>
            <div className="relative mt-6 flex items-center gap-5 font-mono text-sm text-ink">
              <span className="inline-flex items-center gap-1.5"><Star className="h-4 w-4" style={{ color: "var(--color-accent)" }} /> {r.stars}</span>
              <span className="inline-flex items-center gap-1.5"><CircleDot className="h-4 w-4" style={{ color: "var(--color-accent-2)" }} /> {r.gfi} gfi</span>
              <span className="ml-auto inline-flex items-center gap-1 text-muted-foreground transition-all group-hover:gap-2 group-hover:text-ink">
                open <ArrowUpRight className="h-4 w-4" />
              </span>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}

/* ============================== HOW IT WORKS ============================== */
function HowItWorks() {
  const steps = [
    { n: "01", t: "Pick a language", d: "Type any language — we suggest only frameworks worth your time." },
    { n: "02", t: "Pick a framework", d: "Curated lists. No 50-item awesome-list rabbit holes." },
    { n: "03", t: "Get 100 repos", d: "Sorted by stars, filtered to active, gfi-friendly projects only." },
    { n: "04", t: "Open the issue", d: "Hit the GFI link and start your PR. That's it." },
  ];
  return (
    <section className="relative border-y-2 border-ink bg-[var(--color-accent-3)] py-24 text-[var(--color-background)] overflow-hidden">
      <div className="grain-overlay" />
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em]">
          <span className="h-px w-10 bg-[var(--color-background)]/60" /> / how it works
        </div>
        <h2 className="mt-4 font-display text-5xl leading-[0.92] tracking-tight md:text-8xl">
          four steps.<br /><span className="italic">zero noise.</span>
        </h2>
        <div className="mt-16 grid gap-0 border-t-2 border-[var(--color-background)] md:grid-cols-4">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group relative border-b-2 border-[var(--color-background)] p-6 md:border-b-0 md:border-r-2 md:last:border-r-0"
            >
              <div className="font-mono text-6xl font-bold leading-none">{s.n}</div>
              <h3 className="mt-6 font-display text-2xl">{s.t}</h3>
              <p className="mt-2 max-w-xs text-sm opacity-80">{s.d}</p>
              <motion.div
                className="mt-6 h-1 origin-left bg-[var(--color-background)]"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.08, duration: 0.6 }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================== STATS ============================== */
function Stats() {
  const stats = [
    { k: "12M+", v: "repos indexed",      c: "var(--color-accent)" },
    { k: "100",  v: "results per query",  c: "var(--color-accent-2)" },
    { k: "240k", v: "good-first-issues",  c: "var(--color-accent-3)" },
    { k: "0",    v: "ads, paywalls",      c: "var(--color-accent-4)" },
  ];
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="grid grid-cols-2 gap-0 border-2 border-ink md:grid-cols-4" style={{ boxShadow: "8px 8px 0 0 var(--color-accent)" }}>
        {stats.map((s, i) => (
          <motion.div
            key={s.v}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ scale: 1.04 }}
            className="group relative overflow-hidden border-ink p-8 [&:not(:last-child)]:border-r-2 [&:nth-child(2)]:border-r-0 md:[&:nth-child(2)]:border-r-2"
          >
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: `radial-gradient(circle at 50% 100%, ${s.c}, transparent 70%)` }} />
            <div className="relative font-display text-6xl leading-none tracking-tight text-ink md:text-7xl">
              {s.k}
            </div>
            <div className="relative mt-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              {s.v}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ============================== CTA ============================== */
function CTA() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="relative overflow-hidden rounded-[2.5rem] border-2 border-ink bg-ink p-10 md:p-20" style={{ boxShadow: "10px 10px 0 0 var(--color-accent-2)" }}>
        <div className="pointer-events-none absolute inset-0 halo opacity-50" />
        <div className="grain-overlay" />
        <motion.div
          className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          style={{ background: "conic-gradient(from 0deg, var(--color-accent), var(--color-accent-3), var(--color-accent-4), var(--color-accent-2), var(--color-accent))", filter: "blur(40px)", opacity: 0.6 }}
        />
        <div className="relative">
          <Compass className="h-10 w-10" style={{ color: "var(--color-accent-2)" }} />
          <h2 className="mt-6 font-display text-5xl leading-[0.92] tracking-tight text-[var(--color-background)] md:text-8xl">
            stop scrolling.<br /><span className="chroma-text italic">start shipping.</span>
          </h2>
          <p className="mt-6 max-w-xl font-grotesk text-lg text-[var(--color-background)]/70">
            Your next pull request is one search away. We surface 100 active,
            beginner-friendly repos per query — pick one and go.
          </p>
          <Link
            to="/explore"
            className="group mt-10 inline-flex items-center gap-3 rounded-full border-2 border-[var(--color-background)] bg-[var(--color-accent-2)] px-8 py-4 text-base font-bold uppercase tracking-wider text-[var(--color-background)] transition-all hover:-translate-y-1 hover:rotate-[-1.5deg]"
            style={{ boxShadow: "6px 6px 0 0 var(--color-background)" }}
          >
            launch explorer
            <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" strokeWidth={2.6} />
          </Link>
        </div>
      </div>
    </section>
  );
}