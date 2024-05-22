const { DataTypes } = require('sequelize');
const sequelize = require('../config/index');
const customer = require('./customer');

const customerLedger = sequelize.define('P_customerLedger', {
    customerId : {type: DataTypes.INTEGER},
    creditId : {type: DataTypes.INTEGER},
    debitId : {type: DataTypes.INTEGER},
    date : {type: DataTypes.DATEONLY}
});

customer.hasMany(customerLedger, {foreignKey:'customerId', onDelete:'CASCADE', as:'customerData'});
customerLedger.belongsTo(customer, {foreignKey:'customerId', onDelete:'CASCADE', as:'customerData'});

module.exports = customerLedger;