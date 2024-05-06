const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const salesInvoice = require("./salesInvoice");

const salesInvoiceItem = sequelize.define("P_salesInvoiceItem", {
  product: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mrp: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  qty: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  rate: {
    type: DataTypes.FLOAT,
  },
  totalIgst: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  totalSgst: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  totalMrp: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  mainTotal: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
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
