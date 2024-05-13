const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const customer = require("./customer");
const ProFormaInvoice = require("./ProFormaInvoice");

const salesInvoice = sequelize.define("P_salesInvoice", {
  dispatchno: {
    type: DataTypes.INTEGER,
  },
  deliverydate: {
    type: DataTypes.DATEONLY,
  },
  invoiceno: { type: DataTypes.INTEGER },
  invoicedate: { type: DataTypes.DATE },
  terms: { type: DataTypes.INTEGER },
  duedate: { type: DataTypes.DATE },
  proFormaId: { type: DataTypes.INTEGER },
  dispatchThrough: { type: DataTypes.STRING },
  destination: { type: DataTypes.STRING },
  LL_RR_no: { type: DataTypes.INTEGER },
  motorVehicleNo: { type: DataTypes.STRING },
  customerId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  totalIgst: { type: DataTypes.FLOAT, defaultValue: 0 },
  totalSgst: { type: DataTypes.FLOAT, defaultValue: 0 },
  totalMrp: { type: DataTypes.FLOAT, defaultValue: 0 },
  mainTotal: { type: DataTypes.FLOAT, defaultValue: 0 },
});


ProFormaInvoice.hasMany(salesInvoice, { foreignKey: 'proFormaId', onDelete: 'CASCADE' });
salesInvoice.belongsTo(ProFormaInvoice, { foreignKey: 'proFormaId', onDelete: 'CASCADE' });

customer.hasMany(salesInvoice, { foreignKey: 'customerId', onDelete: 'CASCADE', as: 'InvioceCustomer' });
salesInvoice.belongsTo(customer, { foreignKey: 'customerId', onDelete: 'CASCADE', as: 'InvioceCustomer' });

module.exports = salesInvoice;
