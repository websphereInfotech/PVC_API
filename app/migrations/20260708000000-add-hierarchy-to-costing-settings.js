"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("costing_settings", "itemTypeId", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "P_ItemTypes",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });

    await queryInterface.addColumn("costing_settings", "itemGroupId", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "P_ItemGroups",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });

    await queryInterface.addColumn("costing_settings", "itemCategoryId", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "P_ItemCategories",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });

    await queryInterface.addColumn("costing_settings", "itemSubCategoryId", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "P_ItemSubCategories",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });

    await queryInterface.addIndex("costing_settings", ["companyId", "itemTypeId", "itemGroupId", "itemCategoryId", "itemSubCategoryId"], {
      name: "costing_settings_hierarchy_idx",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex("costing_settings", "costing_settings_hierarchy_idx");
    await queryInterface.removeColumn("costing_settings", "itemSubCategoryId");
    await queryInterface.removeColumn("costing_settings", "itemCategoryId");
    await queryInterface.removeColumn("costing_settings", "itemGroupId");
    await queryInterface.removeColumn("costing_settings", "itemTypeId");
  },
};
