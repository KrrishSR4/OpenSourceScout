import { Repo } from '../types/github.types';
import { calculateRepositoryScore } from './scoring';

/**
 * Sorts and ranks repositories based on the requested parameter and order.
 */
export function rankRepositories(
  repos: Repo[],
  sortBy: 'relevance' | 'stars' | 'forks' | 'updated' | 'score' = 'relevance',
  order: 'asc' | 'desc' = 'desc'
): Repo[] {
  const scoreMap = new Map<number, number>();
  repos.forEach((r) => {
    scoreMap.set(r.id, calculateRepositoryScore(r));
  });

  return [...repos].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'stars':
        comparison = a.stars - b.stars;
        break;
      case 'forks':
        comparison = a.forks - b.forks;
        break;
      case 'updated':
        comparison = new Date(a.pushedAt).getTime() - new Date(b.pushedAt).getTime();
        break;
      case 'score':
        comparison = (scoreMap.get(a.id) || 0) - (scoreMap.get(b.id) || 0);
        break;
      case 'relevance':
      default: {
        // Relevance uses a combination of stars, activity, and friendliness
        const relA = a.stars * 0.1 + a.activityScore * 0.45 + a.friendlinessScore * 0.45;
        const relB = b.stars * 0.1 + b.activityScore * 0.45 + b.friendlinessScore * 0.45;
        comparison = relA - relB;
        break;
      }
    }

    return order === 'desc' ? -comparison : comparison;
  });
}
