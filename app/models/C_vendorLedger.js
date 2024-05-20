const { DataTypes} = require('sequelize');
const sequelize = require('../config/index');
const C_PaymentCash = require('./C_paymentCash');
const C_purchaseCash = require('./C_purchaseCash');

const C_vendorLedger = sequelize.define("P_C_vendorLedger", {
    vendorId : {type: DataTypes.INTEGER},
    creditId: { type: DataTypes.INTEGER },
    debitId: { type: DataTypes.INTEGER },
    date: { type: DataTypes.DATEONLY }
});

C_purchaseCash.hasMany(C_vendorLedger, {foreignKey:'creditId', onDelete:'CASCADE', as:'invoiceLedger'});
C_vendorLedger.belongsTo(C_purchaseCash, {foreignKey:'creditId', onDelete:'CASCADE', as:'invoiceLedger'});

C_PaymentCash.hasMany(C_vendorLedger, {foreignKey:'debitId', onDelete:'CASCADE', as:'paymentLedger'});
C_vendorLedger.belongsTo(C_PaymentCash, {foreignKey:'debitId', onDelete:'CASCADE', as:'paymentLedger'});

module.exports = C_vendorLedger;