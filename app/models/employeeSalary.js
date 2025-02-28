const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");

const EmployeeSalary = sequelize.define("P_employee_salary", {
    employeeId: {
        type: DataTypes.INTEGER(11),
        allowNull: false
    },
    month: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    salary: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    bonusAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    overtimeAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    penaltyAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    overtimeHours: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    numberOfWorkedDays: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    numberOfLeaves  : {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
});

module.exports = EmployeeSalary;
