const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const User = require("./user");
const Account = require("./Account");
const company = require("./company");

const C_Payment = sequelize.define("P_C_Payment", {
  accountId: { type: DataTypes.INTEGER, allowNull: false },
  amount: { type: DataTypes.INTEGER },
  description: {
    type: DataTypes.STRING,
    validate: {
      len: [0, 30],
    },
  },
  date: { type: DataTypes.DATEONLY },
  createdBy: { type: DataTypes.INTEGER },
  updatedBy: { type: DataTypes.INTEGER },
  companyId: { type: DataTypes.INTEGER },
  paymentNo: {type: DataTypes.INTEGER, allowNull: false},
});

company.hasMany(C_Payment, {
  foreignKey: "companyId",
  onDelete: "CASCADE",
});
C_Payment.belongsTo(company, {
  foreignKey: "companyId",
  onDelete: "CASCADE",
});

User.hasMany(C_Payment, { foreignKey: "createdBy", as: "paymentCreate" });
C_Payment.belongsTo(User, { foreignKey: "createdBy", as: "paymentCreate" });

User.hasMany(C_Payment, { foreignKey: "updatedBy", as: "paymentUpdate" });
C_Payment.belongsTo(User, { foreignKey: "updatedBy", as: "paymentUpdate" });

Account.hasMany(C_Payment, {
  foreignKey: "accountId",
  onDelete: "CASCADE",
  as: "accountPaymentCash",
});
C_Payment.belongsTo(Account, {
  foreignKey: "accountId",
  onDelete: "CASCADE",
  as: "accountPaymentCash",
});

module.exports = C_Payment;
