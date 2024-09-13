const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const PurchaseCash = require("./C_purchaseCash");
const company = require("./company");
const User = require("./user");
const Account = require("./Account");

const C_DebitNote = sequelize.define("P_C_DebitNote", {
    accountId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    debitnoteno: {
        type: DataTypes.INTEGER,
        defaultValue:0
    },
    purchaseId: { type: DataTypes.INTEGER, allowNull: true },
    purchaseDate: { type: DataTypes.DATEONLY },
    debitdate: {
        type: DataTypes.DATEONLY
    },
    mainTotal: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
    },
    totalQty: {
        type: DataTypes.INTEGER,
        defaultValue:0
    },
    companyId: {type: DataTypes.INTEGER},
    createdBy: { type: DataTypes.INTEGER },
    updatedBy: { type: DataTypes.INTEGER },
});

User.hasMany(C_DebitNote, { foreignKey: "createdBy", as: "debitCreateUserCash" });
C_DebitNote.belongsTo(User, {
    foreignKey: "createdBy",
    as: "debitCreateUserCash",
});

User.hasMany(C_DebitNote, { foreignKey: "updatedBy", as: "debitUpdateUserCash" });
C_DebitNote.belongsTo(User, {
    foreignKey: "updatedBy",
    as: "debitUpdateUserCash",
});
company.hasMany(C_DebitNote, {foreignKey:'companyId',onDelete:'CASCADE'});
C_DebitNote.belongsTo(company, {foreignKey:'companyId',onDelete:'CASCADE'});

Account.hasMany(C_DebitNote, {foreignKey:'accountId', onDelete:'CASCADE', as:'accountDebitNoCash'});
C_DebitNote.belongsTo(Account, {foreignKey:'accountId', onDelete:'CASCADE', as:'accountDebitNoCash'});

PurchaseCash.hasMany(C_DebitNote, {foreignKey:'purchaseId', onDelete:'CASCADE',as:'purchaseDataCash'});
C_DebitNote.belongsTo(PurchaseCash, {foreignKey:'purchaseId',onDelete:'CASCADE',as:'purchaseDataCash'});

module.exports = C_DebitNote;
