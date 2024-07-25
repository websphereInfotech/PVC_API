const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const company = require("./company");

const Group = sequelize.define("P_Group", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    companyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
});

company.hasMany(Group, { foreignKey: "companyId", onDelete: "CASCADE" });
Group.belongsTo(company, { foreignKey: "companyId", onDelete: "CASCADE" });

module.exports = Group;
