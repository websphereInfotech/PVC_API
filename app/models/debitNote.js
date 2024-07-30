const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const purchaseInvoice = require("./purchaseInvoice");
const company = require("./company");
const User = require("./user");
const Account = require("./Account");

const debitNote = sequelize.define("P_debitNote", {
  accountId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  debitnoteno: {
    type: DataTypes.INTEGER,
    defaultValue:0
  },
  invoiceId: { type: DataTypes.INTEGER },
  invoicedate: { type: DataTypes.DATEONLY },
  debitdate: {
    type: DataTypes.DATEONLY
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
  totalQty: {
    type: DataTypes.INTEGER,
    defaultValue:0
  },
  companyId: {type: DataTypes.INTEGER},
  createdBy: { type: DataTypes.INTEGER },
  updatedBy: { type: DataTypes.INTEGER },
});

User.hasMany(debitNote, { foreignKey: "createdBy", as: "debitCreateUser" });
debitNote.belongsTo(User, {
  foreignKey: "createdBy",
  as: "debitCreateUser",
});

User.hasMany(debitNote, { foreignKey: "updatedBy", as: "debitUpdateUser" });
debitNote.belongsTo(User, {
  foreignKey: "updatedBy",
  as: "debitUpdateUser",
});
company.hasMany(debitNote, {foreignKey:'companyId',onDelete:'CASCADE'});
debitNote.belongsTo(company, {foreignKey:'companyId',onDelete:'CASCADE'});

Account.hasMany(debitNote, {foreignKey:'accountId', onDelete:'CASCADE', as:'accountDebitNo'});
debitNote.belongsTo(Account, {foreignKey:'accountId', onDelete:'CASCADE', as:'accountDebitNo'});

purchaseInvoice.hasMany(debitNote, {foreignKey:'invoiceId', onDelete:'CASCADE',as:'purchaseData'});
debitNote.belongsTo(purchaseInvoice, {foreignKey:'invoiceId',onDelete:'CASCADE',as:'purchaseData'});

module.exports = debitNote;
