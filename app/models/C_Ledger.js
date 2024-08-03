const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const C_Salesinvoice = require("./C_salesinvoice");
const C_PurchaseCash = require("./C_purchaseCash");
const company = require("./company");
const C_Payment = require("./C_Payment");
const C_Receipt = require("./C_Receipt");
const Account = require("./Account");

const C_Ledger = sequelize.define("P_C_Ledger", {
    accountId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    companyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    purchaseId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null
    },
    saleId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null
    },
    paymentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null
    },
    receiptId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    }
});

company.hasMany(C_Ledger, { foreignKey: "companyId", onDelete: "CASCADE" });
C_Ledger.belongsTo(company, { foreignKey: "companyId", onDelete: "CASCADE" });

C_PurchaseCash.hasMany(C_Ledger, { foreignKey: "purchaseId", onDelete: "CASCADE", as: "purchaseLedgerCash" });
C_Ledger.belongsTo(C_PurchaseCash, { foreignKey: "purchaseId", onDelete: "CASCADE", as: "purchaseLedgerCash" });

C_Salesinvoice.hasMany(C_Ledger, { foreignKey: "saleId", onDelete: "CASCADE", as: "salesLedgerCash" });
C_Ledger.belongsTo(C_Salesinvoice, { foreignKey: "saleId", onDelete: "CASCADE", as: "salesLedgerCash" });

C_Payment.hasMany(C_Ledger, { foreignKey: "paymentId", onDelete: "CASCADE", as: "paymentLedgerCash" });
C_Ledger.belongsTo(C_Payment, { foreignKey: "paymentId", onDelete: "CASCADE", as: "paymentLedgerCash" });

C_Receipt.hasMany(C_Ledger, { foreignKey: "receiptId", onDelete: "CASCADE", as: "receiptLedgerCash" });
C_Ledger.belongsTo(C_Receipt, { foreignKey: "receiptId", onDelete: "CASCADE", as: "receiptLedgerCash" });

Account.hasMany(C_Ledger, { foreignKey: "accountId", onDelete: "CASCADE", as: "accountLedgerCash" });
C_Ledger.belongsTo(Account, { foreignKey: "accountId", onDelete: "CASCADE", as: "accountLedgerCash" });

module.exports = C_Ledger;
