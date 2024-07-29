const { DataTypes } = require('sequelize');
const sequelize = require('../config/index');
const Account = require('./Account');
const User = require('./user');
const company = require('./company');

const C_purchaseCash = sequelize.define('P_C_purchaseCash', {
    accountId: { type : DataTypes.INTEGER, allowNull: false},
    date : { type: DataTypes.DATEONLY},
    totalMrp: {
        type : DataTypes.INTEGER,
        defaultValue:0
    },
    createdBy:{type: DataTypes.INTEGER},
    updatedBy:{type:DataTypes.INTEGER},
    companyId:{type:DataTypes.INTEGER},
    purchaseNo: {type: DataTypes.INTEGER, allowNull: false},
});

company.hasMany(C_purchaseCash,{foreignKey:'companyId',as:'companypurchasecash'});
C_purchaseCash.belongsTo(company,{foreignKey:'companyId',as:'companypurchasecash'});

User.hasMany(C_purchaseCash,{foreignKey:'createdBy', as:'purchaseCreateUser'});
C_purchaseCash.belongsTo(User,{foreignKey:'createdBy', as:'purchaseCreateUser'});

User.hasMany(C_purchaseCash,{foreignKey:'updatedBy', as:'purchaseUpdateUser'});
C_purchaseCash.belongsTo(User,{foreignKey:'updatedBy', as:'purchaseUpdateUser'});

Account.hasMany(C_purchaseCash, {foreignKey:'accountId', onDelete:'CASCADE', as:'accountPurchaseCash'});
C_purchaseCash.belongsTo(Account, {foreignKey:'accountId', onDelete:'CASCADE',as:'accountPurchaseCash'});

module.exports = C_purchaseCash;