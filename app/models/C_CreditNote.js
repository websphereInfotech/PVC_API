const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const User = require("./user");
const Account = require("./Account");
const company = require("./company");

const C_CreditNote = sequelize.define("P_C_CreditNote", {
    accountId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    creditnoteNo: {
        type: DataTypes.INTEGER,
    },
    creditdate: {
        type: DataTypes.DATEONLY,
    },
    LL_RR_no: {
        type: DataTypes.INTEGER,
    },
    dispatchThrough: { type: DataTypes.STRING },
    motorVehicleNo: { type: DataTypes.STRING },
    destination: { type: DataTypes.STRING },
    mainTotal: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
    },
    totalQty: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    companyId: { type: DataTypes.INTEGER },
    createdBy: { type: DataTypes.INTEGER },
    updatedBy: { type: DataTypes.INTEGER },
});

User.hasMany(C_CreditNote, { foreignKey: "createdBy", as: "creditCreateUserCash" });
C_CreditNote.belongsTo(User, {
    foreignKey: "createdBy",
    as: "creditCreateUserCash",
});

User.hasMany(C_CreditNote, { foreignKey: "updatedBy", as: "creditUpdateUserCash" });
C_CreditNote.belongsTo(User, {
    foreignKey: "updatedBy",
    as: "creditUpdateUserCash",
});

Account.hasMany(C_CreditNote, {
    foreignKey: "accountId",
    onDelete: "CASCADE",
    as: "accountCreditNoCash",
});
C_CreditNote.belongsTo(Account, {
    foreignKey: "accountId",
    onDelete: "CASCADE",
    as: "accountCreditNoCash",
});

company.hasMany(C_CreditNote, {foreignKey:'companyId',onDelete:'CASCADE'});
C_CreditNote.belongsTo(company, {foreignKey:'companyId',onDelete:'CASCADE'});

module.exports = C_CreditNote;
