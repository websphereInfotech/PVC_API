const { DataTypes } = require('sequelize');
const sequelize = require('../config/index');
const C_product = require('./C_product');
const C_purchasebill = require('./C_purchasebill');

const C_purchaseBillItem = sequelize.define('P_C_purchaseBillItem', {
    productId : {type: DataTypes.INTEGER},
    qty :{type: DataTypes.INTEGER,
        defaultValue:0
    },
    rate: {type: DataTypes.INTEGER,
        defaultValue:0
    },
    mrp: {type: DataTypes.INTEGER,
        defaultValue:0
    }
});

C_product.hasMany(C_purchaseBillItem, {foreignKey:'productId',onDelete:'CASCADE'});
C_purchaseBillItem.belongsTo(C_product, {foreignKey:'productId', onDelete:'CASCADE'});

C_purchasebill.hasMany(C_purchaseBillItem, {foreignKey:'PurchaseId', onDelete:'CASCADE', as:'items'});
C_purchaseBillItem.belongsTo(C_purchasebill, {foreignKey:'PurchaseId', onDelete:'CASCADE', as:'items'});

module.exports = C_purchaseBillItem;