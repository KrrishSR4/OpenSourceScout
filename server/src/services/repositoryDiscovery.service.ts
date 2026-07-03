import { GitHubService } from './github.service';
import { Repo } from '../types/github.types';
import { calculateRepositoryScore } from '../utils/scoring';
import { rankRepositories } from '../utils/ranking';
import { logger } from '../lib/logger';

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

    // 1. Fetch repositories using existing GitHubService
    // We pass page=1 and a larger perPage (like 100) to GitHubService so that we can do in-memory filtering,
    // de-duplication, ranking, and scoring locally before slicing to the requested page/perPage.
    const ghSort = sort === 'score' || sort === 'relevance' ? 'stars' : sort;
    const rawRepos = await GitHubService.searchRepositories(
      language,
      framework,
      1, // Fetch first page from GitHub to filter/rank
      100, // Fetch up to 100 items for ranking
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
    // If a framework is specified, ensure repositories contain framework keywords or topics if they are not already filtered by the GitHub search topic query
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
    return paginated.map((r) => {
      const score = calculateRepositoryScore(r);
      return {
        ...r,
        score,
        framework,
        watchers: r.stars, // Set watchers equivalent to stars
      };
    });
  }
}
