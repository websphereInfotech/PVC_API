const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const User = require("./user");
const company = require("./company");
const {PAYMENT_TYPE, TRANSACTION_TYPE} = require("../constant/constant");
const Account = require("./Account");
const CompanyBankDetails = require("./companyBankDetails");

const Receipt = sequelize.define("P_Receipt", {
  voucherno: { type: DataTypes.INTEGER },
  bankAccountId: { type: DataTypes.INTEGER, allowNull: true },
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
    allowNull: true
  },
  accountId: { type: DataTypes.INTEGER },
  amount: { type: DataTypes.INTEGER, allowNull: false },
  createdBy: { type: DataTypes.INTEGER },
  updatedBy: { type: DataTypes.INTEGER },
  companyId: {type: DataTypes.INTEGER},
  paymentType: {
    type: DataTypes.ENUM,
    values: [...Object.values(PAYMENT_TYPE)],
    allowNull: false
  },
  transactionType: {
    type: DataTypes.ENUM,
    values: [...Object.values(TRANSACTION_TYPE)],
    allowNull: false,
  }
});

company.hasMany(Receipt,{ foreignKey:'companyId',onDelete:'CASCADE'});
Receipt.belongsTo(company,{ foreignKey:'companyId',onDelete:'CASCADE'});

User.hasMany(Receipt, { foreignKey: "createdBy", as: "bankCreateUser" });
Receipt.belongsTo(User, { foreignKey: "createdBy", as: "bankCreateUser" });

User.hasMany(Receipt, { foreignKey: "updatedBy", as: "bankUpdateUser" });
Receipt.belongsTo(User, { foreignKey: "updatedBy", as: "bankUpdateUser" });

Account.hasMany(Receipt, {
  foreignKey: "accountId",
  onDelete: "CASCADE",
  as: "accountReceipt",
});
Receipt.belongsTo(Account, {
  foreignKey: "accountId",
  onDelete: "CASCADE",
  as: "accountReceipt",
});

CompanyBankDetails.hasMany(Receipt, {
  foreignKey: "bankAccountId",
  onDelete: "CASCADE",
  as: "receiptBankAccount",
});
Receipt.belongsTo(CompanyBankDetails, {
  foreignKey: "bankAccountId",
  onDelete: "CASCADE",
  as: "receiptBankAccount",
});

module.exports = Receipt;
