const {DataTypes } = require('sequelize');
const sequelize = require('../config/index');
const vendor = require('./vendor');
const purchaseInvoice = require('./purchaseInvoice');
const paymentBank = require('./paymentBank');
const company = require('./company');

const vendorLedger = sequelize.define("P_vendorLedger", {
    vendorId : {type : DataTypes.INTEGER},
    creditId : {type :DataTypes.INTEGER},
    debitId : {type: DataTypes.INTEGER},
    companyId : {type: DataTypes.INTEGER},
    date : {type: DataTypes.DATEONLY}
});

company.hasMany(vendorLedger,{foreignKey:'companyId',onDelete:'CASCADE',as:'companyvendorledger'});
vendorLedger.belongsTo(company,{foreignKey:'companyId',onDelete:'CASCADE',as:'companyvendorledger'});

vendor.hasMany(vendorLedger, {foreignKey:'vendorId', onDelete:'CASCADE', as:'vendorData'});
vendorLedger.belongsTo(vendor, {foreignKey:'vendorId', onDelete:'CASCADE',as:'vendorData'});

paymentBank.hasMany(vendorLedger, {foreignKey:'creditId', onDelete:'CASCADE', as:'paymentVendor'});
vendorLedger.belongsTo(paymentBank, {foreignKey:'creditId', onDelete:'CASCADE', as:'paymentVendor'});

purchaseInvoice.hasMany(vendorLedger, {foreignKey:'debitId', onDelete:'CASCADE', as:'invoiceVendor'});
vendorLedger.belongsTo(purchaseInvoice, {foreignKey:'debitId', onDelete:'CASCADE', as:'invoiceVendor'});

module.exports = vendorLedger;