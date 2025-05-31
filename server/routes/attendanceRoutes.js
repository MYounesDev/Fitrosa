import express from 'express';
import { getStudentAttendance, getAllAttendance, addAttendance, updateAttendance, deleteAttendance } from '../controllers/attendanceController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, authorize('admin', 'coach'), getAllAttendance);
router.get('/:id', authenticate, authorize('admin', 'coach'), getStudentAttendance);
router.post('/:id', authenticate, authorize('admin', 'coach'), addAttendance);
router.put('/:id', authenticate, authorize('admin', 'coach'), updateAttendance);
router.delete('/:id', authenticate, authorize('admin', 'coach'), deleteAttendance);

export default router; 