"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("costing_settings");

    if (!table.discountBaseColumn) {
      await queryInterface.addColumn("costing_settings", "discountBaseColumn", {
        type: Sequelize.ENUM("net", "star", "gold", "silver"),
        allowNull: false,
        defaultValue: "net",
      });
    }
  },

  async down(queryInterface) {
    const table = await queryInterface.describeTable("costing_settings");

    if (table.discountBaseColumn) {
      await queryInterface.removeColumn("costing_settings", "discountBaseColumn");
    }
  },
};
