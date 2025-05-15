const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const company = require("./company");
const AccountGroup = require("./AccountGroup");

const Account = sequelize.define("P_Account", {
    accountName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    shortName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    contactPersonName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    companyId: {type: DataTypes.INTEGER, allowNull: false},
    accountGroupId: {type: DataTypes.INTEGER, allowNull: false},
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    }
});

company.hasMany(Account, {foreignKey:'companyId',onDelete:'CASCADE'});
Account.belongsTo(company, {foreignKey:'companyId',onDelete:'CASCADE'});

AccountGroup.hasMany(Account, {foreignKey:'accountGroupId',onDelete:'CASCADE'});
Account.belongsTo(AccountGroup, {foreignKey:'accountGroupId',onDelete:'CASCADE', as: "accountGroup"});

module.exports = Account;
