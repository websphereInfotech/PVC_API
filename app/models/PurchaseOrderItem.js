const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const product = require("./product");
const PurchaseOrder = require("./PurchaseOrder");

const PurchaseOrderItem = sequelize.define("P_PurchaseOrderItem", {
    productId: { type: DataTypes.INTEGER },
    qty: { type: DataTypes.INTEGER },
    rate: { type: DataTypes.INTEGER },
    mrp: { type: DataTypes.INTEGER },
    unit: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    purchaseOrderId: {
        type: DataTypes.INTEGER,
        // allowNull: false,
    }
});

product.hasMany(PurchaseOrderItem, {foreignKey:'productId',onDelete:'CASCADE',as:'purchaseOrderProduct'});
PurchaseOrderItem.belongsTo(product, {foreignKey:'productId', onDelete:'CASCADE', as:'purchaseOrderProduct'});

PurchaseOrder.hasMany(PurchaseOrderItem, { foreignKey: "purchaseOrderId" ,onDelete:'CASCADE',as:'purchaseOrderItem'});
PurchaseOrderItem.belongsTo(PurchaseOrder, { foreignKey: "purchaseOrderId",onDelete:'CASCADE', as:'purchaseOrderItem' });

module.exports = PurchaseOrderItem;
