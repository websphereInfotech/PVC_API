const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");

const expense = sequelize.define("P_expense", {
  customer: {
    type: DataTypes.STRING,
  },
  voucherno: {
    type: DataTypes.STRING,
  },
  date: {
    type: DataTypes.DATE,
  },
  gstin: {
    type: DataTypes.STRING,
  },
  mobileno: {
    type: DataTypes.STRING,
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

module.exports = expense;
