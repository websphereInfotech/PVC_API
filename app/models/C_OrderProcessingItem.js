const { DataTypes } = require('sequelize');
const sequelize = require('../config/index');
const Product = require('./product');
const C_OrderProcessing = require('./C_OrderProcessing');

const C_OrderProcessingItem = sequelize.define('P_C_OrderProcessingItem', {
    productId : {type: DataTypes.INTEGER},
    qty :{type: DataTypes.INTEGER,
        defaultValue:0
    },
    rate: {type: DataTypes.INTEGER,
        defaultValue:0
    },
    mrp: {type: DataTypes.INTEGER,
        defaultValue:0
    },
    unit: {
        type: DataTypes.STRING,
        allowNull: false,
    },
})

Product.hasMany(C_OrderProcessingItem, {foreignKey:'productId',onDelete:'CASCADE', as:'orderProduct'});
C_OrderProcessingItem.belongsTo(Product, {foreignKey:'productId', onDelete:'CASCADE',as:'orderProduct'});

C_OrderProcessing.hasMany(C_OrderProcessingItem, {foreignKey:'orderId', onDelete:'CASCADE', as:'items'});
C_OrderProcessingItem.belongsTo(C_OrderProcessing, {foreignKey:'orderId', onDelete:'CASCADE', as:'items'});

module.exports = C_OrderProcessingItem;