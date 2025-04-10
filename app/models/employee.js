const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const Shift = require("./shift");
const Leave = require("./leave");
const company = require("./company");

const Employee = sequelize.define("P_employee", {
    companyId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    firstName: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    phoneNumber: {
        type: DataTypes.STRING(15),
        allowNull: true
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    dob: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    panNumber: {
        type: DataTypes.STRING(10),
        allowNull: true
    },
    aadharNumber: {
        type: DataTypes.STRING(12),
        allowNull: true
    },
    profilePicture: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    bonus: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
        allowNull: false
    },
    overtime: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
        allowNull: false
    },
    shiftId: {
        type: DataTypes.INTEGER(11),
        allowNull: false
    },
    role: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    salaryPerDay: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    hireDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    emergencyLeaves: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        defaultValue: 1
    },
    personalLeaves: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        defaultValue: 1
    },
    referredBy: {
        type: DataTypes.INTEGER(11),
        allowNull: true
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
    },
});

Employee.belongsTo(Shift, { foreignKey: 'shiftId', as: 'shift' });
Employee.hasMany(Leave, { foreignKey: 'employeeId', as: 'leaves' });
Employee.belongsTo(Employee, { foreignKey: 'referredBy', as: 'referral' });
company.hasMany(Employee,{foreignKey:"companyId", as:'companyEmployee'});
Employee.belongsTo(company,{foreignKey:"companyId", as:'companyEmployee'});

module.exports = Employee;
