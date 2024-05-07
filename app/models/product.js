const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
// const quotationItem = require("./ProFormaInvoiceItem");

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
    defaultValue: false,
  },
  nagativeqty: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
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
  gstrate : {
    type: DataTypes.INTEGER
  },
  HSNcode: {
    type:DataTypes.INTEGER
  },
  cess: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

// product.hasMany(quotationItem,{ foreignKey:'productId'})
// quotationItem.belongsTo(product, {foreignKey:"productId"});

module.exports = product;
