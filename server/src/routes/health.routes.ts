import { Router } from 'express';
import { getHealth, getReady, getLive } from '../controllers/health.controller';

const router = Router();

router.get('/health', getHealth);
router.get('/ready', getReady);
router.get('/live', getLive);

export default router;
