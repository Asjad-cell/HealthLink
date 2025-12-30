import { Router } from 'express';
import { login, getProfile } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { validateLogin } from '../middleware/validation';

const router = Router();

router.post('/login', validateLogin, login);
router.get('/profile', authenticate, getProfile);

export default router;
