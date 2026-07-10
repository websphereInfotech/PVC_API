"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(
      "UPDATE `costing_settings` SET `itemSubCategoryId` = NULL WHERE `itemSubCategoryId` IS NOT NULL"
    );
  },

  async down() {
    // Category-level costing is now the intended scope; previous subcategory links cannot be restored safely.
  },
};
