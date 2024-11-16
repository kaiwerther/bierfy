'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create the companies table
    await queryInterface.createTable('tasting_ratings', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users', // Reference to users table
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      rating: { type: Sequelize.INTEGER, validate: { min: 1, max: 10 } },
      taster: {
        type: Sequelize.STRING(100),
      },
      tasting_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tastings', // Reference to users table
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },

  down: async (queryInterface) => {
    // Drop the companies table
    await queryInterface.dropTable('tasting_ratings');
  },
};
