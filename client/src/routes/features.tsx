import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/site/Shell";
import { motion } from "framer-motion";
import { Activity, Gauge, Heart, Layers, Search, Sparkles, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/features")({
  component: Features,
});

const feats = [
  {
    icon: Search,
    title: "Smart Language Detection",
    desc: "Type your language — we suggest the frameworks worth your time.",
  },
  {
    icon: Layers,
    title: "Framework Recommendations",
    desc: "Hand-curated frameworks per ecosystem.",
  },
  {
    icon: Sparkles,
    title: "Good First Issues Discovery",
    desc: "Live counts of welcoming, beginner-friendly tickets.",
  },
  {
    icon: Gauge,
    title: "Difficulty Analysis",
    desc: "Onboarding effort scored from stars, issues, and labels.",
  },
  {
    icon: Activity,
    title: "Repository Growth Tracking",
    desc: "Momentum and freshness, distilled into a single pulse.",
  },
  {
    icon: Heart,
    title: "Community Health Insights",
    desc: "Friendliness from GFI density and maintainer activity.",
  },
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
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-ink">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-ink">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Deep Dive Section */}
        <div className="mt-24 border-t border-border pt-16">
          <h2 className="font-display text-3xl tracking-tight text-ink">
            A deeper look at the <span className="italic text-muted-foreground">scouting</span> engine.
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground text-sm">
            Scout doesn't just fetch repository lists. We run realtime analytics on each repository's commit velocity, issue density, and contributor distributions to help you find the right fit.
          </p>

          <div className="mt-12 space-y-12">
            <div className="grid gap-8 md:grid-cols-[1fr_2fr] items-start">
              <div className="rounded-xl border border-border bg-secondary/30 p-5">
                <span className="text-xs font-mono uppercase text-accent font-semibold tracking-wider">01 / Rating Algorithm</span>
                <h3 className="mt-2 text-lg font-semibold text-ink">Dynamic Quality Scores</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Our scoring engine processes the fresh status of each repository. By analyzing the date of the latest commit and decaying it daily, we compute the <strong className="text-ink">Activity</strong> index. We calculate <strong className="text-ink">Friendliness</strong> by checking the ratio of welcoming labels (like <code>good-first-issue</code>) to total issues. Finally, the <strong className="text-ink">Difficulty</strong> index aggregates stars, repository size, and issue resolution times to determine if the codebase is easy to onboard.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-[1fr_2fr] items-start border-t border-border/50 pt-8">
              <div className="rounded-xl border border-border bg-secondary/30 p-5">
                <span className="text-xs font-mono uppercase text-accent-2 font-semibold tracking-wider">02 / Issue Tracking</span>
                <h3 className="mt-2 text-lg font-semibold text-ink">Realtime GFI Discovery</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Many platforms list repositories with static stats. OpenSource Scout queries GitHub Search APIs in real-time, fetching active open tickets matching beginner-friendly criteria. We filter out closed and stale tickets, ensuring that when you see a "Good First Issue" count, it points to real, actionable work.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-[1fr_2fr] items-start border-t border-border/50 pt-8">
              <div className="rounded-xl border border-border bg-secondary/30 p-5">
                <span className="text-xs font-mono uppercase text-accent-3 font-semibold tracking-wider">03 / Tech Stack Mapping</span>
                <h3 className="mt-2 text-lg font-semibold text-ink">Framework Affinity</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Different languages have distinct ecosystems. We pair languages with their most active web frameworks. For instance, selecting TypeScript lets you filter by Next.js, Remix, or SvelteKit, while selecting Python surfaces FastAPI or Django repositories. This saves you from wading through generic topic tags.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-14">
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-medium text-background hover:scale-[1.02] transition"
          >
            Try it now <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </Shell>
  );
}
