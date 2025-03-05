const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");

const PenaltyConfiguration = sequelize.define("P_penaltyConfiguration", {
    type: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    firstPenalty: {
        type: DataTypes.INTEGER(11),
        allowNull: false
    },
    secondPenalty: {
        type: DataTypes.INTEGER(11),
        allowNull: false
    },
    thirdPenalty: {
        type: DataTypes.INTEGER(11),
        allowNull: false
    },
    fourthPenalty: {
        type: DataTypes.INTEGER(11),
        allowNull: false
    },
    fifthPenalty: {
        type: DataTypes.INTEGER(11),
        allowNull: false
    }
}, {
    indexes: [
        {
            unique: true,
            fields: ["type"],
        }
    ]
});

module.exports = PenaltyConfiguration;
