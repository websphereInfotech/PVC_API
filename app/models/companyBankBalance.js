const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const company = require("./company");
const companyBankDetails = require("./companyBankDetails");

const companyBankBalance = sequelize.define("P_companyBankBalance", {
  companyId: { type: DataTypes.INTEGER },
  accountId: { type: DataTypes.INTEGER },
  balance: { type: DataTypes.INTEGER, defaultValue: 0 },
});

company.hasMany(companyBankBalance, {
  foreignKey: "companyId",
  onDelete: "CASCADE",
});
companyBankBalance.belongsTo(company, {
  foreignKey: "companyId",
  onDelete: "CASCADE",
});

companyBankDetails.hasMany(companyBankBalance, {
  foreignKey: "accountId",
  onDelete: "CASCADE",
});
companyBankBalance.belongsTo(companyBankDetails, {
  foreignKey: "accountId",
  onDelete: "CASCADE",
});

module.exports = companyBankBalance;
