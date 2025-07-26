const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const User = require("./user");
const company = require("./company");

const C_SelfExpense = sequelize.define("P_C_SelfExpense", {
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  userId: { type: DataTypes.INTEGER },
  companyId: { type: DataTypes.INTEGER },
  paymentId : {type: DataTypes.INTEGER, allowNull: true, defaultValue: null},
});

User.hasMany(C_SelfExpense, { foreignKey: "userId", as: "user" });
C_SelfExpense.belongsTo(User, { foreignKey: "userId", as: "user" });

company.hasMany(C_SelfExpense, {
  foreignKey: "companyId",
  onDelete: "CASCADE",
});
C_SelfExpense.belongsTo(company, {
  foreignKey: "companyId",
  onDelete: "CASCADE",
});

module.exports = C_SelfExpense;
