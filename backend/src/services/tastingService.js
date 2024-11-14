// src/services/tastingService.js
import db from '../models/index.js';

class TastingService {
  async getUserTastings(userId) {
    return await db.Tasting.findAll({
      where: { user_id: userId },
      attributes: ['id', 'rating', 'notes', 'is_rating_public', 'is_picture_public', 'created_at'],
      include: [{
        model: db.Beer,
        attributes: ['name'],
        include: [{
          model: db.Company,
          attributes: ['name']
        }]
      }]
    });
    //make beer lowercase

  }

  async addTasting(data) {
    return await db.Tasting.create({
      user_id: data.userId,
      beer_id: data.beerId,
      rating: data.rating,
      notes: data.notes,
      is_rating_public: data.isRatingPublic,
      is_picture_public: data.isPicturePublic
    });
  }

  async updateTasting(tastingId, userId, updates) {
    const tasting = await db.Tasting.findOne({ where: { id: tastingId, user_id: userId } });
    if (!tasting) {
      throw new Error('Tasting not found or unauthorized');
    }
    return await tasting.update(updates);
  }

  async deleteTasting(tastingId, userId) {
    const deleted = await db.Tasting.destroy({ where: { id: tastingId, user_id: userId } });
    if (!deleted) {
      throw new Error('Tasting not found or unauthorized');
    }
  }

  async uploadImage(tastingId, userId, imagePath) {
    const tasting = await db.Tasting.findOne({ where: { id: tastingId, user_id: userId } });
    if (!tasting) {
      throw new Error('Tasting not found or unauthorized');
    }
    await db.Image.create({ tasting_id: tastingId, image_path: imagePath });
  }

  async getTastingImages(tastingId) {
    return await db.Image.findAll({ where: { tasting_id: tastingId } });
  }
}

export default new TastingService();
