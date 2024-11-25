// src/features/tasting/deleteTasting.js
import express from 'express';
import authenticateToken from '../../middleware/auth.js';
import db from '../../models/index.js';
import path from 'path';
import fs from 'fs/promises';

const router = express.Router();

// Route Definition
router.delete('/:tasting_id', authenticateToken, deleteTastingHandler);

// Controller Function
async function deleteTastingHandler(req, res) {
  try {
    await deleteTastingService(req.params.tasting_id, req.user.id);
    res.json({ message: 'Tasting deleted' });
  } catch (error) {
    console.error('Error deleting tasting:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
}

// Service Function
async function deleteTastingService(tastingId, userId) {
  const transaction = await db.sequelize.transaction();

  try {
    // Fetch the tasting along with the associated image
    const tasting = await db.Tasting.findOne({
      where: { id: tastingId, user_id: userId },
      include: { model: db.Image },
    });

    if (!tasting) {
      throw new Error('Tasting not found or unauthorized');
    }

    // If there is an associated image, delete it from the filesystem
    if (tasting.Image) {
      const imagePath = path.join(
        process.env.IMAGE_PATH,
        tasting.Image.image_path
      );
      await fs.unlink(imagePath).catch((err) => {
        console.error(`Error deleting image file: ${err.message}`);
        throw err;
      });
    }

    // Delete the tasting record
    await db.Tasting.destroy({
      where: { id: tastingId, user_id: userId },
      transaction,
    });

    // Commit the transaction
    await transaction.commit();
  } catch (error) {
    // Rollback the transaction in case of error
    console.error(error);
    await transaction.rollback();
    throw error;
  }
}

export default router;
