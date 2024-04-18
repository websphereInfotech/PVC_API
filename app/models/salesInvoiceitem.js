const { DataTypes } = require('sequelize');
const sequelize = require('../config/index');
const salesInvoice = require('./salesInvoice');

const salesInvoiceItem = sequelize.define("salesInvoiceItem", {
    serialno: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    product: {
        type: DataTypes.STRING,
        allowNull: false
    },
    mrp: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    qty: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    rate: {
        type: DataTypes.FLOAT,
    }
});

salesInvoice.hasMany(salesInvoiceItem);
salesInvoiceItem.belongsTo(salesInvoice);

module.exports = salesInvoiceItem;