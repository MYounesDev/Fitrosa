import express from 'express';
import { getAuthLogs } from '../controllers/authLogController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all auth logs with pagination
router.get('/',authenticate, authorize('admin'), getAuthLogs);

export default router; 