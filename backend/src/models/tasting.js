// src/models/tasting.js
import { Model, DataTypes } from 'sequelize';

class Tasting extends Model {
  static init(sequelize) {
    return super.init({
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      beer_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      rating: {
        type: DataTypes.INTEGER,
        validate: { min: 1, max: 5 }
      },
      notes: DataTypes.TEXT,
      is_rating_public: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      is_picture_public: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    }, {
      sequelize,
      tableName: 'tastings',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false
    });
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id' });
    this.belongsTo(models.Beer, { foreignKey: 'beer_id' });
    this.hasMany(models.Image, { foreignKey: 'tasting_id' });
  }
}


export default Tasting;
