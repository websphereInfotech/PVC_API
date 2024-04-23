const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const quotation = require("./quotation");

const quotationItem = sequelize.define("P_quotationItem", {
  srNo: {
    type: DataTypes.INTEGER,
  },
  rate: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  qty: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  product: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mrp: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

quotation.hasMany(quotationItem, { foreignKey: "quotationId" });
quotationItem.belongsTo(quotation, { foreignKey: "quotationId" });

module.exports = quotationItem;
