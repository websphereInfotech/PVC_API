const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const customer = require("./customer");
const vendor = require("./vendor");

const bankAccount = sequelize.define("P_bankAccount", {
  accountnumber: { type: DataTypes.STRING },
  ifsccode: { type: DataTypes.STRING },
  bankname: { type: DataTypes.STRING },
  accounttype: { type: DataTypes.STRING}
});
customer.hasOne(bankAccount, {foreignKey:'customerId', onDelete:"CASCADE", as:'bankdetails'});
bankAccount.belongsTo(customer,{foreignKey:"customerId", onDelete:"CASCADE", as:'bankdetails'});

vendor.hasOne(bankAccount, {foreignKey:'vendorId', onDelete:'CASCADE', as:'v_bankdetails'});
bankAccount.belongsTo(vendor, {foreignKey:'vendorId',onDelete:'CASCADE',as:'v_bankdetails'});

module.exports = bankAccount;
