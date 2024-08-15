const { DataTypes } = require('sequelize');
const sequelize = require('../config/index');
const product = require('./product');
const creditNote = require('./creditNote');

const C_CreditNoteItem = sequelize.define("P_C_CreditNoteItem", {
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    mrp: {
        type: DataTypes.FLOAT
    },
    qty: {
        type: DataTypes.INTEGER
    },
    rate: {
        type: DataTypes.FLOAT
    },
    unit: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

product.hasMany(C_CreditNoteItem, { foreignKey: 'productId', onDelete: 'CASCADE', as: 'CreditProductCash' });
C_CreditNoteItem.belongsTo(product, { foreignKey: 'productId', onDelete: 'CASCADE', as: 'CreditProductCash' });

creditNote.hasMany(C_CreditNoteItem, { foreignKey: 'creditId', onDelete: 'CASCADE', as: 'cashCreditNoteItem' });
C_CreditNoteItem.belongsTo(creditNote, { foreignKey: 'creditId', onDelete: 'CASCADE', as: 'cashCreditNoteItem' });

module.exports = C_CreditNoteItem;