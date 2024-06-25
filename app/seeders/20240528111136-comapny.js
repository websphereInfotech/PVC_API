"use strict";
/** @type {import('sequelize-cli').Migration} */

const {existingData, existingPermission} = require('../util/seeder');
module.exports = {
  async up(queryInterface, Sequelize) {

   await existingData();
   await existingPermission();
  },

  async down(queryInterface, Sequelize) {
  },
};
