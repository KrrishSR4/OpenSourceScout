import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  ChevronDown,
  Star,
  GitFork,
  CircleDot,
  ExternalLink,
  Github,
  Sparkles,
  Activity,
  Heart,
  Gauge,
  Loader2,
  Clock,
  Users,
  Swords,
} from "lucide-react";
import { Shell } from "@/components/site/Shell";
import { LANGUAGES, FRAMEWORKS } from "@/lib/frameworks";
import { searchRepos, type Repo } from "@/lib/github.functions";

export const Route = createFileRoute("/explore")({
  component: ExplorePage,
});

function ExplorePage() {
  const [languageInput, setLanguageInput] = useState("");
  const [language, setLanguage] = useState<string | null>(null);
  const [framework, setFramework] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<string>("");
  const [competition, setCompetition] = useState<"all" | "Low" | "Medium" | "High">("all");

  const callSearch = useServerFn(searchRepos);
  const mutation = useMutation({
    mutationFn: async (input: { language: string; framework: string }) => {
      const phases = [
        "Analyzing ecosystem…",
        "Finding active repositories…",
        "Calculating contribution opportunities…",
      ];
      let i = 0;
      setPhase(phases[0]);
      const id = setInterval(() => {
        i = (i + 1) % phases.length;
        setPhase(phases[i]);
      }, 900);
      try {
        const res = await callSearch({ data: input });
        return res;
      } finally {
        clearInterval(id);
        setPhase("");
      }
    },
  });

  const langKey = useMemo(() => {
    const exact = LANGUAGES.find(
      (l) => l.name.toLowerCase() === languageInput.trim().toLowerCase(),
    );
    return exact?.key ?? null;
  }, [languageInput]);

  useEffect(() => {
    setLanguage(langKey);
  }, [langKey]);

  const frameworks = langKey ? FRAMEWORKS[langKey] ?? [] : [];

  function pickLanguage(name: string, key: string) {
    setLanguageInput(name);
    setLanguage(key);
    setFramework(null);
  }

  function onSearch() {
    if (!language) return;
    mutation.mutate({ language, framework: framework ?? "" });
  }

  return (
    <Shell>
      <section className="relative isolate overflow-x-clip">
        <div className="absolute inset-0 -z-10 grid-bg" />
        <div className="absolute inset-0 -z-10 halo opacity-60" />

        <div className="mx-auto max-w-6xl px-6 pt-16 pb-10">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Discovery</div>
          <h1 className="mt-3 font-display text-5xl tracking-tight text-ink md:text-6xl">
            Explore <span className="italic text-muted-foreground">repositories</span> worth contributing to.
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Pick your language, then a framework. We surface real GitHub repos with friendly maintainers and live good-first-issues.
          </p>

          {/* Search panel */}
          <div className="mt-10 rounded-3xl border border-border bg-surface/80 p-3 shadow-[var(--shadow-elegant)] backdrop-blur md:p-4">
            <div className="grid gap-3 md:grid-cols-[1.1fr_1.1fr_auto]">
              {/* Language combobox */}
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={languageInput}
                  onChange={(e) => {
                    setLanguageInput(e.target.value);
                    setLanguage(null);
                    setFramework(null);
                  }}
                  list="language-list"
                  placeholder="Programming language (e.g. TypeScript)"
                  className="h-14 w-full rounded-2xl border border-border bg-secondary/60 pl-11 pr-4 text-sm text-ink outline-none transition focus:border-[var(--color-accent)] focus:bg-surface"
                />
                <datalist id="language-list">
                  {LANGUAGES.map((l) => (
                    <option key={l.key} value={l.name} />
                  ))}
                </datalist>
                {languageInput && !language && (
                  <div className="absolute z-30 mt-2 max-h-64 w-full overflow-auto rounded-xl border border-border bg-surface p-1 shadow-lg">
                    {LANGUAGES.filter((l) =>
                      l.name.toLowerCase().includes(languageInput.toLowerCase()),
                    ).map((l) => (
                      <button
                        key={l.key}
                        onClick={() => pickLanguage(l.name, l.key)}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-secondary"
                      >
                        <span className="h-2 w-2 rounded-full" style={{ background: l.color }} />
                        {l.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Framework dropdown */}
              <div className="relative">
                <button
                  disabled={!language}
                  onClick={() => setOpen((v) => !v)}
                  className="flex h-14 w-full items-center justify-between rounded-2xl border border-border bg-secondary/60 px-4 text-sm text-ink transition disabled:opacity-50 hover:bg-surface"
                >
                  <span className={framework ? "" : "text-muted-foreground"}>
                    {framework ? frameworks.find((f) => f.topic === framework)?.name : "Choose framework"}
                  </span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {open && language && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.18 }}
                      className="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl border border-border bg-surface p-2 shadow-xl"
                    >
                      <button
                        onClick={() => {
                          setFramework(null);
                          setOpen(false);
                        }}
                        className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm hover:bg-secondary"
                      >
                        <span className="text-muted-foreground">Any framework</span>
                      </button>
                      {frameworks.map((f, i) => (
                        <motion.button
                          key={f.topic}
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.03 }}
                          onClick={() => {
                            setFramework(f.topic);
                            setOpen(false);
                          }}
                          className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm hover:bg-secondary"
                        >
                          <span className="font-medium text-ink">{f.name}</span>
                          <span className="text-xs text-muted-foreground">{f.blurb}</span>
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={onSearch}
                disabled={!language || mutation.isPending}
                className="group inline-flex h-14 items-center justify-center gap-2 rounded-2xl border-2 border-ink bg-[var(--color-accent)] px-6 text-sm font-bold text-[var(--color-background)] transition-all hover:-translate-y-0.5 disabled:opacity-50"
                style={{ boxShadow: "4px 4px 0 0 var(--color-ink)" }}
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Searching
                  </>
                ) : (
                  <>
                    Search Repositories
                    <Search className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>

            {/* Quick languages */}
            <div className="mt-4 flex flex-wrap items-center gap-2 px-1">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">Popular</span>
              {LANGUAGES.slice(0, 8).map((l) => (
                <button
                  key={l.key}
                  onClick={() => pickLanguage(l.name, l.key)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition ${
                    language === l.key
                      ? "border-ink bg-ink text-[var(--color-background)]"
                      : "border-border bg-surface text-muted-foreground hover:text-ink"
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: l.color }} />
                  {l.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <AnimatePresence mode="wait">
          {mutation.isPending && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid gap-4"
            >
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin text-[var(--color-accent)]" />
                <motion.span
                  key={phase}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-mono"
                >
                  {phase || "Working…"}
                </motion.span>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} />
                ))}
              </div>
            </motion.div>
          )}

          {mutation.isError && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive"
            >
              {(mutation.error as Error).message || "Something went wrong. Please try again."}
            </motion.div>
          )}

          {mutation.isSuccess && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {(() => {
                const all = mutation.data;
                const filtered = competition === "all" ? all : all.filter((r) => r.competition === competition);
                const counts = {
                  all: all.length,
                  Low: all.filter((r) => r.competition === "Low").length,
                  Medium: all.filter((r) => r.competition === "Medium").length,
                  High: all.filter((r) => r.competition === "High").length,
                };
                return all.length === 0 ? (
                <div className="rounded-2xl border border-border bg-surface p-10 text-center text-muted-foreground">
                  No repositories matched. Try removing the framework, or pick a different language.
                </div>
              ) : (
                <>
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                    <h2 className="font-display text-2xl text-ink">
                      {filtered.length} of {all.length} repositories
                    </h2>
                    <span className="text-xs text-muted-foreground">Sorted by stars · live data</span>
                  </div>
                  <div className="mb-6 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      <Swords className="h-3 w-3" /> Competition
                    </span>
                    {(["all", "Low", "Medium", "High"] as const).map((c) => {
                      const active = competition === c;
                      const dot =
                        c === "Low" ? "var(--color-accent-2)" :
                        c === "Medium" ? "var(--color-accent)" :
                        c === "High" ? "var(--color-accent-3)" : "var(--color-muted-foreground)";
                      return (
                        <button
                          key={c}
                          onClick={() => setCompetition(c)}
                          className={`inline-flex items-center gap-1.5 rounded-full border-2 px-3 py-1 text-xs font-semibold transition-all ${
                            active
                              ? "border-ink bg-ink text-[var(--color-background)]"
                              : "border-border bg-surface text-muted-foreground hover:border-ink hover:text-ink"
                          }`}
                        >
                          <span className="h-1.5 w-1.5 rounded-full" style={{ background: dot }} />
                          {c === "all" ? "All" : c}
                          <span className="font-mono text-[10px] opacity-70">{counts[c]}</span>
                        </button>
                      );
                    })}
                  </div>
                  {filtered.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center text-muted-foreground">
                      No repositories at this competition level. Try another filter.
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      {filtered.map((r, i) => (
                        <RepoCard key={r.id} repo={r} delay={i * 0.04} />
                      ))}
                    </div>
                  )}
                </>
                );
              })()}
            </motion.div>
          )}

          {!mutation.isPending && !mutation.isSuccess && !mutation.isError && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-3xl border border-dashed border-border bg-surface/60 p-12 text-center"
            >
              <Sparkles className="mx-auto h-6 w-6 text-[var(--color-accent)]" />
              <p className="mt-3 font-display text-2xl text-ink">Pick a language to get started</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Try{" "}
                <button onClick={() => pickLanguage("TypeScript", "typescript")} className="underline">
                  TypeScript
                </button>{" "}
                or{" "}
                <button onClick={() => pickLanguage("Python", "python")} className="underline">
                  Python
                </button>
                .
              </p>
              <div className="mt-6">
                <Link to="/" className="text-sm text-muted-foreground underline">
                  ← Back to home
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </Shell>
  );
}

function Skeleton() {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <div className="h-4 w-1/3 animate-shimmer rounded bg-secondary" />
      <div className="mt-3 h-3 w-4/5 animate-shimmer rounded bg-secondary" />
      <div className="mt-2 h-3 w-3/5 animate-shimmer rounded bg-secondary" />
      <div className="mt-5 flex gap-3">
        <div className="h-6 w-16 animate-shimmer rounded-full bg-secondary" />
        <div className="h-6 w-16 animate-shimmer rounded-full bg-secondary" />
        <div className="h-6 w-16 animate-shimmer rounded-full bg-secondary" />
      </div>
    </div>
  );
}

function RepoCard({ repo, delay }: { repo: Repo; delay: number }) {
  const [open, setOpen] = useState(false);
  const updated = new Date(repo.pushedAt);
  const days = Math.round((Date.now() - updated.getTime()) / (1000 * 60 * 60 * 24));
  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay }}
      className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-6 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-elegant)]"
    >
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[var(--color-accent)]/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 [mask:linear-gradient(white,white)_content-box,linear-gradient(white,white)] p-px" />

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <img src={repo.owner.avatar} alt={repo.owner.login} className="h-10 w-10 rounded-lg border border-border" />
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {repo.owner.login}
            </div>
            <h3 className="font-display text-xl tracking-tight text-ink">
              {repo.name}
            </h3>
          </div>
        </div>
        <DifficultyBadge level={repo.difficulty} />
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
        {repo.description || "No description provided."}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1"><Star className="h-3.5 w-3.5" />{compact(repo.stars)}</span>
        <span className="inline-flex items-center gap-1"><GitFork className="h-3.5 w-3.5" />{compact(repo.forks)}</span>
        <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5 text-[var(--color-accent-4)]" />{compact(repo.contributors)} contributors</span>
        <span className="inline-flex items-center gap-1"><CircleDot className="h-3.5 w-3.5 text-emerald-500" />{repo.openIssues} open</span>
        <span className="inline-flex items-center gap-1"><Sparkles className="h-3.5 w-3.5 text-[var(--color-accent-2)]" />{repo.goodFirstIssues} GFI</span>
        {repo.language && (
          <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-ink">
            {repo.language}
          </span>
        )}
        <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />Updated {days}d ago</span>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <CompetitionBadge level={repo.competition} />
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          competition · based on contributor count
        </span>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <MetricBar label="Activity" value={repo.activityScore} icon={Activity} />
        <MetricBar label="Friendliness" value={repo.friendlinessScore} icon={Heart} />
        <MetricBar label="Difficulty" value={repo.difficultyScore} icon={Gauge} />
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 flex flex-wrap gap-1.5">
              {repo.topics.slice(0, 10).map((t) => (
                <span key={t} className="rounded-full border border-border bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">
                  #{t}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-5 flex items-center gap-2">
        <a
          href={repo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3.5 py-1.5 text-xs font-medium text-[var(--color-background)] transition-transform hover:scale-[1.02]"
        >
          <ExternalLink className="h-3.5 w-3.5" /> Visit Repository
        </a>
        <a
          href={repo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs font-medium text-ink hover:bg-secondary"
        >
          <Github className="h-3.5 w-3.5" /> Open in GitHub
        </a>
        {repo.topics.length > 0 && (
          <button
            onClick={() => setOpen((v) => !v)}
            className="ml-auto text-xs text-muted-foreground hover:text-ink"
          >
            {open ? "Hide" : "Show"} topics
          </button>
        )}
      </div>
    </motion.article>
  );
}

function DifficultyBadge({ level }: { level: Repo["difficulty"] }) {
  const color =
    level === "Beginner" ? "var(--color-accent-2)" :
    level === "Intermediate" ? "var(--color-accent)" :
    "var(--color-accent-3)";
  return (
    <span
      className="shrink-0 rounded-full border-2 border-ink px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--color-background)]"
      style={{ background: color }}
    >
      {level}
    </span>
  );
}

function CompetitionBadge({ level }: { level: Repo["competition"] }) {
  const color =
    level === "Low" ? "var(--color-accent-2)" :
    level === "Medium" ? "var(--color-accent)" :
    "var(--color-accent-3)";
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full border border-ink px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--color-background)]"
      style={{ background: color }}
    >
      <Swords className="h-3 w-3" /> {level}
    </span>
  );
}

function MetricBar({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: typeof Activity;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-[10px] uppercase tracking-widest text-muted-foreground">
        <span className="inline-flex items-center gap-1"><Icon className="h-3 w-3" />{label}</span>
        <span className="font-mono text-ink">{value}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, Math.max(0, value))}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full bg-[var(--color-accent)]"
        />
      </div>
    </div>
  );
}

function compact(n: number) {
  return Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(n);
}
