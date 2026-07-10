"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("P_products", "itemtype");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("P_products", "itemtype", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
};
