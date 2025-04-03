const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");

const Holiday = sequelize.define("P_holiday", {
    companyId: {
        type: DataTypes.INTEGER(11),
        allowNull: false
    },
    date: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    }
}, {
    indexes: [
        {
            unique: true,
            fields: ["date"],
        }
    ]
});

module.exports = Holiday;
