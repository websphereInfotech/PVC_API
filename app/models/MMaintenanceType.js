const { DataTypes} = require("sequelize");
const sequelize = require("../config/index");
const Maintenance = require("./Maintenance");
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


Maintenance.belongsToMany(MaintenanceType, {
    through: MMaintenanceType,
    foreignKey: 'maintenanceId',
    as: 'mMaintenanceTypes'
});

MaintenanceType.belongsToMany(Maintenance, {
    through: MMaintenanceType,
    foreignKey: 'maintenanceTypeId',
    as: 'maintenances'
});