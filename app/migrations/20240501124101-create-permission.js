'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('P_permissions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      role: {
        type: Sequelize.STRING
      },
      resource: {
        type: Sequelize.STRING
      },
      permissionValue: {
        type: Sequelize.BOOLEAN
      },
      permission: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.BOOLEAN, 
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('P_permissions');
  }
};