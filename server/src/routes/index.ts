import { Router } from 'express';
import healthRoutes from './health.routes';
import repositoryRoutes from './repository.routes';

const router = Router();

// Mount health checks at the root level (e.g., /health, /ready, /live)
router.use('/', healthRoutes);

// Mount versioned repository API routes
router.use('/api/v1/repositories', repositoryRoutes);

export default router;
