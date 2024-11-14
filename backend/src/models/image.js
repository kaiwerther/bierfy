// src/models/image.js

import { Model, DataTypes } from 'sequelize';

class Image extends Model {
  static init(sequelize) {
    return super.init({
      tasting_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      image_path: {
        type: DataTypes.STRING(255),
        allowNull: false
      }
    }, {
      sequelize,
      tableName: 'images',
      timestamps: true,
      createdAt: 'uploaded_at',
      updatedAt: false
    });
  }

  static associate(models) {
    this.belongsTo(models.Tasting, { foreignKey: 'tasting_id' });
  }
}

export default Image;