const { DataTypes } = require('sequelize');
const sequelize = require('../config/index');

const C_customer = sequelize.define('P_C_customer', {
    customername: {type : DataTypes.STRING},
    companyId: {type: DataTypes.STRING},
});

module.exports = C_customer;