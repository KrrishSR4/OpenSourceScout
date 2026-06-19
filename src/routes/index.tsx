import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Star,
  GitFork,
  CircleDot,
  Sparkles,
  Activity,
  Heart,
  Layers,
  Search,
  Gauge,
  Github,
  ArrowRight,
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
      <Marquee />
      <Features />
      <HowItWorks />
      <CTA />
    </Shell>
  );
}

/* ---------------- Hero ---------------- */
function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10 grid-bg" />
      <div className="absolute inset-0 -z-10 halo opacity-70" />

      <div className="mx-auto grid max-w-7xl gap-12 px-6 pt-20 pb-24 lg:grid-cols-12 lg:pt-28">
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-3 py-1 text-xs text-muted-foreground backdrop-blur"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-accent)] opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
            </span>
            Live GitHub data · updated continuously
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="mt-6 font-display text-[clamp(2.6rem,6.2vw,5.4rem)] font-medium leading-[0.98] tracking-[-0.035em] text-ink text-balance"
          >
            Find your next{" "}
            <span className="italic font-normal text-muted-foreground">
              open&nbsp;source
            </span>{" "}
            <span className="gradient-text">contribution.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground"
          >
            Discover high-quality repositories, beginner-friendly issues and
            active communities — curated to your language and framework.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Link
              to="/explore"
              className="group inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-medium text-white shadow-[var(--shadow-elegant)] transition-transform hover:scale-[1.02]"
            >
              Explore Repositories
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/features"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-5 py-3 text-sm font-medium text-ink backdrop-blur hover:bg-secondary"
            >
              View Features
            </Link>
          </motion.div>

          <div className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-border pt-6">
            {[
              { k: "12M+", v: "Repos indexed" },
              { k: "240k", v: "Good first issues" },
              { k: "98%", v: "Match relevance" },
            ].map((s) => (
              <div key={s.v}>
                <div className="font-display text-2xl text-ink">{s.k}</div>
                <div className="text-xs text-muted-foreground">{s.v}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative lg:col-span-5">
          <FloatingCards />
        </div>
      </div>
    </section>
  );
}

function FloatingCards() {
  return (
    <div className="relative h-[520px]">
      <FloatCard
        delay={0}
        className="absolute left-0 top-4 w-[280px] -rotate-[3deg]"
        name="vercel/next.js"
        desc="The React framework for the web."
        stars="129k"
        forks="27.8k"
        issues={186}
        tag="TypeScript"
        tagColor="#3178c6"
      />
      <FloatCard
        delay={0.6}
        className="absolute right-0 top-24 w-[280px] rotate-[4deg]"
        name="tiangolo/fastapi"
        desc="Modern, fast web framework for Python."
        stars="78.4k"
        forks="6.7k"
        issues={42}
        tag="Python"
        tagColor="#3572A5"
      />
      <FloatCard
        delay={1.2}
        className="absolute bottom-6 left-8 w-[300px] -rotate-[1.5deg]"
        name="rust-lang/rust"
        desc="Empowering everyone to build reliable software."
        stars="97.2k"
        forks="12.5k"
        issues={94}
        tag="Rust"
        tagColor="#dea584"
      />
      <ActivityGraph />
    </div>
  );
}

function FloatCard({
  className,
  delay,
  name,
  desc,
  stars,
  forks,
  issues,
  tag,
  tagColor,
}: {
  className: string;
  delay: number;
  name: string;
  desc: string;
  stars: string;
  forks: string;
  issues: number;
  tag: string;
  tagColor: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      className={className}
    >
      <div className="animate-float rounded-2xl border border-border bg-white p-5 shadow-[var(--shadow-elegant)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-ink">
            <Github className="h-4 w-4 text-muted-foreground" />
            {name}
          </div>
          <span
            className="rounded-full px-2 py-0.5 text-[10px] font-medium"
            style={{ backgroundColor: `${tagColor}22`, color: tagColor }}
          >
            {tag}
          </span>
        </div>
        <p className="mt-3 line-clamp-2 text-xs text-muted-foreground">{desc}</p>
        <div className="mt-4 flex items-center gap-4 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1"><Star className="h-3 w-3" />{stars}</span>
          <span className="inline-flex items-center gap-1"><GitFork className="h-3 w-3" />{forks}</span>
          <span className="inline-flex items-center gap-1"><CircleDot className="h-3 w-3 text-emerald-500" />{issues} GFI</span>
        </div>
      </div>
    </motion.div>
  );
}

function ActivityGraph() {
  const cells = Array.from({ length: 7 * 14 });
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.4 }}
      className="absolute -bottom-2 right-2 rounded-2xl border border-border bg-white/85 p-4 backdrop-blur shadow-[var(--shadow-elegant)]"
    >
      <div className="mb-2 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
        Contribution velocity
      </div>
      <div className="grid grid-rows-7 grid-flow-col gap-[3px]">
        {cells.map((_, i) => {
          const level = (Math.sin(i * 0.7) + 1) / 2;
          const op = 0.15 + level * 0.85;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: op }}
              transition={{ duration: 0.4, delay: 0.5 + i * 0.005 }}
              className="h-2 w-2 rounded-[3px]"
              style={{ background: `var(--color-accent)` }}
            />
          );
        })}
      </div>
    </motion.div>
  );
}

