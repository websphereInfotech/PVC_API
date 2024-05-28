const {DataTypes } = require('sequelize');
const sequelize = require('../config/index');
const vendor = require('./vendor');
const purchaseInvoice = require('./purchaseInvoice');
const paymentBank = require('./paymentBank');

const vendorLedger = sequelize.define("P_vendorLedger", {
    vendorId : {type : DataTypes.INTEGER},
    creditId : {type :DataTypes.INTEGER},
    debitId : {type: DataTypes.INTEGER},
    date : {type: DataTypes.DATEONLY}
});

vendor.hasMany(vendorLedger, {foreignKey:'vendorId', onDelete:'CASCADE', as:'vendorData'});
vendorLedger.belongsTo(vendor, {foreignKey:'vendorId', onDelete:'CASCADE',as:'vendorData'});

purchaseInvoice.hasMany(vendorLedger, {foreignKey:'creditId', onDelete:'CASCADE', as:'invoiceVendor'});
vendorLedger.belongsTo(purchaseInvoice, {foreignKey:'creditId', onDelete:'CASCADE', as:'invoiceVendor'});

paymentBank.hasMany(vendorLedger, {foreignKey:'debitId', onDelete:'CASCADE', as:'paymentVendor'});
vendorLedger.belongsTo(paymentBank, {foreignKey:'debitId', onDelete:'CASCADE', as:'paymentVendor'});

module.exports = vendorLedger;