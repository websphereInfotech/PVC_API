const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const expense = require("./expense");

const expenseItem = sequelize.define("P_expenseItem", {
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

expense.hasMany(expenseItem, { foreignKey: "expenseId" ,onDelete:'CASCADE', as:'items'});
expenseItem.belongsTo(expense, { foreignKey: "expenseId", onDelete:'CASCADE',as:'items' });

module.exports = expenseItem;