/* ---------------- Marquee ---------------- */
function Marquee() {
  const items = [
    "React", "Next.js", "Vue", "Svelte", "Django", "FastAPI", "Spring Boot",
    "Rails", "Laravel", "Axum", "Tauri", "NestJS", "Astro", "tRPC", "Remix",
  ];
  return (
    <section className="border-y border-border bg-surface/70">
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-8">
        <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-muted-foreground">
          <span className="h-px w-8 bg-border" /> Curating contributions across
        </div>
        <div className="relative mt-4 overflow-hidden">
          <motion.div
            className="flex gap-10 whitespace-nowrap font-display text-3xl text-ink/80"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 28, ease: "linear", repeat: Infinity }}
          >
            {[...items, ...items].map((t, i) => (
              <span key={i} className="opacity-80">
                {t} <span className="text-muted-foreground">·</span>
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Features ---------------- */
function Features() {
  const feats = [
    { icon: Search, title: "Smart Language Detection", desc: "Tell us your language. We surface the frameworks and tooling worth your time." },
    { icon: Layers, title: "Framework Recommendations", desc: "Curated stacks per ecosystem — from React to Spring Boot to Axum." },
    { icon: Sparkles, title: "Good First Issues Discovery", desc: "Real-time counts of welcoming, beginner-friendly tickets per repo." },
    { icon: Gauge, title: "Difficulty Analysis", desc: "Onboarding signals scored from issues, stars and contributor activity." },
    { icon: Activity, title: "Repository Growth Tracking", desc: "Velocity, freshness, and momentum — distilled into a single pulse." },
    { icon: Heart, title: "Community Health Insights", desc: "Friendliness score blends responsiveness, GFI density and maintainer activity." },
  ];

  return (
    <section className="relative mx-auto max-w-7xl px-6 py-28">
      <div className="max-w-2xl">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">Features</div>
        <h2 className="mt-3 font-display text-4xl tracking-tight text-ink md:text-5xl">
          Built for the way <span className="italic text-muted-foreground">contributors</span> actually work.
        </h2>
        <p className="mt-4 text-muted-foreground">
          Six signals, one premium surface. Every score is computed from live GitHub data — never guessed.
        </p>
      </div>

      <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {feats.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, delay: i * 0.06 }}
            className="group relative overflow-hidden rounded-2xl border border-border bg-white p-7 transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)]"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-ink">
              <f.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-5 text-lg font-semibold tracking-tight text-ink">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- How it works ---------------- */
function HowItWorks() {
  const steps = [
    { n: "01", t: "Pick a language", d: "JavaScript, Python, Rust — anything you ship in." },
    { n: "02", t: "Choose a framework", d: "Curated to the ecosystem you selected." },
    { n: "03", t: "Get curated repos", d: "Ranked by friendliness, momentum and good first issues." },
  ];
  return (
    <section className="border-y border-border bg-surface/70">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-24 md:grid-cols-[1fr_2fr]">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Workflow</div>
          <h2 className="mt-3 font-display text-4xl tracking-tight text-ink">
            Three steps to your <span className="italic text-muted-foreground">first PR.</span>
          </h2>
        </div>
        <div className="grid gap-4">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, x: 12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="flex items-start gap-6 rounded-2xl border border-border bg-white p-6"
            >
              <div className="font-display text-3xl text-muted-foreground">{s.n}</div>
              <div>
                <div className="text-base font-semibold text-ink">{s.t}</div>
                <div className="mt-1 text-sm text-muted-foreground">{s.d}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- CTA ---------------- */
function CTA() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-28">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-ink p-12 text-white md:p-16">
        <div className="absolute inset-0 opacity-50">
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[var(--color-accent)] blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-[var(--color-accent-2)] blur-3xl" />
        </div>
        <div className="relative max-w-2xl">
          <h2 className="font-display text-4xl tracking-tight md:text-5xl">
            Ready to <span className="italic">scout</span> your next repo?
          </h2>
          <p className="mt-4 text-white/70">
            Free, no sign-up, no fluff. Powered by live GitHub data.
          </p>
          <Link
            to="/explore"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-ink transition-transform hover:scale-[1.02]"
          >
            Explore Repositories <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
