// src/services/tastingService.js
import db from '../models/index.js';

class TastingService {
  async getUserTastings(userId) {
    const tastings = await db.Tasting.findAll({
      where: { user_id: userId },
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

    //remove Image property and replace with hasImage true/false
    return tastings.map((tasting) => {
      return {
        ...tasting.toJSON(),
        hasImage: !!tasting.Image,
        Image: undefined,
      };
    });
  }

  async getTasters(userId) {
    // get all distinct tasters from tasting_ratings
    return await db.TastingRating.findAll({
      where: { user_id: userId },
      attributes: ['taster'],
      group: ['taster'],
    });
  }

  async addTasting(data) {
    // Start a transaction to ensure data integrity
    const transaction = await db.sequelize.transaction();

    try {
      // Create Tasting
      const tasting = await db.Tasting.create(
        {
          user_id: data.userId,
          beer_id: data.beerId,
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

      // Optionally, fetch the complete tasting with associations
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
        ],
      });

      return createdTasting;
    } catch (error) {
      // Rollback the transaction in case of error
      console.error(error);
      await transaction.rollback();
      throw error;
    }
  }

  async deleteTasting(tastingId, userId) {
    const deleted = await db.Tasting.destroy({
      where: { id: tastingId, user_id: userId },
    });
    if (!deleted) {
      throw new Error('Tasting not found or unauthorized');
    }
  }

  // Method to fetch an image by its ID
  async getImageByTastingId(tastingId) {
    const image = await db.Image.findOne({ where: { tasting_id: tastingId } });
    return image;
  }

  // Method to fetch a tasting by its ID
  async getTastingById(tastingId) {
    const tasting = await db.Tasting.findByPk(tastingId);
    return tasting;
  }
}

export default new TastingService();
