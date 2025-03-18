const { DataTypes } = require("sequelize");
const sequelize = require("../config/secondaryIndex");

const EmployeePunch = sequelize.define("attendance", {
    empId: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    date: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    time: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
},{
    tableName: "attendance",
    freezeTableName: true
});

module.exports = EmployeePunch;
