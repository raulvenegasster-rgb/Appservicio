import { Router } from 'express';
import { getGamesByWeek } from '../controllers/games.controller.js';
import { optionalAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/week/:num', optionalAuth, getGamesByWeek);

export default router;
