import { config } from '../config';
import { Repo, GhRepo } from '../types/github.types';
import { logger } from '../lib/logger';
import { prisma } from '../lib/prisma';
import { githubRequestsTotal, githubErrorsTotal } from '../lib/metrics';

export class GitHubService {
  private static getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'opensource-scout-backend',
    };

    if (config.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${config.GITHUB_TOKEN}`;
    }

    return headers;
  }

  private static async checkRateLimit(headers: Headers): Promise<void> {
    const remaining = headers.get('x-ratelimit-remaining');
    const limit = headers.get('x-ratelimit-limit');
    const reset = headers.get('x-ratelimit-reset');

    if (remaining !== null) {
      logger.debug(
        `GitHub API Rate Limit: ${remaining}/${limit} remaining. Resets at ${reset}`
      );
    }
  }

  private static sanitizeUrlForMetrics(url: string): string {
    try {
      const parsed = new URL(url);
      let path = parsed.pathname;
      if (path.startsWith('/repos/')) {
        const parts = path.split('/');
        if (parts.length >= 3) {
          parts[2] = ':owner';
        }
        if (parts.length >= 4) {
          parts[3] = ':repo';
        }
        path = parts.join('/');
      }
      return path;
    } catch {
      return url;
    }
  }

  private static clamp(n: number, min = 0, max = 100): number {
    return Math.max(min, Math.min(max, n));
  }

  private static daysSince(iso: string): number {
    return (Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24);
  }

  /**
   * Helper to perform a fetch to the GitHub API with timeout and rate-limit tracking.
   */
  private static async ghFetch(url: string, retries = 3, delayMs = 1000): Promise<any> {
    const headers = this.getHeaders();
    const sanitizedUrl = this.sanitizeUrlForMetrics(url);

    logger.info({ url: sanitizedUrl, method: 'GET' }, `GitHub API Call: GET ${url}`);
    githubRequestsTotal.inc({ url: sanitizedUrl, method: 'GET' });

    for (let attempt = 1; attempt <= retries; attempt++) {
      const signal = AbortSignal.timeout(config.REQUEST_TIMEOUT);
      try {
        const res = await fetch(url, { headers, signal });
        await this.checkRateLimit(res.headers);

        if (!res.ok) {
          const text = await res.text().catch(() => '');
          githubErrorsTotal.inc({ url: sanitizedUrl, method: 'GET', error: `Status ${res.status}` });

          if (res.status === 403 && res.headers.get('x-ratelimit-remaining') === '0') {
            const resetTime = res.headers.get('x-ratelimit-reset');
            throw new Error(
              `GitHub API Rate Limit Exceeded. Reset time: ${
                resetTime ? new Date(parseInt(resetTime, 10) * 1000).toLocaleTimeString() : 'unknown'
              }`
            );
          }

          if (res.status >= 500 && attempt < retries) {
            logger.warn(`GitHub API 5xx error (${res.status}) on attempt ${attempt}/${retries}. Retrying in ${delayMs}ms...`);
            await new Promise((resolve) => setTimeout(resolve, delayMs));
            continue;
          }

          throw new Error(`GitHub API Error (${res.status}): ${text.slice(0, 180)}`);
        }

        return await res.json();
      } catch (error: any) {
        const isTimeout = error.name === 'TimeoutError' || error.message?.includes('timeout');
        const isNetwork = error.message?.includes('fetch failed') || error.code === 'ECONNRESET';

        if ((isTimeout || isNetwork) && attempt < retries) {
          logger.warn(`GitHub API request failed/timeout (attempt ${attempt}/${retries}): ${error.message}. Retrying in ${delayMs}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delayMs));
          continue;
        }

        githubErrorsTotal.inc({ url: sanitizedUrl, method: 'GET', error: error.message || 'unknown' });

        if (isTimeout) {
          throw new Error(`GitHub API Request Timeout after ${config.REQUEST_TIMEOUT}ms`);
        }
        throw error;
      }
    }
  }

  /**
   * Reads GitHub Link header to fetch total count of resource.
   */
  private static async ghCount(url: string, retries = 3, delayMs = 1000): Promise<number> {
    const headers = this.getHeaders();
    const sanitizedUrl = this.sanitizeUrlForMetrics(url);

    logger.info({ url: sanitizedUrl, method: 'GET' }, `GitHub API Call (Count): GET ${url}`);
    githubRequestsTotal.inc({ url: sanitizedUrl, method: 'GET' });

    for (let attempt = 1; attempt <= retries; attempt++) {
      const signal = AbortSignal.timeout(config.REQUEST_TIMEOUT);
      try {
        const res = await fetch(url, { headers, signal });
        await this.checkRateLimit(res.headers);

        if (!res.ok) {
          githubErrorsTotal.inc({ url: sanitizedUrl, method: 'GET', error: `Status ${res.status}` });

          if (res.status >= 500 && attempt < retries) {
            await new Promise((resolve) => setTimeout(resolve, delayMs));
            continue;
          }
          return 0;
        }

        const link = res.headers.get('link') || '';
        const m = link.match(/[?&]page=(\d+)>;\s*rel="last"/);
        if (m) return Number(m[1]);

        const body = (await res.json().catch(() => [])) as unknown[];
        return Array.isArray(body) ? body.length : 0;
      } catch (error: any) {
        const isTimeout = error.name === 'TimeoutError' || error.message?.includes('timeout');
        const isNetwork = error.message?.includes('fetch failed') || error.code === 'ECONNRESET';

        if ((isTimeout || isNetwork) && attempt < retries) {
          await new Promise((resolve) => setTimeout(resolve, delayMs));
          continue;
        }

        githubErrorsTotal.inc({ url: sanitizedUrl, method: 'GET', error: error.message || 'unknown' });
        return 0;
      }
    }
    return 0;
  }

  /**
   * Normalizes raw GhRepo item to standardized Repo model with metrics/scores.
   */
  private static normalizeRepo(r: GhRepo, gfiCount: number, contributorCount: number): Repo {
    const dayssincePush = this.daysSince(r.pushed_at);
    const activityScore = this.clamp(100 - dayssincePush * 1.5);
    const friendlinessScore = this.clamp(
      40 + Math.log10(Math.max(1, gfiCount)) * 25 + (r.has_issues ? 10 : 0)
    );

    const rawDiff = this.clamp(
      Math.log10(Math.max(1, r.stargazers_count)) * 14 +
        Math.log10(Math.max(1, r.open_issues_count)) * 8 -
        Math.log10(Math.max(1, gfiCount)) * 10
    );

    const difficulty: Repo['difficulty'] =
      rawDiff < 40 ? 'Beginner' : rawDiff < 70 ? 'Intermediate' : 'Advanced';

    const competition: Repo['competition'] =
      contributorCount < 30 ? 'Low' : contributorCount < 150 ? 'Medium' : 'High';

    return {
      id: r.id,
      name: r.name,
      fullName: r.full_name,
      description: r.description,
      url: r.html_url,
      stars: r.stargazers_count,
      forks: r.forks_count,
      openIssues: r.open_issues_count,
      goodFirstIssues: gfiCount,
      contributors: contributorCount,
      competition,
      language: r.language,
      updatedAt: r.updated_at,
      pushedAt: r.pushed_at,
      topics: r.topics ?? [],
      difficulty,
      difficultyScore: Math.round(rawDiff),
      activityScore: Math.round(activityScore),
      friendlinessScore: Math.round(friendlinessScore),
      owner: {
        login: r.owner.login,
        avatar: r.owner.avatar_url,
      },
    };
  }

  /**
   * Search repositories matching language and optional framework classification.
   */
  public static async searchRepositories(
    language: string,
    framework?: string,
    page = 1,
    perPage = 100,
    sort = 'stars',
    order: 'asc' | 'desc' = 'desc'
  ): Promise<Repo[]> {
    if (!language) return [];

    const q = [
      framework ? `topic:${framework.toLowerCase()}` : '',
      `language:${language}`,
      'stars:>200',
      'archived:false',
      'is:public',
      'good-first-issues:>0',
    ]
      .filter(Boolean)
      .join(' ');

    let sortParam = '';
    if (sort && sort !== 'relevance') {
      sortParam = `&sort=${sort}`;
    }

    const url = `${config.GITHUB_API_URL}/search/repositories?q=${encodeURIComponent(
      q
    )}${sortParam}&order=${order}&page=${page}&per_page=${perPage}`;

    logger.info(`Searching GitHub repositories with query: "${q}"`);
    const json = (await this.ghFetch(url)) as { items: GhRepo[] };
    const rawItems = json.items || [];

    // De-duplicate items by id
    const uniqueMap = new Map<number, GhRepo>();
    for (const item of rawItems) {
      if (!uniqueMap.has(item.id) && !item.archived) {
        uniqueMap.set(item.id, item);
      }
    }
    const items = Array.from(uniqueMap.values());

    const top = items.slice(0, perPage);

    // 1. Check DB cache
    const githubIds = top.map((r) => r.id);
    const existingCaches = await prisma.repositoryCache.findMany({
      where: { githubId: { in: githubIds } },
    });
    const cacheMap = new Map(existingCaches.map((c) => [c.githubId, c]));

    const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
    const now = Date.now();

    // 2. Identify which repos need enrichment
    const reposToEnrich: GhRepo[] = [];
    const results: Repo[] = [];

    // Ensure the framework exists in the DB if specified
    if (framework) {
      await prisma.framework.upsert({
        where: { name: framework.toLowerCase() },
        update: {},
        create: { name: framework.toLowerCase() },
      });
    }

    for (const r of top) {
      const cached = cacheMap.get(r.id);
      if (cached && now - new Date(cached.updatedAt).getTime() < CACHE_TTL_MS) {
        results.push(cached.rawData as unknown as Repo);
      } else {
        reposToEnrich.push(r);
      }
    }

    // 3. For repos that need enrichment:
    // Generate instant response results using stale cache or fallback values
    const newlyEnriched: Repo[] = [];
    for (const r of reposToEnrich) {
      const cached = cacheMap.get(r.id);
      if (cached) {
        newlyEnriched.push(cached.rawData as unknown as Repo);
      } else {
        const normalized = this.normalizeRepo(
          r,
          0,
          Math.max(1, Math.round(Math.log10(Math.max(1, r.forks_count)) * 40))
        );
        newlyEnriched.push(normalized);
      }
    }

    // 4. Enrich in background asynchronously (limit to max 15 repos per search request to prevent rate limits)
    const limitEnrich = reposToEnrich.slice(0, 15);
    if (limitEnrich.length > 0) {
      // Run enrichment task in background without blocking response
      (async () => {
        try {
          logger.info(`Starting background repository enrichment for ${limitEnrich.length} items`);
          const [counts, contribCounts] = await Promise.all([
            Promise.all(
              limitEnrich.map(async (r) => {
                try {
                  const issuesUrl = `${config.GITHUB_API_URL}/search/issues?q=${encodeURIComponent(
                    `repo:${r.full_name} is:issue is:open label:"good first issue"`
                  )}&per_page=1`;
                  const j = (await this.ghFetch(issuesUrl)) as { total_count: number };
                  return j.total_count ?? 0;
                } catch {
                  return 0;
                }
              })
            ),
            Promise.all(
              limitEnrich.map(async (r) => {
                try {
                  const url = `${config.GITHUB_API_URL}/repos/${r.full_name}/contributors?per_page=1&anon=true`;
                  return await this.ghCount(url);
                } catch {
                  return 0;
                }
              })
            ),
          ]);

          // Save newly enriched data to DB
          for (let i = 0; i < limitEnrich.length; i++) {
            const r = limitEnrich[i];
            const gfiCount = counts[i];
            const contributorCount = contribCounts[i];
            const normalized = this.normalizeRepo(r, gfiCount, contributorCount);

            try {
              await prisma.repositoryCache.upsert({
                where: { githubId: r.id },
                update: {
                  description: r.description,
                  stars: r.stargazers_count,
                  forks: r.forks_count,
                  openIssues: r.open_issues_count,
                  language: r.language,
                  rawData: normalized as any,
                  updatedAt: new Date(),
                  frameworks: framework ? {
                    connect: { name: framework.toLowerCase() }
                  } : undefined,
                },
                create: {
                  githubId: r.id,
                  fullName: r.full_name,
                  description: r.description,
                  stars: r.stargazers_count,
                  forks: r.forks_count,
                  openIssues: r.open_issues_count,
                  language: r.language,
                  rawData: normalized as any,
                  frameworks: framework ? {
                    connect: { name: framework.toLowerCase() }
                  } : undefined,
                },
              });
            } catch (err) {
              logger.error(err, `Failed to cache repo ${r.full_name} in background`);
            }
          }
          logger.info(`Successfully enriched ${limitEnrich.length} repos in background.`);
        } catch (err) {
          logger.error(err, "Error in background repo enrichment");
        }
      })();
    }

    // Combine all results in original order
    const finalResultsMap = new Map<number, Repo>();
    results.forEach((r) => finalResultsMap.set(r.id, r));
    newlyEnriched.forEach((r) => finalResultsMap.set(r.id, r));

    return top.map((r) => finalResultsMap.get(r.id)!).filter(Boolean);
  }

  /**
   * Fetch specific repository details by owner and name.
   */
  public static async getRepository(owner: string, repoName: string): Promise<Repo> {
    const fullName = `${owner}/${repoName}`;
    
    // Check DB cache first case-insensitively
    const cached = await prisma.repositoryCache.findFirst({
      where: { fullName: { equals: fullName, mode: 'insensitive' } },
    });
    
    const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
    if (cached && Date.now() - new Date(cached.updatedAt).getTime() < CACHE_TTL_MS) {
      return cached.rawData as unknown as Repo;
    }

    const url = `${config.GITHUB_API_URL}/repos/${owner}/${repoName}`;
    logger.info(`Fetching details for GitHub repository: ${owner}/${repoName}`);
    
    const r = (await this.ghFetch(url)) as GhRepo;

    // Fetch good first issues
    let gfiCount = 0;
    try {
      const issuesUrl = `${config.GITHUB_API_URL}/search/issues?q=${encodeURIComponent(
        `repo:${r.full_name} is:issue is:open label:"good first issue"`
      )}&per_page=1`;
      const j = (await this.ghFetch(issuesUrl)) as { total_count: number };
      gfiCount = j.total_count ?? 0;
    } catch (e) {
      logger.warn(`Failed to fetch GFI count for ${r.full_name}`);
    }

    // Fetch contributors count
    let contributorCount = 0;
    try {
      const url = `${config.GITHUB_API_URL}/repos/${r.full_name}/contributors?per_page=1&anon=true`;
      contributorCount = await this.ghCount(url);
    } catch (e) {
      logger.warn(`Failed to fetch contributors count for ${r.full_name}`);
      contributorCount = Math.max(1, Math.round(Math.log10(Math.max(1, r.forks_count)) * 40));
    }

    const normalized = this.normalizeRepo(r, gfiCount, contributorCount);

    // Upsert cache
    try {
      await prisma.repositoryCache.upsert({
        where: { githubId: r.id },
        update: {
          description: r.description,
          stars: r.stargazers_count,
          forks: r.forks_count,
          openIssues: r.open_issues_count,
          language: r.language,
          rawData: normalized as any,
          updatedAt: new Date(),
        },
        create: {
          githubId: r.id,
          fullName: r.full_name,
          description: r.description,
          stars: r.stargazers_count,
          forks: r.forks_count,
          openIssues: r.open_issues_count,
          language: r.language,
          rawData: normalized as any,
        },
      });
    } catch (err) {
      logger.error(err, `Failed to cache repo ${r.full_name}`);
    }

    return normalized;
  }
}
