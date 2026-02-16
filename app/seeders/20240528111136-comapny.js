"use strict";
/** @type {import('sequelize-cli').Migration} */

const {existingData, existingPermission, exisingGroup} = require('../util/seeder');
module.exports = {
  async up(queryInterface, Sequelize) {

   await existingData();
   await exisingGroup()
  },

  async down(queryInterface, Sequelize) {
  },
};
