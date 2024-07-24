const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const Product = require("./product");
const User = require("./user");

const stock = sequelize.define("P_stock", {
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    qty: {
        type: DataTypes.DECIMAL(10,2),
        defaultValue: 0,
        allowNull: false
    },
    updatedBy: { type: DataTypes.INTEGER }
});

Product.hasOne(stock, {foreignKey: "productId", as: "productStock" });
stock.belongsTo(Product, {foreignKey: "productId", as: "productStock" });

User.hasMany(stock, { foreignKey: "updatedBy", as: "stockUpdateUser" });
stock.belongsTo(User, { foreignKey: "updatedBy", as: "stockUpdateUser" });

module.exports = stock;
