const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const vendor = require("./vendor");
const companyBankDetails = require("./companyBankDetails");
const User = require("./user");
const company = require("./company");
const { PAYMENT_TYPE} = require("../constant/constant");

const paymentBank = sequelize.define("P_paymentBank", {
  voucherno: { type: DataTypes.INTEGER },
  vendorId: { type: DataTypes.INTEGER },
  paymentdate: { type: DataTypes.DATEONLY },
  mode: {
    type: DataTypes.ENUM(
      "Cheque",
      "Net Banking",
      "Cash",
      "UPI",
      "IMPS",
      "NEFT",
      "RTGS",
      "Debit card",
      "Credit card",
      "Other"
    ),
  },
  accountId: { type: DataTypes.INTEGER },
  amount: { type: DataTypes.INTEGER },
  createdBy: { type: DataTypes.INTEGER },
  updatedBy: { type: DataTypes.INTEGER },
  companyId: { type: DataTypes.INTEGER },
  paymentType: {
    type: DataTypes.ENUM,
    values: [...Object.values(PAYMENT_TYPE)],
    allowNull: false
  }
});

company.hasMany(paymentBank, { foreignKey: "companyId", onDelete: "CASCADE" });
paymentBank.belongsTo(company, {
  foreignKey: "companyId",
  onDelete: "CASCADE",
});

User.hasMany(paymentBank, { foreignKey: "createdBy", as: "paymentCreateUser" });
paymentBank.belongsTo(User, {
  foreignKey: "createdBy",
  as: "paymentCreateUser",
});

User.hasMany(paymentBank, { foreignKey: "updatedBy", as: "paymentUpdateUser" });
paymentBank.belongsTo(User, {
  foreignKey: "updatedBy",
  as: "paymentUpdateUser",
});

vendor.hasMany(paymentBank, {
  foreignKey: "vendorId",
  onDelete: "CASCADE",
  as: "paymentData",
});
paymentBank.belongsTo(vendor, {
  foreignKey: "vendorId",
  onDelete: "CASCADE",
  as: "paymentData",
});

companyBankDetails.hasMany(paymentBank, {
  foreignKey: "accountId",
  onDelete: "CASCADE",
  as: "paymentBank",
});
paymentBank.belongsTo(companyBankDetails, {
  foreignKey: "accountId",
  onDelete: "CASCADE",
  as: "paymentBank",
});

module.exports = paymentBank;
