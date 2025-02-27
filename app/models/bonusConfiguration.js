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
}, {
    indexes: [
        {
            unique: true,
            name: "unique_bonus_config",
            fields: ["month", "minAttendance", "maxAttendance"], // Composite Unique Key
        }
    ]
});

module.exports = BonusConfiguration;
