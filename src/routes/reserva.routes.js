import { Router } from 'express';
import { resetCupo, reservarVulnerable, reservarSeguro } from '../controllers/reserva.controller.js';

const router = Router();

router.post('/reset', resetCupo);
router.post('/reservar-vulnerable', reservarVulnerable);
router.post('/reservar-seguro', reservarSeguro);

export default router;
