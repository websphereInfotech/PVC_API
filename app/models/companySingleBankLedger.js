const { DataTypes } = require('sequelize');
const sequelize = require('../config/index');
const receiveBank = require('./receiveBank');
const company = require('./company');
const paymentBank = require('./Payment');
const companyBankDetails = require('./companyBankDetails');

const companySingleBankLedger = sequelize.define('P_companySingleBankLedger',{
    companyId: {type :DataTypes.INTEGER},
    accountId: {type :DataTypes.INTEGER},
    creditId: {type: DataTypes.INTEGER},
    debitId:{type: DataTypes.INTEGER},
    date :{ type: DataTypes.DATEONLY}
});

company.hasMany(companySingleBankLedger, {foreignKey:'companyId', onDelete:'CASCADE'});
companySingleBankLedger.belongsTo(company, {foreignKey:'companyId', onDelete:'CASCADE'});

companyBankDetails.hasMany(companySingleBankLedger,{foreignKey:'accountId',onDelete:'CASCADE',as:'BankData'});
companySingleBankLedger.belongsTo(companyBankDetails,{foreignKey:'accountId',onDelete:'CASCADE',as:'BankData'});

receiveBank.hasMany(companySingleBankLedger,{foreignKey:'creditId', onDelete:'CASCADE', as:'ReceiveData'});
companySingleBankLedger.belongsTo(receiveBank,{foreignKey:'creditId', onDelete:'CASCADE', as:'ReceiveData'});

paymentBank.hasMany(companySingleBankLedger,{foreignKey:'debitId', onDelete:'CASCADE', as:'PaymentData'});
companySingleBankLedger.belongsTo(paymentBank,{foreignKey:'debitId', onDelete:'CASCADE', as:'PaymentData'});

module.exports = companySingleBankLedger;