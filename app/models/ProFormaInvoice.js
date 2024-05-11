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
});

customer.hasMany(ProFormaInvoice,{foreignKey:'customerId', onDelete:"CASCADE", as:'customer'});
ProFormaInvoice.belongsTo(customer,{foreignKey:'customerId', onDelete:'CASCADE', as:'customer'});

module.exports = ProFormaInvoice;
