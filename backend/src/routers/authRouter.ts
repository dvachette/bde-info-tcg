import { Router } from 'express';
import { login, refresh, logout, me, register } from '#controllers/authControllers.js';
import { requireAuth } from '#middlewares/authMiddleware.js';

const router = Router();

router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', requireAuth, me);
router.post('/register', register);

export default router;