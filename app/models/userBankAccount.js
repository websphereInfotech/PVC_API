const {DataTypes} = require('sequelize');
const sequelize = require('../config/index');
const User = require('./user');

const UserBankAccount = sequelize.define('P_UserBankAccount', {
    userId: {type:DataTypes.INTEGER, allowNull: false},
    accountname:{type: DataTypes.STRING, allowNull: false},
    bankname: {type: DataTypes.STRING, allowNull: false},
    accountnumber: {type: DataTypes.STRING, allowNull: false},
    ifsccode: {type: DataTypes.STRING, allowNull: false},
    branch: {type: DataTypes.STRING, allowNull: false},
});

User.hasMany(UserBankAccount,{foreignKey:'userId', onDelete:'CASCADE',as:'userBankAccount'});
UserBankAccount.belongsTo(User,{foreignKey:'userId', onDelete:'CASCADE',as:'userBankAccount'});

module.exports = UserBankAccount;