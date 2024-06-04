const { DataTypes } = require('sequelize');
const sequelize = require('../config/index');
const product = require('./product');
const creditNote = require('./creditNote');

const creditNoteItem = sequelize.define("P_creditNoteItem", {
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
    }
});

product.hasMany(creditNoteItem, { foreignKey: 'productId', onDelete: 'CASCADE', as: 'CreditProduct' });
creditNoteItem.belongsTo(product, { foreignKey: 'productId', onDelete: 'CASCADE', as: 'CreditProduct' });

creditNote.hasMany(creditNoteItem, { foreignKey: 'creditId', onDelete: 'CASCADE', as: 'items' });
creditNoteItem.belongsTo(creditNote, { foreignKey: 'creditId', onDelete: 'CASCADE', as: 'items' });

module.exports = creditNoteItem;