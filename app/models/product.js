const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const company = require("./company");
const {PRODUCT_TYPE} = require("../constant/constant");

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
  itemgroup: {
    type: DataTypes.STRING,
  },
  itemcategory: {
    type: DataTypes.STRING,
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
  productType: {
    type: DataTypes.ENUM,
    values: [PRODUCT_TYPE.PRODUCT, PRODUCT_TYPE.RAW_MATERIAL],
    allowNull: false
  },
  companyId: { type: DataTypes.INTEGER },
  weight: {
    type: DataTypes.INTEGER,
  }
});

company.hasMany(product, { foreignKey: "companyId", onDelete: "CASCADE" });
product.belongsTo(company, { foreignKey: "companyId", onDelete: "CASCADE" });

module.exports = product;
