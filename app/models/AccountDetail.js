const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const Account = require("./Account");
const {REGISTRATION_TYPE} = require("../constant/constant");

const AccountDetails = sequelize.define("P_AccountDetails", {
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    },
    mobileNo: {
        type: DataTypes.BIGINT,
        allowNull: true,
        defaultValue: null
    },
    panNo: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    },
    creditPeriod: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null
    },
    address1: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    },
    address2: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    },
    pincode: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null
    },
    state: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    },
    city: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    },
    bankDetail: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: null
    },
    creditLimit: {
        type: DataTypes.BOOLEAN,
        defaultValue: null,
        allowNull: true
    },
    balance: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null
    },
    // Separate opening balance specifically for CASH ledger.
    // This allows cash and voucher ledgers to have different openings.
    cashOpeningBalance: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null
    },
    gstNumber : {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    },
    totalCredit : {
        type : DataTypes.BIGINT,
        defaultValue: null,
        allowNull: true
    },
    registrationType: {
        type: DataTypes.ENUM(...Object.values(REGISTRATION_TYPE)),
        allowNull: true,
        defaultValue: null
    },
    accountId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    accountNumber: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
    ifscCode: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
    bankName: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
    accountHolderName: {type: DataTypes.STRING, allowNull: true, defaultValue: null}
});

Account.hasOne(AccountDetails, {foreignKey:'accountId',onDelete:'CASCADE', as: "accountDetail"});
AccountDetails.belongsTo(Account, {foreignKey:'accountId',onDelete:'CASCADE', as: "accountDetail"});

module.exports = AccountDetails;
