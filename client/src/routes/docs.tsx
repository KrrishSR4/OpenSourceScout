import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/site/Shell";

export const Route = createFileRoute("/docs")({
  component: Docs,
});

function Docs() {
  return (
    <Shell>
      <section className="mx-auto grid max-w-5xl gap-12 px-6 py-24 md:grid-cols-[200px_1fr]">
        <aside className="text-sm">
          <div className="sticky top-24 space-y-1">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Docs</div>
            <a href="#start" className="block rounded-md px-2 py-1 hover:bg-secondary">Getting started</a>
            <a href="#scoring" className="block rounded-md px-2 py-1 hover:bg-secondary">Scoring model</a>
            <a href="#api" className="block rounded-md px-2 py-1 hover:bg-secondary">API & data</a>
            <a href="#faq" className="block rounded-md px-2 py-1 hover:bg-secondary">FAQ</a>
          </div>
        </aside>
        <article className="prose prose-neutral max-w-none">
          <h1 id="start" className="font-display text-4xl tracking-tight text-ink">Getting started</h1>
          <p className="mt-3 text-muted-foreground">
            Head to <a href="/explore" className="underline">/explore</a>, type a language, and pick a framework.
            Results stream in from the live GitHub Search API and are scored on the fly.
          </p>

          <h2 id="scoring" className="mt-12 font-display text-2xl text-ink">Scoring model</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-muted-foreground">
            <li><strong className="text-ink">Activity</strong> — recency of the latest push, decayed daily.</li>
            <li><strong className="text-ink">Friendliness</strong> — density of <code>good first issue</code> labels weighted against repo size.</li>
            <li><strong className="text-ink">Difficulty</strong> — combines stars, open-issue volume and GFI count to estimate onboarding effort.</li>
          </ul>

          <h2 id="api" className="mt-12 font-display text-2xl text-ink">API & data</h2>
          <p className="mt-3 text-muted-foreground">
            We query the public GitHub REST API (search/repositories + search/issues). Results are filtered to
            non-archived, public repos with ≥200 stars and at least one good first issue. Set a <code>GITHUB_TOKEN</code> secret
            to raise rate limits.
          </p>

          <h2 id="faq" className="mt-12 font-display text-2xl text-ink">FAQ</h2>
          <p className="mt-3 text-muted-foreground"><strong className="text-ink">Do I need an account?</strong> No. Scout is free and stateless.</p>
          <p className="mt-3 text-muted-foreground"><strong className="text-ink">Why is my repo not showing?</strong> It probably lacks <code>good first issue</code> labels or is below the star threshold.</p>
        </article>
      </section>
    </Shell>
  );
}
