import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { getHealth, getReady, getLive } from '../controllers/health.controller';

const router = Router();

const readyRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // limit each IP to 60 requests per windowMs
});

router.get('/health', getHealth);
router.get('/ready', readyRateLimiter, getReady);
router.get('/live', getLive);

export default router;
