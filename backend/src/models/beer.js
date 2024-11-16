import { Model, DataTypes } from 'sequelize';

class Beer extends Model {
  static init(sequelize) {
    return super.init(
      {
        name: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        company_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        created_by: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'beers',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false,
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Company, { foreignKey: 'company_id' });
    this.belongsTo(models.User, { foreignKey: 'created_by' });
    this.hasMany(models.Tasting, { foreignKey: 'beer_id' });
  }
}

export default Beer;
