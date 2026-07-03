import { Repo } from '../types/github.types';

/**
 * Calculates a repository quality score from 0 to 100.
 * Reflects Popularity, Maintenance, Activity, and Community Adoption.
 */
export function calculateRepositoryScore(repo: Repo): number {
  // 1. Popularity Score (max 30 points)
  // Logarithmic scale: stars > 10,000 gets near max points
  const starsScore = Math.min(15, (Math.log10(Math.max(1, repo.stars)) / 5) * 15);
  const forksScore = Math.min(15, (Math.log10(Math.max(1, repo.forks)) / 4) * 15);
  const popularity = starsScore + forksScore;

  // 2. Activity Score (max 30 points)
  // Based on pushed_at timestamp
  const daysSincePush = (Date.now() - new Date(repo.pushedAt).getTime()) / (1000 * 60 * 60 * 24);
  const activity = Math.max(0, 30 - daysSincePush * 0.5);

  // 3. Maintenance / GFI Friendly Score (max 20 points)
  const gfiPoints = Math.min(15, repo.goodFirstIssues * 1.5);
  const openIssuesPoints = repo.openIssues > 0 ? 5 : 0;
  const maintenance = gfiPoints + openIssuesPoints;

  // 4. Community/Friendliness Score (max 20 points)
  // Based on the pre-calculated friendlinessScore in Repo
  const community = (repo.friendlinessScore / 100) * 20;

  const finalScore = Math.round(popularity + activity + maintenance + community);
  return Math.max(0, Math.min(100, finalScore));
}
