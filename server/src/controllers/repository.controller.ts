import { Request, Response } from 'express';
import { GitHubService } from '../services/github.service';
import { searchReposSchema, getRepoDetailsSchema } from '../validators/repository.validator';
import { logger } from '../lib/logger';

export class RepositoryController {
  /**
   * GET /api/v1/repositories
   * Search for repositories matching language and framework criteria.
   */
  public static async search(req: Request, res: Response): Promise<void> {
    try {
      const parseResult = searchReposSchema.safeParse({ query: req.query });

      if (!parseResult.success) {
        res.status(400).json({
          success: false,
          message: 'Invalid request query parameters',
          errors: parseResult.error.format(),
        });
        return;
      }

      const { language, framework, page, per_page } = parseResult.data.query;

      const repos = await GitHubService.searchRepositories(
        language,
        framework,
        page,
        per_page
      );

      res.status(200).json({
        success: true,
        data: repos,
        meta: {
          page,
          per_page,
          count: repos.length,
        },
        message: 'Repositories fetched successfully',
      });
    } catch (error: any) {
      logger.error(error, 'Error searching repositories');
      res.status(500).json({
        success: false,
        message: error.message || 'An error occurred while fetching repositories',
      });
    }
  }

  /**
   * GET /api/v1/repositories/:owner/:repo
   * Fetch specific repository details by owner and name.
   */
  public static async getDetails(req: Request, res: Response): Promise<void> {
    try {
      const parseResult = getRepoDetailsSchema.safeParse({ params: req.params });

      if (!parseResult.success) {
        res.status(400).json({
          success: false,
          message: 'Invalid request parameters',
          errors: parseResult.error.format(),
        });
        return;
      }

      const { owner, repo } = parseResult.data.params;

      const repository = await GitHubService.getRepository(owner, repo);

      res.status(200).json({
        success: true,
        data: repository,
        meta: {},
        message: 'Repository details fetched successfully',
      });
    } catch (error: any) {
      logger.error(error, `Error fetching repository details for ${req.params.owner}/${req.params.repo}`);
      
      const status = error.message.includes('404') ? 404 : 500;
      res.status(status).json({
        success: false,
        message: error.message || 'An error occurred while fetching repository details',
      });
    }
  }
}
