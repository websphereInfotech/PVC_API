const { DataTypes} = require('sequelize');
const sequelize = require('../config/index');
const C_Receipt = require('./C_Receipt');
const C_Payment = require('./C_Payment');
const C_claim = require('./C_claim');
const company = require('./company');
const User = require('./user');

const C_WalletLedger = sequelize.define("P_C_WalletLedger", {
    paymentId : {type: DataTypes.INTEGER, allowNull: true, defaultValue: null},
    receiptId: { type: DataTypes.INTEGER, allowNull: true, defaultValue: null },
    claimId: { type: DataTypes.INTEGER, allowNull: true, defaultValue: null },
    companyId: { type: DataTypes.INTEGER, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    isApprove: {type: DataTypes.BOOLEAN, defaultValue: false},
    approveDate: {type: DataTypes.DATEONLY, allowNull: true}
});

company.hasMany(C_WalletLedger,{foreignKey:'companyId',onDelete:'CASCADE'});
C_WalletLedger.belongsTo(company,{foreignKey:'companyId',onDelete:'CASCADE'});

C_Receipt.hasMany(C_WalletLedger, {foreignKey:'receiptId', onDelete:'CASCADE', as:'walletReceipt'});
C_WalletLedger.belongsTo(C_Receipt, {foreignKey:'receiptId', onDelete:'CASCADE', as:'walletReceipt'});

C_Payment.hasMany(C_WalletLedger, {foreignKey:'paymentId', onDelete:'CASCADE', as:'walletPayment'});
C_WalletLedger.belongsTo(C_Payment, {foreignKey:'paymentId', onDelete:'CASCADE', as:'walletPayment'});

C_claim.hasMany(C_WalletLedger,{foreignKey:'claimId', onDelete:'CASCADE', as:'walletClaim'});
C_WalletLedger.belongsTo(C_claim, {foreignKey:'claimId', onDelete:'CASCADE', as:'walletClaim'});

User.hasMany(C_WalletLedger,{foreignKey:'userId', onDelete:'CASCADE', as:'walletUser'});
C_WalletLedger.belongsTo(User, {foreignKey:'userId', onDelete:'CASCADE', as:'walletUser'});

module.exports = C_WalletLedger;