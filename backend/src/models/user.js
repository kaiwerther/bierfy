// src/models/user.js
import { Model, DataTypes } from 'sequelize';

class User extends Model {
  static init(sequelize) {
    return super.init(
      {
        username: {
          type: DataTypes.STRING(50),
          unique: true,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING(100),
          unique: true,
          allowNull: false,
        },
        password: DataTypes.STRING(255),
        google_id: DataTypes.STRING(255),
        is_pro: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
      },
      {
        sequelize,
        tableName: 'users',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false,
        defaultScope: {
          attributes: { exclude: ['password'] },
        },
        scopes: {
          withSensitiveData: {
            attributes: { include: ['password'] },
          },
        },
      }
    );
  }

  static associate(models) {
    this.hasMany(models.Tasting, { foreignKey: 'user_id' });
    this.hasMany(models.Beer, { foreignKey: 'created_by' });
  }
}

export default User;
