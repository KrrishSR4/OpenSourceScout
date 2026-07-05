import { Request, Response } from 'express';
import { GitHubService } from '../services/github.service';
import { RepositoryDiscoveryService } from '../services/repositoryDiscovery.service';
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
        logger.warn({
          ip: req.ip,
          url: req.originalUrl,
          query: req.query,
          errors: parseResult.error.format(),
        }, 'Validation failure: search query validation failed');

        res.status(400).json({
          success: false,
          message: 'Invalid request query parameters',
          errors: parseResult.error.format(),
        });
        return;
      }

      const { language, framework, page, per_page, sort, order } = parseResult.data.query;

      const repos = await RepositoryDiscoveryService.discover({
        language,
        framework,
        page,
        perPage: per_page,
        sort: sort as any,
        order,
      });

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
      
      let status = 500;
      if (error.message.includes('Rate Limit Exceeded')) {
        status = 403;
      } else if (error.message.includes('Timeout')) {
        status = 504;
      }

      res.status(status).json({
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
        logger.warn({
          ip: req.ip,
          url: req.originalUrl,
          params: req.params,
          errors: parseResult.error.format(),
        }, 'Validation failure: repository details params validation failed');

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
      
      let status = 500;
      if (error.message.includes('404')) {
        status = 404;
      } else if (error.message.includes('Rate Limit Exceeded')) {
        status = 403;
      } else if (error.message.includes('Timeout')) {
        status = 504;
      }

      res.status(status).json({
        success: false,
        message: error.message || 'An error occurred while fetching repository details',
      });
    }
  }
}
