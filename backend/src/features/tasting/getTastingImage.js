// src/features/tasting/getTastingImage.js
import express from 'express';
import authenticateToken from '../../middleware/auth.js';
import db from '../../models/index.js';
import path from 'path';
import fs from 'fs/promises';

const router = express.Router();

// Route Definition
router.get('/:tasting_id/image', authenticateToken, getTastingImageHandler);

// Controller Function
async function getTastingImageHandler(req, res) {
  try {
    const tastingId = req.params.tasting_id;

    // Fetch the tasting
    const tasting = await getTastingById(tastingId);

    if (!tasting) {
      return res.status(404).json({ error: 'Tasting not found.' });
    }

    if (tasting.user_id !== req.user.id) {
      return res
        .status(403)
        .json({ error: 'You do not have access to this image.' });
    }

    // Fetch the image
    const image = await getImageByTastingId(tastingId);

    if (!image) {
      return res
        .status(404)
        .json({ error: 'No image found for this tasting.' });
    }

    // Construct the absolute path to the image
    const imagePath = path.join(process.env.IMAGE_PATH, image.image_path);

    // Check if the file exists
    await fs.access(imagePath).catch(() => {
      throw new Error('File does not exist.');
    });

    // Send the image file
    res.sendFile(imagePath);
  } catch (error) {
    console.error('Error retrieving image:', error);
    if (error.message === 'File does not exist.') {
      return res.status(404).json({ error: 'Image file not found on server.' });
    }
    res.status(500).json({ error: 'Internal server error.' });
  }
}

// Service Functions
async function getTastingById(tastingId) {
  return await db.Tasting.findByPk(tastingId);
}

async function getImageByTastingId(tastingId) {
  return await db.Image.findOne({ where: { tasting_id: tastingId } });
}

export default router;
