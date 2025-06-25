import express from 'express';
import { getProfile, updateProfile, setActive, getAllUsers } from '../controllers/userController.js';
import { authenticate, authorize } from '../middleware/auth.js';


const router = express.Router();

// Route to get all users - Admin only
router.get('/users', authenticate, authorize('admin'), getAllUsers);
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.put('/set-active', authenticate, setActive);

export default router; 