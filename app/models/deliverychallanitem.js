const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const deliverychallan = require("./deliverychallan");

const deliverychallanitem = sequelize.define("P_deliverychallanItem", {
  qty: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  totalQty: {
    type: DataTypes.INTEGER,
    defaultValue:0
  }
});

deliverychallan.hasMany(deliverychallanitem, {
  foreignKey: "deliverychallanId", onDelete:'CASCADE',as:'items'
});
deliverychallanitem.belongsTo(deliverychallan, {
  foreignKey: "deliverychallanId", onDelete:'CASCADE', as:'items'
});

module.exports = deliverychallanitem;
