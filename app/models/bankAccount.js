const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const customer = require("./customer");
const vendor = require("./vendor");

const bankAccount = sequelize.define("P_bankAccount", {
  // accountname: { type: DataTypes.STRING },
  // shortname: { type: DataTypes.STRING },
  // email: { type: DataTypes.STRING },
  // mobileno: { type: DataTypes.STRING },
  // holdername: { type: DataTypes.STRING },
  // openingbalance: { type: DataTypes.INTEGER },
  accountnumber: { type: DataTypes.STRING },
  ifsccode: { type: DataTypes.STRING },
  bankname: { type: DataTypes.STRING },
  accounttype : { type: DataTypes.STRING}
});
customer.hasOne(bankAccount, {foreignKey:'customerId', onDelete:"CASCADE", as:'bankdetails'});
bankAccount.belongsTo(customer,{foreignKey:"customerId", onDelete:"CASCADE", as:'bankdetails'});

vendor.hasOne(bankAccount, {foreignKey:'vendorId', onDelete:'CASCADE', as:'v_bankdetails'});
bankAccount.belongsTo(vendor, {foreignKey:'vendorId',onDelete:'CASCADE',as:'v_bankdetails'});

module.exports = bankAccount;
