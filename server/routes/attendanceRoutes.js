import express from 'express';
import { 
  getStudentAttendance, 
  getStudentAttendanceByStudentId,
  getClassAttendance,
  getAllAttendance, 
  addAttendance, 
  updateAttendance, 
  deleteAttendance 
} from '../controllers/attendanceController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, authorize('admin', 'coach'), getAllAttendance);
router.get('/class/:classId', authenticate, authorize('admin', 'coach'), getClassAttendance);
router.get('/student/:studentId', authenticate, authorize('admin', 'coach'), getStudentAttendanceByStudentId);
router.get('/class-student/:id', authenticate, authorize('admin', 'coach'), getStudentAttendance);
router.post('/class-student/:classStudentId', authenticate, authorize('admin', 'coach'), addAttendance);
router.put('/:id', authenticate, authorize('admin', 'coach'), updateAttendance);
router.delete('/:id', authenticate, authorize('admin', 'coach'), deleteAttendance);

export default router; 