const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const company = require("./company");
const User = require("./user");
const Machine = require("./Machine");
const { MACHINE_SCHEDULE_TYPE } = require("../constant/constant");

const Maintenance = sequelize.define("P_Maintenance", {
    machineId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM(...Object.values(MACHINE_SCHEDULE_TYPE)),
        allowNull: false
    },
    updatedBy: { type: DataTypes.INTEGER },
    createdBy: { type: DataTypes.INTEGER },
    companyId: { type: DataTypes.INTEGER }
});

company.hasOne(Maintenance, {foreignKey: "companyId", onDelete: "CASCADE" });
Maintenance.belongsTo(company, {foreignKey: "companyId", onDelete: "CASCADE" });

User.hasMany(Maintenance, { foreignKey: "createdBy", as: "maintenanceCreateUser" });
Maintenance.belongsTo(User, { foreignKey: "createdBy", as: "maintenanceCreateUser" });

User.hasMany(Maintenance, { foreignKey: "updatedBy", as: "maintenanceUpdateUser" });
Maintenance.belongsTo(User, { foreignKey: "updatedBy", as: "maintenanceUpdateUser" });

Machine.hasMany(Maintenance,{foreignKey:"machineId", as:'machineMaintenance'});
Maintenance.belongsTo(Machine,{foreignKey:"machineId", as:'machineMaintenance'});

module.exports = Maintenance;
