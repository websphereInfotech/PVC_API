"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("costing_settings");

    if (table.lineId && !table.id) {
      await queryInterface.sequelize.query("ALTER TABLE costing_settings DROP PRIMARY KEY");
      await queryInterface.addColumn("costing_settings", "id", {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        first: true,
      });
      await queryInterface.removeColumn("costing_settings", "lineId");
      return;
    }

    if (!table.id) {
      await queryInterface.addColumn("costing_settings", "id", {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        first: true,
      });
    }

    if (table.lineId) {
      await queryInterface.removeColumn("costing_settings", "lineId");
    }
  },

  async down(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable("costing_settings");

    if (!table.lineId) {
      await queryInterface.addColumn("costing_settings", "lineId", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },
};
