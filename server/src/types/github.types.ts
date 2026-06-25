export interface Repo {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  url: string;
  stars: number;
  forks: number;
  openIssues: number;
  goodFirstIssues: number;
  contributors: number;
  competition: 'Low' | 'Medium' | 'High';
  language: string | null;
  updatedAt: string;
  pushedAt: string;
  topics: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  difficultyScore: number; // 0-100
  activityScore: number; // 0-100
  friendlinessScore: number; // 0-100
  owner: {
    login: string;
    avatar: string;
  };
}

export interface GhRepo {
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
  owner: {
    login: string;
    avatar_url: string;
  };
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
}
