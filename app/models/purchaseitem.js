const { DataTypes } = require('sequelize');
const sequelize = require('../../config/index');
const purchase = require('./purchase');

const purchaseitem = sequelize.define('purchaseitem', {
    serialno : {
        type : DataTypes.INTEGER,
        allowNull : false
    },
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
    discount : {
        type : DataTypes.STRING,
        allowNull : false
    },
    mrp : { 
        type : DataTypes.INTEGER,
        allowNull :false
    }
});

purchase.hasMany(purchaseitem);
purchaseitem.belongsTo(purchase);

module.exports = purchaseitem;