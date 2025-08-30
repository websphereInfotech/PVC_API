const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");

const AttendanceType = sequelize.define("P_attendance_type", {
    companyId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    code: {
        type: DataTypes.STRING(10),  // P, M, BM
        allowNull: false
    },
    description: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    salaryPerDay: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
});

module.exports = AttendanceType;