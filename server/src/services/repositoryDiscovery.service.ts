import { GitHubService } from './github.service';
import { Repo } from '../types/github.types';
import { calculateRepositoryScore } from '../utils/scoring';
import { rankRepositories } from '../utils/ranking';
import { logger } from '../lib/logger';
import { CacheService } from './cache.service';
import { config } from '../config';

export interface DiscoveryOptions {
  language: string;
  framework?: string;
  page?: number;
  perPage?: number;
  sort?: 'relevance' | 'stars' | 'forks' | 'updated' | 'score';
  order?: 'asc' | 'desc';
}

export interface DiscoveryRepo extends Repo {
  score: number;
  framework?: string;
  watchers: number;
}

const activeRefreshes = new Set<string>();

export class RepositoryDiscoveryService {
  /**
   * Discover and rank repositories based on criteria.
   */
  public static async discover(options: DiscoveryOptions): Promise<DiscoveryRepo[]> {
    const {
      language,
      framework,
      page = 1,
      perPage = 20,
      sort = 'relevance',
      order = 'desc',
    } = options;

    logger.info(
      `Starting repository discovery for language=${language}, framework=${framework || 'none'}, page=${page}, perPage=${perPage}, sort=${sort}, order=${order}`
    );

    // Validate language filter
    const allowedLanguages = [
      'javascript',
      'typescript',
      'python',
      'java',
      'go',
      'rust',
      'c++',
      'php',
    ];
    
    if (!allowedLanguages.includes(language.toLowerCase())) {
      logger.warn(`Search for unsupported language requested: ${language}`);
    }

    const cacheKey = `repositories:${language.toLowerCase()}:${(framework || 'none').toLowerCase()}:${page}:${sort}:${order}`;
    const ghSort = sort === 'score' || sort === 'relevance' ? 'stars' : sort;

    // Try to get from cache first
    const cachedPayload = await CacheService.get<{ data: DiscoveryRepo[]; cachedAt: number }>(cacheKey);
    if (cachedPayload) {
      const { data, cachedAt } = cachedPayload;
      const ageMs = Date.now() - cachedAt;
      const halfLifeMs = (config.CACHE_TTL / 2) * 1000;

      if (ageMs > halfLifeMs) {
        // Stale! Trigger background refresh
        if (!activeRefreshes.has(cacheKey)) {
          activeRefreshes.add(cacheKey);
          (async () => {
            try {
              logger.info(`Refreshing stale cache in background for key: ${cacheKey}`);
              const freshRepos = await GitHubService.searchRepositories(
                language,
                framework,
                1,
                100,
                ghSort,
                order
              );
              if (freshRepos && freshRepos.length > 0) {
                const uniqueMap = new Map<number, Repo>();
                const seenFullNames = new Set<string>();
                for (const r of freshRepos) {
                  const lowerFullName = r.fullName.toLowerCase();
                  if (!uniqueMap.has(r.id) && !seenFullNames.has(lowerFullName)) {
                    uniqueMap.set(r.id, r);
                    seenFullNames.add(lowerFullName);
                  }
                }
                const deDuplicated = Array.from(uniqueMap.values());
                
                let filtered = deDuplicated;
                if (framework) {
                  const fwLower = framework.toLowerCase();
                  filtered = deDuplicated.filter((r) => {
                    const hasTopic = r.topics.some((t) => t.toLowerCase() === fwLower);
                    const inName = r.name.toLowerCase().includes(fwLower);
                    const inDesc = r.description?.toLowerCase().includes(fwLower) ?? false;
                    return hasTopic || inName || inDesc;
                  });
                }
                
                const ranked = rankRepositories(filtered, sort, order);
                const startIndex = (page - 1) * perPage;
                const paginated = ranked.slice(startIndex, startIndex + perPage);
                const freshResults = paginated.map((r) => {
                  const score = calculateRepositoryScore(r);
                  return {
                    ...r,
                    score,
                    framework,
                    watchers: r.stars,
                  };
                });
                
                await CacheService.set(cacheKey, { data: freshResults, cachedAt: Date.now() });
              }
            } catch (err) {
              logger.error(err, `Failed to refresh background cache for key: ${cacheKey}`);
            } finally {
              activeRefreshes.delete(cacheKey);
            }
          })();
        }
      }
      return data;
    }

    // 1. Fetch repositories using existing GitHubService
    const rawRepos = await GitHubService.searchRepositories(
      language,
      framework,
      1,
      100,
      ghSort,
      order
    );

    if (!rawRepos || rawRepos.length === 0) {
      return [];
    }

    // 2. Remove Duplicates (using id and fullName)
    const uniqueMap = new Map<number, Repo>();
    const seenFullNames = new Set<string>();

    for (const r of rawRepos) {
      const lowerFullName = r.fullName.toLowerCase();
      if (!uniqueMap.has(r.id) && !seenFullNames.has(lowerFullName)) {
        uniqueMap.set(r.id, r);
        seenFullNames.add(lowerFullName);
      }
    }
    const deDuplicated = Array.from(uniqueMap.values());

    // 3. Framework Keyword Filtering
    let filtered = deDuplicated;
    if (framework) {
      const fwLower = framework.toLowerCase();
      filtered = deDuplicated.filter((r) => {
        const hasTopic = r.topics.some((t) => t.toLowerCase() === fwLower);
        const inName = r.name.toLowerCase().includes(fwLower);
        const inDesc = r.description?.toLowerCase().includes(fwLower) ?? false;
        return hasTopic || inName || inDesc;
      });
    }

    // 4. Rank and Sort Repositories in memory
    const ranked = rankRepositories(filtered, sort, order);

    // 5. Paginate in memory
    const startIndex = (page - 1) * perPage;
    const paginated = ranked.slice(startIndex, startIndex + perPage);

    // 6. Optimize and Map Response to include score, framework, and watchers
    const results = paginated.map((r) => {
      const score = calculateRepositoryScore(r);
      return {
        ...r,
        score,
        framework,
        watchers: r.stars,
      };
    });

    // Store in cache
    await CacheService.set(cacheKey, { data: results, cachedAt: Date.now() });

    return results;
  }
}
