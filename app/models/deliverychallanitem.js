const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const deliverychallan = require("./deliverychallan");
const product = require("./product");
const company = require("./company");

const deliverychallanitem = sequelize.define("P_deliverychallanItem", {
  qty: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  companyId: {type: DataTypes.INTEGER}
});

company.hasMany(deliverychallan,{foreignKey:'companyId',onDelete:'CASCADE'});
deliverychallan.belongsTo(company,{foreignKey:'companyId',onDelete:'CASCADE'});

product.hasMany(deliverychallanitem,{foreignKey:'productId',onDelete:'CASCADE', as:'DeliveryProduct'});
deliverychallanitem.belongsTo(product,{ foreignKey:'productId', onDelete:'CASCADE', as:'DeliveryProduct'});

deliverychallan.hasMany(deliverychallanitem, {
  foreignKey: "deliverychallanId", onDelete:'CASCADE',as:'items'
});
deliverychallanitem.belongsTo(deliverychallan, {
  foreignKey: "deliverychallanId", onDelete:'CASCADE', as:'items'
});

module.exports = deliverychallanitem;
