import { Router } from 'express';
import { RepositoryController } from '../controllers/repository.controller';

const router = Router();

router.get('/', RepositoryController.search);
router.get('/:owner/:repo', RepositoryController.getDetails);

export default router;
