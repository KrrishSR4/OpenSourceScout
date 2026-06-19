import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/site/Shell";
import { motion } from "framer-motion";
import { Activity, Gauge, Heart, Layers, Search, Sparkles, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Features · OpenSource Scout" },
      { name: "description", content: "Every signal we surface to help you contribute to open source." },
    ],
  }),
  component: Features,
});

const feats = [
  { icon: Search, title: "Smart Language Detection", desc: "Type your language — we suggest the frameworks worth your time." },
  { icon: Layers, title: "Framework Recommendations", desc: "Hand-curated frameworks per ecosystem." },
  { icon: Sparkles, title: "Good First Issues Discovery", desc: "Live counts of welcoming, beginner-friendly tickets." },
  { icon: Gauge, title: "Difficulty Analysis", desc: "Onboarding effort scored from stars, issues, and labels." },
  { icon: Activity, title: "Repository Growth Tracking", desc: "Momentum and freshness, distilled into a single pulse." },
  { icon: Heart, title: "Community Health Insights", desc: "Friendliness from GFI density and maintainer activity." },
];

function Features() {
  return (
    <Shell>
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">Features</div>
        <h1 className="mt-3 font-display text-5xl tracking-tight text-ink">
          Every signal a <span className="italic text-muted-foreground">contributor</span> needs.
        </h1>
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {feats.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="rounded-2xl border border-border bg-surface p-7 hover:-translate-y-0.5 hover:shadow-[var(--shadow-elegant)] transition"
            >
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-ink"><f.icon className="h-5 w-5" /></div>
              <h3 className="mt-5 text-lg font-semibold text-ink">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-14">
          <Link to="/explore" className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-medium text-white">
            Try it now <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </Shell>
  );
}
