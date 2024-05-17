const {DataTypes} = require('sequelize');
const sequelize = require('../config/index');
const C_customer = require('./C_customer');

const C_receivePayment = sequelize.define('C_P_receivePayment', {
    customerId:{ type: DataTypes.INTEGER},
    mrp: {type: DataTypes.INTEGER},
    description : {type: DataTypes.STRING},
    date: {type: DataTypes.DATEONLY}
});

C_customer.hasMany(C_receivePayment, {foreignKey:'customerId',onDelete:'CASCADE'});
C_receivePayment.belongsTo(C_customer, {foreignKey:'customerId', onDelete:'CASCADE'});

module.exports = C_receivePayment;