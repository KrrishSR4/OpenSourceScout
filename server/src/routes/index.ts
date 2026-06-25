import { Router } from 'express';
import healthRoutes from './health.routes';

const router = Router();

// Mount health checks at the root level (e.g., /health, /ready, /live)
router.use('/', healthRoutes);

export default router;
