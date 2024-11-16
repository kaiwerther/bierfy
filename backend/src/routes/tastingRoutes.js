// src/routes/tastingRoutes.js
import express from 'express';
const router = express.Router();
import tastingController from '../controllers/tastingController.js';
import authenticateToken from '../middleware/auth.js';
import upload from '../utils/multerConfig.js';

router.get('/', authenticateToken, tastingController.getUserTastings);
router.post(
  '/',
  authenticateToken,
  upload.single('image'),
  tastingController.addTasting
);
router.delete(
  '/:tasting_id',
  authenticateToken,
  tastingController.deleteTasting
);
// get all tasters
router.get('/tasters', authenticateToken, tastingController.getTasters);
router.get(
  '/:tasting_id/image',
  authenticateToken,
  tastingController.getTastingImage
);

export default router;
