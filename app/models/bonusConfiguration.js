const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");

const BonusConfiguration = sequelize.define("P_bonusConfiguration", {
    month: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    duty0To50: {
        type: DataTypes.INTEGER(11),
        allowNull: false
    },
    duty51To75: {
        type: DataTypes.INTEGER(11),
        allowNull: false
    },
    duty76To90: {
        type: DataTypes.INTEGER(11),
        allowNull: false
    },
    duty91To100: {
        type: DataTypes.INTEGER(11),
        allowNull: false
    },
    dutyAbove100: {
        type: DataTypes.INTEGER(11),
        allowNull: false
    },
    workingDays: {
        type: DataTypes.INTEGER(11),
        allowNull: false
    }
}, {
    indexes: [
        {
            unique: true,
            fields: ["month"],
        }
    ]
});

module.exports = BonusConfiguration;
