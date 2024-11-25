// migrations/20241124-add-location-to-tastings.cjs
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('tastings', 'latitude', {
      type: Sequelize.FLOAT,
      allowNull: true,
    });
    await queryInterface.addColumn('tastings', 'longitude', {
      type: Sequelize.FLOAT,
      allowNull: true,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('tastings', 'latitude');
    await queryInterface.removeColumn('tastings', 'longitude');
  },
};
