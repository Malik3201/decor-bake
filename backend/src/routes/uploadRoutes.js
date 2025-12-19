import express from 'express';
import { uploadSingle, uploadMultiple } from '../controllers/uploadController.js';
import { protect, authorize } from '../middlewares/auth.js';
import { uploadSingle as uploadSingleMiddleware, uploadMultiple as uploadMultipleMiddleware } from '../middlewares/upload.js';
import { USER_ROLES } from '../config/constants.js';

const router = express.Router();

// Admin only routes - DISABLED: Local uploads not allowed on Vercel
/*
router.post('/single', protect, authorize(USER_ROLES.ADMIN), uploadSingleMiddleware('image'), uploadSingle);
router.post('/multiple', protect, authorize(USER_ROLES.ADMIN), uploadMultipleMiddleware('images', 10), uploadMultiple);
*/

export default router;

