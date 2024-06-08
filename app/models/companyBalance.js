const {DataTypes} = require('sequelize');
const sequelize = require('../config/index');
const company = require('./company');

const companyBalance = sequelize.define("P_companyBalance", {
    companyId: {type: DataTypes.INTEGER},
    balance: { type : DataTypes.INTEGER,
        defaultValue:0
    }
});

company.hasMany(companyBalance, {foreignKey:'companyId',onDelete:'CASCADE'});
companyBalance.belongsTo(company, {foreignKey:'companyId',onDelete:'CASCADE'});

module.exports = companyBalance;