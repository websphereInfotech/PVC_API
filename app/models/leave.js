const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");

const Leave = sequelize.define("P_leave", {
    employeeId: {
        type: DataTypes.INTEGER(11),
        allowNull: false
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    leaveType: {
        type: DataTypes.ENUM('Personal Leave', 'Emergency Leave'),
        allowNull: false
    },
    leaveDuration: {
        type: DataTypes.ENUM('First Half', 'Second Half', 'Full Day'),
        allowNull: false
    },
    reason: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'),
        defaultValue: 'Pending',
        allowNull: false
    },
    approvedBy: {
        type: DataTypes.INTEGER(11),
        allowNull: true
    },
    approvedDate: {
        type: DataTypes.DATE,
        allowNull: true
    }
});

module.exports = Leave;
