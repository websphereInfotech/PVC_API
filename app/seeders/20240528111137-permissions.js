'use strict';

const { existingPermission } = require('../util/seeder');

module.exports = {
  async up(queryInterface, Sequelize) {
    await existingPermission();
  },

  async down(queryInterface, Sequelize) {}
};
