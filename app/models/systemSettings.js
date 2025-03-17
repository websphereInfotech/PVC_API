const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");

const SystemSettings = sequelize.define("P_systemSettings", {
    field: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    value: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

module.exports = SystemSettings;
