const { DataTypes } = require('sequelize');
const sequelize = require('../config/index');

const salesReturn = sequelize.define("salesReturn", {
    customer : {
        type :DataTypes.STRING,
        allowNull: false
    },
    creditnote : {
        type : DataTypes.STRING,
        allowNull: false
    },
    creditdate : {
        type : DataTypes.DATE,
        allowNull : false
    }, 
    serialno : {
        type : DataTypes.INTEGER,
        allowNull : false
    },
    batchno : {
        type : DataTypes.STRING
    },
    expirydate : {
        type : DataTypes.DATE
    },
    price : {
        type : DataTypes.FLOAT
    },
    invoiceno : {
        type :DataTypes.INTEGER
    },
    invoicedate : {
        type : DataTypes.DATE
    },
    quantity : {
        type : DataTypes.INTEGER
    }
});

module.exports = salesReturn;