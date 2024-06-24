const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const C_Product = require("./C_product");
const User = require("./user");

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
    updatedBy: { type: DataTypes.INTEGER }
});

C_Product.hasOne(C_stock, {foreignKey: "productId", as: "productCashStock" });
C_stock.belongsTo(C_Product, {foreignKey: "productId", as: "productCashStock" });

User.hasMany(C_stock, { foreignKey: "updatedBy", as: "cashStockUpdateUser" });
C_stock.belongsTo(User, { foreignKey: "updatedBy", as: "cashStockUpdateUser" });

module.exports = C_stock;
