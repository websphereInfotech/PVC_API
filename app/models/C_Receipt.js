const {DataTypes} = require('sequelize');
const sequelize = require('../config/index');
const User = require('./user');
const Account = require('./Account');
const company = require('./company');

const C_Receipt = sequelize.define('P_C_Receipt', {
    accountId:{ type: DataTypes.INTEGER, allowNull: false},
    amount: {type: DataTypes.INTEGER},
    description : {type: DataTypes.STRING,
        validate:{
            len:[0,20]
        }
    },
    date: {type: DataTypes.DATEONLY},
    createdBy:{type: DataTypes.INTEGER},
    updatedBy:{type:DataTypes.INTEGER},
    companyId: {type: DataTypes.INTEGER},
    receiptNo: {type: DataTypes.INTEGER, allowNull: false},
});

company.hasMany(C_Receipt,{foreignKey:'companyId',onDelete:'CASCADE'});
C_Receipt.belongsTo(company,{foreignKey:'companyId',onDelete:'CASCADE'});

User.hasMany(C_Receipt,{foreignKey:'createdBy', as:'receiveCreate'});
C_Receipt.belongsTo(User,{foreignKey:'createdBy', as:'receiveCreate'});

User.hasMany(C_Receipt,{foreignKey:'updatedBy', as:'receiveUpdate'});
C_Receipt.belongsTo(User,{foreignKey:'updatedBy', as:'receiveUpdate'});

Account.hasMany(C_Receipt, {foreignKey:'accountId',onDelete:'CASCADE', as:'accountReceiptCash'});
C_Receipt.belongsTo(Account, {foreignKey:'accountId', onDelete:'CASCADE', as:'accountReceiptCash'});

module.exports = C_Receipt;