const { DataTypes} = require("sequelize");
const sequelize = require("../config/index");
const MachineSchedule = require("./MachineSchedule");
const MaintenanceType = require("./MaintenanceType");
const MachineScheduleType = sequelize.define("P_MachineScheduleType", {
    machineScheduleId: {
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
            fields: ['machineScheduleId', 'maintenanceTypeId'],
            name: 'machine_maint_unique'
        }
    ],
    tableName: 'P_MachineScheduleType'
});


MachineSchedule.belongsToMany(MaintenanceType, {
    through: MachineScheduleType,
    foreignKey: 'machineScheduleId',
    as: 'maintenanceTypes'
});

MaintenanceType.belongsToMany(MachineSchedule, {
    through: MachineScheduleType,
    foreignKey: 'maintenanceTypeId',
    as: 'machineSchedules'
});