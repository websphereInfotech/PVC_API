const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");

const EmployeePunch = sequelize.define("P_employee_punch", {
    emp_id: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    date: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    punch1: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    punch2: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    punch3: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    punch4: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
});

module.exports = EmployeePunch;
