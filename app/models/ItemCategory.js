const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const ItemGroup = require("./ItemGroup");
const company = require("./company");
const ItemCategory = sequelize.define("P_ItemCategory", {
  name: {
    type: DataTypes.STRING,
  },
  itemGroupId: {
    type: DataTypes.INTEGER,
      allowNull: false,
  },
  companyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
});

company.hasMany(ItemCategory, { foreignKey: "companyId", onDelete: "CASCADE" });
ItemCategory.belongsTo(company, { foreignKey: "companyId", onDelete: "CASCADE" });

ItemGroup.hasMany(ItemCategory, {foreignKey: "itemGroupId", as: "ItemGroup", onDelete: "CASCADE"});
ItemCategory.belongsTo(ItemGroup, {foreignKey: "itemGroupId", as: "ItemGroup", onDelete: "CASCADE"});

module.exports = ItemCategory;
