const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");

const EmployeeOvertime = sequelize.define("P_employee_overtime", {
    employeeId: {
        type: DataTypes.INTEGER(11),
        allowNull: false
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    overtimeHours: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
});

module.exports = EmployeeOvertime;
