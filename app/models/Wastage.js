const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const company = require("./company");
const User = require("./user");

const Wastage = sequelize.define("P_Wastage", {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    updatedBy: { type: DataTypes.INTEGER },
    createdBy: { type: DataTypes.INTEGER },
    companyId: { type: DataTypes.INTEGER }
});

company.hasOne(Wastage, {foreignKey: "companyId", onDelete: "CASCADE" });
Wastage.belongsTo(company, {foreignKey: "companyId", onDelete: "CASCADE" });

User.hasMany(Wastage, { foreignKey: "createdBy", as: "wastageCreateUser" });
Wastage.belongsTo(User, { foreignKey: "createdBy", as: "wastageCreateUser" });

User.hasMany(Wastage, { foreignKey: "updatedBy", as: "wastageUpdateUser" });
Wastage.belongsTo(User, { foreignKey: "updatedBy", as: "wastageUpdateUser" });

module.exports = Wastage;
