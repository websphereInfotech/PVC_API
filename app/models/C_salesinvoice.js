const { DataTypes } = require('sequelize');
const sequelize = require('../config/index');
const C_customer = require('./C_customer');

const C_salesinvoice = sequelize.define('P_C_salesinvoice', {
    customerId: { type : DataTypes.INTEGER},
    date : { type: DataTypes.DATEONLY},
    totalMrp: {
        type : DataTypes.INTEGER,
        defaultValue:0
    }
});

C_customer.hasMany(C_salesinvoice, {foreignKey:'customerId', onDelete:'CASCADE'});
C_salesinvoice.belongsTo(C_customer, {foreignKey:'customerId', onDelete:'CASCADE'});

module.exports = C_salesinvoice;