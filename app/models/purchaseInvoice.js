const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const vendor = require("./vendor");
const User = require("./user");

const purchaseInvoice = sequelize.define("P_purchaseInvoice", {
  vendorId: {
    type: DataTypes.INTEGER,
  },
  invoiceno: { type: DataTypes.INTEGER },
  invoicedate: { type: DataTypes.DATEONLY },
  duedate: { type: DataTypes.DATEONLY },
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
  totalQty: {
    type: DataTypes.INTEGER,
    defaultValue:0
  },
  createdBy: { type: DataTypes.INTEGER},
  updatedBy:{type: DataTypes.INTEGER}
});

User.hasMany(purchaseInvoice,{foreignKey:'createdBy', as:'salesCreateUser'});
purchaseInvoice.belongsTo(User,{foreignKey:'createdBy', as:'salesCreateUser'});

User.hasMany(purchaseInvoice,{foreignKey:'updatedBy', as:'salesUpdateUser'});
purchaseInvoice.belongsTo(User,{foreignKey:'updatedBy', as:'salesUpdateUser'});

vendor.hasMany(purchaseInvoice,{foreignKey:'vendorId', onDelete:'CASCADE',as:'purchseVendor'});
purchaseInvoice.belongsTo(vendor, {foreignKey:'vendorId', onDelete:'CASCADE',as:'purchseVendor'});

module.exports = purchaseInvoice;
