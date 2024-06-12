const { DataTypes} = require('sequelize');
const sequelize = require('../config/index');
const C_PaymentCash = require('./C_paymentCash');
const C_purchaseCash = require('./C_purchaseCash');
const C_vendor = require('./C_vendor');
const company = require('./company');

const C_vendorLedger = sequelize.define("P_C_vendorLedger", {
    vendorId : {type: DataTypes.INTEGER},
    creditId: { type: DataTypes.INTEGER },
    debitId: { type: DataTypes.INTEGER },
    companyId: { type: DataTypes.INTEGER },
    date: { type: DataTypes.DATEONLY }
});

company.hasMany(C_vendorLedger,{foreignKey:'companyId',onDelete:'CASCADE',as:'companyvendorldcash'});
C_vendorLedger.belongsTo(company,{foreignKey:'companyId',onDelete:'CASCADE',as:'companyvendorldcash'});

C_purchaseCash.hasMany(C_vendorLedger, {foreignKey:'debitId', onDelete:'CASCADE', as:'invoiceLedger'});
C_vendorLedger.belongsTo(C_purchaseCash, {foreignKey:'debitId', onDelete:'CASCADE', as:'invoiceLedger'});

C_PaymentCash.hasMany(C_vendorLedger, {foreignKey:'creditId', onDelete:'CASCADE', as:'paymentLedger'});
C_vendorLedger.belongsTo(C_PaymentCash, {foreignKey:'creditId', onDelete:'CASCADE', as:'paymentLedger'});

C_vendor.hasMany(C_vendorLedger,{foreignKey:'vendorId', onDelete:'CASCADE', as:'vendorData'});
C_vendorLedger.belongsTo(C_vendor, {foreignKey:'vendorId', onDelete:'CASCADE', as:'vendorData'});

module.exports = C_vendorLedger;