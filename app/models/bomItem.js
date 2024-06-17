const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const Bom = require("./bom");
const Product = require("./product");

const BomItem = sequelize.define("P_BomItem", {
    productId: { type: DataTypes.INTEGER, allowNull: false },
    qty: { type: DataTypes.INTEGER, allowNull: false },
    bomId: { type: DataTypes.INTEGER, allowNull: false },
    wastage: { type: DataTypes.INTEGER },
});

Bom.hasMany(BomItem, { foreignKey: "bomId", as: "bomItems" });
BomItem.belongsTo(Bom, { foreignKey: "bomId", as: "bomItems" });


Product.hasMany(BomItem, { foreignKey: "productId", as: "bomItemsProduct" });
BomItem.belongsTo(Product, { foreignKey: "productId", as: "bomItemsProduct" });

module.exports = BomItem;
