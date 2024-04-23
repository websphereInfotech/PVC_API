const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const salesInvoice = require("./salesInvoice");

const salesInvoiceItem = sequelize.define("P_salesInvoiceItem", {
  serialno: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
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
});

salesInvoice.hasMany(salesInvoiceItem, { foreignKey: "salesInvoiceId" });
salesInvoiceItem.belongsTo(salesInvoice, { foreignKey: "salesInvoiceId" });

module.exports = salesInvoiceItem;
