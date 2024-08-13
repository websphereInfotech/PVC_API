const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const Account = require("./Account");
const User = require("./user");
const Company = require("./company")
const PurchaseOrder = sequelize.define("P_PurchaseOrder", {
    purchaseOrder_no: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATEONLY,
    },
    validtill: {
        type: DataTypes.DATEONLY,
    },
    accountId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    termsOfDelivery: { type: DataTypes.STRING },
    dispatchThrough: { type: DataTypes.STRING },
    destination: { type: DataTypes.STRING },
    LL_RR_no: { type: DataTypes.INTEGER },
    motorVehicleNo: { type: DataTypes.STRING },
    dispatchno: {
        type: DataTypes.INTEGER,
    },
    terms: {
        type: DataTypes.ENUM("Advance", "Immediate", "Terms"),
    },
    totalIgst: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
    },
    totalSgst: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
    },
    totalMrp: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
    },
    mainTotal: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
    },
    totalQty: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    createdBy: { type: DataTypes.INTEGER },
    updatedBy: { type: DataTypes.INTEGER },
    companyId: {type: DataTypes.INTEGER}
});

Company.hasMany(PurchaseOrder,{foreignKey:"companyId", as:"CompanyPurchaseOrder"});
PurchaseOrder.belongsTo(Company,{foreignKey:"companyId",as:"CompanyPurchaseOrder"})

User.hasMany(PurchaseOrder, { foreignKey: "createdBy", as: "orderCreateUser" });
PurchaseOrder.belongsTo(User, {
    foreignKey: "createdBy",
    as: "orderCreateUser",
});

User.hasMany(PurchaseOrder, { foreignKey: "updatedBy", as: "orderUpdateUser" });
PurchaseOrder.belongsTo(User, {
    foreignKey: "updatedBy",
    as: "orderUpdateUser",
});

Account.hasMany(PurchaseOrder, {
    foreignKey: "accountId",
    onDelete: "CASCADE",
    as: "accountPurchaseOrder",
});
PurchaseOrder.belongsTo(Account, {
    foreignKey: "accountId",
    onDelete: "CASCADE",
    as: "accountPurchaseOrder",
});

module.exports = PurchaseOrder;
