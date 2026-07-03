import { z } from 'zod';

export const searchReposSchema = z.object({
  query: z.object({
    language: z.string().min(1, 'Language parameter is required').max(50),
    framework: z.string().max(50).optional(),
    page: z.coerce.number().int().min(1).default(1),
    per_page: z.coerce.number().int().min(1).max(100).default(100),
    sort: z.enum(['stars', 'forks', 'updated', 'relevance']).default('stars'),
    order: z.enum(['asc', 'desc']).default('desc'),
  }),
});

export const getRepoDetailsSchema = z.object({
  params: z.object({
    owner: z.string().min(1, 'Owner parameter is required'),
    repo: z.string().min(1, 'Repository name parameter is required'),
  }),
});

export type SearchReposQueryInput = z.infer<typeof searchReposSchema>['query'];
export type GetRepoDetailsParamsInput = z.infer<typeof getRepoDetailsSchema>['params'];
