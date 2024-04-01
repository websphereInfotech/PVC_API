const { DataTypes } = require('sequelize');
const sequelize = require('../config/index');
const salesInvoice = require('../models/salesInvoice');

const salesInvoiceItem = sequelize.define("salesInvoiceItem", {
    serialno : {
        type : DataTypes.INTEGER,
        allowNull : false
    },
    quotationno : {
        type :DataTypes.STRING,
        allowNull : false
    },
    product : {
        type : DataTypes.STRING,
        allowNull : false
    },
    batchno : {
        type : DataTypes.STRING,
        allowNull :false
    },
    expirydate : {
        type : DataTypes.DATE,
        allowNull : false
    },
    mrp : {
        type : DataTypes.FLOAT,
        allowNull :false
    },
    qty : {
        type : DataTypes.INTEGER,
        allowNull : false
    }
});

salesInvoice.hasMany(salesInvoiceItem);
salesInvoiceItem.belongsTo(salesInvoice);

module.exports = salesInvoiceItem;