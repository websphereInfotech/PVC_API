const { DataTypes} = require("sequelize");
const sequelize = require("../config/index");
const company = require("./company");
const Machine = require("./Machine");
const {MACHINE_SCHEDULE_TYPE, MACHINE_SCHEDULE_FREQUENCY} = require("../constant/constant");
const MachineSchedule = sequelize.define("P_MachineSchedule", {
    machineId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    frequency: {
        type: DataTypes.ENUM(...Object.values(MACHINE_SCHEDULE_FREQUENCY)),
        allowNull: false
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    interval: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM(...Object.values(MACHINE_SCHEDULE_TYPE)),
        allowNull: false
    },
    companyId: {type: DataTypes.INTEGER, allowNull: false},
});

company.hasMany(MachineSchedule,{foreignKey:"companyId", as:'companyMachineSchedule'});
MachineSchedule.belongsTo(company,{foreignKey:"companyId", as:'companyMachineSchedule'});

Machine.hasMany(MachineSchedule,{foreignKey:"machineId", as:'scheduleMachine'});
MachineSchedule.belongsTo(Machine,{foreignKey:"machineId", as:'scheduleMachine'});

module.exports = MachineSchedule;
