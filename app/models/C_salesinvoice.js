const { DataTypes } = require('sequelize');
const sequelize = require('../config/index');
const C_customer = require('./C_customer');

const C_salesinvoice = sequelize.define('P_C_salesInvoice', {
    customerId: { type : DataTypes.INTEGER},
    date : { type: DataTypes.DATEONLY},
    totalMrp: {
        type : DataTypes.INTEGER,
        defaultValue:0
    }
});

C_customer.hasMany(C_salesinvoice, {foreignKey:'customerId', onDelete:'CASCADE',as:'CashCustomer'});
C_salesinvoice.belongsTo(C_customer, {foreignKey:'customerId', onDelete:'CASCADE',as:'CashCustomer'});

module.exports = C_salesinvoice;