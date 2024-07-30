const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const Account = require("./Account");
const User = require("./user");
const company = require("./company");
const { PAYMENT_TYPE} = require("../constant/constant");

const Payment = sequelize.define("P_Payment", {
  voucherno: { type: DataTypes.INTEGER },
  paymentAccountId: { type: DataTypes.INTEGER, allowNull: false },
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
  accountId: { type: DataTypes.INTEGER, allowNull: false },
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

company.hasMany(Payment, { foreignKey: "companyId", onDelete: "CASCADE" });
Payment.belongsTo(company, {
  foreignKey: "companyId",
  onDelete: "CASCADE",
});

User.hasMany(Payment, { foreignKey: "createdBy", as: "paymentCreateUser" });
Payment.belongsTo(User, {
  foreignKey: "createdBy",
  as: "paymentCreateUser",
});

User.hasMany(Payment, { foreignKey: "updatedBy", as: "paymentUpdateUser" });
Payment.belongsTo(User, {
  foreignKey: "updatedBy",
  as: "paymentUpdateUser",
});

Account.hasMany(Payment, {
  foreignKey: "accountId",
  onDelete: "CASCADE",
  as: "accountPayment",
});
Payment.belongsTo(Account, {
  foreignKey: "accountId",
  onDelete: "CASCADE",
  as: "accountPayment",
});

Account.hasMany(Payment, {
  foreignKey: "paymentAccountId",
  onDelete: "CASCADE",
  as: "paymentAccount",
});
Payment.belongsTo(Account, {
  foreignKey: "paymentAccountId",
  onDelete: "CASCADE",
  as: "paymentAccount",
});

module.exports = Payment;
