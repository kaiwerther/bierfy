// src/features/tasting/getTastings.js
import express from 'express';
import authenticateToken from '../../middleware/auth.js';
import db from '../../models/index.js';

const router = express.Router();

// Route Definition
router.get('/', authenticateToken, getTastingsHandler);

// Controller Function
async function getTastingsHandler(req, res) {
  try {
    const tastings = await getTastingsService(req.user.id);
    res.json(tastings);
  } catch (error) {
    console.error('Error fetching tastings:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
}

// Service Function
async function getTastingsService(userId) {
  const tastings = await db.Tasting.findAll({
    where: { user_id: userId },
    attributes: ['id', 'created_at', 'latitude', 'longitude'],
    include: [
      {
        model: db.Beer,
        attributes: ['name'],
        include: [
          {
            model: db.Company,
            attributes: ['name'],
          },
        ],
      },
      {
        model: db.TastingRating,
        attributes: ['taster', 'rating'],
      },
      { model: db.Image, attributes: ['image_path'] },
    ],
  });

  // Remove Image property and replace with hasImage true/false
  return tastings.map((tasting) => ({
    ...tasting.toJSON(),
    hasImage: !!tasting.Image,
    Image: undefined,
  }));
}

export default router;
