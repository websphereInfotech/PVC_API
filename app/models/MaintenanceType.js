const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const company = require("./company");
const User = require("./user");

const MaintenanceType = sequelize.define("P_MaintenanceType", {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    updatedBy: { type: DataTypes.INTEGER },
    createdBy: { type: DataTypes.INTEGER },
    companyId: { type: DataTypes.INTEGER }
});

company.hasOne(MaintenanceType, {foreignKey: "companyId", onDelete: "CASCADE" });
MaintenanceType.belongsTo(company, {foreignKey: "companyId", onDelete: "CASCADE" });

User.hasMany(MaintenanceType, { foreignKey: "createdBy", as: "maintenanceTypeCreateUser" });
MaintenanceType.belongsTo(User, { foreignKey: "createdBy", as: "maintenanceTypeCreateUser" });

User.hasMany(MaintenanceType, { foreignKey: "updatedBy", as: "maintenanceTypeUpdateUser" });
MaintenanceType.belongsTo(User, { foreignKey: "updatedBy", as: "maintenanceTypeUpdateUser" });

module.exports = MaintenanceType;
