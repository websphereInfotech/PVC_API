"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("P_products", "itemtype", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("P_products", "itemtype", {
      type: Sequelize.ENUM("Product", "Service"),
      allowNull: false,
    });
  },
};
