import { Model, DataTypes } from 'sequelize';

class Tasting extends Model {
  static init(sequelize) {
    return super.init(
      {
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        beer_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        latitude: {
          type: DataTypes.FLOAT,
          allowNull: true,
        },
        longitude: {
          type: DataTypes.FLOAT,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'tastings',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false,
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id' });
    this.belongsTo(models.Beer, { foreignKey: 'beer_id' });
    this.hasMany(models.TastingRating, { foreignKey: 'tasting_id' });
    this.hasOne(models.Image, { foreignKey: 'tasting_id' });
  }
}

export default Tasting;
