import { Router } from 'express';
import { getInfo } from '../controllers/info.controller.js';

const router = Router();

// Endpoint de información general
router.get('/info', getInfo);

export default router;
