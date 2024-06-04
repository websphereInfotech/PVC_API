const { DataTypes } = require('sequelize');
const sequelize = require('../config/index');
const company = require('./company');

const C_customer = sequelize.define('P_C_customer', {
    customername: {type : DataTypes.STRING},
    companyId: {type: DataTypes.INTEGER},
});

company.hasMany(C_customer,{foreignKey:'companyId'});
C_customer.belongsTo(company,{foreignKey:'companyId'});

module.exports = C_customer;