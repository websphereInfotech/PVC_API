const { DataTypes } = require('sequelize');
const sequelize = require('../config/index');
const C_product = require('./C_product');
const C_salesinvoice = require('./C_salesinvoice');

const C_salesinvoiceItem = sequelize.define('P_C_salesinvoiceItem', {
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

C_product.hasMany(C_salesinvoiceItem, {foreignKey:'productId',onDelete:'CASCADE', as:'CashProduct'});
C_salesinvoiceItem.belongsTo(C_product, {foreignKey:'productId', onDelete:'CASCADE',as:'CashProduct'});

C_salesinvoice.hasMany(C_salesinvoiceItem, {foreignKey:'invoiceId', onDelete:'CASCADE', as:'items'});
C_salesinvoiceItem.belongsTo(C_salesinvoice, {foreignKey:'invoiceId', onDelete:'CASCADE', as:'items'});

module.exports = C_salesinvoiceItem;