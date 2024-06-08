const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const company = require("./company");
const companyBankDetails = require("./companyBankDetails");

const companySingleBank = sequelize.define("P_companySingleBank", {
  companyId: { type: DataTypes.INTEGER },
  accountId: { type: DataTypes.INTEGER },
  balance: { type: DataTypes.INTEGER, defaultValue: 0 },
});

company.hasMany(companySingleBank, {
  foreignKey: "companyId",
  onDelete: "CASCADE",
});
companySingleBank.belongsTo(company, {
  foreignKey: "companyId",
  onDelete: "CASCADE",
});

companyBankDetails.hasMany(companySingleBank, {
  foreignKey: "accountId",
  onDelete: "CASCADE",
});
companySingleBank.belongsTo(companyBankDetails, {
  foreignKey: "accountId",
  onDelete: "CASCADE",
});

module.exports = companySingleBank;
