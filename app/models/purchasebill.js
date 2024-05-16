const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const vendor = require("./vendor");

const purchasebill = sequelize.define("P_purchasebill", {
  vendorId: {
    type: DataTypes.INTEGER,
  },
  invoiceno: { type: DataTypes.INTEGER },
  invoicedate: { type: DataTypes.DATEONLY },
  terms: { type: DataTypes.INTEGER },
  duedate: { type: DataTypes.DATE },
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
});

vendor.hasMany(purchasebill,{foreignKey:'vendorId', onDelete:'CASCADE',as:'purchseVendor'});
purchasebill.belongsTo(vendor, {foreignKey:'vendorId', onDelete:'CASCADE',as:'purchseVendor'});

module.exports = purchasebill;
