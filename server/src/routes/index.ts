import { Router } from 'express';
import healthRoutes from './health.routes';
import repositoryRoutes from './repository.routes';
import { apiRateLimiter } from '../middlewares/rateLimit.middleware';

const router = Router();

// Mount health checks at the root level (e.g., /health, /ready, /live) - no rate limit
router.use('/', healthRoutes);

// Mount versioned repository API routes - rate limited
router.use('/api/v1/repositories', apiRateLimiter, repositoryRoutes);

export default router;
