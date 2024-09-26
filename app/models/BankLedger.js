const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const Receipt = require("./Receipt");
const company = require("./company");
const Payment = require("./Payment");
const companyBankDetails = require("./companyBankDetails");
const BankLedger = sequelize.define("P_BankLedger", {
  companyId: { type: DataTypes.INTEGER, allowNull: false },
  bankId: { type: DataTypes.INTEGER, allowNull: false },
  receiptId: { type: DataTypes.INTEGER, allowNull: true, defaultValue: null },
  paymentId: { type: DataTypes.INTEGER, allowNull: true, defaultValue: null },
  date: { type: DataTypes.DATEONLY },
});
company.hasMany(BankLedger, {
  foreignKey: "companyId",
  onDelete: "CASCADE",
});
BankLedger.belongsTo(company, {
  foreignKey: "companyId",
  onDelete: "CASCADE",
});
companyBankDetails.hasMany(BankLedger, {
  foreignKey: "bankId",
  onDelete: "CASCADE",
  as: "BankData",
});
BankLedger.belongsTo(companyBankDetails, {
  foreignKey: "bankId",
  onDelete: "CASCADE",
  as: "BankData",
});
Receipt.hasMany(BankLedger, {
  foreignKey: "receiptId",
  onDelete: "CASCADE",
  as: "bankReceipt",
});
BankLedger.belongsTo(Receipt, {
  foreignKey: "receiptId",
  onDelete: "CASCADE",
  as: "bankReceipt",
});
Payment.hasMany(BankLedger, {
  foreignKey: "paymentId",
  onDelete: "CASCADE",
  as: "bankPayment",
});
BankLedger.belongsTo(Payment, {
  foreignKey: "paymentId",
  onDelete: "CASCADE",
  as: "bankPayment",
});
module.exports = BankLedger;
