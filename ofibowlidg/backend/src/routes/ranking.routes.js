import { Router } from 'express';
import { getRanking } from '../controllers/ranking.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', authenticate, getRanking);

export default router;
