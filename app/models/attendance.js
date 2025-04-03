const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const Employee = require("./employee");
const Leave = require("./leave");

const Attendance = sequelize.define("P_attendance", {
    companyId: {
        type: DataTypes.INTEGER(11),
        defaultValue: 1,
        allowNull: false
    },
    employeeId: {
        type: DataTypes.INTEGER(11),
        allowNull: false
    },
    leaveId: {
        type: DataTypes.INTEGER(11),
        allowNull: true
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('Present', 'Absent'),
        defaultValue: 'Absent',
        allowNull: false
    },
    inTime: {
        type: DataTypes.DATE,
        allowNull: true
    },
    outTime: {
        type: DataTypes.DATE,
        allowNull: true
    },
    breakStart: {
        type: DataTypes.DATE,
        allowNull: true
    },
    breakEnd: {
        type: DataTypes.DATE,
        allowNull: true
    },
    latePunch: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    overtimeHours: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 0,
        allowNull: false
    },
    workingHours: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 0,
        allowNull: false
    },
    approvedBy: {
        type: DataTypes.INTEGER(11),
        allowNull: true
    },
    approvedDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
});

Attendance.belongsTo(Employee, { foreignKey: { name: 'employeeId', allowNull: false }, as: 'employee' });
Attendance.belongsTo(Leave, { foreignKey: { name: 'leaveId', allowNull: true }, as: 'leave' });

module.exports = Attendance;
