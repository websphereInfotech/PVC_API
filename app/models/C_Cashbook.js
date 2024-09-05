const { DataTypes} = require('sequelize');
const sequelize = require('../config/index');
const C_Receipt = require('./C_Receipt');
const C_Payment = require('./C_Payment');
const company = require('./company');
const Payment = require('./Payment');
const Receipt = require('./Receipt');

const C_Cashbook = sequelize.define("P_C_Cashbook", {
    paymentId : {type: DataTypes.INTEGER, allowNull: true, defaultValue: null},
    receiptId: { type: DataTypes.INTEGER, allowNull: true, defaultValue: null },
    C_paymentId : {type: DataTypes.INTEGER, allowNull: true, defaultValue: null},
    C_receiptId: { type: DataTypes.INTEGER, allowNull: true, defaultValue: null },
    companyId: { type: DataTypes.INTEGER, allowNull: false },
    date: { type: DataTypes.DATEONLY, allowNull: false },
});

company.hasMany(C_Cashbook,{foreignKey:'companyId',onDelete:'CASCADE'});
C_Cashbook.belongsTo(company,{foreignKey:'companyId',onDelete:'CASCADE'});

C_Receipt.hasMany(C_Cashbook, {foreignKey:'C_receiptId', onDelete:'CASCADE', as:'cashCashbookReceipt'});
C_Cashbook.belongsTo(C_Receipt, {foreignKey:'C_receiptId', onDelete:'CASCADE', as:'cashCashbookReceipt'});

C_Payment.hasMany(C_Cashbook, {foreignKey:'C_paymentId', onDelete:'CASCADE', as:'cashCashbookPayment'});
C_Cashbook.belongsTo(C_Payment, {foreignKey:'C_paymentId', onDelete:'CASCADE', as:'cashCashbookPayment'});

Receipt.hasMany(C_Cashbook, {foreignKey:'receiptId', onDelete:'CASCADE', as:'cashbookReceipt'});
C_Cashbook.belongsTo(Receipt, {foreignKey:'receiptId', onDelete:'CASCADE', as:'cashbookReceipt'});

Payment.hasMany(C_Cashbook, {foreignKey:'paymentId', onDelete:'CASCADE', as:'cashbookPayment'});
C_Cashbook.belongsTo(Payment, {foreignKey:'paymentId', onDelete:'CASCADE', as:'cashbookPayment'});


module.exports = C_Cashbook;