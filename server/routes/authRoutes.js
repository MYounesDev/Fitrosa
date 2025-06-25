import express from 'express';
import { register, login, changePassword, setupPassword, isAuthenticated } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/isAuthenticated', authenticate, isAuthenticated);
router.post('/register', register);
router.post('/login', login);
router.post('/change-password', authenticate, changePassword);
router.post('/auth/setup-password/:token', setupPassword);

export default router; 