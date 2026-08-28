import { Router } from 'express';
import { getHealth, getPing } from '../controllers/health.controller.js';

const router = Router();

// Endpoint de salud del sistema
router.get('/health', getHealth);

// Endpoint de prueba simple
router.get('/ping', getPing);

export default router;
