import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/site/Shell";
import { useState } from "react";
import { Mail, Github, Send, Check } from "lucide-react";

export const Route = createFileRoute("/contact")({
  component: Contact,
});

function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <Shell>
      <section className="mx-auto grid max-w-5xl gap-12 px-6 py-24 md:grid-cols-2">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Contact</div>
          <h1 className="mt-3 font-display text-5xl tracking-tight text-ink">Say <span className="italic text-muted-foreground">hello.</span></h1>
          <p className="mt-4 text-muted-foreground">
            Feature requests, repo nominations, integrations — we read everything.
          </p>
          <div className="mt-8 space-y-3 text-sm">
            <a href="mailto:hello@opensource-scout.dev" className="inline-flex items-center gap-2 text-ink hover:underline">
              <Mail className="h-4 w-4" /> hello@opensource-scout.dev
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-ink hover:underline">
              <Github className="h-4 w-4" /> @opensource-scout
            </a>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
          className="rounded-3xl border border-border bg-surface p-6 shadow-[var(--shadow-elegant)]"
        >
          <label className="block text-xs uppercase tracking-widest text-muted-foreground">Name</label>
          <input required className="mt-1 h-11 w-full rounded-xl border border-border bg-secondary/60 px-3 outline-none focus:border-[var(--color-accent)] focus:bg-surface" />

          <label className="mt-4 block text-xs uppercase tracking-widest text-muted-foreground">Email</label>
          <input type="email" required className="mt-1 h-11 w-full rounded-xl border border-border bg-secondary/60 px-3 outline-none focus:border-[var(--color-accent)] focus:bg-surface" />

          <label className="mt-4 block text-xs uppercase tracking-widest text-muted-foreground">Message</label>
          <textarea rows={5} required className="mt-1 w-full rounded-xl border border-border bg-secondary/60 p-3 outline-none focus:border-[var(--color-accent)] focus:bg-surface" />

          <button
            type="submit"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white transition-transform hover:scale-[1.02]"
          >
            {sent ? (<><Check className="h-4 w-4" /> Sent</>) : (<><Send className="h-4 w-4" /> Send message</>)}
          </button>
        </form>
      </section>
    </Shell>
  );
}
