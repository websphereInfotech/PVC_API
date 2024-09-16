const { DataTypes} = require("sequelize");
const sequelize = require("../config/index");
const MachineSchedule = require("./MachineSchedule");
const MaintenanceType = require("./MaintenanceType");
const MMaintenanceType = sequelize.define("P_MMaintenanceType", {
    maintenanceId: {
        type: DataTypes.INTEGER,
        onDelete: 'CASCADE'
    },
    maintenanceTypeId: {
        type: DataTypes.INTEGER,
        onDelete: 'CASCADE'
    }
},{
    indexes: [
        {
            unique: true,
            fields: ['maintenanceId', 'maintenanceTypeId'],
            name: 'mach_maint_unique'
        }
    ],
    tableName: 'P_MMaintenanceType'
});


MachineSchedule.belongsToMany(MaintenanceType, {
    through: MMaintenanceType,
    foreignKey: 'maintenanceId',
    as: 'mMaintenanceTypes'
});

MaintenanceType.belongsToMany(MachineSchedule, {
    through: MMaintenanceType,
    foreignKey: 'maintenanceTypeId',
    as: 'maintenances'
});