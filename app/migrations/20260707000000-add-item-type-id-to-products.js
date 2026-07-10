"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("P_products", "itemTypeId", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "P_ItemTypes",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });

    await queryInterface.sequelize.query(`
      INSERT INTO P_ItemTypes (name, companyId, createdAt, updatedAt)
      SELECT DISTINCT product.itemtype, product.companyId, NOW(), NOW()
      FROM P_products AS product
      LEFT JOIN P_ItemTypes AS itemType
        ON itemType.name = product.itemtype
        AND itemType.companyId = product.companyId
      WHERE product.itemTypeId IS NULL
        AND product.itemtype IS NOT NULL
        AND product.itemtype <> ''
        AND itemType.id IS NULL
    `);

    await queryInterface.sequelize.query(`
      UPDATE P_products AS product
      INNER JOIN P_ItemTypes AS itemType
        ON itemType.name = product.itemtype
        AND itemType.companyId = product.companyId
      SET product.itemTypeId = itemType.id
      WHERE product.itemTypeId IS NULL
    `);
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("P_products", "itemTypeId");
  },
};
