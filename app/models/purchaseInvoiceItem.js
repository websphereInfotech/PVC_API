const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const product = require("./product");
const purchaseInvoice = require("./purchaseInvoice");

const purchaseInvoiceItem = sequelize.define("P_purchaseInvoiceItem", {
  productId: { type: DataTypes.INTEGER },
  qty: { type: DataTypes.INTEGER },
  rate: { type: DataTypes.INTEGER },
  mrp: { type: DataTypes.INTEGER },
});

product.hasMany(purchaseInvoiceItem, {foreignKey:'productId',onDelete:'CASCADE',as:'purchseProduct'});
purchaseInvoiceItem.belongsTo(product, {foreignKey:'productId', onDelete:'CASCADE', as:'purchseProduct'});

purchaseInvoice.hasMany(purchaseInvoiceItem, { foreignKey: "purchasebillId" ,onDelete:'CASCADE',as:'items'});
purchaseInvoiceItem.belongsTo(purchaseInvoice, { foreignKey: "purchasebillId",onDelete:'CASCADE', as:'items' });

module.exports = purchaseInvoiceItem;
