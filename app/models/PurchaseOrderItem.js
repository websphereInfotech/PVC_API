const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const product = require("./product");
const PurchaseOrder = require("./PurchaseOrder");

const purchaseInvoiceItem = sequelize.define("P_purchaseInvoiceItem", {
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

product.hasMany(purchaseInvoiceItem, {foreignKey:'productId',onDelete:'CASCADE',as:'purchaseOrderProduct'});
purchaseInvoiceItem.belongsTo(product, {foreignKey:'productId', onDelete:'CASCADE', as:'purchaseOrderProduct'});

PurchaseOrder.hasMany(purchaseInvoiceItem, { foreignKey: "purchaseOrderId" ,onDelete:'CASCADE',as:'purchaseOrderItem'});
purchaseInvoiceItem.belongsTo(PurchaseOrder, { foreignKey: "purchaseOrderId",onDelete:'CASCADE', as:'purchaseOrderItem' });

module.exports = purchaseInvoiceItem;
