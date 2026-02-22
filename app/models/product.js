const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const company = require("./company");
const User = require("./user");
const ItemGroup = require("./ItemGroup");
const ItemCategory = require("./ItemCategory");
const ItemSubCategory = require("./ItemSubCategory");

const product = sequelize.define("P_product", {
  itemtype: {
    type: DataTypes.ENUM("Product", "Service"),
    allowNull: false,
  },
  productname: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.STRING,
  },
  itemGroupId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  itemCategoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  itemSubCategoryId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  unit: {
    type: DataTypes.STRING,
  },
  openingstock: {
    type: DataTypes.BOOLEAN,
  },
  nagativeqty: {
    type: DataTypes.BOOLEAN,
  },
  lowstock: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  lowStockQty: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  purchaseprice: {
    type: DataTypes.INTEGER,
  },
  salesprice: {
    type: DataTypes.INTEGER,
  },
  gstrate: {
    type: DataTypes.INTEGER,
  },
  HSNcode: {
    type: DataTypes.INTEGER,
  },
  cess: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  wastage : {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  raw_material : {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  spare : {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  finished_goods : {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  companyId: { type: DataTypes.INTEGER },
  weight: {
    type: DataTypes.FLOAT,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  updatedBy: { type: DataTypes.INTEGER },
  createdBy: { type: DataTypes.INTEGER }
});

company.hasMany(product, { foreignKey: "companyId", onDelete: "CASCADE" });
product.belongsTo(company, { foreignKey: "companyId", onDelete: "CASCADE" });

User.hasMany(product, { foreignKey: "updatedBy", as: "productUpdateUser" });
product.belongsTo(User, { foreignKey: "updatedBy", as: "productUpdateUser" });

User.hasMany(product, { foreignKey: "createdBy", as: "productCreateUser" });
product.belongsTo(User, { foreignKey: "createdBy", as: "productCreateUser" });

ItemGroup.hasMany(product, {foreignKey: "itemGroupId", as: "itemGroup", onDelete: "CASCADE"});
product.belongsTo(ItemGroup, {foreignKey: "itemGroupId", as: "itemGroup", onDelete: "CASCADE"});

ItemCategory.hasMany(product, {foreignKey: "itemCategoryId", as: "itemCategory", onDelete: "CASCADE"});
product.belongsTo(ItemCategory, {foreignKey: "itemCategoryId", as: "itemCategory", onDelete: "CASCADE"});

ItemSubCategory.hasMany(product, {foreignKey: "itemSubCategoryId", as: "itemSubCategory", onDelete: "CASCADE"});
product.belongsTo(ItemSubCategory, {foreignKey: "itemSubCategoryId", as: "itemSubCategory", onDelete: "CASCADE"});

module.exports = product;
