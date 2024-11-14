'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create the companies table
    await queryInterface.createTable('companies', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(100),
        unique: true,
        allowNull: false,
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users', // Reference to users table
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

    // Add company_id column to beers table
    await queryInterface.addColumn('beers', 'company_id', {
      type: Sequelize.INTEGER,
      allowNull: false, // Set to false if every beer must have a company
      references: {
        model: 'companies',
        key: 'id',
      },
      onDelete: 'CASCADE',
    });

    // If there are existing beers without a company, you may need to handle them
    // Optionally, create a default company and assign it to existing beers
    // Example:
    // const [result] = await queryInterface.sequelize.query(`
    //   INSERT INTO companies (name, created_by, created_at)
    //   VALUES ('Default Company', 1, NOW())
    //   RETURNING id;
    // `);
    // const defaultCompanyId = result[0].id;
    // await queryInterface.sequelize.query(`
    //   UPDATE beers SET company_id = ${defaultCompanyId} WHERE company_id IS NULL;
    // `);
  },

  down: async (queryInterface) => {
    // Remove company_id column from beers table
    await queryInterface.removeColumn('beers', 'company_id');

    // Drop the companies table
    await queryInterface.dropTable('companies');
  },
};
