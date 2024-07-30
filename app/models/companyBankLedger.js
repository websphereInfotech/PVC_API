const { DataTypes } = require('sequelize');
const sequelize = require('../config/index');
const receiveBank = require('./Receipt');
const company = require('./company');
const paymentBank = require('./Payment');

const companyBankLedger = sequelize.define('P_companyBankLedger',{
    companyId: {type :DataTypes.INTEGER},
    creditId: {type: DataTypes.INTEGER},
    debitId:{type: DataTypes.INTEGER},
    date :{ type: DataTypes.DATEONLY}
});

company.hasMany(companyBankLedger, {foreignKey:'companyId', onDelete:'CASCADE'});
companyBankLedger.belongsTo(company, {foreignKey:'companyId', onDelete:'CASCADE'});

receiveBank.hasMany(companyBankLedger, {foreignKey:'creditId', onDelete:'CASCADE',as:'receiveData'});
companyBankLedger.belongsTo(receiveBank, {foreignKey:'creditId', onDelete:'CASCADE',as:'receiveData'});

paymentBank.hasMany(companyBankLedger,{foreignKey:'debitId',onDelete:'CASCADE',as:'paymentdata'});
companyBankLedger.belongsTo(paymentBank,{foreignKey:'debitId',onDelete:'CASCADE',as:'paymentdata'});

module.exports = companyBankLedger;