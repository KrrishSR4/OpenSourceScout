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
            OpenSource Scout exists for the moment every developer hits the same wall: <em>where do I even start contributing?</em>
            GitHub holds the world's software, but discovering a repo that actually welcomes you — with active maintainers, real
            good-first-issues, and a stack you understand — is its own full-time job.
          </p>
          <p className="mt-5">
            We compute friendliness, momentum, and difficulty scores from live GitHub data — so you can spend less time
            wandering trending lists and more time shipping pull requests that ship products.
          </p>
          <p className="mt-5">
            Built by developers, for developers. No sign-up. No ads. Just signal.
          </p>
        </div>
      </section>
    </Shell>
  );
}
