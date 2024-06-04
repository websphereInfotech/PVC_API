'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('P_users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      mobileno: {
        type: Sequelize.BIGINT
      },
      password: {
        type: Sequelize.STRING
      },
      salary: {
        type: Sequelize.INTEGER
      },
      role: {
        type: Sequelize.ENUM('Super Admin', 'Admin', 'Account', 'Employee', 'Workers', 'Other')
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
    // await queryInterface.dropTable('P_users');
  }
};