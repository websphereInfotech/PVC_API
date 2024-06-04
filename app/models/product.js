const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const company = require("./company");

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
  companyId: { type: DataTypes.INTEGER },
});

company.hasMany(product, { foreignKey: "companyId", onDelete: "CASCADE" });
product.belongsTo(company, { foreignKey: "companyId", onDelete: "CASCADE" });

module.exports = product;
