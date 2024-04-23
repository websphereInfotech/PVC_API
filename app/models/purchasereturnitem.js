const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const purchaseReturn = require("./purchasereturn");

const purchaseReturnItem = sequelize.define("P_purchaseReturnItem", {
  serialno: { type: DataTypes.STRING },
  product: { type: DataTypes.STRING },
  batchno: { type: DataTypes.STRING },
  expirydate: { type: DataTypes.DATE },
  mrp: { type: DataTypes.INTEGER },
  bill_no: { type: DataTypes.STRING },
  bill_date: { type: DataTypes.STRING },
  qty: { type: DataTypes.STRING },
  rate: { type: DataTypes.FLOAT },
  taxable: { type: DataTypes.STRING },
  Cess: { type: DataTypes.BOOLEAN },
  price: { type: DataTypes.FLOAT },
});

purchaseReturn.hasMany(purchaseReturnItem, { foreignKey: "purchaseReturnId" });
purchaseReturnItem.belongsTo(purchaseReturn, {
  foreignKey: "purchaseReturnId",
});

module.exports = purchaseReturnItem;
