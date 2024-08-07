const {DataTypes} = require('sequelize');
const sequelize = require('../config/index');
const company = require('./company');

const CompanyCashBalance = sequelize.define("P_CompanyCashBalance", {
    companyId: {type: DataTypes.INTEGER},
    balance: { type : DataTypes.INTEGER,
        defaultValue:0
    }
});

company.hasMany(CompanyCashBalance, {foreignKey:'companyId',onDelete:'CASCADE'});
CompanyCashBalance.belongsTo(company, {foreignKey:'companyId',onDelete:'CASCADE'});

module.exports = CompanyCashBalance;