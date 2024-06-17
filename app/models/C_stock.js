const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const C_Product = require("./C_product");

const C_stock = sequelize.define("P_C_stock", {
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    qty: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
});

C_Product.hasOne(C_stock, {foreignKey: "productId", as: "productCashStock" });
C_stock.belongsTo(C_Product, {foreignKey: "productId", as: "productCashStock" });

module.exports = C_stock;
