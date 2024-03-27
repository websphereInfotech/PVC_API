const { DataTypes } = require('sequelize');
const sequelize = require('../config/index');
const quotation = require('./quotation');

const quotationItem = sequelize.define('quotationItem', {
    rate : {
        type : DataTypes.FLOAT,
        allowNull : false
    },
    qty : {
        type : DataTypes.INTEGER,
        allowNull :false
    },
    product : {
        type : DataTypes.STRING,
        allowNull : false
    },
    amount : {
        type : DataTypes.FLOAT,
        allowNull : false
    }
});

quotation.hasMany(quotationItem);
quotationItem.belongsTo(quotation);

module.exports = quotationItem;