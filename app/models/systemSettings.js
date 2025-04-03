const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");

const SystemSettings = sequelize.define("P_systemSettings", {
    companyId: {
        type: DataTypes.INTEGER(11),
        allowNull: false
    },
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
