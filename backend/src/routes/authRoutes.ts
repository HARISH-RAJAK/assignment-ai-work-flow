import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { authenticateJwt } from '../middlewares/authMiddleware';
import { authRateLimiter } from '../middlewares/rateLimiter';

const router = Router();
const authController = new AuthController();

router.post('/register', authRateLimiter, authController.register);
router.post('/login', authRateLimiter, authController.login);
router.get('/me', authenticateJwt, authController.getMe);

export default router;
