// src/features/tasting/getTasters.js
import express from 'express';
import authenticateToken from '../../middleware/auth.js';
import db from '../../models/index.js';

const router = express.Router();

// Route Definition
router.get('/tasters', authenticateToken, getTastersHandler);

// Controller Function
async function getTastersHandler(req, res) {
  try {
    const tasters = await getTastersService(req.user.id);
    res.json(tasters);
  } catch (error) {
    console.error('Error fetching tasters:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
}

// Service Function
async function getTastersService(userId) {
  // Get all distinct tasters from tasting_ratings
  return await db.TastingRating.findAll({
    where: { user_id: userId },
    attributes: ['taster'],
    group: ['taster'],
  });
}

export default router;
