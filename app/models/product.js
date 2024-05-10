const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
// const quotationItem = require("./ProFormaInvoiceItem");
const ProFormaInvoiceItem = require("./ProFormaInvoiceItem");
const salesInvoiceItem = require("./salesInvoiceitem");
const deliverychallanitem = require("./deliverychallanitem");

const product = sequelize.define("P_product", {
  itemtype: {
    type: DataTypes.ENUM("Product", "Service"),
    allowNull: false,
  },
  productname: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.STRING,
  },
  itemgroup: {
    type: DataTypes.STRING,
  },
  itemcategory: {
    type: DataTypes.STRING,
  },
  unit: {
    type: DataTypes.STRING,
  },
  openingstock: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  nagativeqty: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  lowstock: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  purchaseprice: {
    type: DataTypes.INTEGER,
  },
  salesprice: {
    type: DataTypes.INTEGER,
  },
  gstrate : {
    type: DataTypes.INTEGER
  },
  HSNcode: {
    type:DataTypes.INTEGER
  },
  cess: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

product.hasMany(ProFormaInvoiceItem,{ foreignKey:'productId', onDelete:'CASCADE', as:'product'})
ProFormaInvoiceItem.belongsTo(product, {foreignKey:"productId", onDelete:"CASCADE", as:'product'});

product.hasMany(salesInvoiceItem, { foreignKey:'productId',onDelete:'CASCADE', as:'InvoiceProduct'});
salesInvoiceItem.belongsTo(product,{foreignKey:'productId',onDelete:'CASCADE', as:'InvoiceProduct'});

product.hasMany(deliverychallanitem,{foreignKey:'productId',onDelete:'CASCADE', as:'DeliveryProduct'});
deliverychallanitem.belongsTo(product,{ foreignKey:'productId', onDelete:'CASCADE', as:'DeliveryProduct'});

module.exports = product;
