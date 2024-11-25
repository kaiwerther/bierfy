// src/features/tasting/addTasting.js
import express from 'express';
import authenticateToken from '../../middleware/auth.js';
import upload from '../../utils/multerConfig.js';
import db from '../../models/index.js';

const router = express.Router();

// Route Definition
router.post('/', authenticateToken, upload.single('image'), addTastingHandler);

// Controller Function
async function addTastingHandler(req, res) {
  try {
    const { beer_id, ratings, latitude, longitude } = req.body;

    // Ensure that ratings are provided and are in correct format
    if (!ratings || !Array.isArray(JSON.parse(ratings))) {
      return res
        .status(400)
        .json({ error: 'Ratings must be provided as an array.' });
    }

    // Process the uploaded image
    let imagePath = null;
    if (req.file) {
      imagePath = req.file.filename;
    }

    // Prepare data for service
    const data = {
      userId: req.user.id,
      beerId: beer_id,
      ratings: JSON.parse(ratings),
      latitude: latitude || null,
      longitude: longitude || null,
      imagePath: imagePath,
    };

    // Call the service function
    const tasting = await addTastingService(data);

    res.status(201).json(tasting);
  } catch (error) {
    console.error('Error adding tasting:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
}

// Service Function
async function addTastingService(data) {
  const transaction = await db.sequelize.transaction();

  try {
    // Create Tasting
    const tasting = await db.Tasting.create(
      {
        user_id: data.userId,
        beer_id: data.beerId,
        latitude: data.latitude,
        longitude: data.longitude,
      },
      { transaction }
    );

    // Create Tasting Ratings
    const ratings = data.ratings.map((rating) => ({
      tasting_id: tasting.id,
      user_id: data.userId,
      taster: rating.taster,
      rating: rating.rating,
    }));

    await db.TastingRating.bulkCreate(ratings, { transaction });

    // Create Image record
    if (data.imagePath) {
      await db.Image.create(
        {
          tasting_id: tasting.id,
          image_path: data.imagePath,
        },
        { transaction }
      );
    }

    // Commit the transaction
    await transaction.commit();

    // Fetch the complete tasting with associations
    const createdTasting = await db.Tasting.findOne({
      where: { id: tasting.id },
      attributes: ['id', 'created_at'],
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
    return {
      ...createdTasting.toJSON(),
      hasImage: !!createdTasting.Image,
      Image: undefined,
    };
  } catch (error) {
    // Rollback the transaction in case of error
    console.error(error);
    await transaction.rollback();
    throw error;
  }
}

export default router;
