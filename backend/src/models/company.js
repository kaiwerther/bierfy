import { Model, DataTypes } from 'sequelize';

class Company extends Model {
  static init(sequelize) {
    return super.init({
      name: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false,
      },
      created_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    }, {
      sequelize,
      tableName: 'companies',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
    });
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'created_by' });
    this.hasMany(models.Beer, { foreignKey: 'company_id' });
  }
}

export default Company;
