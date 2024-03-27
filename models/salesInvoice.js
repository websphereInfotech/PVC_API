const { DataTypes } = require('sequelize');
const sequelize = require('../config/index');

const salesInvoice = sequelize.define("salesInvoice", {
    challenno : {
        type :DataTypes.STRING,
        allowNull : false
    },
    challendate : {
        type : DataTypes.DATE,
        allowNull : false
    },
    email : DataTypes.STRING,
    mobileno : DataTypes.STRING,
    customer : DataTypes.STRING
});

module.exports = salesInvoice;