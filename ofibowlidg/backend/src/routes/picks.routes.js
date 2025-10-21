import { Router } from 'express';
import { savePicks } from '../controllers/picks.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', authenticate, savePicks);

export default router;
