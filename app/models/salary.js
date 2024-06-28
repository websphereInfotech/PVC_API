const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const company = require("./company");
const User = require("./user");
const {SALARY_STATUS} = require("../constant/constant");

const Salary = sequelize.define("P_Salary", {
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    companyId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM,
        values: [SALARY_STATUS.PAID, SALARY_STATUS.PENDING, SALARY_STATUS.CANCELED],
        allowNull: false,
        defaultValue: SALARY_STATUS.PENDING
    },
    monthStartDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    monthEndDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    }
});

company.hasMany(Salary,{foreignKey:'companyId',as:'employeeCompany'});
Salary.belongsTo(company,{foreignKey:'companyId',as:'employeeCompany'});

User.hasMany(Salary,{foreignKey:'userId', as:'employeeSalary'});
Salary.belongsTo(User,{foreignKey:'userId', as:'employeeSalary'});

module.exports = Salary;
