const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");

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
  bankdetail: {
    type: DataTypes.ENUM("Normal", "Batch wise", "Lot wise"),
    allowNull: false,
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
  itemselected: {
    type: DataTypes.STRING,
  },
  purchaseprice: {
    type: DataTypes.INTEGER,
  },
  salesprice: {
    type: DataTypes.INTEGER,
  },
  SGST: {
    type: DataTypes.FLOAT,
    allowNull:true
  },
  IGST: {
    type: DataTypes.FLOAT,
    defaultValue:0
  },
  cess: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = product;
