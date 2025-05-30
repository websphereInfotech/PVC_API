const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const salesInvoice = require("./salesInvoice");
const product = require("./product");

const salesInvoiceItem = sequelize.define("P_salesInvoiceItem", {
  productId: {
    type: DataTypes.INTEGER,
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
  unit: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});


product.hasMany(salesInvoiceItem, { foreignKey:'productId',onDelete:'CASCADE', as:'InvoiceProduct'});
salesInvoiceItem.belongsTo(product,{foreignKey:'productId',onDelete:'CASCADE', as:'InvoiceProduct'});


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
