const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const Account = require("./Account");
const User = require("./user");
const company = require("./company");

const purchaseInvoice = sequelize.define("P_purchaseInvoice", {
  accountId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  supplyInvoiceNo: { type: DataTypes.STRING, allowNull: false },
  voucherno: {type: DataTypes.INTEGER, allowNull: false },
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
  updatedBy:{type: DataTypes.INTEGER},
  companyId: {type: DataTypes.INTEGER}
});

company.hasMany(purchaseInvoice,{foreignKey:'companyId',as:'purchaseinv'});
purchaseInvoice.belongsTo(company,{foreignKey:'companyId',as:'purchaseinv'});

User.hasMany(purchaseInvoice,{foreignKey:'createdBy', as:'salesCreateUser'});
purchaseInvoice.belongsTo(User,{foreignKey:'createdBy', as:'salesCreateUser'});

User.hasMany(purchaseInvoice,{foreignKey:'updatedBy', as:'salesUpdateUser'});
purchaseInvoice.belongsTo(User,{foreignKey:'updatedBy', as:'salesUpdateUser'});

Account.hasMany(purchaseInvoice,{foreignKey:'accountId', onDelete:'CASCADE',as:'accountPurchaseInv'});
purchaseInvoice.belongsTo(Account, {foreignKey:'accountId', onDelete:'CASCADE',as:'accountPurchaseInv'});

module.exports = purchaseInvoice;
