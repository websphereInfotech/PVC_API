const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const Product = require("./product");

const stock = sequelize.define("P_stock", {
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    qty: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
});

Product.hasOne(stock, {foreignKey: "productId", as: "productStock" });
stock.belongsTo(Product, {foreignKey: "productId", as: "productStock" });

module.exports = stock;
