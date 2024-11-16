// src/models/tasting.js
import { Model, DataTypes } from 'sequelize';

class TastingRating extends Model {
  static init(sequelize) {
    return super.init(
      {
        tasting_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        taster: {
          type: DataTypes.STRING(255),
        },
        notes: DataTypes.TEXT,
        rating: {
          type: DataTypes.INTEGER,
          validate: { min: 1, max: 10 },
        },
      },
      {
        sequelize,
        tableName: 'tasting_ratings',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false,
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id' });
    this.belongsTo(models.Beer, { foreignKey: 'beer_id' });
    this.hasMany(models.Image, { foreignKey: 'tasting_id' });
  }
}

export default TastingRating;
