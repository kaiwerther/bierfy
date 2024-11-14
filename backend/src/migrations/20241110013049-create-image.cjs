'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('images', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      tasting_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'tastings', key: 'id' },
        onDelete: 'CASCADE'
      },
      image_path: { type: Sequelize.STRING(255), allowNull: false },
      uploaded_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('images');
  }
};
