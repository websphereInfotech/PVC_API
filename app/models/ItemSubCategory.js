const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const ItemCategory = require("./ItemCategory");
const company = require("./company");
const User = require("./user");

const ItemSubCategory = sequelize.define("P_ItemSubCategory", {
  name: {
    type: DataTypes.STRING,
  },
  itemCategoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  updatedBy: { type: DataTypes.INTEGER },
  createdBy: { type: DataTypes.INTEGER },
  companyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
});

company.hasMany(ItemSubCategory, { foreignKey: "companyId", onDelete: "CASCADE" });
ItemSubCategory.belongsTo(company, { foreignKey: "companyId", onDelete: "CASCADE" });

ItemCategory.hasMany(ItemSubCategory, {foreignKey: "itemCategoryId", as: "ItemCategory", onDelete: "CASCADE"});
ItemSubCategory.belongsTo(ItemCategory, {foreignKey: "itemCategoryId", as: "ItemCategory", onDelete: "CASCADE"});

User.hasMany(ItemSubCategory, { foreignKey: "updatedBy", as: "subCategoryUpdateUser" });
ItemSubCategory.belongsTo(User, { foreignKey: "updatedBy", as: "subCategoryUpdateUser" });

User.hasMany(ItemSubCategory, { foreignKey: "createdBy", as: "subCategoryCreateUser" });
ItemSubCategory.belongsTo(User, { foreignKey: "createdBy", as: "subCategoryCreateUser" });

module.exports = ItemSubCategory;
