// src/services/tastingService.js
import db from '../models/index.js';

class TastingService {
  async getUserTastings(userId) {
    return await db.Tasting.findAll({
      where: { user_id: userId },
      attributes: ['id', 'created_at'],
      include: [{
        model: db.Beer,
        attributes: ['name'],
        include: [{
          model: db.Company,
          attributes: ['name']
        }]
      },
      {
        model: db.TastingRating,
        attributes: ['taster', 'rating']
      },]
    });
    //make beer lowercase

  }

  async getTasters(userId) {
    // get all distinct tasters from tasting_ratings
    return await db.TastingRating.findAll({
      where: { user_id: userId },
      attributes: ['taster'],
      group: ['taster']
    });
  }

  async addTasting(data) {
    const tasting = await db.Tasting.create({
      user_id: data.userId,
      beer_id: data.beerId,
    });
    const ratings = data.ratings.map(rating => ({
      tasting_id: tasting.id,
      user_id: data.userId,
      taster: rating.taster,
      rating: rating.rating
    }));
    await db.TastingRating.bulkCreate(ratings);
    return tasting;
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
