const { DataTypes } = require('sequelize');
const sequelize = require('../config/index');
const company = require('./company');
const User = require('./user');
const Account = require('./Account');

const C_OrderProcessing = sequelize.define('P_C_orderProcessing', {
    accountId: { type : DataTypes.INTEGER, allowNull: false},
    date : { type: DataTypes.DATEONLY},
    totalMrp: {
        type : DataTypes.INTEGER,
        defaultValue:0
    },
    totalQty: {
        type : DataTypes.INTEGER,
        defaultValue:0
    },
    createdBy:{type: DataTypes.INTEGER},
    updatedBy:{type:DataTypes.INTEGER},
    companyId:{type:DataTypes.INTEGER},
    status: {
        type: DataTypes.ENUM('Open', 'Pending', 'Closed'),
        defaultValue: 'Pending',
        allowNull: false
    },
    orderProcessingNo: {type: DataTypes.INTEGER, allowNull: false}
});

company.hasMany(C_OrderProcessing,{foreignKey:'companyId',as:'companyOrderProcesscash'});
C_OrderProcessing.belongsTo(company,{foreignKey:'companyId',as:'companyOrderProcesscash'});

User.hasMany(C_OrderProcessing,{foreignKey:'createdBy', as:'orderCreate'});
C_OrderProcessing.belongsTo(User,{foreignKey:'createdBy', as:'orderCreate'});

User.hasMany(C_OrderProcessing,{foreignKey:'updatedBy', as:'orderUpdate'});
C_OrderProcessing.belongsTo(User,{foreignKey:'updatedBy', as:'orderUpdate'});

Account.hasMany(C_OrderProcessing, {foreignKey:'accountId', onDelete:'CASCADE',as:'orderAccount'});
C_OrderProcessing.belongsTo(Account, {foreignKey:'accountId', onDelete:'CASCADE',as:'orderAccount'});

module.exports = C_OrderProcessing;