import express from 'express';
import { getAllSports, getSport, createSport, updateSport, deleteSport } from '../controllers/sportController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Admin only routes
router.get('/', authenticate, authorize('admin'), getAllSports);
router.get('/:id', authenticate, authorize('admin'), getSport);
router.post('/', authenticate, authorize('admin'), createSport);
router.put('/:id', authenticate, authorize('admin'), updateSport);
router.delete('/:id', authenticate, authorize('admin'), deleteSport);

export default router; 