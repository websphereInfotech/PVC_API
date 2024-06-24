const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const ProFormaInvoice = require("./ProFormaInvoice");
const product = require("./product");

const ProFormaInvoiceItem = sequelize.define("P_ProFormaInvoiceItem", {
  rate: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  qty: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  unit: {
    type: DataTypes.STRING,
    allowNull: false,
    // defaultValue: "GM",
  },
  mrp: {
    type: DataTypes.FLOAT,
    defaultValue:0
  },
});

product.hasMany(ProFormaInvoiceItem,{ foreignKey:'productId', onDelete:'CASCADE', as:'product'})
ProFormaInvoiceItem.belongsTo(product, {foreignKey:"productId", onDelete:"CASCADE", as:'product'});

ProFormaInvoice.hasMany(ProFormaInvoiceItem, { foreignKey: "InvoiceId" ,onDelete:'CASCADE', as:'items'});
ProFormaInvoiceItem.belongsTo(ProFormaInvoice, { foreignKey: "InvoiceId", onDelete:'CASCADE',as:'items' });



module.exports = ProFormaInvoiceItem;
