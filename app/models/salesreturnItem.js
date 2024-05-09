const {DataTypes} = require('sequelize');
const sequelize = require('../config/index');

const salesReturnItem = sequelize.define('salesReturnItem', {
    productId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    batchno : {
        type: DataTypes.STRING
    },
    expirydate: {
        type: DataTypes.DATE
    },
    mrp : {
        type: DataTypes.FLOAT
    },
    invoiceno : {
        type: DataTypes.INTEGER
    },
    invoicedate : {
        type: DataTypes.DATE
    },
    qty :{
        type: DataTypes.INTEGER
    },
    rate: {
        type: DataTypes.FLOAT
    },
    gstrate: {
        type: DataTypes.FLOAT
    },
    cess:{
        type: DataTypes.INTEGER
    },
    mrp :{
        type: DataTypes.FLOAT
    }
});

module.exports = salesReturnItem;