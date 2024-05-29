const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const customer = require("./customer");

const expense = sequelize.define("P_expense", {
  customerId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  voucherno: {
    type: DataTypes.STRING,
  },
  date: {
    type: DataTypes.DATEONLY,
  },
  gstin: {
    type: DataTypes.STRING,
  },
  mobileno: {
    type: DataTypes.BIGINT,
  },
  email: {
    type: DataTypes.STRING,
  },
  billno: {
    type: DataTypes.STRING,
  },
  billdate: {
    type: DataTypes.STRING,
  },
  payment: {
    type: DataTypes.STRING,
  },
});

customer.hasMany(expense, {foreignKey:'customerId', onDelete:'CASCADE', as:'ExpenseCustomer'});
expense.belongsTo(customer,{foreignKey:'customerId', onDelete:'CASCADE', as:'ExpenseCustomer'});

module.exports = expense;
