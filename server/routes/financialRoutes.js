import express from 'express';
import {
  getAllTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getFinancialSummary
} from '../controllers/financialController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Admin only routes
router.get('/', authenticate, authorize('admin'), getAllTransactions);
router.get('/summary', authenticate, authorize('admin'), getFinancialSummary);
router.post('/', authenticate, authorize('admin'), createTransaction);
router.put('/:id', authenticate, authorize('admin'), updateTransaction);
router.delete('/:id', authenticate, authorize('admin'), deleteTransaction);

export default router; 