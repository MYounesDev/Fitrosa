import express from 'express';
import { getAllCoaches, getCoach, addCoach, updateCoach, deleteCoach } from '../controllers/coachController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, authorize('admin'), getAllCoaches);
router.get('/:id', authenticate, authorize('admin'), getCoach);
router.post('/', authenticate, authorize('admin'), addCoach);
router.put('/:id', authenticate, authorize('admin'), updateCoach);
router.delete('/:id', authenticate, authorize('admin'), deleteCoach);

export default router; 