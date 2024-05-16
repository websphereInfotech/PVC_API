const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const purchasebill = require("./purchasebill");
const product = require("./product");

const purchasebillItem = sequelize.define("P_purchasebillItem", {
  productId: { type: DataTypes.INTEGER },
  qty: { type: DataTypes.INTEGER },
  rate: { type: DataTypes.INTEGER },
  mrp: { type: DataTypes.INTEGER },
});

product.hasMany(purchasebillItem, {foreignKey:'productId',onDelete:'CASCADE',as:'purchseProduct'});
purchasebillItem.belongsTo(product, {foreignKey:'productId', onDelete:'CASCADE', as:'purchseProduct'});

purchasebill.hasMany(purchasebillItem, { foreignKey: "purchasebillId" ,onDelete:'CASCADE',as:'items'});
purchasebillItem.belongsTo(purchasebill, { foreignKey: "purchasebillId",onDelete:'CASCADE', as:'items' });

module.exports = purchasebillItem;
