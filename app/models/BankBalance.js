const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const company = require("./company");
const companyBankDetails = require("./companyBankDetails");
const BankBalance = sequelize.define("P_BankBalance", {
  companyId: { type: DataTypes.INTEGER },
  bankId: { type: DataTypes.INTEGER },
  balance: { type: DataTypes.INTEGER, defaultValue: 0 },
});
company.hasMany(BankBalance, {
  foreignKey: "companyId",
  onDelete: "CASCADE",
});
BankBalance.belongsTo(company, {
  foreignKey: "companyId",
  onDelete: "CASCADE",
});
companyBankDetails.hasMany(BankBalance, {
  foreignKey: "bankId",
  onDelete: "CASCADE",
});
BankBalance.belongsTo(companyBankDetails, {
  foreignKey: "bankId",
  onDelete: "CASCADE",
});
module.exports = BankBalance;