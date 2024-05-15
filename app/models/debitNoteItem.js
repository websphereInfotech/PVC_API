const {DataTypes} = require('sequelize');
const sequelize = require('../config/index');
const debitNote = require('./debitNote');
const product = require('./product');

const debitNoteItem = sequelize.define('P_debitNoteItem', {
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    mrp : {
        type: DataTypes.FLOAT
    },
    qty :{
        type: DataTypes.INTEGER
    },
    rate: {
        type: DataTypes.FLOAT
    }
});

product.hasMany(debitNoteItem,{foreignKey:'productId', onDelete:'CASCADE', as:'DebitProduct'});
debitNoteItem.belongsTo(product, {foreignKey:'productId', onDelete:'CASCADE', as:'DebitProduct'});

debitNote.hasMany(debitNoteItem,{foreignKey:'DebitId', onDelete:'CASCADE',as:'items'});
debitNoteItem.belongsTo(debitNote,{foreignKey:'DebitId',onDelete:'CASCADE',as:'items'});

module.exports = debitNoteItem;