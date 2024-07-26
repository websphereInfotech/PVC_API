const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const company = require("./company");

const AccountGroup = sequelize.define("P_AccountGroup", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    companyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
});

company.hasMany(AccountGroup, { foreignKey: "companyId", onDelete: "CASCADE" });
AccountGroup.belongsTo(company, { foreignKey: "companyId", onDelete: "CASCADE" });

module.exports = AccountGroup;
