import { createServerFn } from "@tanstack/react-start";

export type Repo = {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  url: string;
  stars: number;
  forks: number;
  openIssues: number;
  goodFirstIssues: number;
  language: string | null;
  updatedAt: string;
  pushedAt: string;
  topics: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  difficultyScore: number; // 0-100
  activityScore: number; // 0-100
  friendlinessScore: number; // 0-100
  owner: { login: string; avatar: string };
};

type GhRepo = {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null;
  updated_at: string;
  pushed_at: string;
  topics?: string[];
  has_issues: boolean;
  archived: boolean;
  owner: { login: string; avatar_url: string };
};

function clamp(n: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, n));
}

function daysSince(iso: string) {
  return (Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24);
}

async function ghFetch(url: string) {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "opensource-scout",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(url, { headers });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`GitHub ${res.status}: ${text.slice(0, 180)}`);
  }
  return res.json();
}

export const searchRepos = createServerFn({ method: "GET" })
  .inputValidator((d: { language: string; framework: string }) => ({
    language: String(d.language || "").slice(0, 40),
    framework: String(d.framework || "").slice(0, 40),
  }))
  .handler(async ({ data }): Promise<Repo[]> => {
    const { language, framework } = data;
    if (!language) return [];

    const q = [
      framework ? `topic:${framework.toLowerCase()}` : "",
      `language:${language}`,
      "stars:>200",
      "archived:false",
      "is:public",
      "good-first-issues:>0",
    ]
      .filter(Boolean)
      .join(" ");

    const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(
      q,
    )}&sort=stars&order=desc&per_page=100`;

    const json = (await ghFetch(url)) as { items: GhRepo[] };
    const items = (json.items || []).filter((r) => !r.archived);

    // Fetch good-first-issue counts only for the first 24 to stay under rate limit;
    // the remaining repos still return with derived (estimated) gfi = 0.
    const top = items.slice(0, 100);
    const enriched = top.slice(0, 24);
    const counts = await Promise.all(
      enriched.map(async (r) => {
        try {
          const issuesUrl = `https://api.github.com/search/issues?q=${encodeURIComponent(
            `repo:${r.full_name} is:issue is:open label:"good first issue"`,
          )}&per_page=1`;
          const j = (await ghFetch(issuesUrl)) as { total_count: number };
          return j.total_count ?? 0;
        } catch {
          return 0;
        }
      }),
    );

    return top.map((r, i) => {
      const gfi = i < counts.length ? counts[i] : 0;
      const dayssincePush = daysSince(r.pushed_at);
      const activityScore = clamp(100 - dayssincePush * 1.5);
      const friendlinessScore = clamp(
        40 + Math.log10(Math.max(1, gfi)) * 25 + (r.has_issues ? 10 : 0),
      );
      // difficulty: more stars + more open issues -> harder onboarding
      const rawDiff = clamp(
        Math.log10(Math.max(1, r.stargazers_count)) * 14 +
          Math.log10(Math.max(1, r.open_issues_count)) * 8 -
          Math.log10(Math.max(1, gfi)) * 10,
      );
      const difficulty: Repo["difficulty"] =
        rawDiff < 40 ? "Beginner" : rawDiff < 70 ? "Intermediate" : "Advanced";

      return {
        id: r.id,
        name: r.name,
        fullName: r.full_name,
        description: r.description,
        url: r.html_url,
        stars: r.stargazers_count,
        forks: r.forks_count,
        openIssues: r.open_issues_count,
        goodFirstIssues: gfi,
        language: r.language,
        updatedAt: r.updated_at,
        pushedAt: r.pushed_at,
        topics: r.topics ?? [],
        difficulty,
        difficultyScore: Math.round(rawDiff),
        activityScore: Math.round(activityScore),
        friendlinessScore: Math.round(friendlinessScore),
        owner: { login: r.owner.login, avatar: r.owner.avatar_url },
      };
    });
  });
