const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const expense = require("./expense");

const expenseItem = sequelize.define("P_expenseItem", {
  serialno: {
    type: DataTypes.STRING,
  },
  expensse: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.STRING,
  },
  taxable: {
    type: DataTypes.FLOAT,
  },
  mrp: {
    type: DataTypes.FLOAT,
  },
});

expense.hasMany(expenseItem, { foreignKey: "expenseId" });
expenseItem.belongsTo(expense, { foreignKey: "expenseId" });

module.exports = expenseItem;
