// src/routes/tastingRoutes.js
import express from 'express';
const router = express.Router();
import tastingController from '../controllers/tastingController.js';
import authenticateToken from '../middleware/auth.js';

router.get('/', authenticateToken, tastingController.getUserTastings);
router.post('/', authenticateToken, tastingController.addTasting);
router.put('/:tasting_id', authenticateToken, tastingController.updateTasting);
router.delete('/:tasting_id', authenticateToken, tastingController.deleteTasting);
router.post('/:tasting_id/upload', authenticateToken, tastingController.uploadImage);
router.get('/:tasting_id/images', authenticateToken, tastingController.getTastingImages);

export default router;