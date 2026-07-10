"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("costing_settings", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      companyId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "P_companies",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      resinRate: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },
      brassRate: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },
      profitMargin: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },
      multiplier: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },
      starMargin: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },
      goldMargin: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },
      silverMargin: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },
      refMargin: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },
      cdMargin: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },
      todMargin: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },
      discountBaseColumn: {
        type: Sequelize.ENUM("net", "star", "gold", "silver"),
        defaultValue: "net",
      },
      recipeId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "recipes",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      createdBy: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "P_users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      updatedBy: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "P_users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("costing_settings");
  },
};
