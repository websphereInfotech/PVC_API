const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const ProFormaInvoice = require("./ProFormaInvoice");

const ProFormaInvoiceItem = sequelize.define("P_ProFormaInvoiceItem", {
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
    defaultValue:0
  },
});

ProFormaInvoice.hasMany(ProFormaInvoiceItem, { foreignKey: "InvoiceId" ,onDelete:'CASCADE', as:'items'});
ProFormaInvoiceItem.belongsTo(ProFormaInvoice, { foreignKey: "InvoiceId", onDelete:'CASCADE',as:'items' });


module.exports = ProFormaInvoiceItem;
