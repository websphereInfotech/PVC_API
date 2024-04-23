const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");

const bankAccount = sequelize.define("P_bankAccount", {
  accountname: { type: DataTypes.STRING },
  shortname: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  mobileno: { type: DataTypes.STRING },
  holdername: { type: DataTypes.STRING },
  accountnumber: { type: DataTypes.STRING },
  ifsccode: { type: DataTypes.STRING },
  bankname: { type: DataTypes.STRING },
  openingbalance: { type: DataTypes.INTEGER },
});

module.exports = bankAccount;
