import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/site/Shell";
import { useState, useEffect } from "react";
import { Search, Database, Sparkles, Github, ArrowRight, Terminal } from "lucide-react";

export const Route = createFileRoute("/docs")({
  component: Docs,
});

const steps = [
  {
    id: 1,
    title: "1. Select Stack",
    desc: "User inputs a language & framework.",
    icon: Search,
    color: "var(--color-accent)",
  },
  {
    id: 2,
    title: "2. Fetch & Cache",
    desc: "Queries GitHub APIs. Caches in Redis.",
    icon: Database,
    color: "var(--color-accent-2)",
  },
  {
    id: 3,
    title: "3. Analyze Metrics",
    desc: "Computes activity & difficulty scores.",
    icon: Sparkles,
    color: "var(--color-accent-3)",
  },
  {
    id: 4,
    title: "4. Contribute",
    desc: "Direct link to open GitHub Issues.",
    icon: Github,
    color: "var(--color-accent-4)",
  },
];

function WorkflowAnimation() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="mt-8 rounded-2xl border border-border bg-surface p-6 brutal-shadow">
      <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-6">
        Real-time Workflow Pipeline
      </h3>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
        {steps.map((s, idx) => {
          const isActive = idx === activeStep;
          const Icon = s.icon;
          return (
            <div
              key={s.id}
              className={`relative rounded-xl border p-4 transition-all duration-500 ${
                isActive
                  ? "border-ink bg-secondary/20 scale-[1.02]"
                  : "border-border bg-surface opacity-60"
              }`}
            >
              {isActive && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: s.color }}></span>
                  <span className="relative inline-flex rounded-full h-3 w-3" style={{ backgroundColor: s.color }}></span>
                </span>
              )}
              
              <div
                className="grid h-10 w-10 place-items-center rounded-lg text-background transition-transform"
                style={{ backgroundColor: s.color }}
              >
                <Icon className="h-5 w-5" />
              </div>

              <h4 className="mt-4 text-sm font-semibold text-ink">{s.title}</h4>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
              
              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 -translate-y-1/2 z-10 text-border">
                  <ArrowRight className={`h-4 w-4 transition-colors duration-500 ${isActive ? 'text-ink' : 'text-border'}`} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Docs() {
  return (
    <Shell>
      <section className="mx-auto grid max-w-5xl gap-12 px-6 py-24 md:grid-cols-[200px_1fr]">
        <aside className="text-sm">
          <div className="sticky top-24 space-y-1">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Docs</div>
            <a href="#start" className="block rounded-md px-2 py-1 hover:bg-secondary">
              Getting started
            </a>
            <a href="#scoring" className="block rounded-md px-2 py-1 hover:bg-secondary">
              Scoring model
            </a>
            <a href="#api" className="block rounded-md px-2 py-1 hover:bg-secondary">
              API & data
            </a>
            <a href="#faq" className="block rounded-md px-2 py-1 hover:bg-secondary">
              FAQ
            </a>
          </div>
        </aside>
        <article className="prose prose-neutral max-w-none">
          <h1 id="start" className="font-display text-4xl tracking-tight text-ink">
            Getting started
          </h1>
          <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
            OpenSource Scout is designed to remove friction from discovering repositories you want to contribute to.
            Simply head to <a href="/explore" className="underline text-ink">/explore</a>, type in a programming language (like JavaScript or Go), and pick a framework (like React or Gin). Results stream in from live GitHub Search query filters, enrich themselves via repository-specific analytics, and are scored on the fly.
          </p>

          <WorkflowAnimation />

          <h2 id="scoring" className="mt-16 font-display text-2xl text-ink">
            Scoring model
          </h2>
          <p className="mt-3 text-muted-foreground text-sm">
            We use a multi-factor score to grade repositories and evaluate their welcoming nature:
          </p>
          <ul className="mt-4 list-disc space-y-3 pl-5 text-muted-foreground text-sm">
            <li>
              <strong className="text-ink">Activity (0 - 100)</strong>: Recency of the latest push. The activity score decays daily: if a repository was updated today, it scores 100. Over 30 days of inactivity, the score drops down to encourage finding repositories with active commit flows.
            </li>
            <li>
              <strong className="text-ink">Friendliness (0 - 100)</strong>: Calculates GFI (Good First Issue) density. Specifically, we weigh the number of open beginner issues against the repository's total open issues and star volume. More GFIs relative to size increases this score.
            </li>
            <li>
              <strong className="text-ink">Difficulty (0 - 100)</strong>: Evaluates onboarding complexity. High star counts, massive contributor lists, and very long issue backlogs increase the difficulty, while a solid volume of GFI tickets lowers the score to indicate a welcoming codebase.
            </li>
          </ul>

          <h2 id="api" className="mt-16 font-display text-2xl text-ink">
            API & data
          </h2>
          <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
            All data is queried in real-time using public GitHub REST API endpoints. Search results are filtered to active public repositories with at least 200 stars and one welcoming issue.
          </p>
          
          <div className="mt-6 space-y-4">
            <h3 className="text-base font-semibold text-ink flex items-center gap-2">
              <Terminal className="h-4 w-4 text-accent" /> Endpoint: GET <code>/api/v1/repositories</code>
            </h3>
            
            <div className="rounded-xl border border-border bg-surface p-4 font-mono text-xs text-muted-foreground">
              <span className="text-emerald-500 font-semibold">GET</span> /api/v1/repositories?language=typescript&framework=nextjs
            </div>
            
            <p className="text-xs text-muted-foreground">
              Parameters supported:
            </p>
            <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1">
              <li><code>language</code> (required): e.g., <code>typescript</code>, <code>python</code>, <code>go</code></li>
              <li><code>framework</code> (optional): e.g., <code>nextjs</code>, <code>fastapi</code>, <code>gin</code></li>
              <li><code>page</code> (optional): Defaults to <code>1</code></li>
              <li><code>perPage</code> (optional): Defaults to <code>100</code></li>
            </ul>
          </div>

          <h2 id="faq" className="mt-16 font-display text-2xl text-ink">
            FAQ
          </h2>
          <div className="mt-4 space-y-6 text-sm">
            <div>
              <strong className="text-ink block">Do I need an account?</strong>
              <p className="mt-1 text-muted-foreground leading-relaxed">
                No. Scout is free, open source, and stateless. We do not store queries or user search profiles.
              </p>
            </div>
            <div>
              <strong className="text-ink block">Why is a specific repository not showing?</strong>
              <p className="mt-1 text-muted-foreground leading-relaxed">
                We only index repositories with 200 or more stars, which are public, not archived, and have at least one issue labeled as a <code>good-first-issue</code>.
              </p>
            </div>
            <div>
              <strong className="text-ink block">How does caching work?</strong>
              <p className="mt-1 text-muted-foreground leading-relaxed">
                To bypass strict GitHub API rate limits, we cache successful repository search results in Redis for 24 hours. If a search query misses cache, the backend fetches fresh details and populates it immediately.
              </p>
            </div>
          </div>
        </article>
      </section>
    </Shell>
  );
}
