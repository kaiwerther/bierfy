// src/routes/paymentRoutes.js
import express from 'express';
const router = express.Router();
import paymentController from '../controllers/paymentController.js';
import authenticateToken from '../middleware/auth.js';

router.post('/purchase-pro', authenticateToken, paymentController.purchasePro);

export default router;