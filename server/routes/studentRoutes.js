import express from 'express';
import { getAllStudents, getStudent, addStudent, updateStudent, deleteStudent } from '../controllers/studentController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, authorize('admin', 'coach'), getAllStudents);
router.get('/:id', authenticate, authorize('admin', 'coach'), getStudent);
router.post('/', authenticate, authorize('admin', 'coach'), addStudent);
router.put('/:id', authenticate, authorize('admin', 'coach'), updateStudent);
router.delete('/:id', authenticate, authorize('admin', 'coach'), deleteStudent);

export default router; 