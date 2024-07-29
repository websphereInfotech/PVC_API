const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const SalesInvoice = require("./salesInvoice");
const PurchaseInvoice = require("./purchaseInvoice");
const company = require("./company");
const Payment = require("./paymentBank");
const Receipt = require("./receiveBank");
const Account = require("./Account");

const Ledger = sequelize.define("P_Ledger", {
    accountId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    companyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    purchaseInvId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null
    },
    saleInvId: {
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

company.hasMany(Ledger, { foreignKey: "companyId", onDelete: "CASCADE" });
Ledger.belongsTo(company, { foreignKey: "companyId", onDelete: "CASCADE" });

PurchaseInvoice.hasMany(Ledger, { foreignKey: "purchaseInvId", onDelete: "CASCADE", as: "purchaseLedger" });
Ledger.belongsTo(PurchaseInvoice, { foreignKey: "purchaseInvId", onDelete: "CASCADE", as: "purchaseLedger" });

SalesInvoice.hasMany(Ledger, { foreignKey: "saleInvId", onDelete: "CASCADE", as: "salesLedger" });
Ledger.belongsTo(SalesInvoice, { foreignKey: "saleInvId", onDelete: "CASCADE", as: "salesLedger" });

Payment.hasMany(Ledger, { foreignKey: "paymentId", onDelete: "CASCADE", as: "paymentLedger" });
Ledger.belongsTo(Payment, { foreignKey: "paymentId", onDelete: "CASCADE", as: "paymentLedger" });

Receipt.hasMany(Ledger, { foreignKey: "receiptId", onDelete: "CASCADE", as: "receiptLedger" });
Ledger.belongsTo(Receipt, { foreignKey: "receiptId", onDelete: "CASCADE", as: "receiptLedger" });

Account.hasMany(Ledger, { foreignKey: "accountId", onDelete: "CASCADE", as: "accountLedger" });
Ledger.belongsTo(Account, { foreignKey: "accountId", onDelete: "CASCADE", as: "accountLedger" });

module.exports = Ledger;
