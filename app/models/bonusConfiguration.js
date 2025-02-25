const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");

const BonusConfiguration = sequelize.define("P_bonusConfiguration", {
    month: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    minAttendance: {
        type: DataTypes.INTEGER(11),
        allowNull: false
    },
    maxAttendance: {
        type: DataTypes.INTEGER(11),
        allowNull: false
    },
    bonusPercentage: {
        type: DataTypes.INTEGER(11),
        allowNull: false
    }
});

module.exports = BonusConfiguration;
