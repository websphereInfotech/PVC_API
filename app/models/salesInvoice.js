const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const customer = require("./customer");
const ProFormaInvoice = require("./ProFormaInvoice");
const User = require('./user');

const salesInvoice = sequelize.define("P_salesInvoice", {
  dispatchno: {
    type: DataTypes.INTEGER,
  },
  deliverydate: {
    type: DataTypes.DATEONLY,
  },
  terms: {
    type: DataTypes.ENUM(
      "Advance",
      "Immediate",
      "Terms"
    )
  },
  invoiceno: { type: DataTypes.INTEGER },
  invoicedate: { type: DataTypes.DATEONLY },
  termsOfDelivery : {type: DataTypes.STRING},
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
  totalQty: {
    type: DataTypes.INTEGER,
    defaultValue:0
  },
  createdBy : {
    type: DataTypes.INTEGER
  },
  updatedBy: { type: DataTypes.INTEGER}
});

User.hasMany(salesInvoice,{foreignKey:'createdBy',onDelete:'CASCADE', as:'createUser'});
salesInvoice.belongsTo(User,{foreignKey:'createdBy',onDelete:"CASCADE", as:'createUser'});

User.hasMany(salesInvoice,{foreignKey:'updatedBy',onDelete:'CASCADE', as:'updateUser'});
salesInvoice.belongsTo(User,{foreignKey:'updatedBy',onDelete:"CASCADE", as:'updateUser'});

ProFormaInvoice.hasMany(salesInvoice, { foreignKey: 'proFormaId', onDelete: 'CASCADE', as:'proFormaItem' });
salesInvoice.belongsTo(ProFormaInvoice, { foreignKey: 'proFormaId', onDelete: 'CASCADE', as:'proFormaItem' });

customer.hasMany(salesInvoice, { foreignKey: 'customerId', onDelete: 'CASCADE', as: 'InvioceCustomer' });
salesInvoice.belongsTo(customer, { foreignKey: 'customerId', onDelete: 'CASCADE', as: 'InvioceCustomer' });

module.exports = salesInvoice;
