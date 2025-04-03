const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");

const Shift = sequelize.define("P_shift", {
    companyId: {
        type: DataTypes.INTEGER(11),
        defaultValue: 1,
        allowNull: false
    },
    shiftName: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    shiftStartTime: {
        type: DataTypes.STRING(15),
        allowNull: false
    },
    shiftEndTime: {
        type: DataTypes.STRING(15),
        allowNull: false
    },
    breakStartTime: {
        type: DataTypes.STRING(15),
        allowNull: false
    },
    breakEndTime: {
        type: DataTypes.STRING(15),
        allowNull: false
    },
    maxOvertimeHours: {
        type: DataTypes.INTEGER(11),
        defaultValue: 0,
        allowNull: false
    }
});

module.exports = Shift;
