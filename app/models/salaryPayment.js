const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const CompanyBank = require("./companyBankDetails");
const UserBankAccount = require("./userBankAccount");
const Salary = require("./salary");
const {SALARY_PAYMENT_TYPE} = require("../constant/constant");

const SalaryPayment = sequelize.define("P_SalaryPayment", {
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    paymentType: {
        type: DataTypes.ENUM,
        values: [...Object.values(SALARY_PAYMENT_TYPE)],
        allowNull: false
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    companyBankId: {
        type: DataTypes.INTEGER,
    },
    salaryId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    userBankId: {
        type: DataTypes.INTEGER,
    },
});

CompanyBank.hasMany(SalaryPayment,{foreignKey:'companyBankId',as:'salaryPaymentBank'});
SalaryPayment.belongsTo(CompanyBank,{foreignKey:'companyBankId',as:'salaryPaymentBank'});

UserBankAccount.hasMany(SalaryPayment,{foreignKey:'userBankId', as:'salaryPaymentUserBank'});
SalaryPayment.belongsTo(UserBankAccount,{foreignKey:'userBankId', as:'salaryPaymentUserBank'});

Salary.hasMany(SalaryPayment,{foreignKey:'salaryId', as:'salaryInfo'});
SalaryPayment.belongsTo(Salary,{foreignKey:'salaryId', as:'salaryInfo'});

module.exports = SalaryPayment;
