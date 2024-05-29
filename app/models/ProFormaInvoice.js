const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const customer = require("./customer");
const User = require("./user");
// const moment = require('moment');
const ProFormaInvoice = sequelize.define("P_ProFormaInvoice", {
  ProFormaInvoice_no: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY
  },
  validtill: {
    type: DataTypes.DATEONLY
  },
  customerId:{  
    type: DataTypes.INTEGER,
    allowNull: false,

  },
  termsOfDelivery : {type: DataTypes.STRING},
  dispatchThrough: { type: DataTypes.STRING },
  destination: { type: DataTypes.STRING },
  LL_RR_no: { type: DataTypes.INTEGER },
  motorVehicleNo: { type: DataTypes.STRING },
  dispatchno: {
    type: DataTypes.INTEGER,
  },
  terms: {
    type: DataTypes.ENUM(
      "Advance",
      "Immediate",
      "Terms"
    )
  },
  totalIgst: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  totalSgst: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  totalMrp: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  mainTotal: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  totalQty: {
    type: DataTypes.INTEGER,
    defaultValue:0
  },
  createdBy : { type: DataTypes.INTEGER},
  updatedBy: {type: DataTypes.INTEGER}
});

User.hasMany(ProFormaInvoice,{foreignKey:'createdBy',onDelete:'CASCADE', as:'proCreateUser'});
ProFormaInvoice.belongsTo(User,{foreignKey:'createdBy',onDelete:"CASCADE", as:'proCreateUser'});

User.hasMany(ProFormaInvoice,{foreignKey:'updatedBy',onDelete:'CASCADE', as:'proUpdateUser'});
ProFormaInvoice.belongsTo(User,{foreignKey:'updatedBy',onDelete:"CASCADE", as:'proUpdateUser'});

customer.hasMany(ProFormaInvoice,{foreignKey:'customerId', onDelete:"CASCADE", as:'customer'});
ProFormaInvoice.belongsTo(customer,{foreignKey:'customerId', onDelete:'CASCADE', as:'customer'});

module.exports = ProFormaInvoice;
