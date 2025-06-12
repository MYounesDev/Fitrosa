import express from 'express';
import {
  getAllClasses,
  getClass,
  createClass,
  updateClass,
  deleteClass,
  assignCoach,
  getUnassignedClasses,
  assignStudent,
  removeStudent
} from '../controllers/classController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Admin only routes
router.get('/', authenticate, authorize('admin', 'coach'), getAllClasses);
router.get('/unassigned', authenticate, authorize('admin'), getUnassignedClasses);
router.get('/:id', authenticate, authorize('admin', 'coach'), getClass);
router.post('/', authenticate, authorize('admin'), createClass);
router.put('/:id', authenticate, authorize('admin'), updateClass);
router.delete('/:id', authenticate, authorize('admin'), deleteClass);
router.post('/:id/coach', authenticate, authorize('admin'), assignCoach);

// Admin and Coach routes
router.post('/:id/students', authenticate, authorize('admin', 'coach'), assignStudent);
router.delete('/:id/students/:studentId', authenticate, authorize('admin', 'coach'), removeStudent);

export default router; 