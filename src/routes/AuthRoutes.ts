import { Router } from 'express';
import { AuthController } from '../api/controllers/AuthController';
import { authenticate } from '../middleware/authenticate';

const router = Router();
const authController = new AuthController();

router.post('/auth/login', authController.login);
router.get('/auth/me', authenticate, authController.me);

export { router as authRouter };