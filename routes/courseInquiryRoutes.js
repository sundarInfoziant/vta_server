import express from 'express';
import {
  createCourseInquiry,
  createInquiryOrder,
  verifyInquiryPayment,
  verifyPaymentSimple,
  getInquiries
} from '../controllers/courseInquiryController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/', createCourseInquiry);
router.post('/:id/create-order', createInquiryOrder);
router.post('/verify-payment', verifyInquiryPayment);
router.post('/verify-payment-simple', verifyPaymentSimple);

// Admin routes
router.get('/', protect, getInquiries);

export default router; 