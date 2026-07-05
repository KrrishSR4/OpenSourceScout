import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/site/Shell";

export const Route = createFileRoute("/about")({
  component: About,
});

function About() {
  return (
    <Shell>
      <section className="mx-auto max-w-3xl px-6 py-24">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">About</div>
        <h1 className="mt-3 font-display text-5xl tracking-tight text-ink">
          A scout for the <span className="italic text-muted-foreground">open</span> web.
        </h1>
        <div className="prose prose-neutral mt-8 max-w-none text-lg leading-relaxed text-muted-foreground">
          <p>
            OpenSource Scout exists for the moment every developer hits the same wall:{" "}
            <em className="text-ink">"Where do I even start contributing?"</em>
            GitHub holds the world's software, but discovering a repository that actually welcomes you —
            with active maintainers, real good-first-issues, and a stack you understand — is its own
            full-time job.
          </p>
          <p className="mt-5">
            We compute friendliness, momentum, and difficulty scores from live GitHub data — so you
            can spend less time wandering trending lists and more time shipping pull requests that
            improve the open web.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-surface p-6 brutal-shadow transition hover:-translate-y-0.5">
            <div className="font-display text-4xl font-bold text-accent">0</div>
            <div className="mt-2 text-xs font-mono uppercase text-muted-foreground tracking-wider">
              Signups Required
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Direct access. No database, no profiles, no onboarding friction.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-surface p-6 brutal-shadow transition hover:-translate-y-0.5">
            <div className="font-display text-4xl font-bold text-accent-2">100%</div>
            <div className="mt-2 text-xs font-mono uppercase text-muted-foreground tracking-wider">
              Stateless & Private
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              We do not track your searches or keep cookies. Your queries are yours alone.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-surface p-6 brutal-shadow transition hover:-translate-y-0.5">
            <div className="font-display text-4xl font-bold text-accent-3">Direct</div>
            <div className="mt-2 text-xs font-mono uppercase text-muted-foreground tracking-wider">
              GitHub Pipeline
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              No proxies or modified lists. Every link takes you straight to the issues tab.
            </p>
          </div>
        </div>

        {/* Our Values / Philosophy */}
        <div className="mt-20">
          <h2 className="font-display text-3xl tracking-tight text-ink">
            Our core <span className="italic text-muted-foreground">philosophies</span>.
          </h2>
          
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-ink">Lowering the Barrier</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Open source thrives when new developers join. But getting started can be intimidating. Scout lowers this barrier by filtering codebases that have active `good-first-issue` labels and maintainers who regularly merge PRs.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-ink">Signal Over Noise</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Trending lists are dominated by massive projects that rarely accept outside help. We calculate an activity score based on commit recency, ensuring that we only surface codebases that are actively evolving and looking for help.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-ink">Developers First</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We believe in clean interfaces, lightning-fast loads, and absolute transparency. Scout is open-source itself, built with TypeScript, React, and standard web APIs, keeping it modern and completely interview-friendly.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-ink">No Placeholders</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We pull authentic repository data directly from GitHub and cache it securely in Redis to ensure that every single query surfaces genuine, live issues that you can start working on right now.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Shell>
  );
}
