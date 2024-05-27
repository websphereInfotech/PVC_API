const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const customer = require("./customer");
// const moment = require('moment');
const ProFormaInvoice = sequelize.define("P_ProFormaInvoice", {
  ProFormaInvoice_no: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE
  },
  validtill: {
    type: DataTypes.DATE
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
});

customer.hasMany(ProFormaInvoice,{foreignKey:'customerId', onDelete:"CASCADE", as:'customer'});
ProFormaInvoice.belongsTo(customer,{foreignKey:'customerId', onDelete:'CASCADE', as:'customer'});

module.exports = ProFormaInvoice;
