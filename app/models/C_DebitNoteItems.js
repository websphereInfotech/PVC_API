const {DataTypes} = require('sequelize');
const sequelize = require('../config/index');
const C_DebitNote = require('./C_DebitNote');
const product = require('./product');

const C_DebitNoteItem = sequelize.define('P_C_DebitNoteItem', {
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
    },
    unit: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

product.hasMany(C_DebitNoteItem,{foreignKey:'productId', onDelete:'CASCADE', as:'DebitProductCash'});
C_DebitNoteItem.belongsTo(product, {foreignKey:'productId', onDelete:'CASCADE', as:'DebitProductCash'});

C_DebitNote.hasMany(C_DebitNoteItem,{foreignKey:'DebitId', onDelete:'CASCADE',as:'cashDebitNoteItem'});
C_DebitNoteItem.belongsTo(C_DebitNote,{foreignKey:'DebitId',onDelete:'CASCADE',as:'cashDebitNoteItem'});

module.exports = C_DebitNoteItem;