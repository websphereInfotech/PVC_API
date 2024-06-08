const { DataTypes} = require('sequelize');
const sequelize = require('../config/index');
const company = require('./company');

const C_companyBalance = sequelize.define("P_C_companyBalance",{
    companyId: {type: DataTypes.INTEGER},
    balance: {type: DataTypes.INTEGER}
});

company.hasMany(C_companyBalance, {foreignKey:'companyId', onDelete:'CASCADE'});
C_companyBalance.belongsTo(company, {foreignKey:'companyId', onDelete:'CASCADE'});

module.exports = C_companyBalance;