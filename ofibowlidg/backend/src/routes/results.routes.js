import { Router } from 'express';
import { saveResults } from '../controllers/results.controller.js';
import { authenticate, authorizeAdmin } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', authenticate, authorizeAdmin, saveResults);

export default router;
