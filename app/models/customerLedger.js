const { DataTypes } = require('sequelize');
const sequelize = require('../config/index');
const customer = require('./customer');
const salesInvoice = require('./salesInvoice');
const payment = require('./payment');
const creditNote = require('./creditNote');

const customerLedger = sequelize.define('P_customerLedger', {
    customerId : {type: DataTypes.INTEGER},
    creditId : {type: DataTypes.INTEGER},
    debitId : {type: DataTypes.INTEGER},
    date : {type: DataTypes.DATEONLY}
});

customer.hasMany(customerLedger, {foreignKey:'customerId', onDelete:'CASCADE', as:'customerData'});
customerLedger.belongsTo(customer, {foreignKey:'customerId', onDelete:'CASCADE', as:'customerData'});

salesInvoice.hasMany(customerLedger, {foreignKey:'creditId', onDelete:'CASCADE', as:'invoiceCustomer'});
customerLedger.belongsTo(salesInvoice, {foreignKey:'creditId', onDelete:'CASCADE', as:'invoiceCustomer'});

creditNote.hasMany(customerLedger,{foreignKey:'debitId',onDelete:'CASCADE',as:'creditCustomer'});
customerLedger.belongsTo(creditNote, {foreignKey:'debitId',onDelete:'CASCADE',as:'creditCustomer'});

module.exports = customerLedger;