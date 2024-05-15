const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const salesInvoice = require("./salesInvoice");
const product = require("./product");

const salesInvoiceItem = sequelize.define("P_salesInvoiceItem", {
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    // references :{
    //   model:'P_product',
    //   key:'id'
    // }
  },
  mrp: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  qty: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  totalQty: {
    type: DataTypes.INTEGER,
    defaultValue:0
  },
  rate: {
    type: DataTypes.FLOAT,
  },
});


salesInvoice.hasMany(salesInvoiceItem, {
  foreignKey: "salesInvoiceId",
  onDelete: "CASCADE",
  as: "items",
});
salesInvoiceItem.belongsTo(salesInvoice, {
  foreignKey: "salesInvoiceId",
  onDelete: "CASCADE",
  as: "items",
});

module.exports = salesInvoiceItem;
